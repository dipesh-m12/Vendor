import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import useThemeStore from "@/store/themeStore";
import { Picker } from "@react-native-picker/picker";
import { X } from "lucide-react-native";
import { z } from "zod";
import { ActivityIndicator } from "react-native";
import { accountModalsTranslations } from "@/translations/tabsTranslations/settings/accountTranslations";

const supportSchema = z.object({
  subject: z.string().min(1, "Please select a topic"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters long")
    .max(1000, "Message cannot exceed 1000 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
});

const AccountModals = ({ modals, closeModal, showToast, profileData }: any) => {
  const { isDark, language } = useThemeStore();
  const accountModalLanguageSet = accountModalsTranslations[language];

  // State variables
  const [isLoading, setIsLoading] = useState(false);
  const [supportData, setSupportData] = useState({
    subject: "",
    message: "",
    email: profileData?.email || "",
  });
  const [errors, setErrors] = useState({});

  // Validation function
  const validateSupportForm = () => {
    try {
      supportSchema.parse(supportData);
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      if (error.name === "ZodError") {
        error.issues.forEach((issue: any) => {
          const fieldName = issue.path[0];
          newErrors[fieldName] = issue.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  // Form submission handler
  const handleSubmitSupport = () => {
    if (validateSupportForm()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        closeModal("support");
        setSupportData({
          subject: "",
          message: "",
          email: profileData?.email || "",
        });
        setErrors({});
        showToast("Support request submitted successfully!");
      }, 2000);
    }
  };

  // Input change handler
  const handleInputChange = (field, value) => {
    setSupportData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <>
      {/* About Modal */}
      <Modal visible={modals.about} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-center">
          <View
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } mx-4 rounded-xl p-4`}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {accountModalLanguageSet.aboutQVuew}
              </Text>
              <TouchableOpacity onPress={() => closeModal("about")}>
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <View className="items-center mb-4">
              <View className="w-20 h-20 bg-blue-600 rounded-xl items-center justify-center mb-4">
                <Text className="text-white text-2xl font-bold">Q</Text>
              </View>
              <Text
                className={`text-xl font-bold ${
                  isDark ? "text-blue-300" : "text-blue-800"
                }`}
              >
                QVuew
              </Text>
              <Text className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Version 1.2.3
              </Text>
            </View>

            <Text
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              } mb-4 text-center`}
            >
              {accountModalLanguageSet.qvuewDescription}
            </Text>

            <Text
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              } text-center mb-6`}
            >
              © 2023 QVuew Technologies. All rights reserved.
            </Text>

            <TouchableOpacity
              onPress={() => {
                closeModal("about");
                showToast("You're using the latest version!");
              }}
              className="bg-blue-600 rounded-lg p-3 mb-3"
            >
              <Text className="text-white font-medium text-center">
                {accountModalLanguageSet.checkForUpdates}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="border border-blue-300 dark:border-blue-700 rounded-lg p-3">
              <Text
                className={`font-medium text-center ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {accountModalLanguageSet.visitWebsite}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Support Modal */}
      <Modal visible={modals.support} animationType="slide" transparent>
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
                {accountModalLanguageSet.contactSupport}
              </Text>
              <TouchableOpacity onPress={() => closeModal("support")}>
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
              <Text
                className={`${isDark ? "text-gray-400" : "text-gray-600"} mb-4`}
              >
                {accountModalLanguageSet.supportHelpText}
              </Text>

              <View className="space-y-4">
                <View>
                  <Text
                    className={`text-sm mb-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {accountModalLanguageSet.subject}
                  </Text>
                  <View
                    className={`${
                      isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    } border rounded-lg`}
                  >
                    <Picker
                      selectedValue={supportData.subject}
                      onValueChange={(value) =>
                        handleInputChange("subject", value)
                      }
                      style={{ color: isDark ? "white" : "black" }}
                    >
                      <Picker.Item label="Select a topic" value="" />
                      <Picker.Item label="Technical Issue" value="technical" />
                      <Picker.Item label="Billing Question" value="billing" />
                      <Picker.Item label="Feature Request" value="feature" />
                      <Picker.Item label="Account Help" value="account" />
                      <Picker.Item label="Other" value="other" />
                    </Picker>
                  </View>
                  <View className="h-5 pl-5">
                    {errors.subject && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.subject}
                      </Text>
                    )}
                  </View>
                </View>

                <View>
                  <Text
                    className={`text-sm mb-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {accountModalLanguageSet.message}
                  </Text>
                  <TextInput
                    value={supportData.message}
                    onChangeText={(text) => handleInputChange("message", text)}
                    className={`${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } border rounded-lg p-3 h-24`}
                    placeholder={accountModalLanguageSet.describeIssue}
                    placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                    multiline
                    textAlignVertical="top"
                  />
                  <View className="h-5 pl-5">
                    {errors.message && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.message}
                      </Text>
                    )}
                  </View>
                </View>

                <View>
                  <Text
                    className={`text-sm mb-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {accountModalLanguageSet.emailForResponse}
                  </Text>
                  <TextInput
                    value={supportData.email}
                    onChangeText={(text) => handleInputChange("email", text)}
                    className={`${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } border rounded-lg p-3`}
                    placeholder="your@email.com"
                    placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                    keyboardType="email-address"
                  />
                  <View className="h-5 pl-5">
                    {errors.email && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>

            <View className="p-4 border-t border-gray-200 dark:border-gray-700">
              <TouchableOpacity
                onPress={handleSubmitSupport}
                disabled={isLoading}
                className="bg-blue-600 rounded-lg p-3 mb-3 flex-row items-center justify-center"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-medium text-center">
                    {accountModalLanguageSet.submitRequest}
                  </Text>
                )}
              </TouchableOpacity>
              <Text
                className={`text-center text-xs ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Typical response time: 24-48 hours
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal visible={modals.privacy} animationType="slide" transparent>
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
                {accountModalLanguageSet.privacyPolicy}
              </Text>
              <TouchableOpacity onPress={() => closeModal("privacy")}>
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
              <Text
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-4`}
              >
                Last updated: January 15, 2024
              </Text>

              <Text
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Information We Collect
              </Text>
              <Text
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-4`}
              >
                We collect information you provide directly to us, such as when
                you create an account, use our services, or contact us for
                support. This may include your name, email address, business
                information, and usage data.
              </Text>

              <Text
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                How We Use Your Information
              </Text>
              <Text
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-4`}
              >
                We use the information we collect to provide, maintain, and
                improve our services, process transactions, send you technical
                notices and support messages, and comply with legal obligations.
              </Text>

              <Text
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Information Sharing
              </Text>
              <Text
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-4`}
              >
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except as
                described in this policy or as required by law.
              </Text>

              <Text
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Data Security
              </Text>
              <Text
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-4`}
              >
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction.
              </Text>

              <Text
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Contact Us
              </Text>
              <Text
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-4`}
              >
                If you have any questions about this Privacy Policy, please
                contact us at privacy@qvuew.com.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal visible={modals.terms} animationType="slide" transparent>
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
                {accountModalLanguageSet.termsOfService}
              </Text>
              <TouchableOpacity onPress={() => closeModal("terms")}>
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
              <Text
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-4`}
              >
                Last updated: January 15, 2024
              </Text>

              <Text
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Acceptance of Terms
              </Text>
              <Text
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-4`}
              >
                By accessing and using QVuew, you accept and agree to be bound
                by the terms and provision of this agreement.
              </Text>

              <Text
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Use License
              </Text>
              <Text
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-4`}
              >
                Permission is granted to temporarily use QVuew for personal and
                commercial use. This license shall automatically terminate if
                you violate any of these restrictions.
              </Text>

              <Text
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Disclaimer
              </Text>
              <Text
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-4`}
              >
                The materials on QVuew are provided on an &apos;as is&apos;
                basis. QVuew makes no warranties, expressed or implied, and
                hereby disclaim and negate all other warranties.
              </Text>

              <Text
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Limitations
              </Text>
              <Text
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-4`}
              >
                In no event shall QVuew or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit) arising out of the use or inability to use QVuew.
              </Text>

              <Text
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Modifications
              </Text>
              <Text
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-4`}
              >
                QVuew may revise these terms of service at any time without
                notice. By using this service, you are agreeing to be bound by
                the current version of these terms.
              </Text>

              <Text
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Contact Information
              </Text>
              <Text
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                } mb-4`}
              >
                If you have any questions about these Terms of Service, please
                contact us at legal@qvuew.com.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AccountModals;
