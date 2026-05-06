import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";

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
  return (
    <View>
      <View className="mb-4 items-center rounded-lg border border-[--border] bg-[--card] p-6">
        <Ionicons name="lock-closed-outline" size={28} color={foregroundColor} />
        <Text className="mt-3 text-lg font-semibold text-[--foreground]">This vault is locked.</Text>
        <Text className="mt-1 text-center text-sm text-[--muted-foreground]">
          Enter your vault password, or use biometrics when this vault has a protected local key.
        </Text>
      </View>

      {biometricAvailable && biometricEnabled ? (
        <Pressable
          accessibilityRole="button"
          onPress={onBiometricUnlock}
          disabled={decrypting}
          className={`mb-4 h-12 flex-row items-center justify-center gap-2 rounded-md border border-[--border] ${
            decrypting ? "bg-gray-100" : "bg-[--card]"
          }`}
        >
          <Ionicons name="finger-print-outline" size={20} color={foregroundColor} />
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
          className="mt-2 rounded-md border border-[--border] bg-[--input] px-3 py-2 text-[--foreground]"
        />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onDecrypt}
        disabled={decrypting || !password}
        className={`h-12 items-center justify-center rounded-md ${decrypting || !password ? "bg-gray-300" : "bg-gray-900"}`}
      >
        <Text className="font-semibold text-white">{decrypting ? "Decrypting..." : "Unlock Vault"}</Text>
      </Pressable>

      <Text className="mt-3 text-xs leading-5 text-[--muted-foreground]">
        Biometrics never become your vault password or encryption key. They only ask the OS to release a protected
        copy of the vault key after you have unlocked with the password.
      </Text>
    </View>
  );
}
