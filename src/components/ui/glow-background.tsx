import { BRAND_BACKGROUND, BRAND_CAMEL, BRAND_PRIMARY } from "@/src/lib/colors";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

export function GlowBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[BRAND_PRIMARY, BRAND_BACKGROUND, BRAND_BACKGROUND]}
        locations={[0, 0.35, 1]}
        style={styles.topGradient}
      />

      <View style={[styles.blob, styles.blobPrimary]} />

      <LinearGradient
        colors={[`${BRAND_CAMEL}30`, "transparent"]}
        style={[styles.blob, styles.blobCamel]}
      />

      <LinearGradient
        colors={["rgba(100, 115, 96, 0.2)", "transparent"]}
        style={[styles.blob, styles.blobOlive]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 320,
  },
  blob: {
    position: "absolute",
    borderRadius: 999,
  },
  blobPrimary: {
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    backgroundColor: "rgba(20, 39, 37, 0.7)",
  },
  blobCamel: {
    top: 60,
    right: -30,
    width: 160,
    height: 160,
  },
  blobOlive: {
    top: 140,
    left: -70,
    width: 200,
    height: 200,
  },
});
