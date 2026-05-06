import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
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
        <View className="max-h-[90%] rounded-t-2xl bg-[--card] p-4">
          <View className="mb-4 flex-row items-center justify-between gap-3">
            <Text className="text-lg font-semibold text-[--foreground]">{title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close add credential"
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full border border-[--border]"
            >
              <Ionicons name="close" size={20} color={foregroundColor} />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" className="mb-12">
            <CredentialInput label="Title" value={value.title} placeholder="Example account" onChangeText={(text) => updateField("title", text)} />
            <CredentialInput
              label="Username"
              value={value.username}
              placeholder="name@example.com"
              autoCapitalize="none"
              onChangeText={(text) => updateField("username", text)}
            />
            <CredentialInput
              label="Password"
              value={value.password}
              placeholder="Password"
              autoCapitalize="none"
              secureTextEntry
              onChangeText={(text) => updateField("password", text)}
            />
            <CredentialInput
              label="URL"
              value={value.url}
              placeholder="https://example.com"
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
                className="min-h-24 rounded-md border border-[--border] bg-[--input] px-3 py-2 text-[--foreground]"
              />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={onSave}
              disabled={saving}
              className={`mb-6 h-12 items-center justify-center rounded-md ${saving ? "bg-gray-300" : "bg-[--primary]"}`}
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
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "url";
  secureTextEntry?: boolean;
  onChangeText: (value: string) => void;
};

function CredentialInput({
  label,
  value,
  placeholder,
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
        className="rounded-md border border-[--border] bg-[--input] px-3 py-2 text-[--foreground]"
      />
    </View>
  );
}
