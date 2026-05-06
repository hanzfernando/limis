import { useCallback, useEffect } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { fetchVaultsThunk } from "@/src/store/slices/vaultSlice";

const VaultView = () => {
  const dispatch = useAppDispatch();
  const { items: vaults, loading } = useAppSelector((state) => state.vaults);
  const router = useRouter();

  const loadVaults = useCallback(() => {
    dispatch(fetchVaultsThunk());
  }, [dispatch]);

  useEffect(() => {
    loadVaults();
  }, [loadVaults]);

  function goToCreateVault() {
    router.push("/vault/create" as any);
  }


  return (
    <FlatList
      className="flex-1 bg-[--background]"
      contentContainerStyle={{ paddingBottom: 24 }}
      data={vaults}
      keyExtractor={(item) => item.id}
      refreshing={loading}
      onRefresh={loadVaults}
      ListHeaderComponent={
        <View className="mb-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="text-3xl font-semibold text-[--foreground]">Vault</Text>
              <Text className="mt-2 text-base text-[--muted-foreground]">
                Store encrypted credentials in one place.
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create vault"
              onPress={goToCreateVault}
              className="h-11 flex-row items-center gap-2 rounded-full bg-[--primary] px-4"
            >
              <Ionicons name="add" size={18} color="#ffffff" />
              <Text className="text-sm font-semibold text-[--primary-foreground]">New</Text>
            </Pressable>
          </View>
        </View>
      }
      ListEmptyComponent={
        !loading ? (
          <View className="rounded-2xl border border-dashed border-[--border] bg-[--card] p-4">
            <Text className="text-sm font-medium text-[--foreground]">No vaults yet.</Text>
            <Text className="mt-1 text-sm text-[--muted-foreground]">
              Create your first vault to start storing encrypted credentials.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={goToCreateVault}
              className="mt-4 self-start rounded-full bg-[--primary] px-4 py-2"
            >
              <Text className="text-sm font-semibold text-[--primary-foreground]">Create vault</Text>
            </Pressable>
          </View>
        ) : null
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            router.push({ pathname: `/vault/${item.id}` } as any);
          }}
          className="mb-3"
        >
          <View className="rounded-lg border border-[--border] bg-[--card] p-4">
            <Text className="text-base font-semibold text-[--foreground]">{item.name}</Text>
            {item.desc ? (
              <Text className="mt-1 text-sm text-[--muted-foreground]">{item.desc}</Text>
            ) : null}
          </View>
        </Pressable>
      )}
    />
  );
};

export default VaultView;