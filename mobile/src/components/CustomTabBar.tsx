import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUnstableNativeVariable } from "nativewind";

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const idleIconColor = useUnstableNativeVariable("--muted-foreground") ?? "#756e83";
  const activeIconColor = useUnstableNativeVariable("--primary") ?? "#5d3c8f";

  return (
    <View className="absolute bottom-6 left-4 right-4 items-center">
      <View className="flex-row rounded-lg border border-[--border] bg-[--card] px-3 py-2 shadow-lg">
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;

          const onPress = () => {
            navigation.navigate(route.name);
          };

          let iconName: any = "";

          if (route.name === "vault") iconName = "lock-closed";
          if (route.name === "profile") iconName = "person";

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              className={`mx-2 h-12 w-16 items-center justify-center rounded-md ${
                isFocused ? "bg-[--secondary]" : ""
              }`}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={isFocused ? activeIconColor : idleIconColor}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
