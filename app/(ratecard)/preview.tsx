import useThemeStore from "@/store/themeStore";
import { translations } from "@/translations/ratecards/prev";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Camera,
  Clock,
  Edit,
  Plus,
  Trash2,
  User
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Service {
  id: number;
  name: string;
  gender: "Male" | "Female" | "Child";
  hours: number;
  minutes: number;
  rate: number;
}

export default function RateCardPreviewScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, setLanguage, language } = useThemeStore();
  const languageSet = translations[language];

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
    headerBg: isDark ? "#374151" : "white", // dark:bg-gray-700
    serviceCardBg: isDark ? "#4B5563" : "#F8FAFC", // dark:bg-gray-600

    // Borders
    borderColor: isDark ? "#4B5563" : "#E5E7EB", // dark:border-gray-600
    serviceBorder: isDark ? "#6B7280" : "#E2E8F0", // dark:border-gray-500

    // Action buttons
    editButtonBg: isDark ? "#1E40AF" : "#EFF6FF", // dark:bg-blue-900
    editButtonIcon: isDark ? "#93C5FD" : "#3B82F6", // dark:text-blue-300
    deleteButtonBg: isDark ? "#7F1D1D" : "#FEF2F2", // dark:bg-red-900

    // Empty state
    emptyIconBg: isDark ? "#1E40AF" : "#EFF6FF",
  };

  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    loadServices();

    const unsubscribe = router.addListener?.("focus", () => {
      loadServices();
    });

    return unsubscribe;
  }, []);

  const loadServices = async () => {
    try {
      const savedServices = await AsyncStorage.getItem("rateCardServices");
      if (savedServices) {
        const parsedServices = JSON.parse(savedServices);
        setServices(parsedServices);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Error loading services:", error);
      setServices([]);
    }
  };

  const handleEditService = (serviceId: number) => {
    router.push(`/(ratecard)/edit/${serviceId}` as any);
  };

  const confirmDeleteService = (service: Service) => {
    Alert.alert(
      languageSet.deleteService,
      (languageSet.confirmDeleteService as string).replace(
        `"{serviceName}"`,
        service.name
      ),
      [
        { text: languageSet.cancel, style: "cancel" },
        {
          text: languageSet.delete,
          style: "destructive",
          onPress: () => handleDeleteService(service),
        },
      ]
    );
  };

  const handleDeleteService = async (serviceToDelete: Service) => {
    try {
      const newServices = services.filter((s) => s.id !== serviceToDelete.id);
      setServices(newServices);

      await AsyncStorage.setItem(
        "rateCardServices",
        JSON.stringify(newServices)
      );

      Alert.alert("Success", `${serviceToDelete.name} has been deleted`);
    } catch (error) {
      console.error("Error deleting service:", error);
      Alert.alert("Error", "Failed to delete service");
    }
  };

  const handleAddNewService = () => {
    router.push("/(ratecard)/add");
  };

  const handleBack = () => {
    router.back();
  };

  const formatTime = (hours: number, minutes: number) => {
    let timeString = "";
    if (hours > 0) {
      timeString += `${hours} hr${hours > 1 ? "s" : ""} `;
    }
    if (minutes > 0) {
      timeString += `${minutes} min`;
    }
    return timeString.trim() || "0 min";
  };

  const handleCameraAction = () => {
    // Camera action implementation
  };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
      start={[0, 0]}
      end={[0, 1]}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View
        style={{
          backgroundColor: colors.headerBg,
          paddingHorizontal: 16,
          paddingTop: Platform.OS === "ios" ? 60 : 40,
          paddingBottom: 16,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: colors.borderColor,
        }}
      >
        <TouchableOpacity onPress={handleBack} style={{ marginRight: 12 }}>
          <ArrowLeft size={20} color={colors.iconColor} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: colors.textPrimary,
          }}
        >
          {languageSet.yourRateCard}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
      >
        {services.length > 0 ? (
          <>
            {/* Services Info Card */}
            <View
              style={{
                backgroundColor: colors.cardBg,
                borderRadius: 12,
                padding: 13,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: colors.borderColor,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: colors.textPrimary,
                  }}
                >
                  {languageSet.yourServices}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textAccent,
                  }}
                >
                  {services.length} / 20
                </Text>
              </View>

              {/* Services List */}
              <View style={{ gap: 12 }}>
                {services.map((service) => (
                  <View
                    key={service.id}
                    style={{
                      backgroundColor: colors.serviceCardBg,
                      borderRadius: 12,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: colors.serviceBorder,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        {/* Service Name */}
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: colors.textPrimary,
                            marginBottom: 8,
                          }}
                        >
                          {service.name}
                        </Text>

                        {/* Service Details */}
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 16,
                          }}
                        >
                          {/* Duration */}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Clock
                              size={16}
                              color={colors.iconColor}
                              style={{ marginRight: 4 }}
                            />
                            <Text
                              style={{
                                fontSize: 14,
                                color: colors.textSecondary,
                              }}
                            >
                              {formatTime(service.hours, service.minutes)}
                            </Text>
                          </View>

                          {/* Gender */}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <User
                              size={16}
                              color={colors.iconColor}
                              style={{ marginRight: 4 }}
                            />
                            <Text
                              style={{
                                fontSize: 14,
                                color: colors.textSecondary,
                              }}
                            >
                              {service.gender}
                            </Text>
                          </View>

                          {/* Rate */}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                color: colors.iconColor,
                                marginRight: 2,
                              }}
                            >
                              ₹
                            </Text>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: colors.textPrimary,
                              }}
                            >
                              {service.rate}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Action Buttons */}
                      <View style={{ flexDirection: "row", gap: 14 }}>
                        <TouchableOpacity
                          onPress={() => handleEditService(service.id)}
                          style={{
                            backgroundColor: colors.editButtonBg,
                            padding: 8,
                            borderRadius: 8,
                          }}
                        >
                          <Edit
                            size={16}
                            color={colors.editButtonIcon}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => confirmDeleteService(service)}
                          style={{
                            backgroundColor: colors.deleteButtonBg,
                            padding: 8,
                            borderRadius: 8,
                          }}
                        >
                          <Trash2 size={16} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          /* Empty State */
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 50,
            }}
          >
            <View
              style={{
                backgroundColor: colors.cardBg,
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.borderColor,
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: colors.emptyIconBg,
                  borderRadius: 32,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text style={{ fontSize: 24, color: colors.iconColor }}>₹</Text>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: colors.textPrimary,
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                {languageSet.noServicesAdded}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                {languageSet.addFirstService}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textMuted,
                  textAlign: "center",
                }}
              >
                Services Added: 0 / 20
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Buttons */}
      <View
        style={{
          position: "absolute",
          right: 16,
          bottom: 130,
          zIndex: 1000,
        }}
      >
        {/* Camera Button */}
        <TouchableOpacity
          onPress={handleCameraAction}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.4 : 0.3,
            shadowRadius: 8,
            elevation: 8,
            marginBottom: 16,
          }}
        >
          <LinearGradient
            colors={["#4F7DF7", "#2563EB"]}
            start={[0, 0]}
            end={[1, 0]}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Camera size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Add Button */}
        <TouchableOpacity
          onPress={handleAddNewService}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.4 : 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <LinearGradient
            colors={["#4F7DF7", "#2563EB"]}
            start={[0, 0]}
            end={[1, 0]}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Plus size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
