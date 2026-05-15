import { SafeAreaView } from "react-native-safe-area-context";
import { Tabs } from "expo-router";
import CustomTabBar from "@/src/components/CustomTabBar";

export default function TabsLayout() {
  return (
    <SafeAreaView className="flex flex-1 bg-[--background]">
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        initialRouteName="vault"
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="vault" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </SafeAreaView>
  );
}
