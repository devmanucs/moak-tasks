import { useSafeAreaInsets } from "react-native-safe-area-context";

export const TAB_BAR_HEIGHT = 64;
const TAB_BAR_MARGIN = 12;

/** Espaço acima da tab bar flutuante (para FAB, padding de listas, etc.) */
export function useTabBarInset(extra = 16) {
  const insets = useSafeAreaInsets();
  return Math.max(insets.bottom, TAB_BAR_MARGIN) + TAB_BAR_HEIGHT + extra;
}

/** Offset do FAB acima da tab bar */
export function useFabBottom() {
  return useTabBarInset(20);
}
