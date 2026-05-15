import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

import Post from "../components/Post";
import type { User, Post as PostType } from "../types";

interface MyCollectionsProps {
  user: User | null | undefined;
}

function MyCollections({ user }: MyCollectionsProps) {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    if (!user) return;
    const db = getFirestore();
    const postsRef = query(
      collection(db, "posts"),
      where("collectedBy", "array-contains", user.uid),
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
      <h2 className="text-xl font-bold mb-4">我的收藏</h2>
      <div>
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
    </>
  );
}

export default MyCollections;
