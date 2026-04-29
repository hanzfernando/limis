import { FlatList, Text, View, Pressable } from "react-native"
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux"
import { useCallback, useEffect } from "react"
import { fetchVaultsThunk } from "@/src/store/slices/vaultSlice"
import { useRouter } from "expo-router"
const VaultView = () => {
  const dispatch = useAppDispatch()
  const { items: vaults, loading } = useAppSelector((state) => state.vaults)
  const router = useRouter()

  const loadVaults = useCallback(() => {
    dispatch(fetchVaultsThunk())
  }, [dispatch])

  useEffect(() => {
    loadVaults()
  }, [loadVaults])


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
          <Text className="text-3xl font-semibold text-[--foreground]">Vault</Text>
          <Text className="mt-2 text-base text-[--muted-foreground]">
            This is your vault screen.
          </Text>
        </View>
      }
      ListEmptyComponent={
        !loading ? (
          <Text className="text-sm text-[--muted-foreground]">No vaults yet.</Text>
        ) : null
      }
      renderItem={({ item }) => (
        <Pressable onPress={() => {
          router.push({ pathname: `/vault/${item.id}` } as any)}
        } className="mb-3">
          <View className="rounded-lg border border-[--border] bg-[--card] p-4">
            <Text className="text-base font-semibold text-[--foreground]">{item.name}</Text>
            {item.desc ? (
              <Text className="mt-1 text-sm text-[--muted-foreground]">{item.desc}</Text>
            ) : null}
          </View>
        </Pressable>
      )}
    />
  )
}

export default VaultView