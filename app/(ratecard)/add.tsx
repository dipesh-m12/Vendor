import useThemeStore from "@/store/themeStore";
import { durTranslations, translations } from "@/translations/ratecards/add";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  Baby,
  ChevronDown,
  Info,
  Mars,
  Plus,
  Trash2,
  Users,
  Venus
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Service {
  id: number;
  name: string;
  gender: "Male" | "Female" | "Child";
  hours: number;
  minutes: number;
  rate: string;
}

const SERVICE_NAMES = [
  "Haircut",
  "Facial",
  "Manicure",
  "Pedicure",
  "Hair Coloring",
  "Hair Treatment",
  "Massage",
  "Waxing",
  "Threading",
  "Bleaching",
  "Beard Trim",
  "Shaving",
  "Hair Spa",
  "Nail Art",
  "Makeup",
];

const HOUR_OPTIONS = [0, 1, 2, 3, 4, 5];
const MINUTE_OPTIONS = [0, 15, 30, 45];

export default function AddServiceScreen() {
  const router = useRouter();
  const { isDark, language } = useThemeStore();

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
    serviceCardBg: isDark ? "#4B5563" : "#F9FAFB", // dark:bg-gray-600

    // Input fields
    inputBg: isDark ? "#374151" : "white", // dark:bg-gray-700
    inputBorder: isDark ? "#4B5563" : "#E5E7EB", // dark:border-gray-600
    inputText: isDark ? "#F9FAFB" : "#111827", // dark:text-white
    placeholderColor: isDark ? "#9CA3AF" : "#6B7280",

    // Borders
    borderColor: isDark ? "#4B5563" : "#E5E7EB", // dark:border-gray-600
    serviceBorder: isDark ? "#6B7280" : "#E5E7EB", // dark:border-gray-500

    // Error backgrounds
    errorBg: isDark ? "#7F1D1D" : "#FEF2F2", // dark:bg-red-900
    errorBorder: isDark ? "#DC2626" : "#FECACA",

    // Delete button
    deleteBg: isDark ? "#7F1D1D" : "#FEF2F2",

    // Gender button selected
    genderSelected: "#3B82F6",
    genderUnselected: isDark ? "#374151" : "white",
    genderBorder: isDark ? "#4B5563" : "#E5E7EB",
    genderIcon: isDark ? "#9CA3AF" : "#6B7280",

    // Add button
    addButtonBg: isDark ? "#1E40AF" : "#EFF6FF", // dark:bg-blue-900
    addButtonText: isDark ? "white" : "#3B82F6",

    // Modal
    modalBg: isDark ? "#374151" : "white",
    modalTitle: isDark ? "#DBEAFE" : "#1E3A8A",
  };

  const [existingServices, setExistingServices] = useState<Service[]>([]);
  const [newServices, setNewServices] = useState<Service[]>([
    {
      id: Date.now(),
      name: "",
      gender: "Male",
      hours: 0,
      minutes: 15,
      rate: "",
    },
  ]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showServiceDropdown, setShowServiceDropdown] = useState<number | null>(null);
  const [showHoursDropdown, setShowHoursDropdown] = useState<number | null>(null);
  const [showMinutesDropdown, setShowMinutesDropdown] = useState<number | null>(null);

  const languageSet = translations[language];
  const durLanguageSet = durTranslations[language];

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

  const handleInputChange = <K extends keyof Service>(
    index: number,
    field: K,
    value: Service[K]
  ) => {
    const updatedServices = [...newServices];
    updatedServices[index][field] = value;
    setNewServices(updatedServices);

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
      } else if (Number(service.rate) > 100000) {
        errors[`${index}-rate`] = "Rate cannot exceed ₹1,00,000";
        isValid = false;
      }

      const isDuplicate = existingServices.some(
        (existing) =>
          existing.name.toLowerCase() === service.name.toLowerCase() &&
          existing.gender === service.gender
      );

      if (isDuplicate) {
        errors[`${index}-name`] = `Service already exists for ${service.gender}`;
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
        gender: "Child",
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
          gender: "Male",
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
        `${servicesToSave.length} service${servicesToSave.length !== 1 ? "s" : ""
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

  const renderGenderIcon = (gender: string) => {
    switch (gender) {
      case "Male":
        return <Mars size={18} color="white" />;
      case "Female":
        return <Venus size={18} color="white" />;
      case "Child":
        return <Baby size={18} color="white" />;
      default:
        return <Users size={18} color="white" />;
    }
  };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
      start={[0, 0]}
      end={[0, 1]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
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
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 12 }}
          >
            <ArrowLeft size={20} color={colors.iconColor} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: colors.textPrimary,
            }}
          >
            {languageSet.addServices}
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Info Card */}
          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 12,
              padding: 8,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: colors.borderColor,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Info size={16} color={colors.iconColor} style={{ marginRight: 8 }} />
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 14,
                }}
              >
                You&apos;ve added {existingServices.length} services. You can add{" "}
                {remainingServices} more.
              </Text>
            </View>

            {formErrors.general && (
              <View
                style={{
                  backgroundColor: colors.errorBg,
                  borderColor: colors.errorBorder,
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
                  backgroundColor: colors.serviceCardBg,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: colors.serviceBorder,
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
                      color: colors.textPrimary,
                    }}
                  >
                    Service {index + 1}
                  </Text>
                  {newServices.length > 1 && (
                    <TouchableOpacity
                      onPress={() => handleRemoveService(index)}
                      style={{
                        backgroundColor: colors.deleteBg,
                        padding: 8,
                        borderRadius: 8,
                      }}
                    >
                      <Trash2 size={16} color="#DC2626" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Service Name with Autocomplete */}
                <View style={{ marginBottom: 16, zIndex: 1000 - index }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: colors.textSecondary,
                      marginBottom: 4,
                    }}
                  >
                    {languageSet.serviceNameLabel}
                  </Text>
                  <View style={{ position: "relative" }}>
                    <TextInput
                      value={service.name}
                      onChangeText={(text) => {
                        handleInputChange(index, "name", text);
                        if (text.trim()) {
                          setShowServiceDropdown(index);
                        } else {
                          setShowServiceDropdown(null);
                        }
                      }}
                      onFocus={() => {
                        if (service.name.trim()) {
                          setShowServiceDropdown(index);
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowServiceDropdown(null), 200);
                      }}
                      placeholder="Type or select service name"
                      placeholderTextColor={colors.placeholderColor}
                      style={{
                        backgroundColor: colors.inputBg,
                        borderColor: formErrors[`${index}-name`]
                          ? "#DC2626"
                          : colors.inputBorder,
                        borderWidth: 1,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 12,
                        fontSize: 16,
                        color: colors.inputText,
                      }}
                    />

                    {/* Filtered Suggestions Dropdown */}
                    {showServiceDropdown === index && (
                      <View
                        style={{
                          backgroundColor: colors.inputBg,
                          borderRadius: 8,
                          marginTop: 4,
                          borderWidth: 1,
                          borderColor: colors.inputBorder,
                          maxHeight: 200,
                          position: "absolute",
                          top: 50,
                          left: 0,
                          right: 0,
                          zIndex: 9999,
                          elevation: 5,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                        }}
                      >
                        <ScrollView
                          keyboardShouldPersistTaps="always"
                          nestedScrollEnabled={true}
                        >
                          {SERVICE_NAMES.filter((serviceName) =>
                            serviceName.toLowerCase().includes(service.name.toLowerCase())
                          ).length > 0 ? (
                            SERVICE_NAMES.filter((serviceName) =>
                              serviceName.toLowerCase().includes(service.name.toLowerCase())
                            ).map((serviceName) => (
                              <TouchableOpacity
                                key={serviceName}
                                onPress={() => {
                                  handleInputChange(index, "name", serviceName);
                                  setShowServiceDropdown(null);
                                }}
                                style={{
                                  paddingVertical: 12,
                                  paddingHorizontal: 16,
                                  borderBottomWidth: 1,
                                  borderBottomColor: colors.borderColor,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 16,
                                    color: colors.inputText,
                                  }}
                                >
                                  {serviceName}
                                </Text>
                              </TouchableOpacity>
                            ))
                          ) : (
                            <View
                              style={{
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: colors.textMuted,
                                  fontStyle: "italic",
                                }}
                              >
                                No suggestions found. Keep typing to add custom service.
                              </Text>
                            </View>
                          )}
                        </ScrollView>
                      </View>
                    )}
                  </View>

                  {formErrors[`${index}-name`] && (
                    <Text style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>
                      {formErrors[`${index}-name`]}
                    </Text>
                  )}
                </View>

                {/* Gender with Icons */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: colors.textSecondary,
                      marginBottom: 8,
                    }}
                  >
                    {languageSet.genderLabel}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {[
                      { value: "Male", icon: Mars },
                      { value: "Female", icon: Venus },
                      { value: "Child", icon: Baby },
                    ].map(({ value, icon: Icon }) => (
                      <TouchableOpacity
                        key={value}
                        onPress={() =>
                          handleInputChange(index, "gender", value as any)
                        }
                        style={{
                          flex: 1,
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          backgroundColor:
                            service.gender === value
                              ? colors.genderSelected
                              : colors.genderUnselected,
                          borderColor:
                            service.gender === value
                              ? colors.genderSelected
                              : colors.genderBorder,
                          borderWidth: 1,
                          borderRadius: 8,
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "center",
                          gap: 6,
                        }}
                      >
                        <Icon
                          size={18}
                          color={
                            service.gender === value
                              ? "white"
                              : colors.genderIcon
                          }
                        />
                        <Text
                          style={{
                            color:
                              service.gender === value
                                ? "white"
                                : colors.inputText,
                            fontSize: 14,
                            fontWeight: service.gender === value ? "600" : "400",
                          }}
                        >
                          {value}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Duration with Dropdowns */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: colors.textSecondary,
                      marginBottom: 8,
                    }}
                  >
                    {durLanguageSet.durationLabel}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {/* Hours Dropdown */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.textMuted,
                          marginBottom: 4,
                        }}
                      >
                        {languageSet.hoursLabel}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setShowHoursDropdown(index)}
                        style={{
                          backgroundColor: colors.inputBg,
                          borderColor: colors.inputBorder,
                          borderWidth: 1,
                          borderRadius: 8,
                          paddingHorizontal: 12,
                          paddingVertical: 12,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            color: colors.inputText,
                          }}
                        >
                          {service.hours}
                        </Text>
                        <ChevronDown size={16} color={colors.textMuted} />
                      </TouchableOpacity>
                    </View>

                    {/* Minutes Dropdown */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.textMuted,
                          marginBottom: 4,
                        }}
                      >
                        {languageSet.minutesLabel}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setShowMinutesDropdown(index)}
                        style={{
                          backgroundColor: colors.inputBg,
                          borderColor: colors.inputBorder,
                          borderWidth: 1,
                          borderRadius: 8,
                          paddingHorizontal: 12,
                          paddingVertical: 12,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            color: colors.inputText,
                          }}
                        >
                          {service.minutes}
                        </Text>
                        <ChevronDown size={16} color={colors.textMuted} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Hours Dropdown Modal */}
                <Modal
                  visible={showHoursDropdown === index}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setShowHoursDropdown(null)}
                >
                  <Pressable
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => setShowHoursDropdown(null)}
                  >
                    <View
                      style={{
                        backgroundColor: colors.modalBg,
                        borderRadius: 12,
                        padding: 16,
                        width: "50%",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: colors.modalTitle,
                          marginBottom: 16,
                        }}
                      >
                        Select Hours
                      </Text>
                      {HOUR_OPTIONS.map((hour) => (
                        <TouchableOpacity
                          key={hour}
                          onPress={() => {
                            handleInputChange(index, "hours", hour);
                            setShowHoursDropdown(null);
                          }}
                          style={{
                            paddingVertical: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: colors.borderColor,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              color: colors.inputText,
                              textAlign: "center",
                            }}
                          >
                            {hour} {hour === 1 ? "hour" : "hours"}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </Pressable>
                </Modal>

                {/* Minutes Dropdown Modal */}
                <Modal
                  visible={showMinutesDropdown === index}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setShowMinutesDropdown(null)}
                >
                  <Pressable
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => setShowMinutesDropdown(null)}
                  >
                    <View
                      style={{
                        backgroundColor: colors.modalBg,
                        borderRadius: 12,
                        padding: 16,
                        width: "50%",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: colors.modalTitle,
                          marginBottom: 16,
                        }}
                      >
                        Select Minutes
                      </Text>
                      {MINUTE_OPTIONS.map((minute) => (
                        <TouchableOpacity
                          key={minute}
                          onPress={() => {
                            handleInputChange(index, "minutes", minute);
                            setShowMinutesDropdown(null);
                          }}
                          style={{
                            paddingVertical: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: colors.borderColor,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              color: colors.inputText,
                              textAlign: "center",
                            }}
                          >
                            {minute} min
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </Pressable>
                </Modal>

                {/* Rate with Limit */}
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: colors.textSecondary,
                      marginBottom: 4,
                    }}
                  >
                    {languageSet.rateLabel}
                  </Text>
                  <TextInput
                    value={service.rate}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, "");
                      if (Number(numericValue) <= 100000) {
                        handleInputChange(index, "rate", numericValue);
                      }
                    }}
                    placeholder="e.g., 500 (Max: ₹1,00,000)"
                    placeholderTextColor={colors.placeholderColor}
                    keyboardType="numeric"
                    maxLength={6}
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: formErrors[`${index}-rate`]
                        ? "#DC2626"
                        : colors.inputBorder,
                      borderWidth: 1,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      fontSize: 16,
                      color: colors.inputText,
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
                  backgroundColor: colors.addButtonBg,
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
                  color={colors.addButtonText}
                  style={{ marginRight: 8 }}
                />

                <Text
                  style={{
                    color: colors.addButtonText,
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
                colors={["#4F7DF7", "#2563EB"]}
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
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
