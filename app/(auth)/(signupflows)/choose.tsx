import useRegTypeStore from "@/store/regTypeStore";
import useThemeStore from "@/store/themeStore";
import { accountTypeTranslations } from "@/translations/signupflowsTranslations";
import { Box } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft, Users, Wrench } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function AccountTypeScreen() {
  const router = useRouter();
  const { isDark, setLanguage, language, toggleTheme } = useThemeStore();
  const { regType, setRegType } = useRegTypeStore();
  const languageSet = accountTypeTranslations[language];

  // Dark mode color palette - MATCHING all other pages
  const colors = {
    // Page backgrounds - consistent gradient
    gradientStart: isDark ? "#111827" : "#F1F5F9", // dark:from-gray-900
    gradientMid: isDark ? "#1F2937" : "#E2E8F0", // dark:bg-gray-800
    gradientEnd: isDark ? "#374151" : "#CBD5E1", // dark:border-gray-700

    // Text colors - blue palette
    textPrimary: isDark ? "#DBEAFE" : "#1E3A8A", // dark:text-blue-100
    textSecondary: isDark ? "#BFDBFE" : "#6B7280", // dark:text-blue-200
    textAccent: isDark ? "#93C5FD" : "#3B82F6", // dark:text-blue-300
    textMuted: isDark ? "#9CA3AF" : "#6B7280", // dark:text-gray-400

    // Icon colors
    iconColor: isDark ? "#60A5FA" : "#3B82F6", // dark:text-blue-400
    backButtonColor: isDark ? "#60A5FA" : "#3B82F6", // dark:text-blue-400

    // Card - unselected
    cardBg: isDark ? "rgba(31, 41, 55, 0.95)" : "white", // dark:bg-gray-800/95
    cardBorder: isDark ? "#4B5563" : "#E5E7EB", // dark:border-gray-600
    cardIconBg: isDark ? "#4B5563" : "#F3F4F6", // dark:bg-gray-600
    cardIconColor: isDark ? "#F9FAFB" : "#3B82F6",
    cardTextPrimary: isDark ? "#DBEAFE" : "#1E3A8A", // dark:text-blue-100
    cardTextSecondary: isDark ? "#BFDBFE" : "#6B7280", // dark:text-blue-200

    // Card - selected
    selectedCardBg: isDark ? "#1E40AF" : "#3B82F6", // dark:bg-blue-900
    selectedCardBorder: isDark ? "#3B82F6" : "#2563EB", // dark:border-blue-600
    selectedIconBg: "rgba(255, 255, 255, 0.2)",
    selectedIconColor: "white",
    selectedTextPrimary: "white",
    selectedTextSecondary: "rgba(255, 255, 255, 0.8)",

    // Selected type indicator
    selectedIndicatorText: isDark ? "#93C5FD" : "#3B82F6", // dark:text-blue-300
  };

  const handleContinue = () => {
    router.push("/(auth)/signup");
  };

  const AccountTypeCard = ({
    type,
    title,
    description,
    icon: Icon,
    isSelected,
  }: any) => (
    <TouchableOpacity
      onPress={() => setRegType(type)}
      style={{
        flex: 1,
        marginHorizontal: 8,
      }}
    >
      <Box
        style={{
          backgroundColor: isSelected ? colors.selectedCardBg : colors.cardBg,
          borderRadius: 16,
          padding: 12,
          alignItems: "center",
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? colors.selectedCardBorder : colors.cardBorder,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: isSelected ? 4 : 2,
          },
          shadowOpacity: isSelected ? 0.3 : 0.1,
          shadowRadius: isSelected ? 8 : 4,
          elevation: isSelected ? 8 : 4,
        }}
      >
        <View
          style={{
            backgroundColor: isSelected ? colors.selectedIconBg : colors.cardIconBg,
            padding: 16,
            borderRadius: 50,
            marginBottom: 16,
          }}
        >
          <Icon
            size={32}
            color={isSelected ? colors.selectedIconColor : colors.cardIconColor}
          />
        </View>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: isSelected ? colors.selectedTextPrimary : colors.cardTextPrimary,
            marginBottom: 8,
            textAlign: "left",
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: isSelected ? colors.selectedTextSecondary : colors.cardTextSecondary,
            textAlign: "center",
            lineHeight: 20,
          }}
        >
          {description}
        </Text>
      </Box>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
      start={[0, 0]}
      end={[0, 1]}
      style={{ flex: 1 }}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 60,
          left: 15,
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
          zIndex: 1,
        }}
      >
        <ArrowLeft size={20} color={colors.backButtonColor} />
        <Text
          style={{
            color: colors.backButtonColor,
            marginLeft: 4,
            fontSize: 16,
          }}
        >
          {languageSet.back}
        </Text>
      </TouchableOpacity>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 40,
        }}
      >
        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 48 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: colors.textPrimary,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {languageSet.chooseAccountType}
          </Text>
          <Text
            style={{
              color: colors.textAccent,
              fontSize: 16,
              textAlign: "center",
              paddingHorizontal: 10,
            }}
          >
            {languageSet.selectAccountType}
          </Text>
        </View>

        {/* Account Type Cards */}
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginBottom: 48,
          }}
        >
          <AccountTypeCard
            type="owner"
            title="Owner"
            description="I own a business or property and need help with various tasks"
            icon={Users}
            isSelected={regType === "owner"}
          />

          <AccountTypeCard
            type="helper"
            title="Helper"
            description="I want to provide services and help others with their needs"
            icon={Wrench}
            isSelected={regType === "helper"}
          />
        </View>

        {/* Continue Button */}
        <Box width="100%" paddingHorizontal={16}>
          <TouchableOpacity style={{ width: "100%" }} onPress={handleContinue}>
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
                {languageSet.continueAs}{" "}
                {regType === "owner" ? "Owner" : "Helper"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Box>

        {/* Selected Type Indicator */}
        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: 14,
            }}
          >
            {languageSet.selected}:{" "}
            <Text style={{ fontWeight: "600", color: colors.selectedIndicatorText }}>
              {regType === "owner" ? "Owner Account" : "Helper Account"}
            </Text>
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
