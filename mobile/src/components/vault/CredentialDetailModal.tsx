import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import type { VaultCredential } from "@/src/types/credential";

type Props = {
  credential: VaultCredential | null;
  foregroundColor: string;
  onClose: () => void;
};

function CredentialField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm text-[--muted-foreground]">{label}</Text>
      <View className="rounded-lg border border-[--border] bg-[--muted] p-3">
        <Text selectable className="text-sm text-[--foreground]">
          {value}
        </Text>
      </View>
    </View>
  );
}

export function CredentialDetailModal({ credential, foregroundColor, onClose }: Props) {
  const hasDetails = Boolean(credential?.username || credential?.password || credential?.url || credential?.note);

  return (
    <Modal animationType="slide" transparent visible={credential !== null} onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close credential details"
          className="absolute bottom-0 left-0 right-0 top-0 bg-black/40"
          onPress={onClose}
        />
        <View className="max-h-[82%] rounded-t-2xl bg-[--card] p-4">
          <View className="mb-4 flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-[--foreground]">
                {credential?.title ?? credential?.name ?? "Credential"}
              </Text>
              {credential?.id ? <Text className="mt-1 text-xs text-[--muted-foreground]">{credential.id}</Text> : null}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close credential details"
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full border border-[--border]"
            >
              <Ionicons name="close" size={20} color={foregroundColor} />
            </Pressable>
          </View>

          <ScrollView className="pb-12">
            <CredentialField label="Username" value={credential?.username} />
            <CredentialField label="Password" value={credential?.password} />
            <CredentialField label="URL" value={credential?.url} />
            <CredentialField label="Note" value={credential?.note} />
            {credential && !hasDetails ? (
              <Text className="mb-4 text-sm text-[--muted-foreground]">This credential has no saved details.</Text>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
