import { SafeAreaView } from "react-native-safe-area-context";
import { Tabs } from "expo-router";
import CustomTabBar from "@/src/components/CustomTabBar";
import { useThemeSwitch } from "@/src/hooks/useThemeSwitch";

export default function AppLayout() {
  const { backgroundColor } = useThemeSwitch();

  return (
    <SafeAreaView className="flex flex-1" style={{ backgroundColor }}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </SafeAreaView>
  );
}