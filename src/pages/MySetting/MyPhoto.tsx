import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { updateUserPhoto } from "../../api/auth";
import {
  Button,
  Header,
  Input,
  Modal,
  Segment,
  Image,
  Icon,
} from "semantic-ui-react";
import { Button as AppButton } from "../../stories";
import { UserProp } from "../../types/auth";

export default function MyPhoto({ user }: UserProp) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const { mutate: savePhoto, isPending } = useMutation({
    mutationFn: (f: File) => updateUserPhoto(user, f),
    onSuccess: () => {
      setFile(null);
      setPreviewUrl(null);
      setIsModalOpen(false);
    },
    onError: (e) => console.log("error", e),
  });

  return (
    <>
      <Header size="small">
        會員照片
        <AppButton
          label="修改"
          style={{ float: "right" }}
          onClick={() => setIsModalOpen(true)}
        />
      </Header>
      <Segment vertical>
        {user.photoURL ? (
          <Image src={user.photoURL} avatar />
        ) : (
          <Icon name="user circle" />
        )}
      </Segment>
      <Modal
        onClose={() => setIsModalOpen(false)}
        onOpen={() => setIsModalOpen(true)}
        open={isModalOpen}
        size="mini"
      >
        <Modal.Header>修改會員照片</Modal.Header>
        <Modal.Content image>
          {(previewUrl || user.photoURL) && (
            <Image
              src={previewUrl ?? user.photoURL ?? undefined}
              avatar
              wrapped
            />
          )}
          <Modal.Description>
            <Button as="label" htmlFor="user-photo">
              上傳
            </Button>
            <Input
              id="user-photo"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFile(f);
              }}
            />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={() => {
              setIsModalOpen(false);
              setFile(null);
            }}
          >
            取消
          </Button>
          <Button onClick={() => file && savePhoto(file)} loading={isPending}>
            修改
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
