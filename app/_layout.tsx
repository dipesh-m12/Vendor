import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/useColorScheme";

import { toastConfig } from "@/components/ToastConfig";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import useThemeStore from "@/store/themeStore";
import ToastManager from "toastify-react-native/components/ToastManager";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isDark } = useThemeStore();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="history" options={{ headerShown: false }} />
          <Stack.Screen name="(ratecard)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="connect-device"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="qrcode" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        {/* Toast provider should be at the root level */}
        <ToastManager config={toastConfig} />
        <StatusBar style={isDark ? "light" : "auto"} />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
