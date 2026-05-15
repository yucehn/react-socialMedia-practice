import { useQuery } from "@tanstack/react-query";

import Post from "../components/Post";
import { getMyPosts } from "../api/posts";
import type { User } from "../types";

interface MyPostProps {
  user: User | null | undefined;
}

function MyPost({ user }: MyPostProps) {
  const { data: posts = [] } = useQuery({
    queryKey: ["myPosts", user?.uid],
    queryFn: () => getMyPosts(user!.uid),
    enabled: !!user,
  });

  return (
    <>
      <h2 className="text-xl font-bold mb-4">我的文章</h2>
      <div className="overflow-y-auto" style={{ height: "calc(100vh - 150px)" }}>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}

export default MyPost;
