import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUnstableNativeVariable } from "nativewind";

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const idleIconColor = useUnstableNativeVariable("--muted-foreground") ?? "#6b7280";

  return (
    <View className="absolute bottom-6 left-4 right-4 items-center">
      <View className="flex-row rounded-full border border-[--border] bg-[--card] px-6 py-3 shadow-lg">
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;

          const onPress = () => {
            navigation.navigate(route.name);
          };

          let iconName: any = "";

          if (route.name === "index") iconName = "home";
          if (route.name === "vault") iconName = "lock-closed";
          if (route.name === "profile") iconName = "person";

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              className={`mx-4 rounded-full p-2 ${isFocused ? "bg-sky-500/20" : ""}`}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={isFocused ? "#0ea5e9" : idleIconColor}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}