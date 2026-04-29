import { Pressable, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { logoutThunk } from "@/src/store/slices/authSlice";
import VaultView from "@/src/components/vault/VaultView";

export default function HomeScreen() {

  return (
    <View className="flex-1 bg-[--background] p-8">
      <VaultView />
    </View>
  );
}
