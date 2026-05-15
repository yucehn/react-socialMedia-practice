import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import type { Post } from "../types";

export async function getMyPosts(uid: string): Promise<Post[]> {
  const db = getFirestore();
  const postsRef = query(collection(db, "posts"), where("author.uid", "==", uid));
  const res = await getDocs(postsRef);
  return res.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[];
}
