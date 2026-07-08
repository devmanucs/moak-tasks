import {
  BRAND_CAMEL,
  BRAND_OLIVE,
  GLASS_BG,
  GLASS_BORDER,
} from "@/src/lib/colors";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function GlassTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 12);

  return (
    <View
      className="absolute left-5 right-5"
      style={{
        bottom,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: GLASS_BORDER,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 16,
        elevation: 12,
      }}
    >
      <BlurView
        intensity={Platform.OS === "ios" ? 55 : 90}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        style={{ height: 64 }}
      >
        <View
          className="absolute inset-0"
          style={{ backgroundColor: GLASS_BG }}
        />
        <View className="h-full flex-row items-center px-2">
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.title ?? route.name;
            const isFocused = state.index === index;
            const color = isFocused ? BRAND_CAMEL : BRAND_OLIVE;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const icon = options.tabBarIcon?.({
              focused: isFocused,
              color,
              size: 22,
            });

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                className="flex-1 items-center justify-center"
                style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
              >
                <View
                  className={[
                    "items-center justify-center rounded-full px-4 py-2",
                    isFocused ? "bg-primary/15" : "",
                  ].join(" ")}
                >
                  {icon}
                  <Text
                    style={{
                      color,
                      fontFamily: "Inter-SemiBold",
                      fontSize: 10,
                      marginTop: 2,
                    }}
                  >
                    {label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}
