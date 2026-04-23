import { Redirect } from "expo-router";
import { useAppSelector } from "@/src/hooks/redux";

export default function Index() {
  const { token, authChecked } = useAppSelector((state) => state.auth);

  if (!authChecked) {
    return null;
  } 

  return <Redirect href={token ? "/(app)" : "/(auth)/login"} />;
}
