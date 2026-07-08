import { Tabs } from "expo-router";
import { GlassTabBar } from "@/src/components/ui/glass-tab-bar";
import {
  DumbbellIcon,
  LayoutDashboardIcon,
  ListTodoIcon,
} from "@/src/components/ui/icons";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "transparent" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboardIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tarefas",
          tabBarIcon: ({ color, size }) => (
            <ListTodoIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gym"
        options={{
          title: "Academia",
          tabBarIcon: ({ color, size }) => (
            <DumbbellIcon size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
