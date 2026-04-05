import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useProgressStore } from "../../store/progressStore";

const ALL_COUNTRIES_COUNT = 250;

export default function ProgressScreen() {
  const { learnedCodes, quizHighScore, quizTotalPlayed, resetProgress } =
    useProgressStore();

  const learned = learnedCodes.length;
  const pct = Math.round((learned / ALL_COUNTRIES_COUNT) * 100);

  function confirmReset() {
    Alert.alert(
      "Reset Progress",
      "This will clear all countries learned and quiz scores. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: resetProgress },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Countries Learned</Text>
        <Text style={styles.bigNum}>{learned}</Text>
        <Text style={styles.outOf}>out of {ALL_COUNTRIES_COUNT}</Text>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.pct}>{pct}% complete</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Quiz Stats</Text>
        <StatRow label="Best Score" value={`${quizHighScore}/10`} />
        <StatRow label="Games Played" value={String(quizTotalPlayed)} />
      </View>

      <TouchableOpacity style={styles.resetBtn} onPress={confirmReset}>
        <Text style={styles.resetBtnText}>Reset Progress</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 16 },
  title: { fontSize: 28, fontWeight: "700", color: "#111827", marginTop: 16, marginBottom: 24 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  bigNum: { fontSize: 56, fontWeight: "800", color: "#2563EB", lineHeight: 64 },
  outOf: { fontSize: 14, color: "#9CA3AF", marginBottom: 12 },
  barBg: { height: 10, backgroundColor: "#E5E7EB", borderRadius: 5, overflow: "hidden" },
  barFill: { height: 10, backgroundColor: "#2563EB", borderRadius: 5 },
  pct: { fontSize: 12, color: "#6B7280", marginTop: 6, textAlign: "right" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  rowLabel: { fontSize: 15, color: "#374151" },
  rowValue: { fontSize: 15, fontWeight: "700", color: "#111827" },
  resetBtn: {
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#EF4444",
    alignItems: "center",
  },
  resetBtnText: { color: "#EF4444", fontWeight: "600", fontSize: 15 },
});
