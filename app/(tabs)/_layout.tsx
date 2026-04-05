import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: { backgroundColor: "#FFFFFF" },
        headerShown: false,
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Home",
          tabBarIcon: () => "🏠" as any
        }} 
      />
      <Tabs.Screen 
        name="flashcard" 
        options={{ 
          title: "Explore",
          tabBarIcon: () => "🚩" as any
        }} 
      />
      <Tabs.Screen 
        name="quiz" 
        options={{ 
          title: "Quiz",
          tabBarIcon: () => "❓" as any
        }} 
      />
      <Tabs.Screen 
        name="progress" 
        options={{ 
          title: "Progress",
          tabBarIcon: () => "📊" as any
        }} 
      />
    </Tabs>
  );
}
