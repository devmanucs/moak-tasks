import type { LucideIcon, LucideProps } from "lucide-react-native";
import type { ComponentType } from "react";
import { cssInterop } from "nativewind";

export type IconProps = LucideProps & {
  className?: string;
  color?: string;
};

export type IconComponent = ComponentType<IconProps>;

export function iconWithClassName(icon: LucideIcon): IconComponent {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  } as never);

  return icon as IconComponent;
}
