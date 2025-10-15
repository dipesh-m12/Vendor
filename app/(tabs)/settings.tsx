import AccountModals from "@/components/modals/AccountModals";
import SecurityModals from "@/components/modals/SecurityModals";
import useRegTypeStore from "@/store/regTypeStore";
import useThemeStore from "@/store/themeStore";
import { accountTranslations } from "@/translations/tabsTranslations/settings/accountTranslations";
import {
  displayDeviceTranslations,
  generalSettingsTranslations,
} from "@/translations/tabsTranslations/settings/generalSettingsTranslations";
import {
  manageTranslations,
  translations,
  workingHoursTranslations,
} from "@/translations/tabsTranslations/settings/profileTranslations";
import { queueSettingsTranslations } from "@/translations/tabsTranslations/settings/queueSettingsTranslations";
import { securityTranslations } from "@/translations/tabsTranslations/settings/securityTranslations";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  BarChart2,
  Bell,
  Calendar,
  Camera,
  ChevronRight,
  Clock,
  Edit2,
  Eye,
  Globe,
  HelpCircle,
  Info,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Monitor,
  Moon,
  Navigation,
  Phone,
  QrCode,
  Save,
  Shield,
  Star,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

// Validation schemas
const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name too long"),
  email: z.string().email("Please enter a valid email address"),
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name too long"),
  businessType: z.string().min(1, "Please select a business type"),
  businessAddress: z
    .string()
    .min(10, "Please enter a complete address")
    .max(200, "Address too long"),
  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"),
  seats: z
    .number()
    .min(1, "Minimum 1 seat required")
    .max(1000, "Too many seats"),
});

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, language, setLanguage } = useThemeStore();
  const { regType } = useRegTypeStore();
  const profileLanguageSet = translations[language];
  const profileModalLanguageSet = workingHoursTranslations[language];
  const generalLanguageSet = generalSettingsTranslations[language];
  const generalModalLanguageSet = displayDeviceTranslations[language];
  const queueLanguageSet = queueSettingsTranslations[language];
  const settingLanguageSet = securityTranslations[language];
  const accountLanguageSet = accountTranslations[language];
  const manageLanguageSet = manageTranslations[language];

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    inactivityReminder: true,
    inactivityTimeout: 5,
    privacyMode: false,
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState<any>({
    fullName: "John Doe",
    email: "john@example.com",
    businessName: "My Business",
    businessType: "",
    businessAddress: "",
    phoneNumber: "",
    seats: 10,
    avatar: null,
    workingHours: {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: false },
      saturday: { open: "10:00", close: "15:00", closed: false },
      sunday: { open: "10:00", close: "15:00", closed: true },
    },
  });

  const [errors, setErrors] = useState<any>({});

  const [customTimePicker, setCustomTimePicker] = useState({
    visible: false,
    day: "",
    field: "",
    hour: 9,
    minute: 0,
    ampm: "AM",
  });

  const formatCustomTime = () => {
    return `${customTimePicker.hour}:${customTimePicker.minute
      .toString()
      .padStart(2, "0")} ${customTimePicker.ampm}`;
  };
  const setCommonTime = (time: string) => {
    const [timePart, period] = time.split(" ");
    const [hours, minutes] = timePart.split(":").map(Number);

    setCustomTimePicker((prev) => ({
      ...prev,
      hour: hours,
      minute: minutes,
      ampm: period,
    }));
  };

  const handleSetTime = () => {
    let hour24 = customTimePicker.hour;
    if (customTimePicker.ampm === "PM" && customTimePicker.hour !== 12) {
      hour24 = customTimePicker.hour + 12;
    } else if (customTimePicker.ampm === "AM" && customTimePicker.hour === 12) {
      hour24 = 0;
    }

    const timeString = `${hour24
      .toString()
      .padStart(2, "0")}:${customTimePicker.minute
      .toString()
      .padStart(2, "0")}`;

    handleWorkingHoursChange(
      customTimePicker.day,
      customTimePicker.field,
      timeString
    );

    setCustomTimePicker((prev) => ({ ...prev, visible: false }));
    showToast("Time updated successfully!");
  };

  // Modal states
  const [modals, setModals] = useState({
    workingHours: false,
    changePassword: false,
    deleteAccount: false,
    logout: false,
    displayDevice: false,
    about: false,
    support: false,
    privacy: false,
    terms: false,
    timePicker: false,
    loginActivity: false, // Add this
    logoutAllDevices: false, // Add this
  });

  //display device modal switches
  const [displaydevice, setDisplaydevice] = useState({
    customer_names: true,
    est_time: true,
    rot_announcements: true,
  });

  // Time picker state
  const [timePickerData, setTimePickerData] = useState({
    day: "",
    field: "",
    value: new Date(),
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Languages array
  const languages = [
    { label: "English", value: "English" },
    { label: "हिन्दी (Hindi)", value: "हिन्दी" },
    { label: "বাংলা (Bengali)", value: "বাংলা" },
    { label: "తెలుగు (Telugu)", value: "తెలుగు" },
    { label: "मराठी (Marathi)", value: "मराठी" },
    { label: "தமிழ் (Tamil)", value: "தமிழ்" },
    { label: "اردو (Urdu)", value: "اردو" },
    { label: "ગુજરાતી (Gujarati)", value: "ગુજરાતી" },
    { label: "ಕನ್ನಡ (Kannada)", value: "ಕನ್ನಡ" },
    { label: "ଓଡ଼ିଆ (Odia)", value: "ଓଡ଼ିଆ" },
    { label: "മലയാളം (Malayalam)", value: "മലയാളം" },
    { label: "ਪੰਜਾਬੀ (Punjabi)", value: "ਪੰਜਾਬੀ" },
    { label: "অসমীয়া (Assamese)", value: "অসমীয়া" },
    { label: "मैथिली (Maithili)", value: "मैथिली" },
    { label: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)", value: "ᱥᱟᱱᱛᱟᱲᱤ" },
  ];

  const businessTypes = [
    "Retail",
    "Restaurant",
    "Healthcare",
    "Banking",
    "Government",
    "Education",
    "Salon/Spa",
    "Automotive",
    "Legal Services",
    "Others",
  ];

  const colors = {
    // Page backgrounds
    gradientStart: isDark ? "#111827" : "#F1F5F9", // dark:from-gray-900
    gradientEnd: isDark ? "#1F2937" : "#E2E8F0", // dark:bg-gray-800

    // Card backgrounds
    cardBg: isDark ? "rgba(31, 41, 55, 0.95)" : "#FFFFFF", // dark:bg-gray-800/95

    // Text colors
    textPrimary: isDark ? "#DBEAFE" : "#1E293B", // dark:text-blue-100
    textSecondary: isDark ? "#BFDBFE" : "#64748B", // dark:text-blue-200
    textAccent: isDark ? "#93C5FD" : "#3B82F6", // dark:text-blue-300
    iconColor: isDark ? "#60A5FA" : "#3B82F6", // dark:text-blue-400

    // Borders
    borderColor: isDark ? "#374151" : "#E2E8F0", // dark:border-gray-700

    // Input fields
    inputBg: isDark ? "#374151" : "#FFFFFF", // dark:bg-gray-700
    inputBorder: isDark ? "#4B5563" : "#BFDBFE", // dark:border-gray-600
    inputText: isDark ? "#F9FAFB" : "#1F2937", // dark:text-white

    // Section headers
    sectionTitle: isDark ? "#93C5FD" : "#1E40AF", // dark:text-blue-300
  };
  // Helper functions
  const openModal = (modalName: any) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: any) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };

  const showToast = (message: any) => {
    Alert.alert("Success", message);
  };

  const showError = (message: any) => {
    Alert.alert("Error", message);
  };

  // Profile validation and update
  const validateProfile = () => {
    try {
      profileSchema.parse(profileData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: any = {};

      // Check if it's a ZodError
      if (error.name === "ZodError") {
        // Handle Zod validation errors - use 'issues' not 'errors'
        error.issues.forEach((issue: any) => {
          const fieldName = issue.path[0];
          newErrors[fieldName] = issue.message;
        });
      } else {
        // Generic error fallback
        newErrors.general = "Validation failed. Please check your input.";
      }

      setErrors(newErrors);
      return false;
    }
  };

  const handleProfileUpdate = () => {
    if (validateProfile()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsEditingProfile(false);
        showToast("Profile updated successfully!");
      }, 1000);
    }
  };

  // Avatar handling
  const handleAvatarChange = async () => {
    try {
      // Request permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        showError("Permission to access camera roll is required!");
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileData(
          (prev: any) =>
            ({
              ...prev,
              avatar: result.assets[0].uri,
            } as any)
        );
        showToast("Profile picture updated!");
      }
    } catch (error) {
      showError("Failed to select image. Please try again.");
      console.log("Image picker error:", error);
    }
  };

  // Location detection
  const detectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showError("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const addr = address[0];
        const fullAddress = `${addr.name || ""} ${addr.street || ""} ${
          addr.city || ""
        } ${addr.region || ""} ${addr.country || ""}`.trim();
        setProfileData((prev: any) => ({
          ...prev,
          businessAddress: fullAddress,
        }));
        showToast("Location detected successfully!");
      }
    } catch (error) {
      showError("Could not detect location. Please enter manually.");
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Working hours handling
  const handleWorkingHoursChange = (day: any, field: any, value: any) => {
    setProfileData((prev: any) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: field === "closed" ? value : value,
        },
      },
    }));
  };

  const formatTime = (timeString: any) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const openTimePicker = (day: any, field: any) => {
    const timeString = profileData.workingHours[day][field];
    const [hours24, minutes] = timeString.split(":").map(Number);

    let hour12 = hours24;
    let ampm = "AM";

    if (hours24 >= 12) {
      ampm = "PM";
      if (hours24 > 12) hour12 = hours24 - 12;
    } else if (hours24 === 0) {
      hour12 = 12;
    }

    setCustomTimePicker({
      visible: true,
      day,
      field,
      hour: hour12,
      minute: minutes,
      ampm,
    });
  };

  const handleTimeChange = (event: any, selectedDate: any) => {
    if (Platform.OS === "android") {
      closeModal("timePicker");
    }

    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}`;

      handleWorkingHoursChange(
        timePickerData.day,
        timePickerData.field,
        timeString
      );

      if (Platform.OS === "ios") {
        setTimePickerData((prev) => ({ ...prev, value: selectedDate }));
      }
    }
  };

  // Delete account confirmation
  const confirmDeleteAccount = () => {
    Alert.alert(
      accountLanguageSet.deleteAccountTitle,
      accountLanguageSet.deleteAccountConfirmation,
      [
        { text: accountLanguageSet.cancel, style: "cancel" },
        {
          text: accountLanguageSet.delete,
          style: "destructive",
          onPress: () => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              showToast("Account deleted successfully");
              router.replace("/(auth)/signin");
            }, 2000);
          },
        },
      ]
    );
  };

  // Logout confirmation
  const confirmLogout = () => {
    Alert.alert(
      accountLanguageSet.logout,
      accountLanguageSet.logoutConfirmation,
      [
        { text: accountLanguageSet.cancel, style: "cancel" },
        {
          text: accountLanguageSet.logout,
          onPress: () => router.replace("/(auth)/signin"),
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View className="pt-12 pb-4 px-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color={colors.iconColor} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: colors.textPrimary,
          }}
        >
          {profileLanguageSet.settings}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        style={{ paddingBottom: 300 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-xl p-4 mb-4 shadow-sm`}
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className={`text-lg font-semibold ${
                isDark ? "text-blue-300" : "text-blue-800"
              }`}
            >
              {profileLanguageSet.profileInformation}
            </Text>
            {!isEditingProfile ? (
              <TouchableOpacity
                onPress={() => setIsEditingProfile(true)}
                className="flex-row items-center"
              >
                <Edit2 size={16} color={isDark ? "#60A5FA" : "#3B82F6"} />
                <Text
                  className={`ml-1 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {profileLanguageSet.edit}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  onPress={handleProfileUpdate}
                  disabled={isLoading}
                  className="flex-row items-center"
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#10B981" />
                  ) : (
                    <Save size={16} color="#10B981" />
                  )}
                  <Text className="ml-1 text-green-600">
                    {profileLanguageSet.save}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsEditingProfile(false);
                    setErrors({});
                  }}
                  className="flex-row items-center"
                >
                  <X size={16} color="#EF4444" />
                  <Text className="ml-1 text-red-600">
                    {profileLanguageSet.cancel}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Avatar */}
          <View className="items-center mb-4">
            <TouchableOpacity
              onPress={isEditingProfile ? handleAvatarChange : null}
              className="relative"
              activeOpacity={isEditingProfile ? 0.7 : 1}
            >
              <View
                className={`w-20 h-20 rounded-full ${
                  isDark ? "bg-gray-700" : "bg-blue-100"
                } items-center justify-center border-2 ${
                  isDark ? "border-gray-600" : "border-blue-200"
                }`}
              >
                {profileData.avatar ? (
                  <Image
                    source={{ uri: profileData.avatar }}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <Star size={32} color={isDark ? "#60A5FA" : "#3B82F6"} />
                )}
              </View>
              {isEditingProfile && (
                <View className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                  <Camera size={16} color="white" />
                </View>
              )}
            </TouchableOpacity>
            <Text
              className={`mt-2 text-sm ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {profileLanguageSet.profilePicture}
            </Text>
          </View>

          {/* Profile Fields */}
          <View style={{ gap: 16 }}>
            {/* Full Name */}
            <View>
              <View className="flex-row items-center mb-1">
                <User size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
                <Text
                  className={`ml-3 text-sm ${
                    isDark ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  {profileLanguageSet.fullName}
                </Text>
              </View>
              {isEditingProfile ? (
                <TextInput
                  value={profileData.fullName}
                  onChangeText={(text) =>
                    setProfileData((prev: any) => ({ ...prev, fullName: text }))
                  }
                  className={`${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-blue-200 text-gray-900"
                  } border rounded-lg p-3 text-base ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                  placeholder={profileLanguageSet.placeholderFullName}
                  placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                />
              ) : (
                <Text
                  className={`${
                    isDark ? "text-gray-100" : "text-gray-900"
                  } text-base ml-6`}
                >
                  {profileData.fullName || "Not provided"}
                </Text>
              )}
              {errors.fullName && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.fullName}
                </Text>
              )}
            </View>

            {/* Email */}
            <View>
              <View className="flex-row items-center mb-1">
                <Mail size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
                <Text
                  className={`ml-3 text-sm ${
                    isDark ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  {profileLanguageSet.emailAddress}
                </Text>
              </View>
              {isEditingProfile ? (
                <TextInput
                  value={profileData.email}
                  onChangeText={(text) =>
                    setProfileData((prev: any) => ({ ...prev, email: text }))
                  }
                  className={`${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-blue-200 text-gray-900"
                  } border rounded-lg p-3 text-base ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder={profileLanguageSet.placeholderEmail}
                  placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text
                  className={`${
                    isDark ? "text-gray-100" : "text-gray-900"
                  } text-base ml-6`}
                >
                  {profileData.email}
                </Text>
              )}
              {errors.email && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Business Name */}
            <View>
              <View className="flex-row items-center mb-1">
                <Star size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
                <Text
                  className={`ml-3 text-sm ${
                    isDark ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  {profileLanguageSet.businessName}
                </Text>
              </View>
              {isEditingProfile ? (
                <TextInput
                  value={profileData.businessName}
                  onChangeText={(text) =>
                    setProfileData((prev: any) => ({
                      ...prev,
                      businessName: text,
                    }))
                  }
                  className={`${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-blue-200 text-gray-900"
                  } border rounded-lg p-3 text-base ${
                    errors.businessName ? "border-red-500" : ""
                  }`}
                  placeholder={profileLanguageSet.placeholderBusinessName}
                  placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                />
              ) : (
                <Text
                  className={`${
                    isDark ? "text-gray-100" : "text-gray-900"
                  } text-base ml-6`}
                >
                  {profileData.businessName}
                </Text>
              )}
              {errors.businessName && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.businessName}
                </Text>
              )}
            </View>

            {/* Business Type */}
            <View>
              <View className="flex-row items-center mb-1">
                <BarChart2 size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
                <Text
                  className={`ml-3 text-sm ${
                    isDark ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  {profileLanguageSet.businessType}
                </Text>
              </View>
              {isEditingProfile ? (
                <View
                  className={`${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-blue-200"
                  } border rounded-lg ${
                    errors.businessType ? "border-red-500" : ""
                  }`}
                >
                  <Picker
                    selectedValue={profileData.businessType}
                    onValueChange={(value) =>
                      setProfileData((prev: any) => ({
                        ...prev,
                        businessType: value,
                      }))
                    }
                    style={{ color: isDark ? "white" : "black" }}
                  >
                    <Picker.Item
                      label={profileLanguageSet.placeholderBusinessType}
                      value=""
                    />
                    {businessTypes.map((type) => (
                      <Picker.Item key={type} label={type} value={type} />
                    ))}
                  </Picker>
                </View>
              ) : (
                <Text
                  className={`${
                    isDark ? "text-gray-100" : "text-gray-900"
                  } text-base ml-6`}
                >
                  {profileData.businessType || "Not provided"}
                </Text>
              )}
              {errors.businessType && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.businessType}
                </Text>
              )}
            </View>

            {/* Seats */}
            <View>
              <View className="flex-row items-center mb-1">
                <Users size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
                <Text
                  className={`ml-3 text-sm ${
                    isDark ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  {profileLanguageSet.numberOfSeats}
                </Text>
              </View>
              {isEditingProfile ? (
                <TextInput
                  value={profileData.seats.toString()}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, "");
                    setProfileData((prev: any) => ({
                      ...prev,
                      seats: parseInt(numericValue) || 0,
                    }));
                  }}
                  className={`${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-blue-200 text-gray-900"
                  } border rounded-lg p-3 text-base ${
                    errors.seats ? "border-red-500" : ""
                  }`}
                  placeholder={profileLanguageSet.placeholderSeats}
                  placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                  keyboardType="numeric"
                  maxLength={4}
                />
              ) : (
                <Text
                  className={`${
                    isDark ? "text-gray-100" : "text-gray-900"
                  } text-base ml-6`}
                >
                  {profileData.seats} seats
                </Text>
              )}
              {errors.seats && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.seats}
                </Text>
              )}
            </View>

            {/* Business Address */}
            <View>
              <View className="flex-row items-center mb-1">
                <MapPin size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
                <Text
                  className={`ml-3 text-sm ${
                    isDark ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  {profileLanguageSet.businessAddress}
                </Text>
              </View>
              {isEditingProfile ? (
                <View>
                  <TextInput
                    value={profileData.businessAddress}
                    onChangeText={(text) =>
                      setProfileData((prev: any) => ({
                        ...prev,
                        businessAddress: text,
                      }))
                    }
                    className={`${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-blue-200 text-gray-900"
                    } border rounded-lg p-3 text-base mb-2 ${
                      errors.businessAddress ? "border-red-500" : ""
                    }`}
                    placeholder={profileLanguageSet.placeholderBusinessAddress}
                    placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                    multiline
                  />
                  <TouchableOpacity
                    onPress={detectLocation}
                    disabled={isDetectingLocation}
                    className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg flex-row items-center justify-center"
                  >
                    {isDetectingLocation ? (
                      <ActivityIndicator size="small" color="#3B82F6" />
                    ) : (
                      <Navigation size={16} color="#3B82F6" />
                    )}
                    <Text className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                      {isDetectingLocation
                        ? profileLanguageSet.detecting
                        : profileLanguageSet.detectLocation}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text
                  className={`${
                    isDark ? "text-gray-100" : "text-gray-900"
                  } text-base ml-6`}
                >
                  {profileData.businessAddress || "Not provided"}
                </Text>
              )}
              {errors.businessAddress && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.businessAddress}
                </Text>
              )}
            </View>

            {/* Phone Number */}
            <View>
              <View className="flex-row items-center mb-1">
                <Phone size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
                <Text
                  className={`ml-3 text-sm ${
                    isDark ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  {profileLanguageSet.phoneNumber}
                </Text>
              </View>
              {isEditingProfile ? (
                <TextInput
                  value={profileData.phoneNumber}
                  onChangeText={(text) => {
                    // Only allow digits and limit to 10 characters
                    const numericValue = text
                      .replace(/[^0-9]/g, "")
                      .slice(0, 10);
                    setProfileData((prev: any) => ({
                      ...prev,
                      phoneNumber: numericValue,
                    }));
                  }}
                  className={`${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-blue-200 text-gray-900"
                  } border rounded-lg p-3 text-base ${
                    errors.phoneNumber ? "border-red-500" : ""
                  }`}
                  placeholder={profileLanguageSet.placeholderPhoneNumber}
                  placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              ) : (
                <Text
                  className={`${
                    isDark ? "text-gray-100" : "text-gray-900"
                  } text-base ml-6`}
                >
                  {profileData.phoneNumber || "Not provided"}
                </Text>
              )}
              {errors.phoneNumber && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber}
                </Text>
              )}
            </View>

            {/* Working Hours */}
            <TouchableOpacity onPress={() => openModal("workingHours")}>
              <View className="flex-row items-center mb-1">
                <Calendar size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
                <Text
                  className={`ml-3 text-sm ${
                    isDark ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  {profileLanguageSet.workingHours}
                </Text>
              </View>
              <View className="flex-row items-center justify-between ml-6">
                <Text
                  className={`${
                    isDark ? "text-gray-100" : "text-gray-900"
                  } text-base`}
                >
                  Mon:{" "}
                  {profileData.workingHours.monday.closed
                    ? "Closed"
                    : `${formatTime(
                        profileData.workingHours.monday.open
                      )} - ${formatTime(
                        profileData.workingHours.monday.close
                      )}`}
                </Text>
                <ChevronRight
                  size={16}
                  color={isDark ? "#60A5FA" : "#3B82F6"}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* General Settings */}
        <View
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-xl p-4 mb-4 shadow-sm`}
        >
          <Text
            className={`text-lg font-semibold ${
              isDark ? "text-blue-300" : "text-blue-800"
            } mb-4`}
          >
            {generalLanguageSet.generalSettings}
          </Text>

          {/* Notifications */}
          <View className="flex-row items-center justify-between ">
            <View className="flex-row items-center">
              <Bell size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
              <Text
                className={`ml-3 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {generalLanguageSet.notifications}
              </Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, notifications: value }))
              }
              trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
              thumbColor="white"
            />
          </View>

          {/* Dark Mode */}
          <View className="flex-row items-center justify-between ">
            <View className="flex-row items-center">
              <Moon size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
              <Text
                className={`ml-3 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {generalLanguageSet.darkMode}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
              thumbColor="white"
            />
          </View>

          {/* Language */}
          <View className="flex-row items-center justify-between ">
            <View className="flex-row items-center">
              <Globe size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
              <Text
                className={`ml-3 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {generalLanguageSet.language}
              </Text>
            </View>
            <View
              className={`${
                isDark
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-blue-200"
              } border rounded-lg`}
            >
              <Picker
                selectedValue={language}
                onValueChange={(value) => setLanguage(value)}
                style={{ color: isDark ? "white" : "black", width: 150 }}
              >
                {languages.map((lang) => (
                  <Picker.Item
                    key={lang.value}
                    label={lang.label}
                    value={lang.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Display Device */}
          <TouchableOpacity
            onPress={() => openModal("displayDevice")}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row items-center">
              <Monitor size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
              <View className="ml-3">
                <Text className={`${isDark ? "text-white" : "text-gray-900"}`}>
                  {generalLanguageSet.displayDevice}
                </Text>
                <Text
                  className={`text-xs ${
                    isDark ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  QVuew Display 1 • Connected
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={isDark ? "#60A5FA" : "#3B82F6"} />
          </TouchableOpacity>
        </View>

        {/* Queue Settings */}
        <View
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-xl p-4 mb-4 shadow-sm`}
        >
          <Text
            className={`text-lg font-semibold ${
              isDark ? "text-blue-300" : "text-blue-800"
            } mb-4`}
          >
            {queueLanguageSet.queueSettings}
          </Text>

          {/* Inactivity Reminder */}
          <View className="flex-row items-center justify-between ">
            <View className="flex-row items-center">
              <Clock size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
              <Text
                className={`ml-3 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {queueLanguageSet.inactivityReminder}
              </Text>
            </View>
            <Switch
              value={settings.inactivityReminder}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, inactivityReminder: value }))
              }
              trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
              thumbColor="white"
            />
          </View>

          {/* Inactivity Timeout */}
          {settings.inactivityReminder && (
            <View className="flex-row items-center justify-between  ml-6">
              <Text className={`${isDark ? "text-white" : "text-gray-900"}`}>
                {queueLanguageSet.reminderAfter}
              </Text>
              <View className="flex-row items-center">
                <TextInput
                  value={settings.inactivityTimeout.toString()}
                  onChangeText={(text) =>
                    setSettings((prev) => ({
                      ...prev,
                      inactivityTimeout: parseInt(text) || 5,
                    }))
                  }
                  className={`${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-blue-200 text-gray-900"
                  } border rounded-lg p-2 w-16 text-center`}
                  keyboardType="numeric"
                />
                <Text
                  className={`ml-2 ${
                    isDark ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  {queueLanguageSet.minutes}
                </Text>
              </View>
            </View>
          )}

          {/* Privacy Mode */}
          <View className="flex-row items-center justify-between ">
            <View className="flex-row items-center">
              <Shield size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
              <Text
                className={`ml-3 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {queueLanguageSet.privacyMode}
              </Text>
            </View>
            <Switch
              value={settings.privacyMode}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, privacyMode: value }))
              }
              trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
              thumbColor="white"
            />
          </View>
          {settings.privacyMode && (
            <Text
              className={`text-xs ${
                isDark ? "text-blue-300" : "text-blue-600"
              } ml-9 -mt-2`}
            >
              {queueLanguageSet.hideCustomerNames}
            </Text>
          )}
        </View>

        {/* Security Settings */}
        <View
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-xl p-4 mb-4 shadow-sm`}
        >
          <Text
            className={`text-lg font-semibold ${
              isDark ? "text-blue-300" : "text-blue-800"
            } mb-4`}
          >
            {settingLanguageSet.security}
          </Text>

          {/* Change Password */}
          <TouchableOpacity
            onPress={() => openModal("changePassword")}
            className="flex-row items-center justify-between py-3  border-gray-100 dark:border-gray-700"
          >
            <View className="flex-row items-center">
              <Lock size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
              <Text
                className={`ml-3 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {settingLanguageSet.changePassword}
              </Text>
            </View>
            <ChevronRight size={16} color={isDark ? "#60A5FA" : "#3B82F6"} />
          </TouchableOpacity>

          {/* 2-Factor Authentication */}
          <View className="flex-row items-center justify-between  border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center">
              <Shield size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
              <View className="ml-3">
                <Text className={`${isDark ? "text-white" : "text-gray-900"}`}>
                  {settingLanguageSet.twoFactorAuthentication}
                </Text>
                <Text
                  className={`text-xs ${
                    isDark ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  {twoFactorEnabled
                    ? settingLanguageSet.currentlyEnabled
                    : settingLanguageSet.currentlyDisabled}
                </Text>
              </View>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
              thumbColor="white"
            />
          </View>

          {/* View Login Activity */}
          <TouchableOpacity
            onPress={() => openModal("loginActivity")}
            className="flex-row items-center justify-between py-3  border-gray-100 dark:border-gray-700"
          >
            <View className="flex-row items-center">
              <Eye size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
              <Text
                className={`ml-3 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {settingLanguageSet.viewLoginActivity}
              </Text>
            </View>
            <ChevronRight size={16} color={isDark ? "#60A5FA" : "#3B82F6"} />
          </TouchableOpacity>

          {/* Log Out from All Devices */}
          <TouchableOpacity
            onPress={() => openModal("logoutAllDevices")}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row items-center">
              <LogOut size={18} color="#EF4444" />
              <Text className="ml-3 text-red-500">
                {settingLanguageSet.logOutAllDevices}
              </Text>
            </View>
            <ChevronRight size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Account Settings */}
        <View
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-xl p-4 mb-4 shadow-sm`}
        >
          <Text
            className={`text-lg font-semibold ${
              isDark ? "text-blue-300" : "text-blue-800"
            } mb-4`}
          >
            {accountLanguageSet.account}
          </Text>

          {/* About QVuew */}
          <TouchableOpacity
            onPress={() => openModal("about")}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row items-center">
              <Info size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
              <Text
                className={`ml-3 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {accountLanguageSet.aboutQVuew}
              </Text>
            </View>
            <ChevronRight size={16} color={isDark ? "#60A5FA" : "#3B82F6"} />
          </TouchableOpacity>

          {/* Contact Support */}
          <TouchableOpacity
            onPress={() => openModal("support")}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row items-center">
              <HelpCircle size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
              <Text
                className={`ml-3 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {accountLanguageSet.contactSupport}
              </Text>
            </View>
            <ChevronRight size={16} color={isDark ? "#60A5FA" : "#3B82F6"} />
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity
            onPress={() => openModal("privacy")}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row items-center">
              <Shield size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
              <Text
                className={`ml-3 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {accountLanguageSet.privacyPolicy}
              </Text>
            </View>
            <ChevronRight size={16} color={isDark ? "#60A5FA" : "#3B82F6"} />
          </TouchableOpacity>

          {/* Terms of Service */}
          <TouchableOpacity
            onPress={() => openModal("terms")}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row items-center">
              <Globe size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
              <Text
                className={`ml-3 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {accountLanguageSet.termsOfService}
              </Text>
            </View>
            <ChevronRight size={16} color={isDark ? "#60A5FA" : "#3B82F6"} />
          </TouchableOpacity>

          {/* Manage employer/employee */}
          <TouchableOpacity
            onPress={() => {
              router.push("/(auth)/(signupflows)/code_helper");
            }}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row items-center">
              <QrCode size={18} color={isDark ? "#60A5FA" : "#3B82F6"} />
              <Text
                className={`ml-3 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {regType === "helper"
                  ? manageLanguageSet.manageEmployer
                  : manageLanguageSet.manageEmployee}
              </Text>
            </View>
            <ChevronRight size={16} color={isDark ? "#60A5FA" : "#3B82F6"} />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            onPress={confirmLogout}
            className="flex-row items-center py-3"
          >
            <LogOut size={18} color="#EF4444" />
            <Text className="ml-3 text-red-600">
              {accountLanguageSet.logout}
            </Text>
          </TouchableOpacity>

          {/* Delete Account */}
          <TouchableOpacity
            onPress={confirmDeleteAccount}
            className="flex-row items-center py-3"
          >
            <Trash2 size={18} color="#EF4444" />
            <Text className="ml-3 text-red-600">
              {accountLanguageSet.deleteAccount}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="h-20" />
        <View className="h-20" />
      </ScrollView>

      {/* Working Hours Modal */}
      <Modal visible={modals.workingHours} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-center">
          <View
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } mx-4 rounded-xl max-h-4/5`}
            style={{ maxHeight: "90%", minHeight: "80%" }}
          >
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <Text
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {profileModalLanguageSet.workingHoursModalTitle}
              </Text>
              <TouchableOpacity onPress={() => closeModal("workingHours")}>
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
              <Text
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-4`}
              >
                {profileModalLanguageSet.workingHoursDescription}
              </Text>

              {Object.entries(profileData.workingHours).map(([day, hours]) => (
                <View
                  key={day}
                  className={`mb-4 p-3 rounded-lg ${
                    isDark ? "bg-blue-900/20" : "bg-blue-900/10"
                  } `}
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <Text
                      className={`font-medium capitalize ${
                        isDark ? "text-blue-300" : "text-blue-800"
                      }`}
                    >
                      {day}
                    </Text>
                    <View className="flex-row items-center">
                      <Text
                        className={`text-sm mr-2 ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Closed
                      </Text>
                      <Switch
                        value={hours.closed}
                        onValueChange={(value) =>
                          handleWorkingHoursChange(day, "closed", value)
                        }
                        trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                        thumbColor="white"
                      />
                    </View>
                  </View>

                  {!hours.closed && (
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 mr-2">
                        <Text
                          className={`text-xs mb-1 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Open
                        </Text>
                        <TouchableOpacity
                          onPress={() => openTimePicker(day, "open")}
                          className={`${
                            isDark
                              ? "bg-gray-700 border-gray-600"
                              : "bg-white border-gray-300"
                          } border rounded-lg p-3`}
                        >
                          <Text
                            className={`${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {formatTime(hours.open)}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <Text
                        className={`mx-2 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        to
                      </Text>

                      <View className="flex-1 ml-2">
                        <Text
                          className={`text-xs mb-1  ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                          style={{ textAlign: "right", marginRight: 8 }}
                        >
                          Close
                        </Text>
                        <TouchableOpacity
                          onPress={() => openTimePicker(day, "close")}
                          className={`${
                            isDark
                              ? "bg-gray-700 border-gray-600"
                              : "bg-white border-gray-300"
                          } border rounded-lg p-3`}
                        >
                          <Text
                            className={`${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {formatTime(hours.close)}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <View className="p-4 border-t border-gray-200 dark:border-gray-700">
              <TouchableOpacity
                onPress={() => {
                  closeModal("workingHours");
                  showToast("Working hours updated successfully!");
                }}
                className="bg-blue-600 rounded-lg p-3 flex-row items-center justify-center"
              >
                <Save size={18} color="white" />
                <Text className="ml-2 text-white font-medium">
                  {profileModalLanguageSet.saveHours}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Time Picker Modal */}
      <Modal
        visible={customTimePicker.visible}
        animationType="fade"
        transparent
        onRequestClose={() =>
          setCustomTimePicker((prev) => ({ ...prev, visible: false }))
        }
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              width: "100%",
              maxWidth: 400,
              padding: 20,
            }}
          >
            {/* Header */}
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
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#1E40AF",
                }}
              >
                Select{" "}
                {customTimePicker.field === "open" ? "Opening" : "Closing"} Time
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setCustomTimePicker((prev) => ({ ...prev, visible: false }))
                }
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Time Display */}
            <View
              style={{
                backgroundColor: "#EFF6FF",
                borderRadius: 12,
                padding: 20,
                marginBottom: 20,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: "bold",
                  color: "#1E40AF",
                  letterSpacing: 2,
                }}
              >
                {formatCustomTime()}
              </Text>
            </View>

            {/* Scrollable Time Selectors */}
            <View style={{ marginBottom: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    width: 80,
                    textAlign: "center",
                  }}
                >
                  Hour
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    width: 80,
                    textAlign: "center",
                  }}
                >
                  Minute
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    width: 80,
                    textAlign: "center",
                  }}
                >
                  AM/PM
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Hour Scroll */}
                <View
                  style={{
                    width: 80,
                    height: 140,
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 8,
                    backgroundColor: "#F9FAFB",
                    overflow: "hidden",
                  }}
                >
                  <ScrollView
                    showsVerticalScrollIndicator={true}
                    persistentScrollbar={true}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <TouchableOpacity
                        key={hour}
                        onPress={() =>
                          setCustomTimePicker((prev) => ({ ...prev, hour }))
                        }
                        style={{
                          paddingVertical: 12,
                          alignItems: "center",
                          backgroundColor:
                            customTimePicker.hour === hour
                              ? "#DBEAFE"
                              : "transparent",
                          borderBottomWidth: 0.5,
                          borderBottomColor: "#E5E7EB",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight:
                              customTimePicker.hour === hour ? "600" : "400",
                            color:
                              customTimePicker.hour === hour
                                ? "#1E40AF"
                                : "#1F2937",
                          }}
                        >
                          {hour}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "#6B7280",
                    marginHorizontal: 8,
                  }}
                >
                  :
                </Text>

                {/* Minute Scroll */}
                <View
                  style={{
                    width: 80,
                    height: 140,
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 8,
                    backgroundColor: "#F9FAFB",
                    overflow: "hidden",
                  }}
                >
                  <ScrollView
                    showsVerticalScrollIndicator={true}
                    persistentScrollbar={true}
                  >
                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                      <TouchableOpacity
                        key={minute}
                        onPress={() =>
                          setCustomTimePicker((prev) => ({ ...prev, minute }))
                        }
                        style={{
                          paddingVertical: 12,
                          alignItems: "center",
                          backgroundColor:
                            customTimePicker.minute === minute
                              ? "#DBEAFE"
                              : "transparent",
                          borderBottomWidth: 0.5,
                          borderBottomColor: "#E5E7EB",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight:
                              customTimePicker.minute === minute
                                ? "600"
                                : "400",
                            color:
                              customTimePicker.minute === minute
                                ? "#1E40AF"
                                : "#1F2937",
                          }}
                        >
                          {minute.toString().padStart(2, "0")}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* AM/PM Buttons */}
                <View
                  style={{
                    width: 80,
                    height: 140,
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      setCustomTimePicker((prev) => ({ ...prev, ampm: "AM" }))
                    }
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor:
                        customTimePicker.ampm === "AM" ? "#3B82F6" : "#D1D5DB",
                      borderRadius: 8,
                      backgroundColor:
                        customTimePicker.ampm === "AM" ? "#DBEAFE" : "#F9FAFB",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight:
                          customTimePicker.ampm === "AM" ? "600" : "400",
                        color:
                          customTimePicker.ampm === "AM"
                            ? "#1E40AF"
                            : "#1F2937",
                      }}
                    >
                      AM
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      setCustomTimePicker((prev) => ({ ...prev, ampm: "PM" }))
                    }
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor:
                        customTimePicker.ampm === "PM" ? "#3B82F6" : "#D1D5DB",
                      borderRadius: 8,
                      backgroundColor:
                        customTimePicker.ampm === "PM" ? "#DBEAFE" : "#F9FAFB",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight:
                          customTimePicker.ampm === "PM" ? "600" : "400",
                        color:
                          customTimePicker.ampm === "PM"
                            ? "#1E40AF"
                            : "#1F2937",
                      }}
                    >
                      PM
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Common Times */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "500",
                  color: "#6B7280",
                  marginBottom: 12,
                }}
              >
                Common Times
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {[
                  "9:00 AM",
                  "12:00 PM",
                  "5:00 PM",
                  "8:30 AM",
                  "1:30 PM",
                  "6:30 PM",
                ].map((time) => (
                  <TouchableOpacity
                    key={time}
                    onPress={() => setCommonTime(time)}
                    style={{
                      backgroundColor: "#EFF6FF",
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#BFDBFE",
                      minWidth: "30%",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#1E40AF",
                        fontWeight: "500",
                      }}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() =>
                  setCustomTimePicker((prev) => ({ ...prev, visible: false }))
                }
                style={{
                  flex: 1,
                  backgroundColor: "#F3F4F6",
                  paddingVertical: 14,
                  borderRadius: 8,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSetTime}
                style={{
                  flex: 1,
                  backgroundColor: "#3B82F6",
                  paddingVertical: 14,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  Set Time
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}

      {/* Display Device Modal */}
      <Modal visible={modals.displayDevice} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-center">
          <View
            className={`${isDark ? "bg-gray-800" : "bg-white"} mx-4 rounded-xl`}
          >
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <Text
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {generalModalLanguageSet.displayDevice}
              </Text>
              <TouchableOpacity onPress={() => closeModal("displayDevice")}>
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
              {/* Connected Device */}
              <View className="bg-blue-900/20 p-4 rounded-lg flex-row items-center mb-4">
                <Monitor size={24} color="#3B82F6" />
                <View className="ml-3">
                  <Text
                    className={`font-medium ${
                      isDark ? "text-blue-300" : "text-blue-800"
                    }`}
                  >
                    QVuew Display 1
                  </Text>
                  <Text
                    className={`text-sm ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    Connected • Last synced 2 minutes ago
                  </Text>
                </View>
              </View>

              {/* Display Settings */}
              <Text
                className={`font-medium mb-3 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {generalModalLanguageSet.displaySettings}
              </Text>

              <View className="space-y-3">
                <View className="flex-row items-center justify-between">
                  <Text
                    className={`${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {generalModalLanguageSet.showCustomerNames}
                  </Text>
                  <Switch
                    value={displaydevice.customer_names}
                    onValueChange={(e) =>
                      setDisplaydevice({
                        ...displaydevice,
                        customer_names: !displaydevice.customer_names,
                      })
                    }
                    trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                    thumbColor="white"
                  />
                </View>

                <View className="flex-row items-center justify-between">
                  <Text
                    className={`${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {generalModalLanguageSet.showEstimatedWaitTime}
                  </Text>
                  <Switch
                    value={displaydevice.est_time}
                    onValueChange={(e) =>
                      setDisplaydevice({
                        ...displaydevice,
                        est_time: !displaydevice.est_time,
                      })
                    }
                    trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                    thumbColor="white"
                  />
                </View>

                <View className="flex-row items-center justify-between">
                  <Text
                    className={`${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {generalModalLanguageSet.autoRotateAnnouncements}
                  </Text>
                  <Switch
                    value={displaydevice.rot_announcements}
                    onValueChange={(e) =>
                      setDisplaydevice({
                        ...displaydevice,
                        rot_announcements: !displaydevice.rot_announcements,
                      })
                    }
                    trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                    thumbColor="white"
                  />
                </View>

                <View className="pt-2">
                  <Text
                    className={`text-sm mb-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {generalModalLanguageSet.displayRefreshRate}
                  </Text>
                  <View
                    className={`${
                      isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    } border rounded-lg`}
                  >
                    <Picker
                      selectedValue="5"
                      style={{ color: isDark ? "white" : "black" }}
                    >
                      <Picker.Item label="Every 5 seconds" value="5" />
                      <Picker.Item label="Every 10 seconds" value="10" />
                      <Picker.Item label="Every 30 seconds" value="30" />
                      <Picker.Item label="Every minute" value="60" />
                    </Picker>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <TouchableOpacity className="bg-blue-600 rounded-lg p-3 mb-2">
                <Text className="text-white font-medium text-center">
                  {generalModalLanguageSet.testDisplayConnection}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="border border-blue-300 dark:border-blue-700 rounded-lg p-3">
                <Text
                  className={`font-medium text-center ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {generalModalLanguageSet.disconnectDevice}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <SecurityModals
        modals={modals}
        closeModal={closeModal}
        showToast={showToast}
      />

      <AccountModals
        modals={modals}
        closeModal={closeModal}
        showToast={showToast}
        profileData
      />
    </LinearGradient>
  );
}
