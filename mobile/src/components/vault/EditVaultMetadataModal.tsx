import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { useUnstableNativeVariable } from "nativewind";
import type { VaultDetail } from "@/src/types/vault";

type Props = {
  visible: boolean;
  vault: VaultDetail;
  saving: boolean;
  error?: string | null;
  foregroundColor: string;
  onClose: () => void;
  onSave: (payload: { name: string; desc?: string }) => void;
};

export function EditVaultMetadataModal({
  visible,
  vault,
  saving,
  error,
  foregroundColor,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState(vault.name);
  const [desc, setDesc] = useState(vault.desc ?? "");
  const mutedColor = useUnstableNativeVariable("--muted-foreground") ?? "#756e83";
  const primaryColor = useUnstableNativeVariable("--primary") ?? "#5d3c8f";

  useEffect(() => {
    if (visible) {
      setName(vault.name);
      setDesc(vault.desc ?? "");
    }
  }, [visible, vault.desc, vault.name]);

  function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName || saving) return;

    onSave({
      name: trimmedName,
      desc: desc.trim() || undefined,
    });
  }

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end pb-12">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close edit vault details"
          className="absolute bottom-0 left-0 right-0 top-0 bg-black/40"
          onPress={onClose}
        />
        <View className="rounded-t-lg border-t border-[--border] bg-[--card] p-4">
          <View className="mb-5 flex-row items-center justify-between gap-3">
            <View className="flex-1 flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-md bg-[--secondary]">
                <Ionicons name="create-outline" size={18} color={primaryColor} />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-semibold uppercase tracking-widest text-[--muted-foreground]">
                  Archive details
                </Text>
                <Text className="text-lg font-semibold text-[--foreground]">Edit vault metadata</Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close edit vault details"
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-md border border-[--border]"
            >
              <Ionicons name="close" size={20} color={foregroundColor} />
            </Pressable>
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm text-[--muted-foreground]">Vault name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Personal archive"
              placeholderTextColor={mutedColor}
              className="rounded-md border border-[--input] bg-[--muted] px-4 py-3 text-[--foreground]"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm text-[--muted-foreground]">Description</Text>
            <TextInput
              value={desc}
              onChangeText={setDesc}
              multiline
              textAlignVertical="top"
              placeholder="What this vault protects"
              placeholderTextColor={mutedColor}
              className="min-h-24 rounded-md border border-[--input] bg-[--muted] px-4 py-3 text-[--foreground]"
            />
          </View>

          <View className="mb-4 rounded-md border border-[--border] bg-[--background] p-3">
            <View className="flex-row items-start gap-2">
              <Ionicons name="shield-checkmark-outline" size={17} color={primaryColor} />
              <Text className="flex-1 text-xs leading-5 text-[--muted-foreground]">
                Renaming the vault does not re-encrypt or expose stored credentials.
              </Text>
            </View>
          </View>

          {error ? (
            <Text className="mb-4 rounded-md border border-[--destructive] bg-[--destructive]/10 px-3 py-2 text-sm text-[--destructive]">
              {error}
            </Text>
          ) : null}

          <View className="flex-row gap-3">
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              disabled={saving}
              className="h-12 flex-1 items-center justify-center rounded-md border border-[--border]"
            >
              <Text className="font-semibold text-[--foreground]">Cancel</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={handleSave}
              disabled={saving || !name.trim()}
              className={`h-12 flex-1 flex-row items-center justify-center gap-2 rounded-md ${
                saving || !name.trim() ? "bg-[--secondary]" : "bg-[--primary]"
              }`}
            >
              <Ionicons name="checkmark" size={17} color={saving || !name.trim() ? mutedColor : "#fbf9ff"} />
              <Text className="font-semibold text-[--primary-foreground]">
                {saving ? "Saving..." : "Save details"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
