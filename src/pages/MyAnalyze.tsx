import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Icon, Segment, Comment, Loader } from "semantic-ui-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getMyPosts } from "../api/posts";
import { getPostComments } from "../api/posts";
import StatisticsCard from "../components/StatisticsCard";
import type { User, Comment as CommentType } from "../types";

interface MyAnalyzeProps {
  user: User | null | undefined;
}

function MyAnalyze({ user }: MyAnalyzeProps) {
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentsLoading, setCommentsLoading] = useState<string | null>(null);
  const [commentsData, setCommentsData] = useState<
    Record<string, CommentType[]>
  >({});

  const { data: posts = [] } = useQuery({
    queryKey: ["myPosts", user?.uid],
    queryFn: () => getMyPosts(user!.uid),
    enabled: !!user,
  });

  const handleRowClick = async (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);

      // 如果已經有評論數據，不需要重新加載
      if (!commentsData[postId]) {
        setCommentsLoading(postId);
        try {
          const comments = await getPostComments(postId);
          setCommentsData((prev) => ({
            ...prev,
            [postId]: comments,
          }));
        } catch (error) {
          console.error("Failed to load comments:", error);
        } finally {
          setCommentsLoading(null);
        }
      }
    }
  };
  // 計算統計數據
  const stats = {
    totalPosts: posts.length,
    totalLikes: posts.reduce(
      (sum, post) => sum + (post.likedBy?.length || 0),
      0,
    ),
    totalCollections: posts.reduce(
      (sum, post) => sum + (post.collectedBy?.length || 0),
      0,
    ),
    totalComments: posts.reduce(
      (sum, post) => sum + (post.commentsCount || 0),
      0,
    ),
    avgLikes:
      posts.length > 0
        ? Math.round(
            posts.reduce((sum, post) => sum + (post.likedBy?.length || 0), 0) /
              posts.length,
          )
        : 0,
    avgComments:
      posts.length > 0
        ? Math.round(
            posts.reduce((sum, post) => sum + (post.commentsCount || 0), 0) /
              posts.length,
          )
        : 0,
  };

  // 準備圖表數據
  const chartData = posts.map((post) => ({
    name: post.title.length > 5 ? post.title.slice(0, 5) + "..." : post.title,
    likes: post.likedBy?.length || 0,
    collections: post.collectedBy?.length || 0,
    comments: post.commentsCount || 0,
  }));

  // 月份統計數據
  const monthlyData = posts
    .reduce(
      (acc, post) => {
        const date = new Date(post.createdAt.seconds * 1000);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const monthLabel = date.toLocaleDateString("zh-TW", {
          month: "short",
          year: "2-digit",
        });

        const existing = acc.find((item) => item.monthKey === monthKey);
        if (existing) {
          existing.posts += 1;
        } else {
          acc.push({ month: monthLabel, posts: 1, monthKey });
        }
        return acc;
      },
      [] as Array<{ month: string; posts: number; monthKey: string }>,
    )
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
    .map(({ month, posts: count }) => ({ month, posts: count }));

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7c7c",
    "#8dd1e1",
    "#d084d0",
  ];

  return (
    <>
      <h2 className="text-xl font-bold mb-6">文章分析</h2>

      {/* 統計卡片 */}
      <StatisticsCard
        items={[
          { label: "總文章數", value: stats.totalPosts },
          { label: "總按讚數", value: stats.totalLikes },
          { label: "總收藏數", value: stats.totalCollections },
          { label: "總留言數", value: stats.totalComments },
          { label: "平均按讚數", value: stats.avgLikes },
          { label: "平均留言數", value: stats.avgComments },
        ]}
        columns={3}
      />

      {/* 圖表區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 文章互動數據 */}
        <Segment className="!mb-0">
          <h3 className="text-lg font-bold mb-4">文章互動數據</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="likes" fill="#8884d8" />
                <Bar dataKey="collections" fill="#82ca9d" />
                <Bar dataKey="comments" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>暫無數據</p>
          )}
        </Segment>

        {/* 互動類型占比 */}
        <Segment className="!mt-0">
          <h3 className="text-lg font-bold mb-4">互動類型占比</h3>
          {stats.totalLikes + stats.totalCollections + stats.totalComments >
          0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "按讚",
                      value: stats.totalLikes || 1,
                      fill: COLORS[0],
                    },
                    {
                      name: "收藏",
                      value: stats.totalCollections || 1,
                      fill: COLORS[1],
                    },
                    {
                      name: "留言",
                      value: stats.totalComments || 1,
                      fill: COLORS[2],
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  dataKey="value"
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>暫無數據</p>
          )}
        </Segment>
      </div>

      {/* 月份發文趨勢 */}
      <Segment className="!mb-6">
        <h3 className="text-lg font-bold mb-4">月份發文趨勢</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="posts"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Segment>

      {/* 詳細表格 */}
      <Segment>
        <h3 className="text-lg font-bold mb-4">詳細數據表</h3>
        <div className="overflow-x-auto" style={{ maxHeight: "400px" }}>
          <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={1} />
                <Table.HeaderCell width={1} textAlign="center">
                  序
                </Table.HeaderCell>
                <Table.HeaderCell width={8}>文章標題</Table.HeaderCell>
                <Table.HeaderCell width={2} textAlign="center">
                  收藏人數
                </Table.HeaderCell>
                <Table.HeaderCell width={2} textAlign="center">
                  按讚人數
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {posts.map((post, index) => (
                <>
                  <Table.Row
                    key={post.id}
                    onClick={() => handleRowClick(post.id)}
                    style={{ cursor: "pointer" }}
                    active={expandedPostId === post.id}
                  >
                    <Table.Cell textAlign="center">
                      <Icon
                        name={
                          expandedPostId === post.id
                            ? "chevron down"
                            : "chevron right"
                        }
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                    <Table.Cell>{post.title}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {post.collectedBy?.length || 0}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {post.likedBy?.length || 0}
                    </Table.Cell>
                  </Table.Row>

                  {expandedPostId === post.id && (
                    <Table.Row>
                      <Table.Cell colSpan="5">
                        <Segment>
                          <h4 className="mb-4">
                            留言 ({post.commentsCount || 0})
                          </h4>
                          {commentsLoading === post.id ? (
                            <Loader active inline="centered" />
                          ) : (
                            <Comment.Group>
                              {commentsData[post.id]?.length > 0 ? (
                                commentsData[post.id].map((comment, idx) => (
                                  <Comment key={idx}>
                                    <Comment.Avatar
                                      as="a"
                                      src={comment.author.photoURL}
                                    />
                                    <Comment.Content>
                                      <Comment.Author as="a">
                                        {comment.author.displayName}
                                      </Comment.Author>
                                      <Comment.Metadata>
                                        <div>
                                          {comment.createdAt
                                            ?.toDate()
                                            .toLocaleString()}
                                        </div>
                                      </Comment.Metadata>
                                      <Comment.Text>
                                        {comment.content}
                                      </Comment.Text>
                                    </Comment.Content>
                                  </Comment>
                                ))
                              ) : (
                                <p className="text-gray-500">暫無留言</p>
                              )}
                            </Comment.Group>
                          )}
                        </Segment>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Segment>
    </>
  );
}

export default MyAnalyze;
