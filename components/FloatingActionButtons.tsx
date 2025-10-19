// components/FloatingActionButtons.tsx
import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Users, QrCode } from "lucide-react-native";
import { useRouter } from "expo-router";
import useThemeStore from "@/store/themeStore";
import AddCustomerModal from "./AddCustomerModal";

interface FloatingActionButtonsProps {
  bottom?: number; // Allow customizing position
}

export default function FloatingActionButtons({
  bottom = 60,
}: FloatingActionButtonsProps) {
  const router = useRouter();
  const { isDark } = useThemeStore();
  const [isAddCustomerModalVisible, setIsAddCustomerModalVisible] =
    useState(false);

  const handleUsersPress = () => {
    setIsAddCustomerModalVisible(true);
  };

  const handleQRPress = () => {
    // Navigate to QR code display page
    router.push("/qrcode"); // your QR code page route
  };

  return (
    <>
      <View
        style={{
          position: "absolute",
          right: 16,
          bottom,
          zIndex: 900,
        }}
      >
        {/* Users/People Button */}
        <TouchableOpacity
          onPress={handleUsersPress}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: isDark ? "#60A5FA" : "#4285F4",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.4 : 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Users size={24} color="white" />
        </TouchableOpacity>

        {/* QR Code Button */}
        <TouchableOpacity
          onPress={handleQRPress}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: isDark ? "#60A5FA" : "#4285F4",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.4 : 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <QrCode size={24} color="white" />
        </TouchableOpacity>
      </View>

      <AddCustomerModal
        visible={isAddCustomerModalVisible}
        onClose={() => setIsAddCustomerModalVisible(false)}
      />
    </>
  );
}

// Then in your layout or any screen where you want these buttons:
// import FloatingActionButtons from '@/components/FloatingActionButtons';

// And use it like:
// <FloatingActionButtons top={80} /> // Adjust top position as needed
