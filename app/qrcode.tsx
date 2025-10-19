import useThemeStore from "@/store/themeStore";
import { translations } from "@/translations/qrcodeTranslations";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft, QrCode } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRCodePage() {
  const router = useRouter();
  const { isDark, toggleTheme, setLanguage, language } = useThemeStore();
  const [businessName, setBusinessName] = useState("Your Business Name");
  const [qrValue, setQrValue] = useState(
    "https://yourapp.com/queue/join/business123"
  );
  const languageSet = translations[language];

  // Dark mode color palette - MATCHING all other pages
  const colors = {
    // Page backgrounds - consistent gradient
    gradientStart: isDark ? "#111827" : "#F1F5F9", // dark:from-gray-900
    gradientMid: isDark ? "#1F2937" : "#E2E8F0", // dark:bg-gray-800
    gradientEnd: isDark ? "#374151" : "#CBD5E1", // dark:border-gray-700

    // Card backgrounds
    cardBg: isDark ? "rgba(31, 41, 55, 0.95)" : "white", // dark:bg-gray-800/95
    headerBg: isDark ? "rgba(55, 65, 81, 0.95)" : "white", // dark:bg-gray-700/95

    // Text colors - blue palette
    textPrimary: isDark ? "#DBEAFE" : "#1E3A8A", // dark:text-blue-100
    textSecondary: isDark ? "#BFDBFE" : "#374151", // dark:text-blue-200
    textAccent: isDark ? "#93C5FD" : "#3B82F6", // dark:text-blue-300
    textMuted: isDark ? "#9CA3AF" : "#6B7280", // dark:text-gray-400

    // Icon colors
    iconColor: isDark ? "#60A5FA" : "#3B82F6", // dark:text-blue-400

    // Card header
    cardHeaderBg: isDark ? "rgba(96, 165, 250, 0.15)" : "#EFF6FF",
    cardHeaderBorder: isDark ? "#4B5563" : "#DBEAFE",

    // Border colors
    borderColor: isDark ? "#374151" : "#E2E8F0", // dark:border-gray-700

    // Step number badge
    stepBadgeBg: isDark ? "rgba(96, 165, 250, 0.15)" : "#EFF6FF",
    stepBadgeText: isDark ? "#60A5FA" : "#3B82F6",

    // Instructions section title
    instructionsTitle: isDark ? "#93C5FD" : "#1E40AF", // dark:text-blue-300

    // Refresh button (if used)
    refreshBg: isDark ? "rgba(96, 165, 250, 0.15)" : "#EFF6FF",
    refreshBorder: isDark ? "#4B5563" : "#DBEAFE",
    refreshText: isDark ? "#60A5FA" : "#3B82F6",
  };

  const generateQRCode = (value: string) => {
    setQrValue(value);
  };

  useEffect(() => {
    setQrValue(`https://yourapp.com/queue/join/${Date.now()}`);
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
      start={[0, 0]}
      end={[0, 1]}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View
        style={{
          backgroundColor: colors.headerBg,
          paddingTop: 60,
          paddingBottom: 16,
          paddingHorizontal: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderColor,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={handleBack}
            style={{
              marginRight: 16,
              padding: 4,
            }}
          >
            <ArrowLeft size={20} color={colors.iconColor} />
          </TouchableOpacity>
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: colors.textPrimary,
              }}
            >
              {languageSet.qrCodeDisplay}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.textAccent,
                marginTop: 2,
              }}
            >
              {businessName}
            </Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80%",
          paddingBottom: 70,
        }}
      >
        <View style={{ width: "100%", maxWidth: 400 }}>
          {/* QR Code Card */}
          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 12,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: colors.borderColor,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 4,
              overflow: "hidden",
            }}
          >
            {/* Card Header */}
            <View
              style={{
                backgroundColor: colors.cardHeaderBg,
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.cardHeaderBorder,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <QrCode size={18} color={colors.iconColor} />
              <Text
                style={{
                  marginLeft: 8,
                  fontWeight: "500",
                  color: colors.iconColor,
                  fontSize: 16,
                }}
              >
                {languageSet.customerQueueQRCode}
              </Text>
            </View>

            {/* QR Code Display */}
            <View
              style={{
                padding: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 16,
                  borderRadius: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <QRCode
                  value={qrValue}
                  size={200}
                  color="black"
                  backgroundColor="white"
                />
              </View>
              <Text
                style={{
                  marginTop: 12,
                  fontSize: 12,
                  color: colors.textMuted,
                  textAlign: "center",
                }}
              >
                {languageSet.scanToJoinQueue}
              </Text>
            </View>
          </View>

          {/* Instructions Card */}
          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.borderColor,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: colors.instructionsTitle,
                marginBottom: 12,
              }}
            >
              {languageSet.howItWorks}
            </Text>

            {[
              languageSet.step1,
              languageSet.step2,
              languageSet.step3,
              languageSet.step4,
            ].map((text, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: colors.stepBadgeBg,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                    marginTop: 2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: colors.stepBadgeText,
                    }}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: colors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  {text}
                </Text>
              </View>
            ))}
          </View>

          {/* Refresh Button (Optional) */}
          <TouchableOpacity
            onPress={() => {
              const newValue = `https://yourapp.com/queue/join/${Date.now()}`;
              setQrValue(newValue);
              generateQRCode(newValue);
            }}
            style={{
              marginTop: 16,
              backgroundColor: colors.refreshBg,
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.refreshBorder,
            }}
          >
            <Text
              style={{
                color: colors.refreshText,
                fontWeight: "500",
                fontSize: 14,
              }}
            >
              Refresh QR Code
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
