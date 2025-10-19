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

  // Dark mode color palette - MATCHING all other pages
  const colors = {
    // Page backgrounds - consistent gradient
    gradientStart: isDark ? "#111827" : "#F1F5F9", // dark:from-gray-900
    gradientMid: isDark ? "#1F2937" : "#E2E8F0", // dark:bg-gray-800
    gradientEnd: isDark ? "#374151" : "#CBD5E1", // dark:border-gray-700

    // Text colors - blue palette
    textPrimary: isDark ? "#DBEAFE" : "#1E3A8A", // dark:text-blue-100
    textSecondary: isDark ? "#BFDBFE" : "#3B82F6", // dark:text-blue-200
    textAccent: isDark ? "#93C5FD" : "#3B82F6", // dark:text-blue-300
    textMuted: isDark ? "#9CA3AF" : "#6B7280", // dark:text-gray-400

    // Icon colors
    iconColor: isDark ? "#60A5FA" : "#3B82F6", // dark:text-blue-400

    // Card backgrounds
    cardBg: isDark ? "rgba(31, 41, 55, 0.95)" : "white", // dark:bg-gray-800/95
    toggleBg: isDark ? "#374151" : "white", // dark:bg-gray-700

    // Borders
    borderColor: isDark ? "#4B5563" : "#E5E7EB", // dark:border-gray-600

    // Device item
    deviceSelected: isDark ? "#1E40AF" : "#DBEAFE", // dark:bg-blue-900
    deviceUnselected: isDark ? "#374151" : "white",
    deviceText: isDark ? "#F9FAFB" : "#111827",

    // Error
    errorBg: isDark ? "#7F1D1D" : "#FEE2E2", // dark:bg-red-900
    errorText: isDark ? "#FCA5A5" : "#DC2626",
    errorAction: isDark ? "#FBBF24" : "#D97706",

    // Help button
    helpBg: isDark ? "rgba(96, 165, 250, 0.15)" : "rgba(59, 130, 246, 0.1)",

    // Refresh button
    refreshBg: isDark ? "#374151" : "white",
    refreshIcon: isDark ? "#93C5FD" : "#3B82F6",

    // Troubleshooting link
    troubleLink: isDark ? "#93C5FD" : "#1E3A8A",
  };

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
          backgroundColor: isSelected ? colors.deviceSelected : colors.deviceUnselected,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? "#3B82F6" : colors.borderColor,
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
              <Bluetooth size={24} color={colors.iconColor} />
            ) : (
              <Wifi size={24} color={colors.iconColor} />
            )}

            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: colors.deviceText,
                  marginBottom: 2,
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textMuted,
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
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
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
            <LogOut size={20} color={colors.textAccent} />
            <Text
              style={{
                marginLeft: 4,
                color: colors.textAccent,
                fontSize: 16,
              }}
            >
              {languageSet.logout}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowHelpModal(true)}
            style={{
              backgroundColor: colors.helpBg,
              borderRadius: 20,
              padding: 8,
            }}
          >
            <HelpCircle size={20} color={colors.iconColor} />
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
                      backgroundColor: "#3B82F6",
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
              color: colors.textPrimary,
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
              color: colors.textSecondary,
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
            backgroundColor: colors.toggleBg,
            borderRadius: 12,
            padding: 4,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.borderColor,
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
                  deviceType === "bluetooth" ? "#FFFFFF" : colors.textAccent
                }
              />
              <Text
                style={{
                  marginLeft: 8,
                  color: deviceType === "bluetooth" ? "#FFFFFF" : colors.textAccent,
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
                color={deviceType === "wifi" ? "#FFFFFF" : colors.textAccent}
              />
              <Text
                style={{
                  marginLeft: 8,
                  color: deviceType === "wifi" ? "#FFFFFF" : colors.textAccent,
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
              backgroundColor: colors.errorBg,
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: colors.errorText,
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
                  color: colors.errorAction,
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
                backgroundColor: colors.cardBg,
                borderRadius: 12,
                padding: 24,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.borderColor,
              }}
            >
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text
                style={{
                  marginTop: 12,
                  color: colors.textMuted,
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
                backgroundColor: colors.cardBg,
                borderRadius: 12,
                padding: 24,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.borderColor,
              }}
            >
              <Text
                style={{
                  color: colors.textMuted,
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

        {/* Bottom Action Buttons */}
        {discoveredDevices.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginTop: 16,
              marginBottom: 12,
            }}
          >
            <TouchableOpacity
              onPress={scanForDevices}
              disabled={isScanning}
              style={{
                flex: 1,
                backgroundColor: colors.refreshBg,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.borderColor,
              }}
            >
              <RefreshCw size={18} color={colors.refreshIcon} />
            </TouchableOpacity>

            <View
              style={{
                flex: 2,
                borderRadius: 12,
                overflow: "hidden",
                opacity: !selectedDevice || isConnecting ? 0.5 : 1,
              }}
            >
              <TouchableOpacity
                onPress={connectToDevice}
                disabled={!selectedDevice || isConnecting}
                activeOpacity={0.8}
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

        {/* Bottom Banner */}
        <Pressable onPress={() => setShowHelpModal(true)}>
          <View style={{ paddingVertical: 20, alignItems: "center" }}>
            <Text
              style={{
                textAlign: "center",
                color: colors.textSecondary,
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              {languageSet.troubleText}{" "}
              <Text
                style={{
                  fontWeight: "600",
                  color: colors.troubleLink,
                  textDecorationLine: "underline",
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
