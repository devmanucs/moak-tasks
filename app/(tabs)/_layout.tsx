import { Tabs } from "expo-router";
import {
  DumbbellIcon,
  LayoutDashboardIcon,
  ListTodoIcon,
} from "@/src/components/ui/icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#c09664",
        tabBarInactiveTintColor: "#647360",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e8e8e8",
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter-SemiBold",
          fontSize: 11,
        },
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
