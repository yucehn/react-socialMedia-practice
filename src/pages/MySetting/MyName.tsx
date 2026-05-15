import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { updateDisplayName } from "../../api/auth";
import { Button, Header, Input, Modal, Segment } from "semantic-ui-react";
import { Button as AppButton } from "../../stories";
import { UserProp } from "../../types/auth";

export default function MyName({ user }: UserProp) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const { mutate: saveName, isPending } = useMutation({
    mutationFn: (name: string) => updateDisplayName(user, name),
    onSuccess: () => {
      setDisplayName("");
      setIsModalOpen(false);
    },
  });

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
      <Modal
        onClose={() => setIsModalOpen(false)}
        onOpen={() => setIsModalOpen(true)}
        open={isModalOpen}
        size="mini"
      >
        <Modal.Header>修改會員名稱</Modal.Header>
        <Modal.Content>
          <Input
            value={displayName}
            placeholder="輸入新的會員名稱"
            onChange={(e) => setDisplayName(e.target.value)}
            fluid
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsModalOpen(false)}>取消</Button>
          <Button onClick={() => saveName(displayName)} loading={isPending}>
            修改
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
