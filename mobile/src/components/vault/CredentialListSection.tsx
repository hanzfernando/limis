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
      <View className="mb-4 flex-row items-center justify-between gap-3">
        <View>
          <Text className="text-xs font-semibold uppercase tracking-widest text-[--muted-foreground]">
            Decrypted records
          </Text>
          <Text className="mt-1 text-xl font-semibold text-[--foreground]">Credentials</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add credential"
            onPress={onAddCredential}
            className="h-10 w-10 items-center justify-center rounded-md bg-[--primary]"
          >
            <Ionicons name="add" size={18} color="#fbf9ff" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close vault"
            onPress={onCloseVault}
            className="h-10 w-10 items-center justify-center rounded-md border border-[--border] bg-[--card]"
          >
            <Ionicons name="lock-closed-outline" size={16} color={foregroundColor} />
          </Pressable>
        </View>
      </View>

      {credentials.length === 0 ? (
        <View className="rounded-lg border border-dashed border-[--border] bg-[--card] p-5">
          <Ionicons name="key-outline" size={22} color={mutedColor} />
          <Text className="mt-3 text-sm font-semibold text-[--foreground]">No credentials found.</Text>
          <Text className="mt-1 text-sm leading-5 text-[--muted-foreground]">
            Add the first record to this open archive.
          </Text>
        </View>
      ) : (
        credentials.map((credential, idx) => (
          <Pressable
            key={credential.id ?? idx}
            accessibilityRole="button"
            accessibilityLabel={`View ${credential.title ?? credential.name ?? `credential ${idx + 1}`}`}
            onPress={() => onSelectCredential(credential)}
            className="mb-3 rounded-lg border border-[--border] bg-[--card] p-4"
          >
            <View className="flex-row items-center justify-between gap-3">
              <View className="h-9 w-9 items-center justify-center rounded-md bg-[--secondary]">
                <Ionicons name="key-outline" size={17} color={foregroundColor} />
              </View>
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
