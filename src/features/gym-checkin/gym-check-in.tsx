import { Button } from "@/src/components/ui/button";
import { storage } from "@/src/lib/storage";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { calculateDistance, isWithinGym } from "./utils/distanceCalc";

export function GymCheckinFeature() {
  const [gymLocation, setGymLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [settingLocation, setSettingLocation] = useState(false);

  useEffect(() => {
    loadGymLocation();
    requestLocationPermission();
  }, []);

  async function loadGymLocation() {
    const location = await storage.getGymLocation();
    setGymLocation(location);
  }

  async function requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissao", "Acesso a localizacao foi negado");
      }
    } catch (error) {
      console.error("Erro ao solicitar permissao:", error);
    }
  }

  async function handleSetGymLocation() {
    setSettingLocation(true);

    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      await storage.setGymLocation(latitude, longitude);
      setGymLocation({ latitude, longitude });
      Alert.alert("Sucesso", "Localizacao da academia salva!");
    } catch (error) {
      Alert.alert("Erro", "Nao foi possivel obter sua localizacao");
      console.error(error);
    } finally {
      setSettingLocation(false);
    }
  }

  async function handleCheckin() {
    setLoading(true);

    try {
      if (!gymLocation) {
        Alert.alert("Erro", "Configure a localizacao da academia primeiro");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setUserLocation({ latitude, longitude });

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

        Alert.alert(
          "Check-in confirmado!",
          `Voce esta na academia! (${dist.toFixed(0)}m)`,
        );
      } else {
        Alert.alert(
          "Fora da academia",
          `Voce esta a ${dist.toFixed(0)}m da academia. Aproxime-se mais (maximo 50m)`,
        );
      }
    } catch (error) {
      Alert.alert("Erro", "Nao foi possivel obter sua localizacao");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="mb-4 text-2xl font-bold text-gray-800">
        Check-in Academia
      </Text>

      <View className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
        <Text className="mb-3 text-sm font-semibold text-gray-500">
          Localizacao da academia
        </Text>

        {gymLocation ? (
          <View className="mb-3">
            <Text className="my-1 font-mono text-xs text-gray-800">
              Lat: {gymLocation.latitude.toFixed(6)}
            </Text>
            <Text className="my-1 font-mono text-xs text-gray-800">
              Lon: {gymLocation.longitude.toFixed(6)}
            </Text>
          </View>
        ) : (
          <Text className="mb-3 text-sm text-gray-400">
            Nenhuma localizacao salva
          </Text>
        )}

        <Button
          onPress={handleSetGymLocation}
          title={settingLocation ? "Aguarde..." : "Definir localizacao"}
          disabled={settingLocation}
          className="w-full"
        />
      </View>

      {distance !== null && (
        <View className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
          <Text className="mb-3 text-sm font-semibold text-gray-500">
            Distancia ate a academia
          </Text>
          <Text className="my-2 text-3xl font-bold text-blue-500">
            {distance.toFixed(0)}m
          </Text>
          <Text
            className={[
              "mt-2 text-sm font-semibold",
              distance <= 50 ? "text-emerald-600" : "text-red-600",
            ].join(" ")}
          >
            {distance <= 50 ? "Voce esta na academia!" : "Muito longe"}
          </Text>
        </View>
      )}

      {userLocation && (
        <Text className="mb-4 text-xs text-gray-400">
          Ultima leitura: {userLocation.latitude.toFixed(6)},{" "}
          {userLocation.longitude.toFixed(6)}
        </Text>
      )}

      <Button
        onPress={handleCheckin}
        title={loading ? "Localizando..." : "Fazer check-in"}
        variant="primary"
        disabled={loading}
        className="w-full"
      />
    </View>
  );
}
