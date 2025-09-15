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

  return (
    <LinearGradient
      colors={
        isDark
          ? ["#1E1B4B", "#312E81", "#3730A3"]
          : ["#F1F5F9", "#E2E8F0", "#CBD5E1"] // Light whitish-blue to darker
      }
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
            color: isDark ? "#F8FAFC" : "#1E3A8A",
            marginTop: 16,
          }}
        >
          {languageSet.appName}
        </Text>

        <Text
          style={{
            color: isDark ? "#CBD5E1" : "#3B82F6",
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
              colors={isDark ? ["#6366F1", "#4338CA"] : ["#4F7DF7", "#2563EB"]}
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
            borderColor: isDark ? "#6366F1" : "#3B82F6",
            backgroundColor: isDark ? "transparent" : "white",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => router.push("/(auth)/(signupflows)/choose")}
        >
          <Text
            style={{
              color: isDark ? "#A5B4FC" : "#3B82F6",
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
            backgroundColor={
              isDark ? "rgba(55, 65, 81, 0.8)" : "rgba(255, 255, 255, 0.8)"
            }
            paddingHorizontal={12}
            paddingVertical={6}
            borderRadius={20}
          >
            <Text
              style={{
                fontSize: 12,
                color: isDark ? "#A5B4FC" : "#1E40AF",
                fontWeight: "500",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Award size={14} color={isDark ? "#A5B4FC" : "#1E40AF"} />
                <Text
                  style={{
                    fontSize: 12,
                    color: isDark ? "#A5B4FC" : "#1E40AF",
                  }}
                >
                  {languageSet.badge1}
                </Text>
              </View>
            </Text>
          </Box>

          <Box
            backgroundColor={
              isDark ? "rgba(55, 65, 81, 0.8)" : "rgba(255, 255, 255, 0.8)"
            }
            paddingHorizontal={12}
            paddingVertical={6}
            borderRadius={20}
          >
            <Text
              style={{
                fontSize: 12,
                color: isDark ? "#A5B4FC" : "#1E40AF",
                fontWeight: "500",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Shield size={14} color={isDark ? "#A5B4FC" : "#1E40AF"} />
                <Text
                  style={{
                    fontSize: 12,
                    color: isDark ? "#A5B4FC" : "#1E40AF",
                  }}
                >
                  {languageSet.badge2}
                </Text>
              </View>
            </Text>
          </Box>
        </Box>
      </View>
    </LinearGradient>
  );
}
