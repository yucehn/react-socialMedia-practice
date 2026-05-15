import { Link } from "react-router-dom";
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
            <img
              src={post.author.photoURL}
              alt=""
              className="w-5 h-5 rounded-full inline-block align-middle"
            />
          ) : (
            <svg className="w-5 h-5 inline-block align-middle text-black/40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
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
