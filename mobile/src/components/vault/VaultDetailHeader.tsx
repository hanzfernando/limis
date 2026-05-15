import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { VaultDetail } from "@/src/types/vault";

type Props = {
  vault: VaultDetail;
  isUnlocked: boolean;
  foregroundColor: string;
  onBack: () => void;
  onCloseVault: () => void;
};

export function VaultDetailHeader({ vault, isUnlocked, foregroundColor, onBack, onCloseVault }: Props) {
  return (
    <View className="mb-4 flex-row items-start justify-between gap-3 rounded-lg bg-[--card] p-4">
      <View className="flex-1">
        <Text className="text-xl font-semibold text-[--foreground]">{vault.name}</Text>
        {vault.desc ? <Text className="mt-1 text-sm text-[--muted-foreground]">{vault.desc}</Text> : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isUnlocked ? "Close vault" : "Go back"}
        onPress={isUnlocked ? onCloseVault : onBack}
        className="h-10 w-10 items-center justify-center rounded-full border border-[--border]"
      >
        <Ionicons name={isUnlocked ? "lock-closed-outline" : "arrow-back"} size={20} color={foregroundColor} />
      </Pressable>
    </View>
  );
}
