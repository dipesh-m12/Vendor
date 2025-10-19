import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import useThemeStore from "@/store/themeStore";
import { LogOut, X } from "lucide-react-native";
import { translations } from "@/translations/tabsTranslations/logout";
const Logout = () => {
  const router = useRouter();
  const { isDark, language } = useThemeStore();
  const languageSet = translations[language];

  const handleLogout = () => {
    // Add your logout logic here (clear tokens, user data, etc.)
    console.log("User logged out");

    // Redirect to signin
    router.replace("/(auth)/signin");
  };

  const handleCancel = () => {
    // Go back to previous screen
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        <Modal visible={true} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: isDark ? "#374151" : "white",
                  borderColor: isDark ? "#4B5563" : "#E5E7EB",
                },
              ]}
            >
              {/* Icon */}
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: isDark ? "#FEE2E2" : "#FEF2F2",
                  },
                ]}
              >
                <LogOut size={32} color="#EF4444" />
              </View>

              {/* Title */}
              <Text
                style={[
                  styles.title,
                  { color: isDark ? "#F8FAFC" : "#1E3A8A" },
                ]}
              >
                {languageSet.confirmLogout}
              </Text>

              {/* Description */}
              <Text
                style={[
                  styles.description,
                  { color: isDark ? "#9CA3AF" : "#6B7280" },
                ]}
              >
                {languageSet.logoutDescription}
              </Text>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                {/* Cancel Button */}
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.cancelButton,
                    {
                      backgroundColor: isDark ? "#4B5563" : "#F3F4F6",
                      borderColor: isDark ? "#6B7280" : "#E5E7EB",
                    },
                  ]}
                  onPress={handleCancel}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { color: isDark ? "#F9FAFB" : "#374151" },
                    ]}
                  >
                    {languageSet.cancel}
                  </Text>
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity
                  style={[styles.button, styles.logoutButton]}
                  onPress={handleLogout}
                >
                  <LinearGradient
                    colors={["#EF4444", "#DC2626"]}
                    start={[0, 0]}
                    end={[1, 0]}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.logoutButtonText}>
                      {languageSet.logout}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Logout;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 18,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 1,
  },
  logoutButton: {
    overflow: "hidden",
  },
  gradientButton: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
