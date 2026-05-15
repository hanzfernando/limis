import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { VaultCredential } from "@/src/types/credential";

type Props = {
  credentials: VaultCredential[];
  foregroundColor: string;
  mutedColor: string;
  onAddCredential: () => void;
  onCloseVault: () => void;
  onSelectCredential: (credential: VaultCredential) => void;
};

export function CredentialListSection({
  credentials,
  foregroundColor,
  mutedColor,
  onAddCredential,
  onCloseVault,
  onSelectCredential,
}: Props) {
  return (
    <View className="mt-6">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-base font-semibold text-[--foreground]">Credentials</Text>
        <View className="flex-row items-center gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add credential"
            onPress={onAddCredential}
            className="flex-row items-center gap-2 rounded-md bg-[--primary] px-3 py-2"
          >
            <Ionicons name="add" size={16} color="#ffffff" />
            <Text className="text-sm font-semibold text-[--primary-foreground]">Add</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close vault"
            onPress={onCloseVault}
            className="flex-row items-center gap-2 rounded-md border border-[--border] px-3 py-2"
          >
            <Ionicons name="lock-closed-outline" size={16} color={foregroundColor} />
            <Text className="text-sm font-semibold text-[--foreground]">Close</Text>
          </Pressable>
        </View>
      </View>

      {credentials.length === 0 ? (
        <Text className="text-sm text-[--muted-foreground]">No credentials found.</Text>
      ) : (
        credentials.map((credential, idx) => (
          <Pressable
            key={credential.id ?? idx}
            accessibilityRole="button"
            accessibilityLabel={`View ${credential.title ?? credential.name ?? `credential ${idx + 1}`}`}
            onPress={() => onSelectCredential(credential)}
            className="mb-3 rounded-lg border border-[--border] bg-[--card] p-3"
          >
            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-[--foreground]">
                  {credential.title ?? credential.name ?? `Item ${idx + 1}`}
                </Text>
                {credential.username ? (
                  <Text className="mt-1 text-sm text-[--muted-foreground]">{credential.username}</Text>
                ) : null}
                {credential.url ? <Text className="mt-1 text-xs text-[--muted-foreground]">{credential.url}</Text> : null}
              </View>
              <Ionicons name="chevron-forward" size={18} color={mutedColor} />
            </View>
          </Pressable>
        ))
      )}
    </View>
  );
}
