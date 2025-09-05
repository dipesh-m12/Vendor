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
import { useRouter } from "expo-router";
import useThemeStore from "@/store/themeStore";
import {
  ArrowLeft,
  Trash2,
  Plus,
  AlertCircle,
  Info,
  Clock,
  User,
  DollarSign,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations, durTranslations } from "@/translations/ratecards/add";
interface Service {
  id: number;
  name: string;
  gender: "All" | "Male" | "Female";
  hours: number;
  minutes: number;
  rate: string;
}

export default function AddServiceScreen() {
  const router = useRouter();
  const { isDark, language } = useThemeStore();
  const [existingServices, setExistingServices] = useState<Service[]>([]);
  const [newServices, setNewServices] = useState<Service[]>([
    {
      id: Date.now(),
      name: "",
      gender: "All",
      hours: 0,
      minutes: 15,
      rate: "",
    },
  ]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const languageSet = translations[language];
  const durLanguageSet = durTranslations[language];

  // Load existing services
  useEffect(() => {
    loadExistingServices();
  }, []);

  const loadExistingServices = async () => {
    try {
      const savedServices = await AsyncStorage.getItem("rateCardServices");
      if (savedServices) {
        const parsedServices = JSON.parse(savedServices);
        setExistingServices(parsedServices);
      }
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  const handleInputChange = (
    index: number,
    field: keyof Service,
    value: any
  ) => {
    const updatedServices = [...newServices];
    updatedServices[index][field] = value;
    setNewServices(updatedServices);

    // Clear error for this field
    const errorKey = `${index}-${field}`;
    if (formErrors[errorKey]) {
      const updatedErrors = { ...formErrors };
      delete updatedErrors[errorKey];
      setFormErrors(updatedErrors);
    }
  };

  const validateServices = () => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    newServices.forEach((service, index) => {
      if (!service.name && !service.rate) return;

      if (!service.name.trim()) {
        errors[`${index}-name`] = "Service name is required";
        isValid = false;
      } else if (service.name.length < 3) {
        errors[`${index}-name`] = "Name must be at least 3 characters";
        isValid = false;
      }

      if (!service.rate) {
        errors[`${index}-rate`] = "Rate is required";
        isValid = false;
      } else if (isNaN(Number(service.rate)) || Number(service.rate) <= 0) {
        errors[`${index}-rate`] = "Rate must be a positive number";
        isValid = false;
      }

      // Check for duplicates
      const isDuplicate = existingServices.some(
        (existing) =>
          existing.name.toLowerCase() === service.name.toLowerCase() &&
          existing.gender === service.gender
      );

      if (isDuplicate) {
        errors[
          `${index}-name`
        ] = `Service already exists for ${service.gender}`;
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleAddService = () => {
    if (newServices.length >= 5) {
      Alert.alert(languageSet.maxLimitReached, languageSet.maxLimitMessage, [
        { text: languageSet.ok },
      ]);
      return;
    }

    setNewServices([
      ...newServices,
      {
        id: Date.now(),
        name: "",
        gender: "All",
        hours: 0,
        minutes: 15,
        rate: "",
      },
    ]);
  };

  const handleRemoveService = (index: number) => {
    if (newServices.length === 1) {
      setNewServices([
        {
          id: Date.now(),
          name: "",
          gender: "All",
          hours: 0,
          minutes: 15,
          rate: "",
        },
      ]);
      return;
    }

    const updatedServices = newServices.filter((_, i) => i !== index);
    setNewServices(updatedServices);
  };

  const handleSaveServices = async () => {
    const servicesToSave = newServices.filter(
      (service) => service.name.trim() !== "" && service.rate !== ""
    );

    if (servicesToSave.length === 0) {
      setFormErrors({ general: languageSet.generalErrorEmpty });
      return;
    }

    if (!validateServices()) return;

    if (existingServices.length + servicesToSave.length > 20) {
      setFormErrors({
        general: `You can only have up to 20 services. You currently have ${existingServices.length}.`,
      });
      return;
    }

    try {
      const servicesWithIds = servicesToSave.map((service) => ({
        ...service,
        id: service.id || Date.now() + Math.floor(Math.random() * 1000),
        rate: Number(service.rate),
      }));

      const updatedServices = [...existingServices, ...servicesWithIds];
      await AsyncStorage.setItem(
        "rateCardServices",
        JSON.stringify(updatedServices)
      );

      Alert.alert(
        languageSet.success,
        `${servicesToSave.length} service${
          servicesToSave.length !== 1 ? "s" : ""
        } added successfully`,
        [
          {
            text: languageSet.ok,
            onPress: () => router.replace("/(ratecard)/preview"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(languageSet.error, languageSet.failedToSave);
    }
  };

  const remainingServices = 20 - existingServices.length;

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
          {languageSet.addServices}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        {/* Info Card */}
        <View
          style={{
            backgroundColor: isDark ? "#374151" : "white",
            borderRadius: 12,
            padding: 8,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: isDark ? "#4B5563" : "#E5E7EB",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Info size={16} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text
              style={{
                color: isDark ? "#9CA3AF" : "#6B7280",
                fontSize: 14,
              }}
            >
              You've added {existingServices.length} services. You can add{" "}
              {remainingServices} more.
            </Text>
          </View>

          {formErrors.general && (
            <View
              style={{
                backgroundColor: isDark ? "#7F1D1D" : "#FEF2F2",
                borderColor: isDark ? "#DC2626" : "#FECACA",
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <AlertCircle
                size={16}
                color="#DC2626"
                style={{ marginRight: 8, marginTop: 2 }}
              />
              <Text style={{ color: "#DC2626", fontSize: 14, flex: 1 }}>
                {formErrors.general}
              </Text>
            </View>
          )}

          {newServices.map((service, index) => (
            <View
              key={service.id}
              style={{
                backgroundColor: isDark ? "#4B5563" : "#F9FAFB",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: isDark ? "#6B7280" : "#E5E7EB",
              }}
            >
              {/* Service Header */}
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
                    fontSize: 16,
                    fontWeight: "600",
                    color: isDark ? "#F8FAFC" : "#1E3A8A",
                  }}
                >
                  Service {index + 1}
                </Text>
                {newServices.length > 1 && (
                  <TouchableOpacity
                    onPress={() => handleRemoveService(index)}
                    style={{
                      backgroundColor: isDark ? "#7F1D1D" : "#FEF2F2",
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    <Trash2 size={16} color="#DC2626" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Service Name */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: isDark ? "#A5B4FC" : "#3B82F6",
                    marginBottom: 4,
                  }}
                >
                  {languageSet.serviceNameLabel}
                </Text>
                <TextInput
                  value={service.name}
                  onChangeText={(text) =>
                    handleInputChange(index, "name", text)
                  }
                  placeholder="e.g., Haircut, Manicure, Facial"
                  placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                  style={{
                    backgroundColor: isDark ? "#374151" : "white",
                    borderColor: formErrors[`${index}-name`]
                      ? "#DC2626"
                      : isDark
                      ? "#4B5563"
                      : "#E5E7EB",
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: isDark ? "#F9FAFB" : "#111827",
                  }}
                />
                {formErrors[`${index}-name`] && (
                  <Text
                    style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}
                  >
                    {formErrors[`${index}-name`]}
                  </Text>
                )}
              </View>

              {/* Gender */}
              <View style={{ marginBottom: 16 }}>
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
                      onPress={() =>
                        handleInputChange(index, "gender", gender as any)
                      }
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        backgroundColor:
                          service.gender === gender
                            ? "#3B82F6"
                            : isDark
                            ? "#374151"
                            : "white",
                        borderColor:
                          service.gender === gender
                            ? "#3B82F6"
                            : isDark
                            ? "#4B5563"
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

              {/* Duration */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: isDark ? "#A5B4FC" : "#3B82F6",
                    marginBottom: 8,
                  }}
                >
                  {durLanguageSet.durationLabel}
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
                        handleInputChange(index, "hours", parseInt(text) || 0)
                      }
                      keyboardType="numeric"
                      style={{
                        backgroundColor: isDark ? "#374151" : "white",
                        borderColor: isDark ? "#4B5563" : "#E5E7EB",
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
                        handleInputChange(index, "minutes", parseInt(text) || 0)
                      }
                      keyboardType="numeric"
                      style={{
                        backgroundColor: isDark ? "#374151" : "white",
                        borderColor: isDark ? "#4B5563" : "#E5E7EB",
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

              {/* Rate */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: isDark ? "#A5B4FC" : "#3B82F6",
                    marginBottom: 4,
                  }}
                >
                  {languageSet.rateLabel}
                </Text>
                <TextInput
                  value={service.rate}
                  onChangeText={(text) =>
                    handleInputChange(index, "rate", text)
                  }
                  placeholder="e.g., 500"
                  placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: isDark ? "#374151" : "white",
                    borderColor: formErrors[`${index}-rate`]
                      ? "#DC2626"
                      : isDark
                      ? "#4B5563"
                      : "#E5E7EB",
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: isDark ? "#F9FAFB" : "#111827",
                  }}
                />
                {formErrors[`${index}-rate`] && (
                  <Text
                    style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}
                  >
                    {formErrors[`${index}-rate`]}
                  </Text>
                )}
              </View>
            </View>
          ))}

          {/* Add Another Service */}
          {newServices.length < 5 && (
            <TouchableOpacity
              onPress={handleAddService}
              style={{
                backgroundColor: isDark ? "#1E40AF" : "#EFF6FF",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Plus
                size={18}
                color={isDark ? "white" : "#3B82F6"}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: isDark ? "white" : "#3B82F6",
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                {languageSet.addAnotherService}
              </Text>
            </TouchableOpacity>
          )}

          {/* Save Button */}
          <TouchableOpacity onPress={handleSaveServices}>
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
                {languageSet.saveServices}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
