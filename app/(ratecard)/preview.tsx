import useThemeStore from "@/store/themeStore";
import { translations } from "@/translations/ratecards/prev";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
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
  gender: "All" | "Male" | "Female";
  hours: number;
  minutes: number;
  rate: number;
}

export default function RateCardPreviewScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, setLanguage, language } = useThemeStore();
  const languageSet = translations[language];
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    loadServices();

    // Set up focus listener to reload services when screen comes into focus
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

      // Update AsyncStorage
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
    // Navigate back to dashboard or previous screen
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
          backgroundColor: isDark ? "#374151" : "white",
          paddingHorizontal: 16,
          paddingTop: Platform.OS === "ios" ? 60 : 40,
          paddingBottom: 16,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={handleBack} style={{ marginRight: 12 }}>
          <ArrowLeft size={20} color="#3B82F6" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: isDark ? "#F8FAFC" : "#1E3A8A",
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
                backgroundColor: isDark ? "#374151" : "white",
                borderRadius: 12,
                padding: 13,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: isDark ? "#4B5563" : "#E5E7EB",
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
                    color: isDark ? "#A5B4FC" : "#1E3A8A",
                  }}
                >
                  {languageSet.yourServices}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#9CA3AF" : "#3B82F6",
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
                      backgroundColor: isDark ? "#4B5563" : "#F8FAFC",
                      borderRadius: 12,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: isDark ? "#6B7280" : "#E2E8F0",
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
                            color: isDark ? "#F8FAFC" : "#1E3A8A",
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
                              color="#3B82F6"
                              style={{ marginRight: 4 }}
                            />
                            <Text
                              style={{
                                fontSize: 14,
                                color: isDark ? "#A5B4FC" : "#3B82F6",
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
                              color="#3B82F6"
                              style={{ marginRight: 4 }}
                            />
                            <Text
                              style={{
                                fontSize: 14,
                                color: isDark ? "#A5B4FC" : "#3B82F6",
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
                                color: "#3B82F6",
                                marginRight: 2,
                              }}
                            >
                              ₹
                            </Text>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: isDark ? "#F8FAFC" : "#1E3A8A",
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
                            backgroundColor: isDark ? "#1E40AF" : "#EFF6FF",
                            padding: 8,
                            borderRadius: 8,
                          }}
                        >
                          <Edit
                            size={16}
                            color={isDark ? "#93C5FD" : "#3B82F6"}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => confirmDeleteService(service)}
                          style={{
                            backgroundColor: isDark ? "#7F1D1D" : "#FEF2F2",
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
                backgroundColor: isDark ? "#374151" : "white",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                borderWidth: 1,
                borderColor: isDark ? "#4B5563" : "#E5E7EB",
                // maxWidth: 300,
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: isDark ? "#1E40AF" : "#EFF6FF",
                  borderRadius: 32,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text style={{ fontSize: 24, color: "#3B82F6" }}>₹</Text>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                {languageSet.noServicesAdded}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: isDark ? "#A5B4FC" : "#3B82F6",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                {languageSet.addFirstService}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: isDark ? "#9CA3AF" : "#6B7280",
                  textAlign: "center",
                }}
              >
                Services Added: 0 / 20
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
      {/* 
      <ThemeWidget isDark={isDark} toggleTheme={toggleTheme} />

      <LanguageWidget
        setLanguage={setLanguage}
        isDark={isDark}
        language={language}
      /> */}

      {/* Camera */}
      <View
        style={{
          position: "absolute",
          right: 16,
          bottom: 130, // You'll need to define this variable or use a specific value
          zIndex: 1000,
        }}
      >
        {/* Floating Add Button */}
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
            colors={isDark ? ["#6366F1", "#4338CA"] : ["#4F7DF7", "#2563EB"]}
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
