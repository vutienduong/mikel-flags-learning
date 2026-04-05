import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text } from "react-native";
import { CountryCard } from "../../components/CountryCard";
import { RegionFilter, type Region } from "../../components/RegionFilter";
import type { Country } from "../../utils/quizGenerator";

const ALL_COUNTRIES: Country[] = require("../../assets/data/countries.json");

export default function FlashcardScreen() {
  const router = useRouter();
  const [region, setRegion] = useState<Region>("All");

  const filtered = useMemo(
    () =>
      region === "All"
        ? ALL_COUNTRIES
        : ALL_COUNTRIES.filter((c) => c.region === region),
    [region]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Explore Flags</Text>
      <RegionFilter selected={region} onSelect={setRegion} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        numColumns={2}
        renderItem={({ item }) => (
          <CountryCard
            country={item}
            onPress={(c) => router.push(`/country/${c.code}`)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  list: { paddingHorizontal: 6, paddingBottom: 20 },
});
