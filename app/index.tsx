import LanguageWidget from "@/components/LanguageWidget";
import ButtonHelper from "@/components/redirectHelper";
import ThemeWidget from "@/components/ThemeWidget";
import { Box } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Award, Shield } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import useThemeStore from "../store/themeStore";
import { translations } from "../translations/index";

const QVuewLogo = ({ isDark }: { isDark: boolean }) => (
  <Box alignItems="center" justifyContent="center" width={96} height={96}>
    <LinearGradient
      colors={isDark ? ["#6366F1", "#3730A3"] : ["#4F7DF7", "#1E40AF"]}
      start={[0, 0]}
      end={[0, 1]}
      style={{
        width: 96,
        height: 96,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        width={48}
        height={48}
        borderWidth={4}
        borderColor="white"
        borderRadius={6}
        justifyContent="center"
        alignItems="center"
        backgroundColor="transparent"
      >
        <Box
          width={24}
          height={24}
          backgroundColor={isDark ? "#312E81" : "#1E40AF"}
          borderRadius={3}
          borderWidth={4}
          borderColor="white"
        />
      </Box>
    </LinearGradient>
  </Box>
);

export default function Index() {
  const router = useRouter();
  const { isDark, toggleTheme, language, setLanguage } = useThemeStore();
  const languageSet = translations[language];

  // Dark mode color palette - MATCHING all other pages
  const colors = {
    // Page backgrounds - consistent gradient
    gradientStart: isDark ? "#111827" : "#F1F5F9", // dark:from-gray-900
    gradientMid: isDark ? "#1F2937" : "#E2E8F0", // dark:bg-gray-800
    gradientEnd: isDark ? "#374151" : "#CBD5E1", // dark:border-gray-700

    // Text colors - blue palette
    textPrimary: isDark ? "#DBEAFE" : "#1E3A8A", // dark:text-blue-100
    textSecondary: isDark ? "#BFDBFE" : "#3B82F6", // dark:text-blue-200
    textAccent: isDark ? "#93C5FD" : "#3B82F6", // dark:text-blue-300

    // Button colors
    signupBorder: isDark ? "#60A5FA" : "#3B82F6", // dark:border-blue-400
    signupBg: isDark ? "transparent" : "white",
    signupText: isDark ? "#93C5FD" : "#3B82F6", // dark:text-blue-300

    // Badge backgrounds
    badgeBg: isDark ? "rgba(55, 65, 81, 0.8)" : "rgba(255, 255, 255, 0.8)",
    badgeText: isDark ? "#93C5FD" : "#1E40AF", // dark:text-blue-300
    badgeIcon: isDark ? "#93C5FD" : "#1E40AF", // dark:text-blue-300
  };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
      start={[0, 0]}
      end={[0, 1]}
      style={{ flex: 1 }}
    >
      {/* Simple Theme Toggle */}
      <ThemeWidget isDark={isDark} toggleTheme={toggleTheme} />

      {/* Language Widget */}
      <LanguageWidget
        setLanguage={setLanguage}
        isDark={isDark}
        language={language}
      />

      <ButtonHelper />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <QVuewLogo isDark={isDark} />

        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: colors.textPrimary,
            marginTop: 16,
          }}
        >
          {languageSet.appName}
        </Text>

        <Text
          style={{
            color: colors.textSecondary,
            marginTop: 4,
            textAlign: "center",
            fontSize: 13,
          }}
        >
          {languageSet.tagline}
        </Text>

        {/* Log In Button */}
        <Box width="100%" marginTop={32}>
          <TouchableOpacity
            style={{ width: "100%" }}
            onPress={() => router.push("/(auth)/signin")}
          >
            <LinearGradient
              colors={["#4F7DF7", "#2563EB"]}
              start={[0, 0]}
              end={[1, 0]}
              style={{
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                {languageSet.login}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Box>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={{
            width: "100%",
            marginTop: 16,
            paddingVertical: 16,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.signupBorder,
            backgroundColor: colors.signupBg,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => router.push("/(auth)/(signupflows)/choose")}
        >
          <Text
            style={{
              color: colors.signupText,
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            {languageSet.signup}
          </Text>
        </TouchableOpacity>

        {/* Bottom Tags */}
        <Box
          flexDirection="row"
          justifyContent="center"
          gap={8}
          marginTop={32}
          alignItems="center"
        >
          <Box
            backgroundColor={colors.badgeBg}
            paddingHorizontal={12}
            paddingVertical={6}
            borderRadius={20}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Award size={14} color={colors.badgeIcon} />
              <Text
                style={{
                  fontSize: 12,
                  color: colors.badgeText,
                  fontWeight: "500",
                }}
              >
                {languageSet.badge1}
              </Text>
            </View>
          </Box>

          <Box
            backgroundColor={colors.badgeBg}
            paddingHorizontal={12}
            paddingVertical={6}
            borderRadius={20}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Shield size={14} color={colors.badgeIcon} />
              <Text
                style={{
                  fontSize: 12,
                  color: colors.badgeText,
                  fontWeight: "500",
                }}
              >
                {languageSet.badge2}
              </Text>
            </View>
          </Box>
        </Box>
      </View>
    </LinearGradient>
  );
}
