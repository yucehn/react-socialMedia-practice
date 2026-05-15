import { useState } from "react";
import { UserProp } from "../../types/auth";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../api/auth";
import { Button, Header, Message, Modal, Segment } from "semantic-ui-react";
import { Button as AppButton } from "../../stories";
import { FirebaseError } from "firebase/app";
import { useForm } from "react-hook-form";

interface FormValues {
  oldPassword: string;
  newPassword: string;
}

export default function MyPassword({ user }: UserProp) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { mutate: savePassword, isPending } = useMutation({
    mutationFn: ({ oldPassword, newPassword }: FormValues) =>
      changePassword(user, oldPassword, newPassword),
    onSuccess: () => {
      reset();
      setIsModalOpen(false);
      setErrorMessage(null);
    },
    onError: (e: unknown) => {
      if (e instanceof FirebaseError && e.code === "auth/wrong-password")
        setErrorMessage("請確認舊密碼");
    },
  });

  function closeModal() {
    reset();
    setIsModalOpen(false);
    setErrorMessage(null);
  }

  const inputClass = (hasError: boolean) =>
    `w-full border rounded px-3 py-2 outline-none focus:border-blue-400 transition-colors ${
      hasError ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <>
      <Header size="small">
        會員密碼
        <AppButton
          label="修改"
          style={{ float: "right" }}
          onClick={() => setIsModalOpen(true)}
        />
      </Header>
      <Segment vertical>******</Segment>
      <Modal onClose={closeModal} onOpen={() => setIsModalOpen(true)} open={isModalOpen} size="mini">
        <Modal.Header>修改會員密碼</Modal.Header>
        <Modal.Content>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">目前密碼</label>
            <input
              {...register("oldPassword", { required: "請輸入目前密碼" })}
              type="password"
              placeholder="輸入目前密碼"
              className={inputClass(!!errors.oldPassword)}
            />
            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.oldPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">新密碼</label>
            <input
              {...register("newPassword", { required: "請輸入新密碼", minLength: { value: 6, message: "密碼至少 6 個字元" } })}
              type="password"
              placeholder="輸入新密碼"
              className={inputClass(!!errors.newPassword)}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
            )}
          </div>
          {errorMessage && <Message negative className="mt-3">{errorMessage}</Message>}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={closeModal}>取消</Button>
          <Button onClick={handleSubmit((values) => savePassword(values))} loading={isPending}>
            修改
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
