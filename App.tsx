import { ExpoRoot, type RequireContext } from "expo-router";

const ctx = (require as NodeRequire & {
  context: (path: string) => RequireContext;
}).context("./app");

export default function App() {
  return <ExpoRoot context={ctx} />;
}
