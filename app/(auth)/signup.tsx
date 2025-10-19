import { businessTypes, countryCodes } from "@/constants";
import useThemeStore from "@/store/themeStore";
import { selectCountryCodeTranslations } from "@/translations/selectCountryCodeTranslations";
import {
  signupTranslations,
  translations,
} from "@/translations/signupTranslations";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Armchair,
  ArrowLeft,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const PasswordStrengthIndicator = ({
  password,
  isDark,
}: {
  password: string;
  isDark: boolean;
}) => {
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength(password);
  const getStrengthInfo = (strength: number) => {
    if (strength === 0)
      return { color: isDark ? "#4B5563" : "#E5E7EB", label: "" };
    if (strength <= 2) return { color: "#EF4444", label: "Weak" };
    if (strength <= 4) return { color: "#F59E0B", label: "Medium" };
    return { color: "#10B981", label: "Strong" };
  };

  const { color, label } = getStrengthInfo(strength);

  return (
    <View style={{ marginTop: 8 }}>
      <View style={{ flexDirection: "row", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4, 5].map((index) => (
          <View
            key={index}
            style={{
              flex: 1,
              height: 4,
              backgroundColor: index <= strength ? color : isDark ? "#4B5563" : "#E5E7EB",
              borderRadius: 2,
            }}
          />
        ))}
      </View>
      {label && (
        <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280", fontSize: 12 }}>
          Password strength: {label}
        </Text>
      )}
    </View>
  );
};

// Create a combined schema that includes all fields
const signUpSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .refine((val) => /^[A-Za-z\s]+$/.test(val), "Only letters and spaces allowed"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .refine((val) => !val.includes("gamil.com"), {
      message: "Did you mean gmail.com?",
    }),
  countryCode: z.string().default("+91"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => /^\d+$/.test(val), "Only digits allowed")
    .refine((val) => val.length === 10, "Phone number must be exactly 10 digits"),
  businessName: z
    .string()
    .min(3, "Business name must be at least 3 characters")
    .refine((val) => /^[A-Za-z0-9\s]+$/.test(val), "Only alphanumeric characters and spaces allowed"),
  businessType: z.enum([
    "Retail",
    "Restaurant",
    "Healthcare",
    "Banking",
    "Government",
    "Education",
    "Others",
  ]),
  businessAddress: z
    .string()
    .min(1, "Business address is required")
    .refine((val) => /^[A-Za-z0-9\s,.:;-]+$/.test(val), "Only alphanumeric characters, commas, dots, and spaces allowed"),
  seatsNumber: z
    .number()
    .min(1, "Must have at least 1 seat")
    .max(1000, "Maximum 1000 seats allowed"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => /[A-Z]/.test(val), "Must contain at least one uppercase letter")
    .refine((val) => /[a-z]/.test(val), "Must contain at least one lowercase letter")
    .refine((val) => /[0-9]/.test(val), "Must contain at least one number")
    .refine((val) => /[^A-Za-z0-9]/.test(val), "Must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to the terms"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = {
  fullName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  businessName: string;
  businessType: "Retail" | "Restaurant" | "Healthcare" | "Banking" | "Government" | "Education" | "Others";
  businessAddress: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  seatsNumber: number | null;
};

export default function SignUpScreen() {
  const router = useRouter();
  const { isDark, language, toggleTheme, setLanguage } = useThemeStore();
  const languageSet = signupTranslations[language];
  const numseatsLanguageSet = translations[language];
  const [step, setStep] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBusinessTypePicker, setShowBusinessTypePicker] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const params = useLocalSearchParams();
  const [userType, setUserType] = useState<'owner' | 'helper'>(
    (params.userType as 'owner' | 'helper') || 'owner'
  );

  // Dark mode color palette - MATCHING all other pages
  const colors = {
    gradientStart: isDark ? "#111827" : "#F1F5F9",
    gradientMid: isDark ? "#1F2937" : "#E2E8F0",
    gradientEnd: isDark ? "#374151" : "#CBD5E1",
    textPrimary: isDark ? "#DBEAFE" : "#1E3A8A",
    textSecondary: isDark ? "#BFDBFE" : "#3B82F6",
    textAccent: isDark ? "#93C5FD" : "#3B82F6",
    textMuted: isDark ? "#9CA3AF" : "#6B7280",
    iconColor: isDark ? "#60A5FA" : "#3B82F6",
    inputBg: isDark ? "#374151" : "white",
    inputBorder: isDark ? "#4B5563" : "#E5E7EB",
    inputText: isDark ? "#F9FAFB" : "#111827",
    placeholderColor: isDark ? "#9CA3AF" : "#6B7280",
    modalBg: isDark ? "#374151" : "white",
    modalTitleText: isDark ? "#DBEAFE" : "#1E3A8A",
    modalBodyText: isDark ? "#BFDBFE" : "#1E40AF",
    stepActive: "#3B82F6",
    stepInactive: isDark ? "#4B5563" : "#E5E7EB",
    strengthBarInactive: isDark ? "#4B5563" : "#E5E7EB",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      email: "",
      countryCode: "+91",
      phoneNumber: "",
      businessName: "",
      businessType: undefined,
      businessAddress: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
      seatsNumber: 2,
    },
  });

  const password = watch("password", "");
  const emailValue = watch("email", "");
  const fullNameValue = watch("fullName", "");
  const phoneNumberValue = watch("phoneNumber", "");
  const businessNameValue = watch("businessName", "");
  const businessTypeValue = watch("businessType");
  const businessAddressValue = watch("businessAddress", "");
  const seatsNumberValue = watch("seatsNumber");

  const validateStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    if (step === 1) {
      fieldsToValidate = ['fullName', 'email', 'countryCode', 'phoneNumber'];
    } else if (step === 2) {
      fieldsToValidate = ['businessName', 'businessType', 'businessAddress', 'seatsNumber'];
    } else if (step === 3) {
      fieldsToValidate = ['password', 'confirmPassword', 'agreeToTerms'];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleSubmit(onSubmit)();
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting signup data:", data);
      router.push({
        pathname: "/connect-device",
        params: { userType: userType },
      } as any);
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission denied...");
        setIsDetectingLocation(false);
        return;
      }
      setShowLocationModal(false);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      const addressString = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
      setValue("businessAddress", addressString);
      clearErrors("businessAddress");
    } catch (error) {
      console.error("Location error:", error);
      Alert.alert("Error", "Could not detect your location...");
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const renderStepIndicator = () => (
    <View
      style={{
        marginBottom: 0,
        marginTop: 100,
        paddingHorizontal: 8,
        width: "100%",
      }}
    >
      <View style={{ flexDirection: "row", gap: 4, marginBottom: 8 }}>
        {[1, 2, 3].map((stepNum) => (
          <View
            key={stepNum}
            style={{
              flex: 1,
              height: 4,
              backgroundColor: step >= stepNum ? colors.stepActive : colors.stepInactive,
              borderRadius: 2,
            }}
          />
        ))}
      </View>
      <Text style={{ color: colors.stepText, fontSize: 14 }}>
        {languageSet[`step${step}`]}
      </Text>
    </View>
  );

  const renderStep1 = () => (
    <>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: colors.textPrimary,
          marginBottom: 8,
        }}
      >
        {languageSet.createYourAccount}
      </Text>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 16,
          marginBottom: 32,
        }}
      >
        {languageSet.letsGetStarted}
      </Text>

      {/* Full Name Input */}
      <View style={{ width: "100%", marginBottom: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.inputBg,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        >
          <User size={20} color={colors.iconColor} />
          <Controller
            control={control}
            name="fullName"
            rules={{
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: colors.inputText,
                }}
                placeholder={languageSet.fullName}
                placeholderTextColor={colors.placeholderColor}
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  clearErrors("fullName");
                }}
              />
            )}
          />
          {!errors.fullName && fullNameValue && fullNameValue.length >= 2 && (
            <Check size={20} color="#10B981" strokeWidth={3} />
          )}
        </View>
        <View style={{ height: 20 }}>
          {errors.fullName ? (
            <Text
              style={{
                color: "red",
                fontSize: 11,
                textAlign: "left",
                marginTop: 4,
              }}
            >
              {errors.fullName.message}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Email Input */}
      <View style={{ width: "100%", marginBottom: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.inputBg,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        >
          <Mail size={20} color={colors.iconColor} />
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: colors.inputText,
                }}
                placeholder={languageSet.emailAddress}
                placeholderTextColor={colors.placeholderColor}
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  clearErrors("email");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            )}
          />
          {!errors.email && emailValue && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailValue) && (
            <Check size={20} color="#10B981" strokeWidth={3} />
          )}
        </View>
        <View style={{ height: 20 }}>
          {errors.email ? (
            <Text
              style={{
                color: "red",
                fontSize: 11,
                textAlign: "left",
                marginTop: 4,
              }}
            >
              {errors.email.message}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Phone Number Input */}
      <View style={{ width: "100%", marginBottom: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "stretch" }}>
          {/* Country Code Dropdown */}
          <TouchableOpacity
            onPress={() => setShowCountryPicker(true)}
            style={{
              backgroundColor: "#FEF3C7",
              borderWidth: 1,
              borderColor: "#F59E0B",
              borderTopLeftRadius: 12,
              borderBottomLeftRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 80,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#92400E",
                marginRight: 4,
              }}
            >
              {countryCode}
            </Text>
            <ChevronDown size={16} color="#92400E" />
          </TouchableOpacity>

          {/* Phone Input */}
          <View
            style={{
              flex: 1,
              backgroundColor: colors.inputBg,
              borderWidth: 1,
              borderColor: colors.inputBorder,
              borderTopRightRadius: 12,
              borderBottomRightRadius: 12,
              borderLeftWidth: 0,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Phone size={20} color={colors.iconColor} />
            <Controller
              control={control}
              name="phoneNumber"
              rules={{
                required: "Phone number is required",
                minLength: {
                  value: 10,
                  message: "Phone number must be 10 digits",
                },
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Invalid phone number",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    fontSize: 16,
                    color: colors.inputText,
                  }}
                  placeholder={languageSet.phoneNumber}
                  placeholderTextColor={colors.placeholderColor}
                  value={value}
                  onChangeText={(text) => {
                    const digits = text.replace(/\D/g, "").slice(0, 10);
                    onChange(digits);
                    clearErrors("phoneNumber");
                  }}
                  keyboardType="numeric"
                  maxLength={10}
                />
              )}
            />
            {!errors.phoneNumber && phoneNumberValue && phoneNumberValue.length === 10 && (
              <Check size={20} color="#10B981" strokeWidth={3} />
            )}
          </View>
        </View>
        <View style={{ height: 20 }}>
          {errors.phoneNumber ? (
            <Text
              style={{
                color: "red",
                fontSize: 11,
                textAlign: "left",
                marginTop: 4,
              }}
            >
              {errors.phoneNumber.message}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Country Code Picker Modal */}
      <Modal
        visible={showCountryPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCountryPicker(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback onPress={() => { }}>
              <View
                style={{
                  backgroundColor: colors.modalBg,
                  borderRadius: 12,
                  maxWidth: 300,
                  width: "80%",
                  padding: 16,
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
                      fontWeight: "bold",
                      color: colors.modalTitleText,
                    }}
                  >
                    {selectCountryCodeTranslations[language]}
                  </Text>
                  <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                    <Text style={{ color: colors.textSecondary, fontSize: 20 }}>✕</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={{ maxHeight: 300 }}>
                  {countryCodes.map((item) => (
                    <TouchableOpacity
                      key={item.code}
                      style={{
                        paddingVertical: 10,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setCountryCode(item.code);
                        setValue("countryCode", item.code);
                        clearErrors("countryCode");
                        setShowCountryPicker(false);
                      }}
                    >
                      <Text
                        style={{
                          color: colors.inputText,
                          fontSize: 16,
                          fontWeight: "500",
                        }}
                      >
                        {item.code}
                      </Text>
                      <Text
                        style={{
                          color: colors.textMuted,
                          fontSize: 14,
                          marginLeft: 8,
                        }}
                      >
                        {item.country}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Continue Button */}
      <TouchableOpacity
        style={{ width: "100%", marginTop: 16 }}
        onPress={validateStep}
        disabled={isSubmitting}
      >
        <LinearGradient
          colors={isDark ? ["#6366F1", "#4338CA"] : ["#4F7DF7", "#2563EB"]}
          start={[0, 0]}
          end={[1, 0]}
          style={{
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            {isSubmitting ? "Processing..." : languageSet.continue}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: colors.textPrimary,
          marginBottom: 8,
        }}
      >
        {languageSet.businessInformation}
      </Text>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 16,
          marginBottom: 32,
        }}
      >
        {languageSet.tellUsAboutBusiness}
      </Text>

      {/* Business Name Input */}
      <View style={{ width: "100%", marginBottom: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.inputBg,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        >
          <User size={20} color={colors.iconColor} />
          <Controller
            control={control}
            name="businessName"
            rules={{
              required: "Business name is required",
              minLength: {
                value: 2,
                message: "Business name must be at least 2 characters",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: colors.inputText,
                }}
                placeholder={languageSet.businessName}
                placeholderTextColor={colors.placeholderColor}
                value={value || ""}
                onChangeText={(text) => {
                  onChange(text);
                  clearErrors("businessName");
                }}
              />
            )}
          />
          {!errors.businessName && businessNameValue && businessNameValue.length >= 2 && (
            <Check size={20} color="#10B981" strokeWidth={3} />
          )}
        </View>
        <View style={{ height: 20 }}>
          {errors.businessName ? (
            <Text
              style={{
                color: "red",
                fontSize: 11,
                textAlign: "left",
                marginTop: 4,
              }}
            >
              {errors.businessName.message}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Business Type Picker */}
      <View style={{ width: "100%", marginBottom: 8 }}>
        <TouchableOpacity
          onPress={() => setShowBusinessTypePicker(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.inputBg,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 18,
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        >
          <User size={20} color={colors.iconColor} />
          <Text
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              color: businessTypeValue ? colors.inputText : colors.placeholderColor,
            }}
          >
            {businessTypeValue || "Select Business Type"}
          </Text>
          {!errors.businessType && businessTypeValue ? (
            <Check size={20} color="#10B981" strokeWidth={3} style={{ marginRight: 8 }} />
          ) : (
            <ChevronDown size={16} color={colors.iconColor} />
          )}
        </TouchableOpacity>
        <View style={{ height: 20 }}>
          {errors.businessType ? (
            <Text
              style={{
                color: "red",
                fontSize: 11,
                textAlign: "left",
                marginTop: 4,
              }}
            >
              {errors.businessType.message}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Business Address Input */}
      <View style={{ width: "100%", marginBottom: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.inputBg,
            borderRadius: 12,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        >
          <MapPin size={20} color={colors.iconColor} style={{ marginHorizontal: 16 }} />
          <Controller
            control={control}
            name="businessAddress"
            rules={{
              required: "Business address is required",
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: colors.inputText,
                }}
                placeholder={languageSet.businessAddress}
                placeholderTextColor={colors.placeholderColor}
                value={value || ""}
                onChangeText={(text) => {
                  onChange(text);
                  clearErrors("businessAddress");
                }}
                editable={!isDetectingLocation}
              />
            )}
          />
          {!errors.businessAddress && businessAddressValue && (
            <Check size={20} color="#10B981" strokeWidth={3} style={{ marginRight: 8 }} />
          )}
          <TouchableOpacity
            style={{
              backgroundColor: isDetectingLocation ? colors.strengthBarInactive : "#DBEAFE",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              marginRight: 16,
            }}
            onPress={() => setShowLocationModal(true)}
            disabled={isDetectingLocation}
          >
            <MapPin size={14} color={colors.iconColor} />
            <Text
              style={{
                color: isDetectingLocation ? colors.textMuted : colors.textSecondary,
                fontSize: 12,
                fontWeight: "500",
                marginLeft: 4,
              }}
            >
              {isDetectingLocation ? "Getting address..." : languageSet.detectLocation}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 20 }}>
          {errors.businessAddress ? (
            <Text
              style={{
                color: "red",
                fontSize: 11,
                textAlign: "left",
                marginTop: 4,
              }}
            >
              {errors.businessAddress.message}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Number of Seats Input */}
      <View style={{ width: "100%", marginBottom: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.inputBg,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        >
          <Armchair size={20} color={colors.iconColor} />
          <Controller
            control={control}
            name="seatsNumber"
            rules={{
              required: "Number of seats is required",
              min: {
                value: 1,
                message: "Must have at least 1 seat",
              },
              max: {
                value: 4,
                message: "Maximum 4 seats allowed",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginLeft: 12,
                  justifyContent: "center",
                }}
                onPress={() => setShowPicker(!showPicker)}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: value ? colors.inputText : colors.placeholderColor,
                  }}
                >
                  {value || numseatsLanguageSet.numberOfSeats}
                </Text>
              </TouchableOpacity>
            )}
          />
          {!errors.seatsNumber &&
            typeof seatsNumberValue === "number" &&
            seatsNumberValue >= 1 &&
            seatsNumberValue <= 4 && (
              <Check size={20} color="#10B981" strokeWidth={3} />
            )}
        </View>

        {/* Scrollable Picker */}
        {showPicker && (
          <View
            style={{
              backgroundColor: colors.inputBg,
              borderRadius: 12,
              marginTop: 8,
              borderWidth: 1,
              borderColor: colors.inputBorder,
              maxHeight: 120,
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {[1, 2, 3, 4].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderBottomWidth: num !== 4 ? 1 : 0,
                    borderBottomColor: colors.inputBorder,
                    backgroundColor:
                      seatsNumberValue === num
                        ? isDark
                          ? "#4B5563"
                          : "#F3F4F6"
                        : "transparent",
                  }}
                  onPress={() => {
                    setValue("seatsNumber", num);
                    clearErrors("seatsNumber");
                    setShowPicker(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.inputText,
                      fontWeight: seatsNumberValue === num ? "600" : "400",
                    }}
                  >
                    {num} {num === 1 ? "Seat" : "Seats"}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ height: 20 }}>
          {errors.seatsNumber ? (
            <Text
              style={{
                color: "red",
                fontSize: 11,
                textAlign: "left",
                marginTop: 4,
              }}
            >
              {errors.seatsNumber.message}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Business Type Modal */}
      <Modal
        visible={showBusinessTypePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBusinessTypePicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowBusinessTypePicker(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback onPress={() => { }}>
              <View
                style={{
                  backgroundColor: colors.modalBg,
                  borderRadius: 12,
                  maxWidth: 300,
                  width: "80%",
                  padding: 16,
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
                      fontWeight: "bold",
                      color: colors.modalTitleText,
                    }}
                  >
                    {languageSet.businessType}
                  </Text>
                  <TouchableOpacity onPress={() => setShowBusinessTypePicker(false)}>
                    <Text style={{ color: colors.textSecondary, fontSize: 20 }}>✕</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={{ maxHeight: 300 }}>
                  {businessTypes.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={{
                        paddingVertical: 10,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setValue("businessType", item as FormData["businessType"]);
                        clearErrors("businessType");
                        setShowBusinessTypePicker(false);
                      }}
                    >
                      <Text
                        style={{
                          color: colors.inputText,
                          fontSize: 16,
                          fontWeight: "500",
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Location Permission Modal */}
      <Modal
        visible={showLocationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowLocationModal(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback onPress={() => { }}>
              <View
                style={{
                  backgroundColor: colors.modalBg,
                  borderRadius: 12,
                  width: "90%",
                  padding: 16,
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
                      fontWeight: "bold",
                      color: colors.modalTitleText,
                    }}
                  >
                    {languageSet.allowLocationAccess}
                  </Text>
                  <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                    <Text style={{ color: colors.textSecondary, fontSize: 20 }}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: 14,
                    marginBottom: 24,
                  }}
                >
                  {languageSet.locationPermissionMessage}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: 16,
                  }}
                >
                  <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                    <Text
                      style={{
                        color: colors.textSecondary,
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      {languageSet.deny}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDetectLocation}>
                    <Text
                      style={{
                        color: colors.textSecondary,
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      {languageSet.allow}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Continue Button */}
      <TouchableOpacity
        style={{ width: "100%", marginTop: 16 }}
        onPress={validateStep}
        disabled={isSubmitting}
      >
        <LinearGradient
          colors={isDark ? ["#6366F1", "#4338CA"] : ["#4F7DF7", "#2563EB"]}
          start={[0, 0]}
          end={[1, 0]}
          style={{
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            {isSubmitting ? "Processing..." : languageSet.continue}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <View style={{ paddingHorizontal: 0, width: "100%" }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: colors.textPrimary,
          marginBottom: 8,
        }}
      >
        {languageSet.createNewPassword}
      </Text>
      <Text style={{ color: colors.textSecondary, fontSize: 16, marginBottom: 32 }}>
        {languageSet.enterNewPassword}
      </Text>
      {/* Password Input */}
      <View style={{ width: "100%", marginBottom: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.inputBg,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        >
          <Lock size={20} color={colors.iconColor} />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: colors.inputText,
                }}
                placeholder={languageSet.newPassword}
                placeholderTextColor={colors.placeholderColor}
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  clearErrors("password");
                }}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
              />
            )}
          />
          <TouchableOpacity
            style={{ marginLeft: 8 }}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? (
              <EyeOff size={20} color={colors.iconColor} />
            ) : (
              <Eye size={20} color={colors.iconColor} />
            )}
          </TouchableOpacity>
        </View>
        <View style={{ height: 20 }}>
          {errors.password ? (
            <Text
              style={{
                color: "red",
                fontSize: 11,
                textAlign: "left",
                marginTop: 4,
              }}
            >
              {errors.password.message}
            </Text>
          ) : null}
        </View>
      </View>
      <PasswordStrengthIndicator password={password} isDark={isDark} />
      {/* Confirm Password Input */}
      <View style={{ width: "100%", marginBottom: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.inputBg,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: colors.inputBorder,
          }}
        >
          <Lock size={20} color={colors.iconColor} />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: colors.inputText,
                }}
                placeholder={languageSet.confirmNewPassword}
                placeholderTextColor={colors.placeholderColor}
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  clearErrors("confirmPassword");
                }}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
              />
            )}
          />
        </View>
        <View style={{ height: 20 }}>
          {errors.confirmPassword ? (
            <Text
              style={{
                color: "red",
                fontSize: 11,
                textAlign: "left",
                marginTop: 4,
              }}
            >
              {errors.confirmPassword.message}
            </Text>
          ) : null}
        </View>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <Controller
          control={control}
          name="agreeToTerms"
          render={({ field: { onChange, value } }) => (
            <>
              <TouchableOpacity
                onPress={() => {
                  onChange(!value);
                  clearErrors("agreeToTerms");
                }}
                style={{ marginRight: 8 }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: colors.textSecondary,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: value ? colors.textSecondary : "transparent",
                  }}
                >
                  {value && (
                    <Text style={{ color: "white", fontSize: 12 }}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
              <Text
                style={{
                  color: colors.inputText,
                  fontSize: 14,
                }}
              >
                {languageSet.agreeToTerms}{" "}
                <Text
                  style={{
                    color: colors.textSecondary,
                    textDecorationLine: "underline",
                  }}
                  onPress={() => setShowTermsModal(true)}
                >
                  {languageSet.termsOfService}
                </Text>{" "}
                {languageSet.and}{" "}
                <Text
                  style={{
                    color: colors.textSecondary,
                    textDecorationLine: "underline",
                  }}
                  onPress={() => setShowPrivacyModal(true)}
                >
                  {languageSet.privacyPolicy}
                </Text>
              </Text>
            </>
          )}
        />
      </View>
      <View style={{ height: 20 }}>
        {errors.agreeToTerms && (
          <Text style={{ color: "red", fontSize: 11, marginBottom: 8 }}>
            {errors.agreeToTerms.message}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={{ width: "100%", marginBottom: 8, marginTop: 10 }}
        onPress={handleSubmit(() => {
          setIsSubmitting(true);
          setTimeout(() => setIsSubmitting(false), 2000);
        })}
        disabled={isSubmitting}
      >
        <LinearGradient
          colors={isDark ? ["#6366F1", "#4338CA"] : ["#4F7DF7", "#2563EB"]}
          start={[0, 0]}
          end={[1, 0]}
          style={{
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            opacity: isSubmitting ? 0.5 : 1,
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
            {isSubmitting ? "Creating Account..." : languageSet.createYourAccount}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/(auth)/signin")}
        style={{ alignItems: "center" }}
      >
        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
          {languageSet.alreadyHaveAccount}{" "}
          <Text style={{ fontWeight: "600" }}>{languageSet.logIn}</Text>
        </Text>
      </TouchableOpacity>
      {/* Terms of Service Modal */}
      <Modal
        visible={showTermsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: colors.modalBg,
              borderRadius: 12,
              width: "90%",
              padding: 16,
              zIndex: 1000,
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
                  fontWeight: "bold",
                  color: colors.modalTitleText,
                }}
              >
                {languageSet.termsModalTitle}
              </Text>
              <TouchableOpacity onPress={() => setShowTermsModal(false)}>
                <Text style={{ color: colors.textSecondary, fontSize: 16 }}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: isDark ? "#E5E7EB" : "#1E3A8A",
                    marginBottom: 8,
                  }}
                >
                  QVuew Terms of Service
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 8,
                  }}
                >
                  Last Updated: April 20, 2025
                </Text>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  1. Acceptance of Terms
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  Welcome to QVuew. By accessing or using our queue management
                  service, you agree to be bound by these Terms of Service.
                </Text>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  2. Description of Service
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  QVuew provides a queue management system for businesses to
                  organize customer flow and improve service efficiency. The
                  service includes mobile applications, display screens, and web
                  interfaces.
                </Text>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  3. User Accounts
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  You are responsible for maintaining the confidentiality of
                  your account information, including your password, and for all
                  activity that occurs under your account. You must notify QVuew
                  immediately of any unauthorized use of your account.
                </Text>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  4. Privacy Policy
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  Your use of QVuew is also governed by our Privacy Policy,
                  which is incorporated by reference into these Terms of
                  Service.
                </Text>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  5. User Conduct
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  You agree not to use the service to:
                </Text>
                <View style={{ paddingLeft: 20, marginTop: 8 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Violate any applicable laws or regulations
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Infringe the rights of any third party
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Transmit any material that is unlawful, harmful,
                    threatening, abusive, or otherwise objectionable
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Interfere with or disrupt the service or servers or
                    networks connected to the service
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Attempt to gain unauthorized access to any part of the
                    service
                  </Text>
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  6. Intellectual Property
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  All content included on or comprising the service, including
                  text, graphics, logos, and software, is the property of QVuew
                  or its suppliers and is protected by copyright and other laws.
                </Text>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  7. Termination
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  QVuew may terminate your access to all or any part of the
                  service at any time, with or without cause, with or without
                  notice, effective immediately.
                </Text>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  8. Disclaimer of Warranties
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  The service is provided &quot;as is&quot; and &quot;as
                  available&quot; without warranty of any kind, either express
                  or implied, including but not limited to, the implied
                  warranties of merchantability, fitness for a particular
                  purpose, or non-infringement.
                </Text>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  9. Limitation of Liability
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  In no event shall QVuew be liable for any direct, indirect,
                  incidental, special, exemplary, or consequential damages
                  arising out of or in connection with the use of the service.
                </Text>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  10. Changes to Terms
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  QVuew reserves the right to modify these Terms of Service at
                  any time. We will notify users of any changes by posting the
                  new Terms of Service on this page.
                </Text>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  11. Governing Law
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  These Terms of Service shall be governed by and construed in
                  accordance with the laws of the jurisdiction in which QVuew is
                  established, without regard to its conflict of law provisions.
                </Text>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  12. Contact Information
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  For any questions about these Terms of Service, please contact
                  us at legal@qvuew.app.
                </Text>
              </View>
            </ScrollView>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 16,
                marginTop: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setShowTermsModal(false);
                  setValue("agreeToTerms", true);
                  clearErrors("agreeToTerms");
                }}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  backgroundColor: colors.textSecondary,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>
                  {languageSet.agree}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: colors.modalBg,
              borderRadius: 12,
              width: "90%",
              padding: 16,
              zIndex: 1000,
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
                  fontWeight: "bold",
                  color: colors.modalTitleText,
                }}
              >
                {languageSet.privacyModalTitle}
              </Text>
              <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                <Text style={{ color: colors.textSecondary, fontSize: 16 }}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              <View
                style={{
                  marginBottom: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: "#DBEAFE",
                    borderRadius: 32,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Shield size={24} color={colors.textSecondary} />
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: isDark ? "#E5E7EB" : "#1E3A8A",
                    textAlign: "center",
                  }}
                >
                  QVuew Privacy Policy
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  Last Updated: April 20, 2025
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: "#DBEAFE",
                  padding: 16,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginTop: 16,
                }}
              >
                <Lock size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: colors.modalBodyText,
                    }}
                  >
                    Your privacy is important to us
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginTop: 4,
                    }}
                  >
                    At QVuew, we respect your privacy and are committed to
                    protecting your personal data.
                  </Text>
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  1. Information We Collect
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  We collect information you provide directly to us when you:
                </Text>
                <View style={{ paddingLeft: 20, marginTop: 8 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Create an account
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Use our services
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Contact customer support
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Participate in surveys or promotions
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginTop: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    marginRight: 12,
                    marginTop: 2,
                  }}
                >
                  [Icon]
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                  }}
                >
                  <Text style={{ fontWeight: "600" }}>Data Protection:</Text> We
                  do not sell or share your personal or customer data with third
                  parties.
                </Text>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  2. How We Use Your Information
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  We use the information we collect to:
                </Text>
                <View style={{ paddingLeft: 20, marginTop: 8 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Provide, maintain, and improve our services
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Process transactions and send related information
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Send technical notices, updates, and support messages
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Respond to your comments and questions
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Develop new products and services
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginTop: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    marginRight: 12,
                    marginTop: 2,
                  }}
                >
                  [Icon]
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                  }}
                >
                  <Text style={{ fontWeight: "600" }}>Transparency:</Text> All
                  communication is encrypted via SSL. Location data (if used for
                  maps) is not stored beyond session.
                </Text>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  3. Information Sharing
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  We may share your information with:
                </Text>
                <View style={{ paddingLeft: 20, marginTop: 8 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Service providers who perform services on our behalf
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Professional advisors, such as lawyers and accountants
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Regulatory authorities, when required by law
                  </Text>
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  4. Data Security
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  We implement appropriate technical and organizational measures
                  to protect your personal data against unauthorized or unlawful
                  processing, accidental loss, destruction, or damage.
                </Text>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  5. Your Rights
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  You have the right to:
                </Text>
                <View style={{ paddingLeft: 20, marginTop: 8 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Access your personal data
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Correct inaccurate personal data
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Request deletion of your personal data
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Object to processing of your personal data
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.modalBodyText,
                      marginBottom: 4,
                    }}
                  >
                    • Request restriction of processing your personal data
                  </Text>
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  6. Changes to This Privacy Policy
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the &ldquo;Last Updated&ldquo; date.
                </Text>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.modalBodyText,
                    marginTop: 16,
                  }}
                >
                  7. Contact Us
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    marginTop: 4,
                  }}
                >
                  If you have any questions about this Privacy Policy, please
                  contact us at privacy@qvuew.app.
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: "#DBEAFE",
                  padding: 8,
                  paddingVertical: 12,
                  borderRadius: 8,
                  marginTop: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.modalBodyText,
                    textAlign: "center",
                    fontWeight: "500",
                  }}
                >
                  By using this app, you consent to this policy.
                </Text>
              </View>
            </ScrollView>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 16,
                marginTop: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setShowPrivacyModal(false);
                  setValue("agreeToTerms", true);
                  clearErrors("agreeToTerms");
                }}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  backgroundColor: colors.textSecondary,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>
                  {languageSet.agree}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
        start={[0, 0]}
        end={[0, 1]}
        style={{ flex: 1 }}
      >
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            step === 1 ? router.back() : setStep(step - 1);
          }}
          style={{
            position: "absolute",
            top: 30,
            left: 15,
            flexDirection: "row",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <ArrowLeft size={20} color={colors.iconColor} />
          <Text style={{ color: colors.textSecondary, marginLeft: 4, fontSize: 16 }}>
            {languageSet.back}
          </Text>
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: 40,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {renderStepIndicator()}
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-start",
                  paddingHorizontal: 16,
                  marginTop: 40,
                  width: "100%",
                }}
              >
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}