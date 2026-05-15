import { Link } from "react-router-dom";
import { Image, Icon } from "semantic-ui-react";
import type { Post as PostType } from "../types";

const placeholder = "https://react.semantic-ui.com/images/wireframe/image.png";

interface PostProps {
  post: PostType;
}

function Post({ post }: PostProps) {
  return (
    <Link
      to={`/posts/${post.id}`}
      className="flex items-center gap-[1em] py-[0.5em] border-b border-black/[.15] text-black/[.87] no-underline !text-black hover:!bg-[rgba(0,0,0,0.03)]"
    >
      <img
        src={post.imageUrl || placeholder}
        alt={post.title}
        className="w-20 h-20 object-cover shrink-0 rounded"
      />
      <div className="flex-1 min-w-0">
        <div className="text-black/40 text-[0.9em] mb-[0.2em]">
          {post.author.photoURL ? (
            <Image src={post.author.photoURL} avatar />
          ) : (
            <Icon name="user circle" />
          )}
          {` `}
          {post.topic}。{post.author.displayName || "匿名"}
        </div>
        <div className="font-bold text-[1em] mb-[0.2em]">{post.title}</div>
        <div className="truncate text-black/60 text-[0.9em]">
          {post.content}
        </div>
        <div className="text-black/40 text-[0.85em] mt-[0.3em]">
          留言 {post.commentsCount || 0} 。讚 {post.likedBy?.length || 0}
        </div>
      </div>
    </Link>
  );
}

export default Post;
