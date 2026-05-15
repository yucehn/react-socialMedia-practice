import { useState } from "react";
import { UserProp } from "../../types/auth";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../api/auth";
import {
  Button,
  Header,
  Input,
  Message,
  Modal,
  Segment,
} from "semantic-ui-react";
import { Button as AppButton } from "../../stories";
import { FirebaseError } from "firebase/app";

export default function MyPassword({ user }: UserProp) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: savePassword, isPending } = useMutation({
    mutationFn: () => changePassword(user, oldPassword, newPassword),
    onSuccess: () => {
      setIsModalOpen(false);
      setOldPassword("");
      setNewPassword("");
      setErrorMessage(null);
    },
    onError: (e: unknown) => {
      if (e instanceof FirebaseError && e.code === "auth/wrong-password")
        setErrorMessage("請確認舊密碼");
    },
  });

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
      <Modal
        onClose={() => setIsModalOpen(false)}
        onOpen={() => setIsModalOpen(true)}
        open={isModalOpen}
        size="mini"
      >
        <Modal.Header>修改會員密碼</Modal.Header>
        <Modal.Content>
          <Header size="small">目前密碼</Header>
          <Input
            value={oldPassword}
            placeholder="輸入目前密碼"
            onChange={(e) => setOldPassword(e.target.value)}
            fluid
          />
          <Header size="small">新密碼</Header>
          <Input
            value={newPassword}
            placeholder="輸入新密碼"
            onChange={(e) => setNewPassword(e.target.value)}
            fluid
          />
          {errorMessage && <Message negative>{errorMessage}</Message>}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsModalOpen(false)}>取消</Button>
          <Button onClick={() => savePassword()} loading={isPending}>
            修改
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
