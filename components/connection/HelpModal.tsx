"use client";

import { X } from "lucide-react-native";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

export const HelpModal = ({ isOpen, onClose, isDark }: any) => {
  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
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
            maxWidth: 400,
            backgroundColor: isDark ? "#374151" : "white",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <View className="flex flex-row-reverse">
            <X
              size={24}
              onPress={onClose}
              color={isDark ? "#A5B4FC" : "#3B82F6"}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: isDark ? "#F8FAFC" : "#1E3A8A",
              }}
            >
              Need Help with Device Connection?
            </Text>
          </View>
          <ScrollView
            className="max-h-[60vh]"
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: isDark ? "#A5B4FC" : "#3B82F6",
                marginBottom: 12,
              }}
            >
              Having trouble connecting?
            </Text>

            <View style={{ marginBottom: 20 }}>
              {[
                "Ensure Bluetooth/Wi-Fi is enabled.",
                "Move closer to the QVuew device.",
                "Make sure your device is powered ON.",
              ].map((tip, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "#3B82F6",
                      marginRight: 8,
                      fontSize: 16,
                    }}
                  >
                    •
                  </Text>
                  <Text
                    style={{
                      color: isDark ? "#D1D5DB" : "#4B5563",
                      fontSize: 14,
                      flex: 1,
                    }}
                  >
                    {tip}
                  </Text>
                </View>
              ))}
            </View>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: isDark ? "#A5B4FC" : "#3B82F6",
                marginBottom: 12,
              }}
            >
              Bluetooth Connection Tips:
            </Text>

            <View style={{ marginBottom: 20 }}>
              {[
                "Ensure Bluetooth is enabled on your mobile device",
                "The QVuew display should show a blinking blue light when ready to pair",
                "Some devices may require location permissions",
                "Try forgetting the device in your Bluetooth settings and reconnecting",
              ].map((tip, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "#3B82F6",
                      marginRight: 8,
                      fontSize: 16,
                    }}
                  >
                    •
                  </Text>
                  <Text
                    style={{
                      color: isDark ? "#D1D5DB" : "#4B5563",
                      fontSize: 14,
                      flex: 1,
                    }}
                  >
                    {tip}
                  </Text>
                </View>
              ))}
            </View>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: isDark ? "#A5B4FC" : "#3B82F6",
                marginBottom: 12,
              }}
            >
              WiFi Connection Tips:
            </Text>

            <View style={{ marginBottom: 20 }}>
              {[
                "Ensure your phone and QVuew display are on the same WiFi network",
                "Check if your WiFi network has device isolation turned off",
                "The QVuew display should show a solid green light when connected to WiFi",
                "Try restarting your WiFi router if problems persist",
              ].map((tip, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "#3B82F6",
                      marginRight: 8,
                      fontSize: 16,
                    }}
                  >
                    •
                  </Text>
                  <Text
                    style={{
                      color: isDark ? "#D1D5DB" : "#4B5563",
                      fontSize: 14,
                      flex: 1,
                    }}
                  >
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: "#3B82F6",
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
