import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import useThemeStore from "@/store/themeStore";
import { ArrowLeft, QrCode } from "lucide-react-native";
import QRCode from "react-native-qrcode-svg";
import ThemeWidget from "@/components/ThemeWidget";
import LanguageWidget from "@/components/LanguageWidget";
import { translations } from "@/translations/qrcodeTranslations";

// You'll need to replace this with your actual auth context/store
// import { useAuth } from "@/context/AuthContext";

export default function QRCodePage() {
  const router = useRouter();
  const { isDark, toggleTheme, setLanguage, language } = useThemeStore();
  // const { user, isAuthenticated } = useAuth();
  const [businessName, setBusinessName] = useState("Your Business Name");
  const [qrValue, setQrValue] = useState(
    "https://yourapp.com/queue/join/business123"
  );
  const languageSet = translations[language];
  const generateQRCode = (value: string) => {
    setQrValue(value);
  };

  useEffect(() => {
    // Redirect to login if not authenticated
    // if (!isAuthenticated) {
    //   router.push("/(auth)/login");
    //   return;
    // }

    // Set business name from user data
    // if (user?.businessName) {
    //   setBusinessName(user.businessName);
    // }

    // Generate QR code value (replace with your actual logic)
    // This could be a unique URL for your queue system
    setQrValue(`https://yourapp.com/queue/join/${Date.now()}`);
  }, []);

  const handleBack = () => {
    router.back(); // or router.back()
  };

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
      {/* Header */}
      <View
        style={{
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "white",
          paddingTop: 60,
          paddingBottom: 16,
          paddingHorizontal: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
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
            <ArrowLeft size={20} color="#3B82F6" />
          </TouchableOpacity>
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: isDark ? "#F8FAFC" : "#1E3A8A",
              }}
            >
              {languageSet.qrCodeDisplay}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#3B82F6",
                marginTop: 2,
              }}
            >
              {businessName}
            </Text>
          </View>
        </View>
      </View>
      {/* Simple Theme Toggle */}
      {/* <ThemeWidget isDark={isDark} toggleTheme={toggleTheme} /> */}

      {/* Language Widget */}
      {/* <LanguageWidget
        setLanguage={setLanguage}
        isDark={isDark}
        language={language}
      /> */}
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
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "white",
              borderRadius: 12,
              marginBottom: 16,
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
                backgroundColor: isDark ? "rgba(59, 130, 246, 0.2)" : "#EFF6FF",
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderBottomWidth: 1,
                borderBottomColor: isDark
                  ? "rgba(59, 130, 246, 0.3)"
                  : "#DBEAFE",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <QrCode size={18} color="#3B82F6" />
              <Text
                style={{
                  marginLeft: 8,
                  fontWeight: "500",
                  color: "#3B82F6",
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
                  color: isDark ? "#9CA3AF" : "#6B7280",
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
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "white",
              borderRadius: 12,
              padding: 16,
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
                color: isDark ? "#A5B4FC" : "#1E40AF",
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
                    backgroundColor: isDark
                      ? "rgba(59, 130, 246, 0.2)"
                      : "#EFF6FF",
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
                      color: "#3B82F6",
                    }}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: isDark ? "#CBD5E1" : "#374151",
                    lineHeight: 20,
                  }}
                >
                  {text}
                </Text>
              </View>
            ))}
          </View>

          {/* Refresh Button (Optional) */}
          {/* <TouchableOpacity
            onPress={() => {
              const newValue = `https://yourapp.com/queue/join/${Date.now()}`;
              setQrValue(newValue);
              generateQRCode(newValue);
            }}
            style={{
              marginTop: 16,
              backgroundColor: isDark ? "rgba(59, 130, 246, 0.2)" : "#EFF6FF",
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
              alignItems: "center",
              borderWidth: 1,
              borderColor: isDark ? "rgba(59, 130, 246, 0.3)" : "#DBEAFE",
            }}
          >
            <Text
              style={{
                color: "#3B82F6",
                fontWeight: "500",
                fontSize: 14,
              }}
            >
              Refresh QR Code
            </Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
