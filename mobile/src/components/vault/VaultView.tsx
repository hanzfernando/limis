import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUnstableNativeVariable } from "nativewind";
import { BrandMark } from "@/src/components/BrandMark";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { fetchVaultsThunk } from "@/src/store/slices/vaultSlice";

const VaultView = () => {
  const dispatch = useAppDispatch();
  const { items: vaults, loading } = useAppSelector((state) => state.vaults);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const primaryColor = useUnstableNativeVariable("--primary") ?? "#5d3c8f";
  const mutedColor = useUnstableNativeVariable("--muted-foreground") ?? "#756e83";

  const loadVaults = useCallback(() => {
    dispatch(fetchVaultsThunk());
  }, [dispatch]);

  useEffect(() => {
    loadVaults();
  }, [loadVaults]);

  function goToCreateVault() {
    router.push("/vault/create" as any);
  }

  const filteredVaults = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return vaults;

    return vaults.filter((vault) => {
      const name = vault.name.toLowerCase();
      const desc = vault.desc?.toLowerCase() ?? "";
      return name.includes(query) || desc.includes(query);
    });
  }, [search, vaults]);

  return (
    <FlatList
      className="flex-1 bg-[--background]"
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 118 }}
      data={filteredVaults}
      keyExtractor={(item) => item.id}
      refreshing={loading}
      onRefresh={loadVaults}
      ListHeaderComponent={
        <View className="mb-6">
          <View className="mb-7">
            <BrandMark />
          </View>

          <View className="rounded-lg border border-[--border] bg-[--card] p-5">
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <View className="mb-3 flex-row items-center gap-3">
                  <View className="h-11 w-11 items-center justify-center rounded-lg bg-[--secondary]">
                    <Ionicons name="archive-outline" size={21} color={primaryColor} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-semibold uppercase tracking-widest text-[--muted-foreground]">
                      Encrypted archive
                    </Text>
                    <Text className="mt-1 text-3xl font-semibold text-[--foreground]">Your vaults</Text>
                  </View>
                </View>
                <Text className="text-sm leading-6 text-[--muted-foreground]">
                  Auri keeps each vault sealed until you choose to unlock it.
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Create vault"
                onPress={goToCreateVault}
                className="h-11 w-11 items-center justify-center rounded-md bg-[--primary]"
              >
                <Ionicons name="add" size={21} color="#fbf9ff" />
              </Pressable>
            </View>

            <View className="mt-5 flex-row gap-2">
              <ArchiveMetric icon="layers-outline" label="Vaults" value={`${vaults.length}`} color={primaryColor} />
              <ArchiveMetric icon="shield-checkmark-outline" label="State" value="Sealed" color={primaryColor} />
              <ArchiveMetric icon="eye-off-outline" label="Posture" value="Private" color={primaryColor} />
            </View>
          </View>

          <View className="mt-4 rounded-lg border border-[--border] bg-[--card] px-4 py-3">
            <View className="flex-row items-center gap-3">
              <Ionicons name="search" size={18} color={mutedColor} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                autoCapitalize="none"
                placeholder="Search vaults..."
                placeholderTextColor={mutedColor}
                className="flex-1 text-base text-[--foreground]"
              />
            </View>
          </View>
        </View>
      }
      ListEmptyComponent={
        !loading ? (
          <View className="rounded-lg border border-dashed border-[--border] bg-[--card] p-5">
            <View className="mb-4 h-11 w-11 items-center justify-center rounded-md bg-[--secondary]">
              <Ionicons name="lock-closed-outline" size={20} color={primaryColor} />
            </View>
            <Text className="text-base font-semibold text-[--foreground]">
              {search.trim() ? "No matching vaults." : "No vaults yet."}
            </Text>
            <Text className="mt-2 text-sm leading-6 text-[--muted-foreground]">
              {search.trim()
                ? "Try a different search term inside your encrypted archive."
                : "Create your first vault to start storing encrypted credentials."}
            </Text>
            {!search.trim() ? (
              <Pressable
                accessibilityRole="button"
                onPress={goToCreateVault}
                className="mt-5 h-11 flex-row items-center self-start rounded-md bg-[--primary] px-4"
              >
                <Ionicons name="add" size={17} color="#fbf9ff" />
                <Text className="ml-2 text-sm font-semibold text-[--primary-foreground]">New vault</Text>
              </Pressable>
            ) : null}
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
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1 flex-row gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-md bg-[--secondary]">
                  <Ionicons name="lock-closed-outline" size={17} color={primaryColor} />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-[--foreground]">{item.name}</Text>
                  {item.desc ? (
                    <Text className="mt-1 text-sm leading-5 text-[--muted-foreground]">{item.desc}</Text>
                  ) : null}
                  <View className="mt-3 flex-row items-center gap-2">
                    <View className="h-1.5 w-1.5 rounded-full bg-[--primary]" />
                    <Text className="text-xs text-[--muted-foreground]">Sealed archive</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={mutedColor} />
            </View>
          </View>
        </Pressable>
      )}
    />
  );
};

function ArchiveMetric({
  icon,
  label,
  value,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View className="flex-1 rounded-md border border-[--border] bg-[--background] px-3 py-3">
      <Ionicons name={icon} size={16} color={color} />
      <Text className="mt-2 text-[11px] text-[--muted-foreground]">{label}</Text>
      <Text className="mt-1 text-sm font-semibold text-[--foreground]">{value}</Text>
    </View>
  );
}

export default VaultView;
