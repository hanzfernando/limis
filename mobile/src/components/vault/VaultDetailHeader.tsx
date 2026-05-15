import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { VaultDetail } from "@/src/types/vault";

type Props = {
  vault: VaultDetail;
  isUnlocked: boolean;
  foregroundColor: string;
  onBack: () => void;
  onCloseVault: () => void;
  onEditDetails: () => void;
};

export function VaultDetailHeader({
  vault,
  isUnlocked,
  foregroundColor,
  onBack,
  onCloseVault,
  onEditDetails,
}: Props) {
  return (
    <View className="mb-4 rounded-lg border border-[--border] bg-[--card] p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-xs font-semibold uppercase tracking-widest text-[--muted-foreground]">
            {isUnlocked ? "Open archive" : "Sealed archive"}
          </Text>
          <Text className="mt-2 text-2xl font-semibold text-[--foreground]">{vault.name}</Text>
          {vault.desc ? <Text className="mt-2 text-sm leading-5 text-[--muted-foreground]">{vault.desc}</Text> : null}
        </View>
        <View className="flex-row gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit vault details"
            onPress={onEditDetails}
            className="h-10 w-10 items-center justify-center rounded-md border border-[--border] bg-[--background]"
          >
            <Ionicons name="create-outline" size={18} color={foregroundColor} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isUnlocked ? "Close vault" : "Go back"}
            onPress={isUnlocked ? onCloseVault : onBack}
            className="h-10 w-10 items-center justify-center rounded-md border border-[--border] bg-[--background]"
          >
            <Ionicons name={isUnlocked ? "lock-closed-outline" : "arrow-back"} size={20} color={foregroundColor} />
          </Pressable>
        </View>
      </View>
      <View className="mt-4 flex-row items-center gap-2 rounded-md border border-[--border] bg-[--background] px-3 py-2">
        <View className={`h-2 w-2 rounded-full ${isUnlocked ? "bg-[--success]" : "bg-[--primary]"}`} />
        <Text className="text-xs font-medium text-[--muted-foreground]">
          {isUnlocked ? "Credentials decrypted on this device" : "AES-GCM sealed until unlock"}
        </Text>
      </View>
    </View>
  );
}
