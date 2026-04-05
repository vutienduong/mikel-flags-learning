import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useProgressStore } from "../../store/progressStore";
import type { Country } from "../../utils/quizGenerator";

const ALL_COUNTRIES: Country[] = require("../../assets/data/countries.json");

function pickRandom(arr: Country[], n: number): Country[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

export default function HomeScreen() {
  const router = useRouter();
  const learnedCount = useProgressStore((s) => s.learnedCodes.length);
  const decorFlags = useMemo(() => pickRandom(ALL_COUNTRIES, 6), []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flagGrid}>
        {decorFlags.map((c) => (
          <Image
            key={c.code}
            source={{ uri: c.flagUrl }}
            style={styles.decorFlag}
            contentFit="cover"
          />
        ))}
      </View>
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.title}>Flags of the World</Text>
        <Text style={styles.subtitle}>Learn flags from every country</Text>

        <View style={styles.statBadge}>
          <Text style={styles.statText}>
            {learnedCount} / {ALL_COUNTRIES.length} countries learned
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/(tabs)/flashcard")}
        >
          <Text style={styles.primaryBtnText}>Khám phá cờ 🚩</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push("/(tabs)/quiz")}
        >
          <Text style={styles.secondaryBtnText}>Làm quiz ❓</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827" },
  flagGrid: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  decorFlag: { width: "33.33%", height: "33.33%", opacity: 0.35 },
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(17,24,39,0.65)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: { fontSize: 36, fontWeight: "800", color: "#FFFFFF", textAlign: "center" },
  subtitle: { fontSize: 16, color: "#D1D5DB", marginTop: 8, textAlign: "center" },
  statBadge: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
  },
  statText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  primaryBtn: {
    backgroundColor: "#2563EB",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 40,
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
  secondaryBtn: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  secondaryBtnText: { color: "#FFFFFF", fontSize: 18, fontWeight: "600" },
});
