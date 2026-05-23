import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { NAV_THEME } from "../src/lib/theme";

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <SafeAreaProvider>
      <ThemeProvider value={NAV_THEME[colorScheme]}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
        </Stack>

        <PortalHost />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
