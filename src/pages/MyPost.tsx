import { useEffect, useState } from "react";
import { Header } from "semantic-ui-react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import Post from "../components/Post";
import type { User, Post as PostType } from "../types";

interface MyPostProps {
  user: User | null | undefined;
}

function MyPost({ user }: MyPostProps) {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    if (!user) return;
    const db = getFirestore();
    const postsRef = query(
      collection(db, "posts"),
      where("author.uid", "==", user.uid),
    );
    getDocs(postsRef)
      .then((res) => {
        const data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as PostType[];
        setPosts(data);
      })
      .catch((error) => console.log("error", error));
  }, [user]);

  return (
    <>
      <Header>我的文章</Header>
      <div className="overflow-y-auto" style={{ height: "calc(100vh - 150px)" }}>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}

export default MyPost;
