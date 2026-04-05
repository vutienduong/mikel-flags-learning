import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="country/[code]"
        options={{ title: "Country Detail", headerBackTitle: "Back" }}
      />
    </Stack>
  );
}
