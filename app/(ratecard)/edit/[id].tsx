import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import useThemeStore from "@/store/themeStore";
import { ArrowLeft, Info, Check } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations } from "@/translations/ratecards/edit";
interface Service {
  id: number;
  name: string;
  gender: "All" | "Male" | "Female";
  hours: number;
  minutes: number;
  rate: string | number;
}

export default function EditServiceScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isDark, language } = useThemeStore();
  const languageSet = translations[language];

  const [service, setService] = useState<Service>({
    id: 0,
    name: "",
    gender: "All",
    hours: 0,
    minutes: 15,
    rate: "",
  });

  const [existingServices, setExistingServices] = useState<Service[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Load service data
  useEffect(() => {
    loadServiceData();
  }, [id]);

  const loadServiceData = async () => {
    try {
      const savedServices = await AsyncStorage.getItem("rateCardServices");
      if (savedServices) {
        const parsedServices = JSON.parse(savedServices);
        setExistingServices(parsedServices);

        const serviceToEdit = parsedServices.find(
          (s: Service) => s.id.toString() === id
        );
        if (serviceToEdit) {
          setService({
            ...serviceToEdit,
            rate: serviceToEdit.rate.toString(),
          });
        } else {
          Alert.alert(languageSet.error, languageSet.serviceNotFound, [
            { text: languageSet.ok, onPress: () => router.back() },
          ]);
        }
      } else {
        Alert.alert(languageSet.error, languageSet.noServicesFound, [
          { text: languageSet.ok, onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error("Error loading service data:", error);
      Alert.alert(languageSet.error, languageSet.failedToLoad, [
        { text: languageSet.ok, onPress: () => router.back() },
      ]);
    }
  };

  const handleInputChange = (field: keyof Service, value: any) => {
    setService({
      ...service,
      [field]: value,
    });

    // Clear error for this field
    if (formErrors[field]) {
      const updatedErrors = { ...formErrors };
      delete updatedErrors[field];
      setFormErrors(updatedErrors);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    if (!service.name.trim()) {
      errors.name = "Service name is required";
      isValid = false;
    } else if (service.name.length < 3) {
      errors.name = "Service name must be at least 3 characters";
      isValid = false;
    }

    if (!service.rate) {
      errors.rate = "Rate is required";
      isValid = false;
    } else if (isNaN(Number(service.rate)) || Number(service.rate) <= 0) {
      errors.rate = "Rate must be a positive number";
      isValid = false;
    }

    // Check for duplicate service names (excluding the current service)
    const isDuplicate = existingServices.some(
      (existingService) =>
        existingService.id !== service.id &&
        existingService.name.toLowerCase() === service.name.toLowerCase() &&
        existingService.gender === service.gender
    );

    if (isDuplicate) {
      errors.name = `Service already exists for ${service.gender}`;
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSaveService = async () => {
    if (!validateForm()) return;

    try {
      // Update the service in the list
      const updatedServices = existingServices.map((s) =>
        s.id === service.id
          ? {
              ...service,
              rate: Number(service.rate),
            }
          : s
      );

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        "rateCardServices",
        JSON.stringify(updatedServices)
      );

      Alert.alert(languageSet.success, languageSet.serviceUpdatedSuccess, [
        { text: languageSet.ok, onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error saving service:", error);
      Alert.alert(languageSet.error, languageSet.failedToLoad);
    }
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 12 }}
        >
          <ArrowLeft size={20} color="#3B82F6" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: isDark ? "#F8FAFC" : "#1E3A8A",
          }}
        >
          {languageSet.editService}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        {/* Main Card */}
        <View
          style={{
            backgroundColor: isDark ? "#374151" : "white",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: isDark ? "#4B5563" : "#E5E7EB",
          }}
        >
          {/* Info */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Info size={16} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text
              style={{
                color: isDark ? "#9CA3AF" : "#6B7280",
                fontSize: 14,
              }}
            >
              Services Added: {existingServices.length} / 20
            </Text>
          </View>

          {/* Service Name */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: isDark ? "#A5B4FC" : "#3B82F6",
                marginBottom: 8,
              }}
            >
              {languageSet.serviceNameLabel}
            </Text>
            <TextInput
              value={service.name}
              onChangeText={(text) => handleInputChange("name", text)}
              placeholder="e.g., Haircut, Manicure, Consultation"
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              style={{
                backgroundColor: isDark ? "#4B5563" : "white",
                borderColor: formErrors.name
                  ? "#DC2626"
                  : isDark
                  ? "#6B7280"
                  : "#E5E7EB",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 12,
                fontSize: 16,
                color: isDark ? "#F9FAFB" : "#111827",
              }}
            />
            {formErrors.name && (
              <Text style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>
                {formErrors.name}
              </Text>
            )}
          </View>

          {/* Gender */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: isDark ? "#A5B4FC" : "#3B82F6",
                marginBottom: 8,
              }}
            >
              {languageSet.genderLabel}
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {["All", "Male", "Female"].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  onPress={() => handleInputChange("gender", gender as any)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    backgroundColor:
                      service.gender === gender
                        ? "#3B82F6"
                        : isDark
                        ? "#4B5563"
                        : "white",
                    borderColor:
                      service.gender === gender
                        ? "#3B82F6"
                        : isDark
                        ? "#6B7280"
                        : "#E5E7EB",
                    borderWidth: 1,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color:
                        service.gender === gender
                          ? "white"
                          : isDark
                          ? "#F9FAFB"
                          : "#111827",
                      fontSize: 14,
                      fontWeight: service.gender === gender ? "600" : "400",
                    }}
                  >
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Service Duration */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: isDark ? "#A5B4FC" : "#3B82F6",
                marginBottom: 8,
              }}
            >
              {languageSet.serviceDurationLabel}
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: isDark ? "#9CA3AF" : "#6B7280",
                    marginBottom: 4,
                  }}
                >
                  {languageSet.hoursLabel}
                </Text>
                <TextInput
                  value={service.hours.toString()}
                  onChangeText={(text) =>
                    handleInputChange("hours", parseInt(text) || 0)
                  }
                  keyboardType="numeric"
                  style={{
                    backgroundColor: isDark ? "#4B5563" : "white",
                    borderColor: isDark ? "#6B7280" : "#E5E7EB",
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: isDark ? "#F9FAFB" : "#111827",
                    textAlign: "center",
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: isDark ? "#9CA3AF" : "#6B7280",
                    marginBottom: 4,
                  }}
                >
                  {languageSet.minutesLabel}
                </Text>
                <TextInput
                  value={service.minutes.toString()}
                  onChangeText={(text) =>
                    handleInputChange("minutes", parseInt(text) || 0)
                  }
                  keyboardType="numeric"
                  style={{
                    backgroundColor: isDark ? "#4B5563" : "white",
                    borderColor: isDark ? "#6B7280" : "#E5E7EB",
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: isDark ? "#F9FAFB" : "#111827",
                    textAlign: "center",
                  }}
                />
              </View>
            </View>
          </View>

          {/* Service Rate */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: isDark ? "#A5B4FC" : "#3B82F6",
                marginBottom: 8,
              }}
            >
              {languageSet.rateLabel}
            </Text>
            <TextInput
              value={service.rate.toString()}
              onChangeText={(text) => handleInputChange("rate", text)}
              placeholder="e.g., 500"
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              keyboardType="numeric"
              style={{
                backgroundColor: isDark ? "#4B5563" : "white",
                borderColor: formErrors.rate
                  ? "#DC2626"
                  : isDark
                  ? "#6B7280"
                  : "#E5E7EB",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 12,
                fontSize: 16,
                color: isDark ? "#F9FAFB" : "#111827",
              }}
            />
            {formErrors.rate && (
              <Text style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>
                {formErrors.rate}
              </Text>
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity onPress={handleSaveService}>
            <LinearGradient
              colors={isDark ? ["#6366F1", "#4338CA"] : ["#4F7DF7", "#2563EB"]}
              start={[0, 0]}
              end={[1, 0]}
              style={{
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                {languageSet.saveChanges}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
