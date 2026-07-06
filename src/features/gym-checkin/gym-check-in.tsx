import { Button } from "@/src/components/ui/button";
import {
  CheckCircle2Icon,
  DumbbellIcon,
  MapPinIcon,
  NavigationIcon,
} from "@/src/components/ui/icons";
import { ProgressBar } from "@/src/components/ui/progress-bar";
import { storage } from "@/src/lib/storage";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { calculateDistance, isWithinGym } from "./utils/distanceCalc";

export function GymCheckinFeature() {
  const [gymLocation, setGymLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [settingLocation, setSettingLocation] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [checkedInToday, setCheckedInToday] = useState(false);

  useEffect(() => {
    loadData();
    requestLocationPermission();
  }, []);

  async function loadData() {
    const [location, checkins] = await Promise.all([
      storage.getGymLocation(),
      storage.getCheckins(),
    ]);
    setGymLocation(location);

    const today = new Date().toDateString();
    setCheckedInToday(
      checkins.some(
        (c) => new Date(c.timestamp).toDateString() === today,
      ),
    );
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  async function requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão", "Acesso à localização foi negado");
      }
    } catch (error) {
      console.error("Erro ao solicitar permissão:", error);
    }
  }

  async function handleSetGymLocation() {
    setSettingLocation(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      await storage.setGymLocation(latitude, longitude);
      setGymLocation({ latitude, longitude });
      Alert.alert("Sucesso", "Localização da academia salva!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter sua localização");
      console.error(error);
    } finally {
      setSettingLocation(false);
    }
  }

  async function handleCheckin() {
    setLoading(true);
    try {
      if (!gymLocation) {
        Alert.alert("Erro", "Configure a localização da academia primeiro");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const dist = calculateDistance(
        latitude,
        longitude,
        gymLocation.latitude,
        gymLocation.longitude,
      );
      setDistance(dist);

      if (
        isWithinGym(
          latitude,
          longitude,
          gymLocation.latitude,
          gymLocation.longitude,
        )
      ) {
        await storage.saveCheckin({
          taskId: "gym-daily",
          timestamp: Date.now(),
          latitude,
          longitude,
          notes: "Check-in realizado com sucesso",
        });
        setCheckedInToday(true);
        Alert.alert(
          "Check-in confirmado!",
          `Você está na academia! (${dist.toFixed(0)}m)`,
        );
      } else {
        Alert.alert(
          "Fora da academia",
          `Você está a ${dist.toFixed(0)}m da academia. Aproxime-se mais (máximo 50m)`,
        );
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter sua localização");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const proximityPercent =
    distance === null ? 0 : Math.max(0, Math.min(100, ((50 - distance) / 50) * 100));

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="mb-6">
          <Text className="font-fraunces text-3xl text-foreground">
            Academia
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground">
            Check-in por geolocalização
          </Text>
        </View>

        <View className="mb-4 rounded-2xl border border-border bg-card p-5">
          <View className="mb-4 flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15">
              <DumbbellIcon size={24} className="text-secondary" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground">
                Status de hoje
              </Text>
              <Text className="text-sm text-muted-foreground">
                {checkedInToday
                  ? "Check-in realizado ✓"
                  : "Ainda não fez check-in hoje"}
              </Text>
            </View>
            {checkedInToday ? (
              <CheckCircle2Icon size={28} className="text-emerald-600" />
            ) : null}
          </View>

          <Button
            onPress={handleCheckin}
            disabled={loading || !gymLocation}
            className="h-12 rounded-xl"
          >
            <NavigationIcon size={18} className="text-primary-foreground" />
            <Text className="text-sm font-semibold text-primary-foreground">
              {loading ? "Localizando..." : "Fazer check-in agora"}
            </Text>
          </Button>
        </View>

        {distance !== null && (
          <View className="mb-4 rounded-2xl border border-border bg-card p-5">
            <Text className="mb-1 text-sm font-medium text-muted-foreground">
              Distância até a academia
            </Text>
            <Text className="font-fraunces text-4xl text-foreground">
              {distance.toFixed(0)}m
            </Text>
            <View className="mt-4">
              <ProgressBar
                progress={proximityPercent}
                label={distance <= 50 ? "Dentro da área!" : "Aproxime-se mais"}
                showPercent={false}
              />
            </View>
            <Text
              className={[
                "mt-2 text-sm font-semibold",
                distance <= 50 ? "text-emerald-600" : "text-destructive",
              ].join(" ")}
            >
              {distance <= 50
                ? "Você está na academia!"
                : "Muito longe — máximo 50m"}
            </Text>
          </View>
        )}

        <View className="rounded-2xl border border-border bg-card p-5">
          <View className="mb-4 flex-row items-center gap-2">
            <MapPinIcon size={18} className="text-primary" />
            <Text className="text-base font-semibold text-foreground">
              Local da academia
            </Text>
          </View>

          {gymLocation ? (
            <View className="mb-4 rounded-xl bg-muted/50 p-3">
              <Text className="font-mono text-xs text-muted-foreground">
                Lat: {gymLocation.latitude.toFixed(6)}
              </Text>
              <Text className="font-mono text-xs text-muted-foreground">
                Lon: {gymLocation.longitude.toFixed(6)}
              </Text>
            </View>
          ) : (
            <Text className="mb-4 text-sm text-muted-foreground">
              Nenhuma localização salva. Defina onde fica a academia para
              habilitar o check-in.
            </Text>
          )}

          <Button
            onPress={handleSetGymLocation}
            disabled={settingLocation}
            variant="outline"
            className="h-12 rounded-xl"
          >
            <MapPinIcon size={18} className="text-foreground" />
            <Text className="text-sm font-semibold text-foreground">
              {settingLocation
                ? "Obtendo localização..."
                : gymLocation
                  ? "Atualizar localização"
                  : "Definir localização"}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
