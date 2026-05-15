import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  Timestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { DropdownProps } from "semantic-ui-react";

import { Container, Header, Form, Image, Button } from "semantic-ui-react";
import { useQuery } from "@tanstack/react-query";
import { getTopics } from "../api/topics";

const PLACEHOLDER_IMAGE =
  "https://react.semantic-ui.com/images/wireframe/image.png";

interface FormErrors {
  title?: string;
  content?: string;
  topicName?: string;
}

function NewPost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topicName, setTopicName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(PLACEHOLDER_IMAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const e: FormErrors = {};
    if (!title.trim()) e.title = "請輸入文章標題";
    if (!content.trim()) e.content = "請輸入文章內容";
    if (!topicName) e.topicName = "請選擇文章主題";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const { data: topics = [] } = useQuery({
    queryKey: ["topics"],
    queryFn: () => getTopics(),
  });

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
    if (!validate()) return;
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    setIsLoading(true);
    const db = getFirestore();
    const newDocRef = doc(collection(db, "posts"));

    try {
      let imageUrl: string | null = null;
      if (file) {
        const storage = getStorage();
        const fileRef = ref(storage, "post-images/" + newDocRef.id);
        imageUrl = await uploadBytes(fileRef, file, {
          contentType: file.type,
        }).then(() => getDownloadURL(fileRef));
      }

      await setDoc(newDocRef, {
        title,
        content,
        topic: topicName,
        createdAt: Timestamp.now(),
        author: {
          displayName: currentUser.displayName || "",
          photoURL: currentUser.photoURL || "",
          uid: currentUser.uid || "",
          email: currentUser.email || "",
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
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setFile(f);
          }}
        />
        <Form.Input
          error={!!errors.title}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          placeholder="輸入文章標題"
        />
        {errors.title && <p className="text-red-500 text-sm -mt-3 mb-3">{errors.title}</p>}
        <Form.TextArea
          error={!!errors.content}
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setContent(e.target.value);
            if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
          }}
          placeholder="輸入文章內容"
        />
        {errors.content && <p className="text-red-500 text-sm -mt-3 mb-3">{errors.content}</p>}
        <Form.Dropdown
          error={!!errors.topicName}
          options={options}
          placeholder="選擇文章主題"
          selection
          value={topicName}
          onChange={(_: React.SyntheticEvent, { value }: DropdownProps) => {
            setTopicName(value as string);
            if (errors.topicName) setErrors((prev) => ({ ...prev, topicName: undefined }));
          }}
        />
        {errors.topicName && <p className="text-red-500 text-sm mt-1 mb-3">{errors.topicName}</p>}
        <Form.Button loading={isLoading}>送出</Form.Button>
      </Form>
    </Container>
  );
}

export default NewPost;
