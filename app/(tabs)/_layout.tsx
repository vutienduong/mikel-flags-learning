import { Tabs } from "expo-router";
import { Text } from "react-native";

const ICONS: Record<string, string> = {
  index: "🏠",
  flashcard: "🚩",
  quiz: "❓",
  progress: "📊",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: { backgroundColor: "#FFFFFF" },
        headerShown: false,
        tabBarIcon: () => (
          <Text style={{ fontSize: 20 }}>{ICONS[route.name]}</Text>
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="flashcard" options={{ title: "Explore" }} />
      <Tabs.Screen name="quiz" options={{ title: "Quiz" }} />
      <Tabs.Screen name="progress" options={{ title: "Progress" }} />
    </Tabs>
  );
}
