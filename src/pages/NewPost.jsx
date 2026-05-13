import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  getDocs,
  Timestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { Container, Header, Form, Image, Button } from "semantic-ui-react";

const PLACEHOLDER_IMAGE = "https://react.semantic-ui.com/images/wireframe/image.png";

function NewPost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topics, setTopics] = useState([]);
  const [topicName, setTopicName] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(PLACEHOLDER_IMAGE);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const db = getFirestore();
    getDocs(collection(db, "topics"))
      .then((res) => {
        setTopics(res.docs.map((doc) => doc.data()));
      })
      .catch((error) => console.log("error", error));
  }, []);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const options = topics.map((topic) => ({
    text: topic.name,
    value: topic.name,
  }));

  async function onSubmit() {
    setIsLoading(true);
    const auth = getAuth();
    const db = getFirestore();
    const newDocRef = doc(collection(db, "posts"));

    try {
      let imageUrl = null;
      if (file) {
        const storage = getStorage();
        const fileRef = ref(storage, "post-images/" + newDocRef.id);
        imageUrl = await uploadBytes(fileRef, file, { contentType: file.type }).then(() =>
          getDownloadURL(fileRef)
        );
      }

      await setDoc(newDocRef, {
        title,
        content,
        topic: topicName,
        createdAt: Timestamp.now(),
        author: {
          displayName: auth.currentUser.displayName || "",
          photoURL: auth.currentUser.photoURL || "",
          uid: auth.currentUser.uid || "",
          email: auth.currentUser.email || "",
        },
        imageUrl,
      });

      navigate("/");
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Container>
      <Header>發表文章</Header>
      <Form onSubmit={onSubmit}>
        <Image src={previewUrl} size="small" floated="left" />
        <Button basic as="label" htmlFor="post-image">
          上傳文章圖片
        </Button>
        <Form.Input
          type="file"
          id="post-image"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Form.Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="輸入文章標題"
        />
        <Form.TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="輸入文章餒內容"
        />
        <Form.Dropdown
          options={options}
          placeholder="選擇文章主題"
          selection
          value={topicName}
          onChange={(_, { value }) => setTopicName(value)}
        />
        <Form.Button loading={isLoading}>送出</Form.Button>
      </Form>
    </Container>
  );
}

export default NewPost;
