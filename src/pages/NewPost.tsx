import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getTopics } from "../api/topics";
import { createPost } from "../api/posts";

const PLACEHOLDER_IMAGE =
  "https://react.semantic-ui.com/images/wireframe/image.png";

interface FormValues {
  title: string;
  content: string;
  topicName: string;
}

function NewPost() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(PLACEHOLDER_IMAGE);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const { data: topics = [] } = useQuery({
    queryKey: ["topics"],
    queryFn: () => getTopics(),
  });

  const { mutate: createPostMutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => navigate("/"),
  });

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function onSubmit({ title, content, topicName }: FormValues) {
    const currentUser = getAuth().currentUser;
    if (!currentUser) return;

    createPostMutate({
      title,
      content,
      topic: topicName,
      author: {
        displayName: currentUser.displayName || "",
        photoURL: currentUser.photoURL || "",
        uid: currentUser.uid,
        email: currentUser.email || "",
      },
      file,
    });
  }

  const inputClass = (hasError: boolean) =>
    `w-full border rounded px-3 py-2 outline-none focus:border-blue-400 transition-colors ${
      hasError ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">發表文章</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 flex items-center gap-4">
          <img
            src={previewUrl}
            alt=""
            className="w-20 h-20 object-cover rounded"
          />
          <label
            htmlFor="post-image"
            className="cursor-pointer border border-gray-400 rounded px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors"
          >
            上傳文章圖片
          </label>
          <input
            type="file"
            id="post-image"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setFile(f);
            }}
          />
        </div>

        <div className="mb-4">
          <input
            {...register("title", { required: "請輸入文章標題" })}
            placeholder="輸入文章標題"
            className={inputClass(!!errors.title)}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-4">
          <textarea
            {...register("content", { required: "請輸入文章內容" })}
            placeholder="輸入文章內容"
            rows={6}
            className={`${inputClass(!!errors.content)} resize-none`}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <select
            {...register("topicName", { required: "請選擇文章主題" })}
            className={`${inputClass(!!errors.topicName)} bg-white`}
          >
            <option value="">選擇文章主題</option>
            {topics.map((topic) => (
              <option key={topic.name} value={topic.name}>
                {topic.name}
              </option>
            ))}
          </select>
          {errors.topicName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.topicName.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-[#555ab9] text-white px-6 py-2 rounded hover:opacity-80 disabled:opacity-50 transition-opacity"
        >
          {isPending ? "送出中..." : "送出"}
        </button>
      </form>
    </div>
  );
}

export default NewPost;
