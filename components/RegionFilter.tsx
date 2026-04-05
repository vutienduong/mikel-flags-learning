import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export type Region = "All" | "Asia" | "Europe" | "Africa" | "Americas" | "Oceania";

export const REGIONS: Region[] = [
  "All", "Asia", "Europe", "Africa", "Americas", "Oceania",
];

interface Props {
  selected: Region;
  onSelect: (region: Region) => void;
}

export function RegionFilter({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {REGIONS.map((region) => (
        <TouchableOpacity
          key={region}
          style={[styles.chip, selected === region && styles.chipActive]}
          onPress={() => onSelect(region)}
        >
          <Text style={[styles.chipText, selected === region && styles.chipTextActive]}>
            {region}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 0, backgroundColor: "#F9FAFB" },
  content: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  chipActive: { backgroundColor: "#2563EB" },
  chipText: { fontSize: 13, color: "#374151", fontWeight: "500" },
  chipTextActive: { color: "#FFFFFF" },
});
