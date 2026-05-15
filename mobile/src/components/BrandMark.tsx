import { Image } from "expo-image";
import { Text, View } from "react-native";

type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-11 w-11 items-center justify-center rounded-lg border border-[--border] bg-[--secondary] p-1">
        <Image
          source={require("@/assets/images/auri_logo.png")}
          contentFit="contain"
          style={{ height: "100%", width: "100%" }}
        />
      </View>

      {!compact ? (
        <View>
          <Text className="text-2xl font-light text-[--foreground]">Limis</Text>
          <Text className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-[--muted-foreground]">
            Guarded by Auri
          </Text>
        </View>
      ) : null}
    </View>
  );
}
