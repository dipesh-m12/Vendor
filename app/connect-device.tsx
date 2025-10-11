import LanguageWidget from "@/components/LanguageWidget";
import ThemeWidget from "@/components/ThemeWidget";
import { HelpModal } from "@/components/connection/HelpModal";
import LogoutConfirmationModal from "@/components/connection/LogoutConfirmationModal";
import useThemeStore from "@/store/themeStore";
import translations from "@/translations/connectTranslations";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Bluetooth,
  HelpCircle,
  LogOut,
  RefreshCw,
  Wifi,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  PermissionsAndroid,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ConnectionScreen = () => {
  const router = useRouter();
  const { isDark, toggleTheme, language, setLanguage } = useThemeStore();
  const [isScanning, setIsScanning] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [deviceType, setDeviceType] = useState("bluetooth");
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionError, setPermissionError] = useState("");
  const languageSet = translations[language];

  useEffect(() => {
    requestBluetoothPermissions();
  }, []);

  const requestBluetoothPermissions = async () => {
    setHasPermission(true);
    scanForDevices();
    if (Platform.OS === "android") {
      try {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ];

        const granted = await PermissionsAndroid.requestMultiple(permissions);
        const allGranted = Object.values(granted).every(
          (permission) => permission === PermissionsAndroid.RESULTS.GRANTED
        );

        if (allGranted) {
          setHasPermission(true);
          scanForDevices();
        } else {
          setPermissionError(
            "Bluetooth permissions are required to scan for devices"
          );
        }
      } catch (err) {
        setPermissionError("Failed to request Bluetooth permissions");
        console.warn(err);
      }
    } else {
      setHasPermission(true);
      scanForDevices();
    }
  };

  const scanForDevices = async () => {
    setIsScanning(true);
    setDiscoveredDevices([]);
    setSelectedDevice(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockDevices = [
        {
          id: "QV001",
          name: "QVuew Display 1",
          status: "available",
          rssi: -45,
        },
        {
          id: "QV002",
          name: "QVuew Display 2",
          status: "available",
          rssi: -62,
        },
      ];
      setDiscoveredDevices(mockDevices as any);
    } catch (error) {
      console.error("Scanning error:", error);
      Alert.alert("Error", "Failed to scan for devices");
    } finally {
      setIsScanning(false);
    }
  };

  const handleDeviceSelect = (device: any) => {
    setSelectedDevice(device);
  };

  const connectToDevice = async () => {
    if (!selectedDevice) return;

    setIsConnecting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.replace("/(tabs)/queue");
    } catch (error) {
      Alert.alert(
        "Connection Failed",
        "Could not connect to the selected device"
      );
      setIsConnecting(false);
    }
  };

  const toggleDeviceType = (type: any) => {
    setDeviceType(type);
    setDiscoveredDevices([]);
    setSelectedDevice(null);
    if (type === "bluetooth" && hasPermission) {
      scanForDevices();
    } else if (type === "wifi") {
      setDiscoveredDevices([]);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirmation(false);
    router.replace("/(auth)/signin");
  };

  const renderDeviceItem = ({ item }: any) => {
    const isSelected = selectedDevice?.id === item.id;

    return (
      <TouchableOpacity
        onPress={() => handleDeviceSelect(item)}
        disabled={isConnecting}
        activeOpacity={0.8}
        style={{
          backgroundColor: isSelected
            ? isDark
              ? "#1E3A8A"
              : "#DBEAFE"
            : isDark
              ? "#374151"
              : "white",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected
            ? "#3B82F6"
            : isDark
              ? "#4B5563"
              : "#E5E7EB",
          opacity: isConnecting ? 0.5 : 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            {deviceType === "bluetooth" ? (
              <Bluetooth size={24} color="#3B82F6" />
            ) : (
              <Wifi size={24} color="#3B82F6" />
            )}

            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: isDark ? "#F9FAFB" : "#111827",
                  marginBottom: 2,
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: isDark ? "#9CA3AF" : "#6B7280",
                }}
              >
                ID: {item.id} • {item.status}
              </Text>
            </View>
          </View>
         
        </View>
      </TouchableOpacity>
    );
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
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            marginTop: 14,
          }}
        >
          <ThemeWidget isDark={isDark} toggleTheme={toggleTheme} />
          <LanguageWidget
            setLanguage={setLanguage}
            isDark={isDark}
            language={language}
          />

          <TouchableOpacity
            onPress={handleLogout}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <LogOut size={20} color={isDark ? "#A5B4FC" : "#3B82F6"} />
            <Text
              style={{
                marginLeft: 4,
                color: isDark ? "#A5B4FC" : "#3B82F6",
                fontSize: 16,
              }}
            >
              {languageSet.logout}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowHelpModal(true)}
            style={{
              backgroundColor: isDark
                ? "rgba(59, 130, 246, 0.1)"
                : "rgba(59, 130, 246, 0.1)",
              borderRadius: 20,
              padding: 8,
            }}
          >
            <HelpCircle size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Connection Animation */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View style={{ position: "relative" }}>
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: "rgba(59, 130, 246, 0.3)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: isDark ? "#3B82F6" : "#2563EB",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {deviceType === "bluetooth" ? (
                      <Bluetooth size={24} color="#FFFFFF" />
                    ) : (
                      <Wifi size={24} color="#FFFFFF" />
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>

          <Text
            style={{
              marginTop: 16,
              fontSize: 24,
              fontWeight: "bold",
              color: isDark ? "#F8FAFC" : "#1E3A8A",
              textAlign: "center",
            }}
          >
            {isScanning
              ? languageSet.scanningText
              : languageSet.selectDisplayText}
          </Text>
          <Text
            style={{
              marginTop: 8,
              textAlign: "center",
              color: isDark ? "#A5B4FC" : "#3B82F6",
              fontSize: 16,
              paddingHorizontal: 20,
            }}
          >
            {languageSet.instructionText}
          </Text>
        </View>

        {/* Connection Type Toggle */}
        <View
          style={{
            backgroundColor: isDark ? "#374151" : "white",
            borderRadius: 12,
            padding: 4,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: isDark ? "#4B5563" : "#E5E7EB",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => toggleDeviceType("bluetooth")}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor:
                  deviceType === "bluetooth" ? "#3B82F6" : "transparent",
              }}
            >
              <Bluetooth
                size={18}
                color={
                  deviceType === "bluetooth"
                    ? "#FFFFFF"
                    : isDark
                      ? "#A5B4FC"
                      : "#3B82F6"
                }
              />
              <Text
                style={{
                  marginLeft: 8,
                  color:
                    deviceType === "bluetooth"
                      ? "#FFFFFF"
                      : isDark
                        ? "#A5B4FC"
                        : "#3B82F6",
                  fontWeight: "500",
                }}
              >
                {languageSet.bluetooth}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleDeviceType("wifi")}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor:
                  deviceType === "wifi" ? "#3B82F6" : "transparent",
              }}
            >
              <Wifi
                size={18}
                color={
                  deviceType === "wifi"
                    ? "#FFFFFF"
                    : isDark
                      ? "#A5B4FC"
                      : "#3B82F6"
                }
              />
              <Text
                style={{
                  marginLeft: 8,
                  color:
                    deviceType === "wifi"
                      ? "#FFFFFF"
                      : isDark
                        ? "#A5B4FC"
                        : "#3B82F6",
                  fontWeight: "500",
                }}
              >
                {languageSet.wifi}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Permission Error */}
        {permissionError ? (
          <View
            style={{
              backgroundColor: isDark ? "#7F1D1D" : "#FEE2E2",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: isDark ? "#FCA5A5" : "#DC2626",
                fontSize: 14,
              }}
            >
              {permissionError}
            </Text>
            <TouchableOpacity
              onPress={requestBluetoothPermissions}
              style={{
                marginTop: 8,
                alignSelf: "flex-start",
              }}
            >
              <Text
                style={{
                  color: isDark ? "#FBBF24" : "#D97706",
                  fontWeight: "500",
                }}
              >
                {languageSet.grantPermissions}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Device List */}
        <View style={{ flex: 1 }}>
          {isScanning ? (
            <View
              style={{
                backgroundColor: isDark ? "#374151" : "white",
                borderRadius: 12,
                padding: 24,
                alignItems: "center",
                borderWidth: 1,
                borderColor: isDark ? "#4B5563" : "#E5E7EB",
              }}
            >
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text
                style={{
                  marginTop: 12,
                  color: isDark ? "#9CA3AF" : "#6B7280",
                  fontSize: 16,
                }}
              >
                {languageSet.scanning}
              </Text>
            </View>
          ) : discoveredDevices.length > 0 ? (
            <FlatList
              data={discoveredDevices}
              renderItem={renderDeviceItem}
              keyExtractor={(item: any) => item.id}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            />
          ) : hasPermission ? (
            <View
              style={{
                backgroundColor: isDark ? "#374151" : "white",
                borderRadius: 12,
                padding: 24,
                alignItems: "center",
                borderWidth: 1,
                borderColor: isDark ? "#4B5563" : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  color: isDark ? "#9CA3AF" : "#6B7280",
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                {languageSet.noDevices}
              </Text>
              <TouchableOpacity
                onPress={scanForDevices}
                style={{
                  backgroundColor: "#3B82F6",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white", fontWeight: "500" }}>
                  {languageSet.scanAgain}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* Bottom Action Buttons - FIXED */}
        {discoveredDevices.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginTop: 16,
              marginBottom: 12, // Added spacing before troubleshooting text
            }}
          >
            <TouchableOpacity
              onPress={scanForDevices}
              disabled={isScanning}
              style={{
                flex: 1,
                backgroundColor: isDark ? "#374151" : "white",
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
                borderWidth: 1,
                borderColor: isDark ? "#4B5563" : "#E5E7EB",
              }}
            >
              <RefreshCw size={18} color={isDark ? "#A5B4FC" : "#3B82F6"} />

            </TouchableOpacity>

            {/* FIXED Connect Button with proper borderRadius */}
            <View
              style={{
                flex: 2,
                borderRadius: 12,
                overflow: "hidden", // Key fix for borderRadius
                opacity: !selectedDevice || isConnecting ? 0.5 : 1,
              }}
            >
              <TouchableOpacity
                onPress={connectToDevice}
                disabled={!selectedDevice || isConnecting}
                activeOpacity={0.8}
                style={{
                  flex: 2,
                  borderRadius: 12,
                  overflow: "hidden",
                  opacity: !selectedDevice || isConnecting ? 0.5 : 1,
                }}
              >
                <LinearGradient
                  colors={
                    selectedDevice && !isConnecting
                      ? ["#3B82F6", "#2563EB"]
                      : ["#9CA3AF", "#6B7280"]
                  }
                  start={[0, 0]}
                  end={[1, 0]}
                  style={{
                    paddingVertical: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 12,
                  }}
                >
                  {isConnecting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "600",
                        fontSize: 14,
                      }}
                    >
                      {languageSet.connect}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom Banner - FIXED with underline */}
        <Pressable onPress={() => setShowHelpModal(true)}>
          <View style={{ paddingVertical: 20, alignItems: "center" }}>
            <Text
              style={{
                textAlign: "center",
                color: isDark ? "#A5B4FC" : "#3B82F6",
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              {languageSet.troubleText}{" "}
              <Text
                style={{
                  fontWeight: "600",
                  color: isDark ? "#3B82F6" : "#1E3A8A",
                  textDecorationLine: "underline", // Added underline
                }}
              >
                {languageSet.troubleshootingGuide}
              </Text>
            </Text>
          </View>
        </Pressable>

        {/* Help Modal */}
        <HelpModal
          isOpen={showHelpModal}
          onClose={() => setShowHelpModal(false)}
          isDark={isDark}
        />

        {/* Logout Confirmation Modal */}
        <LogoutConfirmationModal
          visible={showLogoutConfirmation}
          onClose={() => setShowLogoutConfirmation(false)}
          onConfirm={confirmLogout}
          isDark={isDark}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ConnectionScreen;
