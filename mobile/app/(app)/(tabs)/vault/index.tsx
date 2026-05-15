import { View } from "react-native";
import VaultView from "@/src/components/vault/VaultView";

export default function VaultScreen() {
  return (
    <View className="flex-1 bg-[--background]">
      <VaultView />
    </View>
  );
}
