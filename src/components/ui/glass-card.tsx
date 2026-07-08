import { GLASS_BG, GLASS_BORDER } from "@/src/lib/colors";
import { cn } from "@/src/lib/utils";
import { BlurView } from "expo-blur";
import { type ReactNode } from "react";
import { Platform, View, type ViewProps } from "react-native";

type GlassCardProps = ViewProps & {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  intensity?: number;
};

export function GlassCard({
  children,
  className,
  contentClassName,
  intensity = Platform.OS === "ios" ? 45 : 80,
  ...props
}: GlassCardProps) {
  return (
    <View
      className={cn("overflow-hidden rounded-3xl", className)}
      style={{ borderWidth: 1, borderColor: GLASS_BORDER }}
      {...props}
    >
      <BlurView
        intensity={intensity}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View
        className={cn("p-5", contentClassName)}
        style={{ backgroundColor: GLASS_BG }}
      >
        {children}
      </View>
    </View>
  );
}
