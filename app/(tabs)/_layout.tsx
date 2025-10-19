// app/(auth)/_layout.tsx
import FloatingActionButtons from "@/components/FloatingActionButtons";
import useThemeStore from "@/store/themeStore";
import { translations } from "@/translations/tabsTranslations/tabTranslations";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AuthLayout() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleTheme, setLanguage, language } = useThemeStore();
  const languageSet = translations[language];

  return (
    <>
      <FloatingActionButtons bottom={130} />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: isDark ? "#1F2937" : "#fff",
            borderTopWidth: 1,
            borderTopColor: isDark ? "#374151" : "#e5e5e5",
            paddingBottom: insets.bottom + 10, // Add extra padding for home indicator
            // paddingTop: 8,
            // height: 70 + insets.bottom, // Adjust height based on safe area
            position: "absolute",
          },
          tabBarActiveTintColor: isDark ? "#60A5FA" : "#4285F4",
          tabBarInactiveTintColor: isDark ? "#6B7280" : "#9CA3AF",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
            marginTop: 2,
            marginBottom: 4, // Add space above the bottom safe area
          },
          tabBarIconStyle: {
            marginBottom: -2,
          },
        }}
      >
        <Tabs.Screen
          name="queue"
          options={{
            title: languageSet.queue,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: languageSet.stats,
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="document-text-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="premium"
          options={{
            title: languageSet.premium,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="star-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: languageSet.settings,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="logout"
          options={{
            title: languageSet.logout,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="log-out-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
