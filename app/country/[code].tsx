import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useProgressStore } from "../../store/progressStore";
import { formatArea, formatPopulation } from "../../utils/formatters";
import type { Country } from "../../utils/quizGenerator";

const ALL_COUNTRIES: Country[] = require("../../assets/data/countries.json");

export default function CountryDetailScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const markLearned = useProgressStore((s) => s.markLearned);

  const country = ALL_COUNTRIES.find((c) => c.code === code);

  useEffect(() => {
    if (code) markLearned(code);
  }, [code]);

  if (!country) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>Country not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: country.flagUrl }}
          style={styles.flag}
          contentFit="cover"
          placeholder={{ color: "#E5E7EB" }}
        />
        <View style={styles.content}>
          <Text style={styles.name}>{country.name}</Text>
          <InfoRow label="Capital" value={country.capital} />
          <InfoRow label="Population" value={formatPopulation(country.population)} />
          <InfoRow label="Area" value={formatArea(country.area)} />
          <InfoRow label="Languages" value={country.languages.join(", ")} />
          <InfoRow label="Region" value={country.region} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  notFound: { padding: 24, fontSize: 16, color: "#6B7280" },
  flag: { width: "100%", aspectRatio: 16 / 9 },
  content: { padding: 20 },
  name: { fontSize: 28, fontWeight: "700", color: "#111827", marginBottom: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  label: { fontSize: 15, color: "#6B7280", fontWeight: "500" },
  value: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
});
