import { SafeAreaView } from "react-native-safe-area-context";
import { Tabs } from "expo-router";
import CustomTabBar from "@/src/components/CustomTabBar";

export default function AppLayout() {
  return (
    <SafeAreaView className="flex flex-1 bg-[--background]">
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