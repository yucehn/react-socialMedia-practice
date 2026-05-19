import { useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
  email: string;
  password: string;
}

const REGISTER_ERRORS: Record<string, string> = {
  "auth/invalid-email": "信箱格式不符",
  "auth/email-already-in-use": "信箱已存在",
  "auth/weak-password": "密碼強度不足",
};

const SIGNIN_ERRORS: Record<string, string> = {
  "auth/invalid-email": "信箱格式不符",
  "auth/user-not-found": "信箱不存在",
  "auth/wrong-password": "密碼錯誤",
};

function SignIn() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<"register" | "signIn">("signIn");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  async function onSubmit({ email, password }: FormValues) {
    try {
      if (activeItem === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (error) {
      const code = (error as { code?: string }).code ?? "";
      const errorMap =
        activeItem === "register" ? REGISTER_ERRORS : SIGNIN_ERRORS;
      setError("root", { message: errorMap[code] ?? "發生錯誤，請稍後再試" });
    }
  }

  function switchTab(tab: "register" | "signIn") {
    setActiveItem(tab);
    reset();
  }

  const inputClass = (hasError: boolean) =>
    `w-full border rounded px-3 py-2 outline-none focus:border-blue-400 transition-colors ${
      hasError ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="max-w-sm mx-auto mt-8">
      <div className="flex border-b mb-6">
        <button
          type="button"
          className={`flex-1 py-3 text-center transition-colors ${
            activeItem === "register"
              ? "border-b-2 border-[#555ab9] text-[#555ab9] font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => switchTab("register")}
        >
          註冊
        </button>
        <button
          type="button"
          className={`flex-1 py-3 text-center transition-colors ${
            activeItem === "signIn"
              ? "border-b-2 border-[#555ab9] text-[#555ab9] font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => switchTab("signIn")}
        >
          登入
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">信箱</label>
          <input
            {...register("email", { required: "請輸入信箱" })}
            type="email"
            placeholder="請輸入信箱"
            className={inputClass(!!errors.email)}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">密碼</label>
          <input
            {...register("password", { required: "請輸入密碼" })}
            type="password"
            placeholder="請輸入密碼"
            className={inputClass(!!errors.password)}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded px-4 py-3 text-sm">
            {errors.root.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#555ab9] text-white py-2 rounded hover:opacity-80 disabled:opacity-50 transition-opacity"
        >
          {isSubmitting
            ? "處理中..."
            : activeItem === "register"
              ? "註冊"
              : "登入"}
        </button>
      </form>
    </div>
  );
}

export default SignIn;
