import { useEffect } from "react";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Fraunces_700Bold } from "@expo-google-fonts/fraunces";
import { Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";

import "../global.css";
import { NAV_THEME } from "../src/lib/theme";

// Segura a splash screen visível enquanto as fontes estão baixando/carregando
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? "light";

  // Carrega as fontes e mapeia para as chaves que você vai usar no tailwind.config.js
  const [fontsLoaded, error] = useFonts({
    Fraunces: Fraunces_700Bold,
    Inter: Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
  });

  // Oculta a splash screen assim que o carregamento terminar (sucesso ou erro)
  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Previne a renderização da interface até que as fontes estejam prontas
  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={NAV_THEME[colorScheme]}>
        <StatusBar
          backgroundColor="#142725"
          barStyle="light-content"
          translucent={false}
        />

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>

        <PortalHost />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}