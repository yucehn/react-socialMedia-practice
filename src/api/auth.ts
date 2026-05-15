import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { User } from "../types";

export async function updateDisplayName(user: User, displayName: string): Promise<void> {
  await updateProfile(user, { displayName });
}

export async function updateUserPhoto(user: User, file: File): Promise<void> {
  const storage = getStorage();
  const fileRef = ref(storage, `user-photos/${user.uid}`);
  await uploadBytes(fileRef, file, { contentType: file.type });
  const photoURL = await getDownloadURL(fileRef);
  await updateProfile(user, { photoURL });
}

export async function changePassword(
  user: User,
  oldPassword: string,
  newPassword: string,
): Promise<void> {
  if (!user.email) throw new Error("使用者沒有設定信箱");
  const credential = EmailAuthProvider.credential(user.email, oldPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}
