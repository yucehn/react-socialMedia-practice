import { useState, useEffect } from "react";
import {
  Button,
  Header,
  Input,
  Modal,
  Segment,
  Image,
  Message,
  Icon,
} from "semantic-ui-react";
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import type { User } from "../types";

interface UserProp {
  user: User;
}

function MyName({ user }: UserProp) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    setIsLoading(true);
    updateProfile(user, { displayName }).then(() => {
      setDisplayName("");
      setIsModalOpen(false);
      setIsLoading(false);
    });
  };

  return (
    <>
      <Header>會員資料</Header>
      <Header size="small">
        會員名稱
        <Button floated="right" onClick={() => setIsModalOpen(true)}>
          修改
        </Button>
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
          <Button onClick={onSubmit} loading={isLoading}>修改</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

function MyPhoto({ user }: UserProp) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onSubmit = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      const storage = getStorage();
      const fileRef = ref(storage, "user-photos/" + user.uid);
      const imageUrl = await uploadBytes(fileRef, file, { contentType: file.type }).then(() =>
        getDownloadURL(fileRef),
      );
      await updateProfile(user, { photoURL: imageUrl });
      setFile(null);
      setIsModalOpen(false);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header size="small">
        會員照片
        <Button floated="right" onClick={() => setIsModalOpen(true)}>
          修改
        </Button>
      </Header>
      <Segment vertical>
        {user.photoURL ? <Image src={user.photoURL} avatar /> : <Icon name="user circle" />}
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
            <Image src={previewUrl ?? user.photoURL ?? undefined} avatar wrapped />
          )}
          <Modal.Description>
            <Button as="label" htmlFor="user-photo">上傳</Button>
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
          <Button onClick={() => { setIsModalOpen(false); setFile(null); }}>取消</Button>
          <Button onClick={onSubmit} loading={isLoading}>修改</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

function MyPassword({ user }: UserProp) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = () => {
    if (!user.email) return;
    setIsLoading(true);
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    reauthenticateWithCredential(user, credential)
      .then(() =>
        updatePassword(user, newPassword).then(() => {
          setIsModalOpen(false);
          setOldPassword("");
          setNewPassword("");
          setErrorMessage(null);
        }),
      )
      .catch((error) => {
        if (error.code === "auth/wrong-password") setErrorMessage("請確認舊密碼");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Header size="small">
        會員密碼
        <Button floated="right" onClick={() => setIsModalOpen(true)}>
          修改
        </Button>
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
          <Button onClick={onSubmit} loading={isLoading}>修改</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

interface MySettingsProps {
  user: User | null | undefined;
}

function MySettings({ user }: MySettingsProps) {
  if (!user) return null;
  return (
    <>
      <MyName user={user} />
      <MyPhoto user={user} />
      <MyPassword user={user} />
    </>
  );
}

export default MySettings;
