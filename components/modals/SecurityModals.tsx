import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { CheckCircle, Eye, EyeOff, LogOut, X, Lock } from "lucide-react-native";
import { isLoading } from "expo-font";
import useThemeStore from "@/store/themeStore";
import z from "zod";
import { securityModalsTranslations } from "@/translations/tabsTranslations/settings/securityTranslations";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

const SecurityModals = ({ modals, closeModal, showToast }: any) => {
  const { isDark, language } = useThemeStore();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<any>({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const securityModalLanguageSet = securityModalsTranslations[language];

  // Password handling
  const handlePasswordChange = () => {
    try {
      // Validate using Zod schema
      passwordSchema.parse(passwordData);

      // Clear any previous errors
      setPasswordErrors({});

      // Start loading
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        closeModal("changePassword");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswords({
          current: false,
          new: false,
          confirm: false,
        });
        showToast("Password changed successfully!");
      }, 1000);
    } catch (error: any) {
      const newErrors = {};

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

      setPasswordErrors(newErrors);
    }
  };
  return (
    <>
      {/* Change Password Modal */}
      <Modal visible={modals.changePassword} animationType="slide" transparent>
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
                {securityModalLanguageSet.changePassword}
              </Text>
              <TouchableOpacity onPress={() => closeModal("changePassword")}>
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <View className="p-4 space-y-4">
              {/* Current Password */}
              <View style={{ marginBottom: 15 }}>
                <Text
                  className={`text-sm mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {securityModalLanguageSet.currentPassword}
                </Text>
                <View className="relative">
                  <TextInput
                    value={passwordData.currentPassword}
                    onChangeText={(text) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: text,
                      }))
                    }
                    secureTextEntry={showPasswords.current}
                    className={`${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } border rounded-lg p-3 pr-12`}
                    placeholder={securityModalLanguageSet.enterCurrentPassword}
                    placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                    className="absolute right-3 top-3"
                  >
                    {showPasswords.current ? (
                      <EyeOff
                        size={18}
                        color={isDark ? "#9CA3AF" : "#6B7280"}
                      />
                    ) : (
                      <Eye size={18} color={isDark ? "#9CA3AF" : "#6B7280"} />
                    )}
                  </TouchableOpacity>
                </View>
                {passwordErrors.currentPassword && (
                  <Text className="text-red-500 text-xs mt-1">
                    {passwordErrors.currentPassword}
                  </Text>
                )}
              </View>

              {/* New Password */}
              <View style={{ marginBottom: 15 }}>
                <Text
                  className={`text-sm mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {securityModalLanguageSet.newPassword}
                </Text>
                <View className="relative">
                  <TextInput
                    value={passwordData.newPassword}
                    onChangeText={(text) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: text,
                      }))
                    }
                    secureTextEntry={showPasswords.new}
                    className={`${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } border rounded-lg p-3 pr-12`}
                    placeholder={securityModalLanguageSet.enterNewPassword}
                    placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                    }
                    className="absolute right-3 top-3"
                  >
                    {showPasswords.new ? (
                      <EyeOff
                        size={18}
                        color={isDark ? "#9CA3AF" : "#6B7280"}
                      />
                    ) : (
                      <Eye size={18} color={isDark ? "#9CA3AF" : "#6B7280"} />
                    )}
                  </TouchableOpacity>
                </View>
                {passwordErrors.newPassword && (
                  <Text className="text-red-500 text-xs mt-1">
                    {passwordErrors.newPassword}
                  </Text>
                )}
              </View>

              {/* Confirm Password */}
              <View style={{ marginBottom: 8 }}>
                <Text
                  className={`text-sm mb-1 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {securityModalLanguageSet.confirmNewPassword}
                </Text>
                <View className="relative">
                  <TextInput
                    value={passwordData.confirmPassword}
                    onChangeText={(text) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: text,
                      }))
                    }
                    secureTextEntry={showPasswords.confirm}
                    className={`${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } border rounded-lg p-3 pr-12`}
                    placeholder={
                      securityModalLanguageSet.confirmNewPasswordPlaceholder
                    }
                    placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                    className="absolute right-3 top-3"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff
                        size={18}
                        color={isDark ? "#9CA3AF" : "#6B7280"}
                      />
                    ) : (
                      <Eye size={18} color={isDark ? "#9CA3AF" : "#6B7280"} />
                    )}
                  </TouchableOpacity>
                </View>
                {passwordErrors.confirmPassword && (
                  <Text className="text-red-500 text-xs mt-1">
                    {passwordErrors.confirmPassword}
                  </Text>
                )}
              </View>
            </View>

            <View className="p-4 border-t border-gray-200 dark:border-gray-700">
              <TouchableOpacity
                onPress={handlePasswordChange}
                disabled={isLoading}
                className="bg-blue-600 rounded-lg p-3 flex-row items-center justify-center"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Lock size={18} color="white" />
                    <Text className="ml-2 text-white font-medium">
                      {securityModalLanguageSet.savePassword}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Login Activity Modal */}
      <Modal visible={modals.loginActivity} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-center">
          <View
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } mx-4 rounded-xl `}
            style={{ height: "70%" }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <Text
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {securityModalLanguageSet.loginActivity}
              </Text>
              <TouchableOpacity onPress={() => closeModal("loginActivity")}>
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            {/* Login Activity List */}
            <ScrollView className="flex-1">
              {[
                {
                  id: 1,
                  device: "iPhone 14",
                  date: "2024-01-15 10:30 AM",
                  location: "Mumbai, India",
                  status: "success",
                },
                {
                  id: 2,
                  device: "Chrome Browser",
                  date: "2024-01-14 02:15 PM",
                  location: "Mumbai, India",
                  status: "success",
                },
                {
                  id: 3,
                  device: "Android Phone",
                  date: "2024-01-13 09:45 AM",
                  location: "Delhi, India",
                  status: "failed",
                },
                {
                  id: 4,
                  device: "iPhone 14",
                  date: "2024-01-12 06:20 PM",
                  location: "Mumbai, India",
                  status: "success",
                },
                {
                  id: 5,
                  device: "Safari Browser",
                  date: "2024-01-11 11:30 AM",
                  location: "Pune, India",
                  status: "success",
                },
              ].map((activity) => (
                <View
                  key={activity.id}
                  className={`p-4 border-b border-gray-100 ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  } flex-row items-center`}
                >
                  <View className="mr-3">
                    {activity.status === "success" ? (
                      <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center">
                        <CheckCircle size={16} color="#10B981" />
                      </View>
                    ) : (
                      <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center">
                        <X size={16} color="#EF4444" />
                      </View>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {activity.device}
                    </Text>
                    <Text
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {activity.date}
                    </Text>
                    <Text
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {activity.location}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Logout All Devices Modal */}
      <Modal visible={modals.logoutAllDevices} animationType="fade" transparent>
        <View className="flex-1 bg-black/50 justify-center">
          <View
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } mx-4 rounded-xl p-6 px-3`}
          >
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                <LogOut size={32} color="#EF4444" />
              </View>
            </View>
            <Text
              className={`text-xl font-semibold text-center mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {securityModalLanguageSet.logOutAllDevices}
            </Text>
            <Text
              className={`text-center mb-6  ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {securityModalLanguageSet.logOutConfirmation}
            </Text>
            <View className="flex-row space-x-3" style={{ gap: 10 }}>
              <TouchableOpacity
                onPress={() => closeModal("logoutAllDevices")}
                className={`flex-1 p-3 rounded-lg border ${
                  isDark
                    ? "border-gray-600 bg-gray-700"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {securityModalLanguageSet.cancel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  closeModal("logoutAllDevices");
                  showToast("Logged out from all devices successfully");
                }}
                className="flex-1 p-3 rounded-lg bg-red-600"
              >
                <Text className="text-center font-medium text-white">
                  {securityModalLanguageSet.logOutAllDevices}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SecurityModals;
