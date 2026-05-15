import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type Firestore,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type DocumentData,
  type Query,
} from "firebase/firestore";

import Post from "../components/Post";
import type { Post as PostType } from "../types";

const POST_HEIGHT = 100;
const HEADER_HEIGHT = 150;

function calcLimit() {
  return Math.ceil((window.innerHeight - HEADER_HEIGHT) / POST_HEIGHT) + 2;
}

function buildQuery(
  db: Firestore,
  currentTopic: string | null,
  pageLimit: number,
  snapshot: QueryDocumentSnapshot<DocumentData> | null = null,
): Query<DocumentData> {
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc"), limit(pageLimit)];
  if (currentTopic) constraints.unshift(where("topic", "==", currentTopic));
  if (snapshot) constraints.push(startAfter(snapshot));
  return query(collection(db, "posts"), ...constraints);
}

function Posts() {
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const currentTopic = urlSearchParams.get("topic");
  const [posts, setPosts] = useState<PostType[]>([]);
  const lastPostSnapshotRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
  const hasMoreRef = useRef(true);
  const isFetchingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pageLimitRef = useRef(0);

  useEffect(() => {
    lastPostSnapshotRef.current = null;
    hasMoreRef.current = true;
    pageLimitRef.current = calcLimit();
    const db = getFirestore();
    getDocs(buildQuery(db, currentTopic, pageLimitRef.current))
      .then((res) => {
        const data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as PostType[];
        lastPostSnapshotRef.current = res.docs[res.docs.length - 1] ?? null;
        hasMoreRef.current = res.docs.length === pageLimitRef.current;
        setPosts(data);
      })
      .catch((error) => console.log("error", error));
  }, [currentTopic]);

  const fetchMore = useCallback(() => {
    if (
      isFetchingRef.current ||
      !hasMoreRef.current ||
      !lastPostSnapshotRef.current
    )
      return;
    isFetchingRef.current = true;
    const db = getFirestore();
    getDocs(
      buildQuery(
        db,
        currentTopic,
        pageLimitRef.current,
        lastPostSnapshotRef.current,
      ),
    )
      .then((res) => {
        const data = res.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as PostType[];
        lastPostSnapshotRef.current = res.docs[res.docs.length - 1] ?? null;
        hasMoreRef.current = res.docs.length === pageLimitRef.current;
        setPosts((prev) => [...prev, ...data]);
        isFetchingRef.current = false;
      })
      .catch((error) => {
        console.log("error", error);
        isFetchingRef.current = false;
      });
  }, [currentTopic]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) fetchMore();
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchMore]);

  return (
    <>
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
      <div ref={sentinelRef} />
    </>
  );
}

export default Posts;
