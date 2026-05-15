import { getFirestore, collection, getDocs, query } from "firebase/firestore";
import type { Topic } from "../types";

export async function getTopics(): Promise<Topic[]> {
  const db = getFirestore();
  const postsRef = query(collection(db, "topics"));
  const res = await getDocs(postsRef);
  return res.docs.map((doc) => doc.data() as Topic);
}
