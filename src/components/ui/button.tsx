import { Pressable, Text, TextStyle, ViewStyle } from "react-native";

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const buttonVariants = {
  primary: "bg-blue-500",
  secondary: "bg-gray-200",
  danger: "bg-red-500",
};

const textVariants = {
  primary: "text-white",
  secondary: "text-gray-800",
  danger: "text-white",
};

export function Button({
  onPress,
  title,
  variant = "primary",
  disabled = false,
  className,
  textClassName,
  style,
  textStyle,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={[
        "items-center justify-center rounded-lg px-4 py-3",
        buttonVariants[variant],
        disabled ? "opacity-50" : "",
        className ?? "",
      ].join(" ")}
      style={style}
    >
      <Text
        className={[
          "text-sm font-semibold",
          textVariants[variant],
          textClassName ?? "",
        ].join(" ")}
        style={textStyle}
      >
        {title}
      </Text>
    </Pressable>
  );
}
