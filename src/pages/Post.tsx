import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
  increment,
  Timestamp,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import {
  Grid,
  Header,
  Image,
  Segment,
  Icon,
  Comment,
  Form,
} from "semantic-ui-react";
import type { User, Post as PostType, Comment as CommentType } from "../types";

interface PostPageProps {
  user?: User | null;
}

function Post({ user }: PostPageProps) {
  const { postId } = useParams<{ postId: string }>();
  const db = getFirestore();
  // postId is guaranteed by the route pattern /posts/:postId
  const docRef = doc(db, "posts", postId!);
  const auth = getAuth();
  const uid = user?.uid ?? auth.currentUser?.uid;
  const [post, setPost] = useState<PostType | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      const data = snapshot.data();
      if (data) setPost({ id: snapshot.id, ...data } as PostType);
    });
    return () => unsubscribe();
  }, [postId]);

  useEffect(() => {
    const docQuery = query(
      collection(docRef, "comments"),
      orderBy("createdAt"),
    );
    const unsubscribe = onSnapshot(docQuery, (collectionSnapshot) => {
      const data = collectionSnapshot.docs.map((d) => d.data() as CommentType);
      setComments(data);
    });
    return () => unsubscribe();
  }, [postId]);

  function toggle(
    isActive: boolean | undefined,
    field: "likedBy" | "collectedBy",
  ) {
    if (!uid) return;
    updateDoc(docRef, {
      [field]: isActive ? arrayRemove(uid) : arrayUnion(uid),
    });
  }

  const onSubmit = () => {
    if (!uid || !auth.currentUser || !post) return;
    setIsLoading(true);
    const batch = writeBatch(db);
    batch.update(docRef, {
      commentsCount: increment(1),
    });

    const commentRef = doc(collection(docRef, "comments"));
    batch.set(commentRef, {
      content: commentContent,
      createdAt: Timestamp.now(),
      author: {
        uid,
        displayName: auth.currentUser.displayName || "",
        photoURL: auth.currentUser.photoURL || "",
      },
    });

    const mailRef = doc(collection(db, "mail"));
    batch.set(mailRef, {
      to: post.author.email,
      message: {
        subject: `新訊息:${auth.currentUser.displayName}剛已回覆您的文章`,
        html: `<a href="${window.location.origin}/posts/${postId}" target="_blank">前往文章</a>`,
      },
    });

    batch.commit().then(() => {
      setCommentContent("");
      setIsLoading(false);
    });
  };

  if (!post) return null;

  const isCollectedBy = post.collectedBy?.includes(uid ?? "");
  const isLiked = post.likedBy?.includes(uid ?? "");

  return (
    <Grid.Column width={10}>
      <Header>
        <Header.Subheader className="!mb-2 !text-md">
          {post.author.photoURL ? (
            <Image src={post.author.photoURL} avatar />
          ) : (
            <Icon name="user circle" />
          )}
          {post.author.displayName || "使用者"}
        </Header.Subheader>
        <div className="mb-3">{post.title}</div>
        <Header.Subheader>
          {post.topic}。{post.createdAt?.toDate().toLocaleDateString()}
        </Header.Subheader>
      </Header>
      <Image src={post.imageUrl ?? undefined} />
      <Segment basic vertical>
        {post.content}
      </Segment>
      <Segment basic vertical>
        留言 {post.commentsCount || 0}。讚 {post.likedBy?.length || 0}
        {uid ? (
          <>
            。
            <Icon
              name="thumbs up"
              color={isLiked ? "blue" : "grey"}
              onClick={() => toggle(isLiked, "likedBy")}
              link
              className="border-0"
            />
            。
            <Icon
              name="bookmark"
              color={isCollectedBy ? "blue" : "grey"}
              onClick={() => toggle(isCollectedBy, "collectedBy")}
              link
            />
          </>
        ) : (
          ""
        )}
      </Segment>
      <Comment>
        <Comment.Group>
          {uid ? (
            <Form reply onSubmit={onSubmit}>
              <Form.TextArea
                value={commentContent}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setCommentContent(e.target.value);
                }}
              />
              <Form.Button loading={isLoading}>留言</Form.Button>
            </Form>
          ) : (
            ""
          )}
          <Header>共{post.commentsCount || 0}則留言</Header>
          {comments.map((comment) => {
            return (
              <Comment key={comment.createdAt.toMillis()}>
                {comment.author.photoURL ? (
                  <Comment.Avatar src={comment.author.photoURL} />
                ) : (
                  <div className="w-[35px] float-left mr-4">
                    <Icon name="user circle" className="!text-4xl" />
                  </div>
                )}
                <Comment.Content>
                  <Comment.Author as="span">
                    {comment.author.displayName || "匿名"}
                  </Comment.Author>
                  <Comment.Metadata>
                    {comment.createdAt.toDate().toLocaleString()}
                  </Comment.Metadata>
                  <Comment.Text>{comment.content}</Comment.Text>
                </Comment.Content>
              </Comment>
            );
          })}
        </Comment.Group>
      </Comment>
    </Grid.Column>
  );
}

export default Post;
