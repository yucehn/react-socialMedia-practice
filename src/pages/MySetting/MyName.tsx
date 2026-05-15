import { useMutation } from "@tanstack/react-query";
import { updateDisplayName } from "../../api/auth";
import { Button, Header, Modal, Segment } from "semantic-ui-react";
import { Button as AppButton } from "../../stories";
import { UserProp } from "../../types/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
  displayName: string;
}

export default function MyName({ user }: UserProp) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { mutate: saveName, isPending } = useMutation({
    mutationFn: (name: string) => updateDisplayName(user, name),
    onSuccess: () => {
      reset();
      setIsModalOpen(false);
    },
  });

  function closeModal() {
    reset();
    setIsModalOpen(false);
  }

  return (
    <>
      <Header>會員資料</Header>
      <Header size="small">
        會員名稱
        <AppButton
          primary
          label="修改"
          style={{ float: "right" }}
          onClick={() => setIsModalOpen(true)}
        />
      </Header>
      <Segment vertical>{user.displayName}</Segment>
      <Modal onClose={closeModal} onOpen={() => setIsModalOpen(true)} open={isModalOpen} size="mini">
        <Modal.Header>修改會員名稱</Modal.Header>
        <Modal.Content>
          <input
            {...register("displayName", { required: "請輸入名稱" })}
            placeholder="輸入新的會員名稱"
            className={`w-full border rounded px-3 py-2 outline-none focus:border-blue-400 ${
              errors.displayName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.displayName && (
            <p className="text-red-500 text-sm mt-1">{errors.displayName.message}</p>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={closeModal}>取消</Button>
          <Button
            onClick={handleSubmit(({ displayName }) => saveName(displayName))}
            loading={isPending}
          >
            修改
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
