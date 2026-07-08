import { useEffect } from "react";

import { ThemeProvider } from "@react-navigation/native";

import { PortalHost } from "@rn-primitives/portal";

import { Stack } from "expo-router";

import { StatusBar } from "expo-status-bar";

import { View } from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";

import * as SplashScreen from "expo-splash-screen";

import { useFonts } from "expo-font";

import { Fraunces_700Bold } from "@expo-google-fonts/fraunces";

import { Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";

import "../global.css";

import { BRAND_BACKGROUND } from "../src/lib/colors";

import { NAV_THEME } from "../src/lib/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Fraunces: Fraunces_700Bold,

    Inter: Inter_400Regular,

    "Inter-SemiBold": Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View className="dark flex-1 bg-background">
        <ThemeProvider value={NAV_THEME.dark}>
          <StatusBar style="light" backgroundColor={BRAND_BACKGROUND} />

          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>

          <PortalHost />
        </ThemeProvider>
      </View>
    </SafeAreaProvider>
  );
}
