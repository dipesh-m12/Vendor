import useThemeStore from "@/store/themeStore";
import translations from "@/translations/connectTranslations";
import { X } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";

interface LogoutConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDark: boolean;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  isDark,
}) => {
  const { language } = useThemeStore();
  const languageSet = translations[language];
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: isDark ? "#374151" : "white",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            style={{ alignSelf: "flex-end", marginBottom: 8 }}
          >
            <X size={20} color={isDark ? "#A5B4FC" : "#3B82F6"} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 24,
              textAlign: "center",
              color: isDark ? "#F8FAFC" : "#1E3A8A",
            }}
          >
            {languageSet.title}
          </Text>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: isDark ? "#4B5563" : "#F3F4F6",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: isDark ? "#A5B4FC" : "#3B82F6",
                  fontWeight: "500",
                }}
              >
                {languageSet.cancel}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: "#3B82F6",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "500",
                }}
              >
                {languageSet.confirm}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutConfirmationModal;
