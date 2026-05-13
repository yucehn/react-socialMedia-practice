import { useEffect, useState } from "react";
import { Header } from "semantic-ui-react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { FixedSizeList } from "react-window";

import Post from "../components/Post";

const ITEM_HEIGHT = 100;

function MyPost({ user }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user) return;
    const db = getFirestore();
    const postsRef = query(
      collection(db, "posts"),
      where("author.uid", "==", user.uid),
    );
    getDocs(postsRef)
      .then((res) => {
        const data = res.docs.map((doc) => {
          const id = doc.id;
          return { ...doc.data(), id };
        });
        setPosts(data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [user]);

  const Row = ({ index, style }) => <Post post={posts[index]} style={style} />;

  return (
    <>
      <Header>我的文章</Header>
      <FixedSizeList
        height={window.innerHeight - 150}
        width="100%"
        itemCount={posts.length}
        itemSize={ITEM_HEIGHT}
        style={{ overflowX: "hidden" }}
      >
        {Row}
      </FixedSizeList>
    </>
  );
}

export default MyPost;
