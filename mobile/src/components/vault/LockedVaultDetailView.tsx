import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";
import { useUnstableNativeVariable } from "nativewind";

type Props = {
  password: string;
  decrypting: boolean;
  biometricAvailable: boolean;
  biometricEnabled: boolean;
  foregroundColor: string;
  onPasswordChange: (value: string) => void;
  onDecrypt: () => void;
  onBiometricUnlock: () => void;
};

export function LockedVaultDetailView({
  password,
  decrypting,
  biometricAvailable,
  biometricEnabled,
  foregroundColor,
  onPasswordChange,
  onDecrypt,
  onBiometricUnlock,
}: Props) {
  const mutedColor = useUnstableNativeVariable("--muted-foreground") ?? "#756e83";
  const primaryColor = useUnstableNativeVariable("--primary") ?? "#5d3c8f";

  return (
    <View>
      <View className="mb-4 items-center rounded-lg border border-[--border] bg-[--card] p-6">
        <View className="h-14 w-14 items-center justify-center rounded-lg bg-[--secondary]">
          <Ionicons name="lock-closed-outline" size={28} color={primaryColor} />
        </View>
        <Text className="mt-4 text-lg font-semibold text-[--foreground]">This vault is locked.</Text>
        <Text className="mt-2 text-center text-sm leading-6 text-[--muted-foreground]">
          Enter your vault password, or use biometrics when this vault has a protected local key.
        </Text>
      </View>

      {biometricAvailable && biometricEnabled ? (
        <Pressable
          accessibilityRole="button"
          onPress={onBiometricUnlock}
          disabled={decrypting}
          className={`mb-4 h-12 flex-row items-center justify-center gap-2 rounded-md border border-[--border] ${
            decrypting ? "bg-[--secondary]" : "bg-[--card]"
          }`}
        >
          <Ionicons name="finger-print-outline" size={20} color={primaryColor} />
          <Text className="font-semibold text-[--foreground]">
            {decrypting ? "Unlocking..." : "Unlock with biometrics"}
          </Text>
        </Pressable>
      ) : null}

      <View className="mb-4">
        <Text className="text-sm text-[--muted-foreground]">Vault password</Text>
        <TextInput
          value={password}
          onChangeText={onPasswordChange}
          secureTextEntry
          placeholder="Enter password"
          placeholderTextColor={mutedColor}
          className="mt-2 rounded-md border border-[--input] bg-[--muted] px-4 py-3 text-[--foreground]"
        />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onDecrypt}
        disabled={decrypting || !password}
        className={`h-12 flex-row items-center justify-center gap-2 rounded-md ${
          decrypting || !password ? "bg-[--secondary]" : "bg-[--primary]"
        }`}
      >
        <Ionicons name="key-outline" size={17} color={decrypting || !password ? mutedColor : "#fbf9ff"} />
        <Text className="font-semibold text-[--primary-foreground]">{decrypting ? "Decrypting..." : "Unlock vault"}</Text>
      </Pressable>

      <Text className="mt-4 rounded-md border border-[--border] bg-[--card] p-3 text-xs leading-5 text-[--muted-foreground]">
        Biometrics never become your vault password or encryption key. They only ask the OS to release a protected
        copy of the vault key after you have unlocked with the password.
      </Text>
    </View>
  );
}
