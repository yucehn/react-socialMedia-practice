import {
  getFirestore,
  collection,
  Timestamp,
  setDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { Post, PostAuthor, Comment } from "../types";

export async function getMyPosts(uid: string): Promise<Post[]> {
  const db = getFirestore();
  const postsRef = query(collection(db, "posts"), where("author.uid", "==", uid));
  const res = await getDocs(postsRef);
  return res.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[];
}

export async function getPostComments(postId: string): Promise<Comment[]> {
  const db = getFirestore();
  const commentsRef = collection(db, "posts", postId, "comments");
  const res = await getDocs(commentsRef);
  return res.docs.map((doc) => ({ ...doc.data() })) as Comment[];
}

interface CreatePostInput {
  title: string;
  content: string;
  topic: string;
  author: PostAuthor;
  file: File | null;
}

export async function createPost(input: CreatePostInput): Promise<void> {
  const db = getFirestore();
  const newDocRef = doc(collection(db, "posts"));

  let imageUrl: string | null = null;
  if (input.file) {
    const storage = getStorage();
    const fileRef = ref(storage, `post-images/${newDocRef.id}`);
    await uploadBytes(fileRef, input.file, { contentType: input.file.type });
    imageUrl = await getDownloadURL(fileRef);
  }

  await setDoc(newDocRef, {
    title: input.title,
    content: input.content,
    topic: input.topic,
    createdAt: Timestamp.now(),
    author: input.author,
    imageUrl,
  });
}
