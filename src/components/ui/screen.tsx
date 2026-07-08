import { GlowBackground } from "@/src/components/ui/glow-background";
import { cn } from "@/src/lib/utils";
import { type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = ViewProps & {
  children: ReactNode;
  className?: string;
  glow?: boolean;
};

export function Screen({
  children,
  className,
  glow = true,
  ...props
}: ScreenProps) {
  return (
    <View className="dark flex-1 bg-background">
      <SafeAreaView edges={["top"]} className="flex-1 bg-background">
        {glow ? <GlowBackground /> : null}
        <View className={cn("flex-1", className)} {...props}>
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
}
