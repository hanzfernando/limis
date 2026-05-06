import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useUnstableNativeVariable } from "nativewind";
import type { VaultCredential } from "@/src/types/credential";

type Props = {
  credential: VaultCredential | null;
  foregroundColor: string;
  onClose: () => void;
  onEdit: (credential: VaultCredential) => void;
  onDelete: (credential: VaultCredential) => void;
};

function CredentialField({
  label,
  value,
  copiedField,
  mutedColor,
  onCopy,
}: {
  label: string;
  value?: string;
  copiedField: string | null;
  mutedColor: string;
  onCopy: (label: string, value: string) => void;
}) {
  if (!value) return null;

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm text-[--muted-foreground]">{label}</Text>
      <View className="rounded-lg border border-[--border] bg-[--muted] p-3">
        <View className="flex-row items-center gap-2">
          <Text selectable className="flex-1 text-sm text-[--foreground]">
            {value}
          </Text>
          {copiedField === label ? <Text className="text-xs font-semibold text-[--success]">Copied</Text> : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Copy ${label.toLowerCase()}`}
            onPress={() => onCopy(label, value)}
            className="h-9 w-9 items-center justify-center rounded-full border border-[--border] bg-[--card]"
          >
            <Ionicons name="copy-outline" size={17} color={mutedColor} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function CredentialDetailModal({ credential, foregroundColor, onClose, onEdit, onDelete }: Props) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const mutedColor = useUnstableNativeVariable("--muted-foreground") ?? "#6b7280";
  const hasDetails = Boolean(credential?.username || credential?.password || credential?.url || credential?.note);

  async function handleCopy(label: string, value: string) {
    await Clipboard.setStringAsync(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField((current) => (current === label ? null : current)), 1600);
  }

  function handleClose() {
    setCopiedField(null);
    onClose();
  }

  return (
    <Modal animationType="slide" transparent visible={credential !== null} onRequestClose={handleClose}>
      <View className="flex-1 justify-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close credential details"
          className="absolute bottom-0 left-0 right-0 top-0 bg-black/40"
          onPress={handleClose}
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
              onPress={handleClose}
              className="h-10 w-10 items-center justify-center rounded-full border border-[--border]"
            >
              <Ionicons name="close" size={20} color={foregroundColor} />
            </Pressable>
          </View>

          {credential ? (
            <View className="mb-4 flex-row gap-2">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit credential"
                onPress={() => onEdit(credential)}
                className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-md bg-[--primary]"
              >
                <Ionicons name="create-outline" size={17} color="#ffffff" />
                <Text className="font-semibold text-[--primary-foreground]">Edit</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Delete credential"
                onPress={() => onDelete(credential)}
                className="h-11 flex-1 flex-row items-center justify-center gap-2 rounded-md border border-rose-500"
              >
                <Ionicons name="trash-outline" size={17} color="#f43f5e" />
                <Text className="font-semibold text-rose-500">Delete</Text>
              </Pressable>
            </View>
          ) : null}

          <ScrollView className="pb-12">
            <CredentialField
              label="Username"
              value={credential?.username}
              copiedField={copiedField}
              mutedColor={mutedColor}
              onCopy={handleCopy}
            />
            <CredentialField
              label="Password"
              value={credential?.password}
              copiedField={copiedField}
              mutedColor={mutedColor}
              onCopy={handleCopy}
            />
            <CredentialField
              label="URL"
              value={credential?.url}
              copiedField={copiedField}
              mutedColor={mutedColor}
              onCopy={handleCopy}
            />
            <CredentialField
              label="Note"
              value={credential?.note}
              copiedField={copiedField}
              mutedColor={mutedColor}
              onCopy={handleCopy}
            />
            {credential && !hasDetails ? (
              <Text className="mb-4 text-sm text-[--muted-foreground]">This credential has no saved details.</Text>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
