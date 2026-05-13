import { useEffect, useState } from "react";
import { Header, Item } from "semantic-ui-react";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

import Post from "../components/Post";

function MyCollections({ user }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user) return;
    const db = getFirestore();
    const postsRef = query(collection(db, "posts"), where("collectedBy", "array-contains", user.uid));
    getDocs(postsRef)
      .then((res) => {
        const data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setPosts(data);
      })
      .catch((error) => console.log("error", error));
  }, [user]);

  return (
    <>
      <Header>我的收藏</Header>
      <Item.Group>
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </Item.Group>
    </>
  );
}

export default MyCollections;
