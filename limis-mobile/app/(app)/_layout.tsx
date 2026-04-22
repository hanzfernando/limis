import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerStyle: { backgroundColor: "#020617" },
          headerTintColor: "#f8fafc",
        }}
      />
    </Stack>
  );
}
