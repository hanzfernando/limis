import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useUnstableNativeVariable } from "nativewind";
import type { CredentialFormState } from "@/src/types/credential";

type Props = {
  visible: boolean;
  title?: string;
  saveLabel?: string;
  value: CredentialFormState;
  saving: boolean;
  foregroundColor: string;
  onChange: (value: CredentialFormState) => void;
  onClose: () => void;
  onSave: () => void;
};

export function AddCredentialModal({
  visible,
  title = "Add credential",
  saveLabel = "Save credential",
  value,
  saving,
  foregroundColor,
  onChange,
  onClose,
  onSave,
}: Props) {
  const mutedColor = useUnstableNativeVariable("--muted-foreground") ?? "#756e83";
  const primaryColor = useUnstableNativeVariable("--primary") ?? "#5d3c8f";

  function updateField(field: keyof CredentialFormState, fieldValue: string) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close add credential"
          className="absolute bottom-0 left-0 right-0 top-0 bg-black/40"
          onPress={onClose}
        />
        <View className="max-h-[90%] rounded-t-lg border-t border-[--border] bg-[--card] p-4">
          <View className="mb-4 flex-row items-center justify-between gap-3">
            <View className="flex-1 flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-md bg-[--secondary]">
                <Ionicons name="key-outline" size={18} color={primaryColor} />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-semibold uppercase tracking-widest text-[--muted-foreground]">
                  Archive record
                </Text>
                <Text className="text-lg font-semibold text-[--foreground]">{title}</Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close add credential"
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-md border border-[--border]"
            >
              <Ionicons name="close" size={20} color={foregroundColor} />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" className="mb-12">
            <CredentialInput label="Title" value={value.title} placeholder="Example account" placeholderTextColor={mutedColor} onChangeText={(text) => updateField("title", text)} />
            <CredentialInput
              label="Username"
              value={value.username}
              placeholder="name@example.com"
              placeholderTextColor={mutedColor}
              autoCapitalize="none"
              onChangeText={(text) => updateField("username", text)}
            />
            <CredentialInput
              label="Password"
              value={value.password}
              placeholder="Password"
              placeholderTextColor={mutedColor}
              autoCapitalize="none"
              secureTextEntry
              onChangeText={(text) => updateField("password", text)}
            />
            <CredentialInput
              label="URL"
              value={value.url}
              placeholder="https://example.com"
              placeholderTextColor={mutedColor}
              autoCapitalize="none"
              keyboardType="url"
              onChangeText={(text) => updateField("url", text)}
            />
            <View className="mb-4">
              <Text className="mb-2 text-sm text-[--muted-foreground]">Note</Text>
              <TextInput
                value={value.note}
                onChangeText={(text) => updateField("note", text)}
                multiline
                textAlignVertical="top"
                placeholder="Optional note"
                placeholderTextColor={mutedColor}
                className="min-h-24 rounded-md border border-[--input] bg-[--muted] px-3 py-2 text-[--foreground]"
              />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={onSave}
              disabled={saving}
              className={`mb-6 h-12 items-center justify-center rounded-md ${saving ? "bg-[--secondary]" : "bg-[--primary]"}`}
            >
              <Text className="font-semibold text-[--primary-foreground]">{saving ? "Saving..." : saveLabel}</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

type CredentialInputProps = {
  label: string;
  value: string;
  placeholder: string;
  placeholderTextColor: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "url";
  secureTextEntry?: boolean;
  onChangeText: (value: string) => void;
};

function CredentialInput({
  label,
  value,
  placeholder,
  placeholderTextColor,
  autoCapitalize,
  keyboardType,
  secureTextEntry,
  onChangeText,
}: CredentialInputProps) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm text-[--muted-foreground]">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        className="rounded-md border border-[--input] bg-[--muted] px-3 py-2 text-[--foreground]"
      />
    </View>
  );
}
