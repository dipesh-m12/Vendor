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

  const handleContinue = () => {
    // Navigate to next step (signup screen)
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
          backgroundColor: isSelected
            ? isDark
              ? "#4338CA"
              : "#3B82F6"
            : isDark
            ? "#374151"
            : "white",
          borderRadius: 16,
          padding: 12,
          alignItems: "center",
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected
            ? isDark
              ? "#6366F1"
              : "#2563EB"
            : isDark
            ? "#4B5563"
            : "#E5E7EB",
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
            backgroundColor: isSelected
              ? "rgba(255, 255, 255, 0.2)"
              : isDark
              ? "#4B5563"
              : "#F3F4F6",
            padding: 16,
            borderRadius: 50,
            marginBottom: 16,
          }}
        >
          <Icon
            size={32}
            color={isSelected ? "white" : isDark ? "#F9FAFB" : "#3B82F6"}
          />
        </View>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: isSelected ? "white" : isDark ? "#F8FAFC" : "#1E3A8A",
            marginBottom: 8,
            textAlign: "left",
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: isSelected
              ? "rgba(255, 255, 255, 0.8)"
              : isDark
              ? "#D1D5DB"
              : "#6B7280",
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
      colors={
        isDark
          ? ["#1E1B4B", "#312E81", "#3730A3"]
          : ["#F1F5F9", "#E2E8F0", "#CBD5E1"]
      }
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
        <ArrowLeft size={20} color="#3B82F6" />
        <Text
          style={{
            color: "#3B82F6",
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
              color: isDark ? "#F8FAFC" : "#1E3A8A",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {languageSet.chooseAccountType}
          </Text>
          <Text
            style={{
              color: "#3B82F6",
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
              color: isDark ? "#9CA3AF" : "#6B7280",
              fontSize: 14,
            }}
          >
            {languageSet.selected}:{" "}
            <Text style={{ fontWeight: "600", color: "#3B82F6" }}>
              {regType === "owner" ? "Owner Account" : "Helper Account"}
            </Text>
          </Text>
        </View>
      </View>
      {/* <ThemeWidget isDark={isDark} toggleTheme={toggleTheme} />
       */}
      {/* <LanguageWidget
        setLanguage={setLanguage}
        isDark={isDark}
        language={language}
      /> */}
    </LinearGradient>
  );
}
