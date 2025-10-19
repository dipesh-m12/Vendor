// components/LanguageWidget.js
import React, { useState } from "react";
import { View, TouchableOpacity, Text, Modal, ScrollView } from "react-native";
import { translations } from "../translations/index";

const LanguageWidget = ({ language, setLanguage, isDark }: any) => {
  const [showModal, setShowModal] = useState(false);
  const languages = Object.keys(translations);

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={{
          position: "absolute",
          top: 60,
          left: 20,
          padding: 10,
          backgroundColor: isDark ? "#374151" : "white",
          borderRadius: 8,
          minWidth: 80,
          alignItems: "center",
        }}
      >
        <Text style={{ color: isDark ? "white" : "black", fontSize: 12 }}>
          🌐 {language}
        </Text>
      </TouchableOpacity>

      <Modal visible={showModal} transparent={true} animationType="fade">
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setShowModal(false)}
        >
          <View
            style={{
              backgroundColor: isDark ? "#374151" : "white",
              borderRadius: 12,
              padding: 20,
              maxHeight: 400,
              width: "80%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: isDark ? "white" : "black",
                marginBottom: 15,
                textAlign: "center",
              }}
            >
              Select Language
            </Text>

            <ScrollView>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang}
                  onPress={() => {
                    setLanguage(lang);
                    setShowModal(false);
                  }}
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    backgroundColor:
                      language === lang
                        ? isDark
                          ? "#4F46E5"
                          : "#3B82F6"
                        : "transparent",
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      color:
                        language === lang
                          ? "white"
                          : isDark
                          ? "#D1D5DB"
                          : "#374151",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    {lang}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default LanguageWidget;
