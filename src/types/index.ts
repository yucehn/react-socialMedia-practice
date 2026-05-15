import type { Timestamp } from "firebase/firestore";
import type { User } from "firebase/auth";

export type { User };

export interface PostAuthor {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
}

export interface CommentAuthor {
  uid: string;
  displayName: string;
  photoURL: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  topic: string;
  createdAt: Timestamp;
  imageUrl: string | null;
  author: PostAuthor;
  likedBy: string[];
  collectedBy: string[];
  commentsCount: number;
}

export interface Comment {
  content: string;
  createdAt: Timestamp;
  author: CommentAuthor;
}

export interface Topic {
  name: string;
}

export interface AlgoliaPostHit {
  objectID: string;
  title: string;
  content: string;
}

export interface SearchResult {
  title: string;
  description: string;
  id: string;
}

export interface MenuItem {
  name: string;
  path: string;
}
