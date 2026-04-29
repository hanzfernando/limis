import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { fetchVaultByIdThunk } from "@/src/store/slices/vaultSlice";
import { decryptVaultData } from "@/src/utils/cryptoMobile";

export default function VaultDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selected: vault, loading } = useAppSelector((s) => s.vaults);
  const [password, setPassword] = useState("");
  const [decrypting, setDecrypting] = useState(false);
  const [credentials, setCredentials] = useState<any[] | null>(null);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchVaultByIdThunk(id));
  }, [dispatch, id]);

  async function handleDecrypt() {
    if (!vault) return;
    setDecrypting(true);
    try {
      // const creds = await decryptVaultData(vault.ciphertext, vault.iv, vault.salt, password);
      // setCredentials(creds as any[]);
    } catch (err: any) {
      Alert.alert("Decryption failed", err?.message ?? String(err));
      setCredentials(null);
    } finally {
      setDecrypting(false);
    }
  }

  if (loading && !vault) {
    return (
      <View className="flex-1 items-center justify-center bg-[--background]">
        <ActivityIndicator size="large" color="#111827" />
        <Text className="mt-2 text-[--muted-foreground]">Loading vault...</Text>
      </View>
    );
  }

  if (!vault) {
    return (
      <View className="flex-1 items-center justify-center bg-[--background] p-4">
        <Text className="text-base text-[--foreground]">Vault not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[--background] p-4">
      <View className="mb-4 rounded-lg bg-[--card] p-4">
        <Text className="text-xl font-semibold text-[--foreground]">{vault.name}</Text>
        {vault.desc ? <Text className="mt-1 text-sm text-[--muted-foreground]">{vault.desc}</Text> : null}
      </View>

      <View className="mb-4">
        <Text className="text-sm text-[--muted-foreground]">Enter password to decrypt</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Vault password"
          className="mt-2 rounded-md border border-[--border] bg-[--input] px-3 py-2 text-[--foreground]"
        />
      </View>

      <Button title={decrypting ? "Decrypting..." : "Decrypt Vault"} onPress={handleDecrypt} disabled={decrypting} />

      {credentials ? (
        <View className="mt-6">
          <Text className="mb-2 text-base font-semibold text-[--foreground]">Credentials</Text>
          {credentials.length === 0 ? (
            <Text className="text-sm text-[--muted-foreground]">No credentials found.</Text>
          ) : (
            credentials.map((c, idx) => (
              <View key={idx} className="mb-3 rounded-lg border border-[--border] bg-[--card] p-3">
                <Text className="text-sm text-[--foreground] font-semibold">{c.title ?? c.name ?? `Item ${idx + 1}`}</Text>
                {c.username ? <Text className="text-sm text-[--muted-foreground]">{c.username}</Text> : null}
                {c.note ? <Text className="mt-1 text-sm text-[--muted-foreground]">{c.note}</Text> : null}
              </View>
            ))
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}
