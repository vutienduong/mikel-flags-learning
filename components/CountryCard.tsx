import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Country } from "../utils/quizGenerator";

interface Props {
  country: Country;
  onPress: (country: Country) => void;
}

export function CountryCard({ country, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={() => onPress(country)}>
      <Image
        source={{ uri: country.flagUrl }}
        style={styles.flag}
        contentFit="cover"
        placeholder={{ color: "#E5E7EB" }}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {country.name}
        </Text>
        <Text style={styles.capital} numberOfLines={1}>
          {country.capital}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: "hidden",
  },
  flag: { width: "100%", aspectRatio: 3 / 2 },
  info: { padding: 8 },
  name: { fontSize: 13, fontWeight: "600", color: "#111827" },
  capital: { fontSize: 11, color: "#6B7280", marginTop: 2 },
});
