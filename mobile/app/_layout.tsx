import { Stack } from "expo-router";
import { Provider } from "react-redux";
import "@/global.css";
import { AuthGate } from "@/src/components/AuthGate";
import { store } from "@/src/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </AuthGate>
    </Provider>
  );
}
