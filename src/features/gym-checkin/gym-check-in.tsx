import { Button } from "@/src/components/ui/button";
import { GlassCard } from "@/src/components/ui/glass-card";
import { WorkoutSection } from "@/src/features/gym-checkin/components/workout-section";
import { ProgressBar } from "@/src/components/ui/progress-bar";
import { BRAND_CAMEL } from "@/src/lib/colors";
import type { GymExercise, GymSet } from "@/src/lib/storage";
import { storage } from "@/src/lib/storage";
import { useTabBarInset } from "@/src/lib/use-tab-bar-inset";
import {
  suggestTemplateForToday,
  type WorkoutTemplateId,
} from "@/src/features/gym-checkin/utils/workout-templates";
import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Screen } from "@/src/components/ui/screen";
import { calculateDistance, isWithinGym } from "./utils/distanceCalc";

export function GymCheckinFeature() {
  const scrollRef = useRef<ScrollView>(null);
  const listPaddingBottom = useTabBarInset(24);
  const [keyboardPadding, setKeyboardPadding] = useState(0);

  const [gymLocation, setGymLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [settingLocation, setSettingLocation] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [exercises, setExercises] = useState<GymExercise[]>([]);
  const [sets, setSets] = useState<GymSet[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<WorkoutTemplateId>(
    suggestTemplateForToday(),
  );

  const scrollToWorkoutInput = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardPadding(event.endCoordinates.height);
      scrollToWorkoutInput();
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardPadding(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [scrollToWorkoutInput]);

  const loadData = useCallback(async () => {
    const [location, checkins, loadedExercises, loadedSets, template] =
      await Promise.all([
        storage.getGymLocation(),
        storage.getCheckins(),
        storage.getExercises(),
        storage.getSets(),
        storage.getActiveTemplate(),
      ]);
    setGymLocation(location);
    setExercises(loadedExercises);
    setSets(loadedSets);
    setActiveTemplate(template ?? suggestTemplateForToday());

    const today = new Date().toDateString();
    setCheckedInToday(
      checkins.some(
        (c) => new Date(c.timestamp).toDateString() === today,
      ),
    );
  }, []);

  useEffect(() => {
    loadData();
    requestLocationPermission();
  }, [loadData]);

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
    <Screen>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: listPaddingBottom + keyboardPadding,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={BRAND_CAMEL}
            />
          }
        >
          <View className="mb-6">
            <Text className="font-fraunces text-3xl text-foreground">
              Academia
            </Text>
            <Text className="mt-1 text-sm text-muted-foreground">
              Check-in e diário de treino
            </Text>
          </View>

          <GlassCard className="mb-4" contentClassName="p-5">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Status de hoje
            </Text>
            <Text className="mt-2 text-base text-foreground">
              {checkedInToday
                ? "Check-in realizado"
                : "Ainda não fez check-in hoje"}
            </Text>

            <Button
              onPress={handleCheckin}
              disabled={loading || !gymLocation}
              className="mt-4 h-12 rounded-xl"
            >
              <Text className="text-sm font-semibold text-primary-foreground">
                {loading ? "Localizando..." : "Fazer check-in agora"}
              </Text>
            </Button>
          </GlassCard>

          {distance !== null && (
            <GlassCard className="mb-4" contentClassName="p-5">
              <Text className="mb-1 text-sm font-medium text-muted-foreground">
                Distância até a academia
              </Text>
              <Text className="font-fraunces text-4xl text-foreground">
                {distance.toFixed(0)}m
              </Text>
              <View className="mt-4">
                <ProgressBar
                  progress={proximityPercent}
                  label={distance <= 50 ? "Dentro da área" : "Aproxime-se mais"}
                  showPercent={false}
                />
              </View>
              <Text
                className={[
                  "mt-2 text-sm font-semibold",
                  distance <= 50 ? "text-emerald-400" : "text-destructive",
                ].join(" ")}
              >
                {distance <= 50
                  ? "Você está na academia"
                  : "Muito longe — máximo 50m"}
              </Text>
            </GlassCard>
          )}

          <GlassCard className="mb-4" contentClassName="p-5">
            <Text className="text-base font-semibold text-foreground">
              Local da academia
            </Text>

            {gymLocation ? (
              <View className="mb-4 mt-3 rounded-xl bg-muted/60 p-3">
                <Text className="font-mono text-xs text-muted-foreground">
                  Lat: {gymLocation.latitude.toFixed(6)}
                </Text>
                <Text className="font-mono text-xs text-muted-foreground">
                  Lon: {gymLocation.longitude.toFixed(6)}
                </Text>
              </View>
            ) : (
              <Text className="mb-4 mt-2 text-sm text-muted-foreground">
                Defina onde fica a academia para habilitar o check-in.
              </Text>
            )}

            <Button
              onPress={handleSetGymLocation}
              disabled={settingLocation}
              variant="outline"
              className="h-12 rounded-xl border-white/10"
            >
              <Text className="text-sm font-semibold text-foreground">
                {settingLocation
                  ? "Obtendo localização..."
                  : gymLocation
                    ? "Atualizar localização"
                    : "Definir localização"}
              </Text>
            </Button>
          </GlassCard>

          <WorkoutSection
            exercises={exercises}
            sets={sets}
            activeTemplate={activeTemplate}
            onTemplateChange={setActiveTemplate}
            onDataChange={loadData}
            onScrollToInput={scrollToWorkoutInput}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
