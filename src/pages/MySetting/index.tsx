import type { User } from "../../types";
import MyName from "./MyName";
import MyPhoto from "./MyPhoto";
import MyPassword from "./MyPassword";

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
