import useThemeStore from "@/store/themeStore";
import { loginTranslations } from "@/translations/loginTranslations";
import { Box } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, language, setLanguage } = useThemeStore();
  const languageSet = loginTranslations[language];

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

    // Icon colors
    iconColor: isDark ? "#60A5FA" : "#3B82F6", // dark:text-blue-400
    backButtonColor: isDark ? "#60A5FA" : "#3B82F6", // dark:text-blue-400

    // Input fields
    inputBg: isDark ? "#374151" : "white", // dark:bg-gray-700
    inputBorder: isDark ? "#4B5563" : "#E5E7EB", // dark:border-gray-600
    inputText: isDark ? "#F9FAFB" : "#111827", // dark:text-white
    placeholderColor: isDark ? "#9CA3AF" : "#6B7280",

    // Links
    forgotPasswordLink: isDark ? "#93C5FD" : "#3B82F6", // dark:text-blue-300
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateForm = () => {
    const result = loginSchema.safeParse({ email, password });
    if (result.success) {
      router.replace("/connect-device");
      setErrors({ email: "", password: "" });
      return true;
    } else {
      const newErrors = { email: "", password: "" };
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === "email")
          newErrors.email = "Invalid email address";
        if (issue.path[0] === "password")
          newErrors.password = "Password must be at least 6 characters";
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleLogin = () => {
    if (validateForm()) {
      console.log("Login pressed", { email, password });
    }
  };

  useEffect(() => {
    setErrors({ email: "", password: "" });
  }, [email, password]);

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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                position: "absolute",
                top: 60,
                left: 15,
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                zIndex: 10,
              }}
            >
              <ArrowLeft size={20} color={colors.backButtonColor} />
              <Text
                style={{
                  color: colors.backButtonColor,
                  marginLeft: 4,
                  fontSize: 16,
                }}
              >
                {languageSet.back}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "flex-start",
                paddingHorizontal: 16,
                paddingTop: 120,
                paddingBottom: 40,
                width: "100%",
              }}
            >
              {/* Header */}
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: colors.textPrimary,
                  marginBottom: 8,
                  textAlign: "left",
                }}
              >
                {languageSet.welcomeBack}
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 16,
                  textAlign: "left",
                  marginBottom: 40,
                }}
              >
                {languageSet.logInToAccount}
              </Text>

              {/* Email Input */}
              <View
                style={{
                  width: "100%",
                  marginBottom: 8,
                }}
              >
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
                  <TextInput
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      fontSize: 16,
                      color: colors.inputText,
                    }}
                    placeholder={languageSet.emailOrPhone}
                    placeholderTextColor={colors.placeholderColor}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
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
                      {errors.email}
                    </Text>
                  ) : null}
                </View>
              </View>

              {/* Password Input */}
              <View
                style={{
                  width: "100%",
                  marginBottom: 8,
                }}
              >
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
                  <TextInput
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      fontSize: 16,
                      color: colors.inputText,
                    }}
                    placeholder={languageSet.password}
                    placeholderTextColor={colors.placeholderColor}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    textContentType={showPassword ? "none" : "password"}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ padding: 4 }}
                  >
                    {showPassword ? (
                      <Eye size={20} color={colors.iconColor} />
                    ) : (
                      <EyeOff size={20} color={colors.iconColor} />
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
                      {errors.password}
                    </Text>
                  ) : null}
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginBottom: 32,
                }}
                onPress={() => router.push("/(auth)/forgot-password")}
              >
                <Text
                  style={{
                    color: colors.forgotPasswordLink,
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  {languageSet.forgotPassword}
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <Box width="100%" marginBottom={8}>
                <TouchableOpacity style={{ width: "100%" }} onPress={handleLogin}>
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
                      {languageSet.logIn}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Box>

              {/* Sign Up Link */}
              <TouchableOpacity
                onPress={() => router.push("/(auth)/(signupflows)/choose")}
                style={{ width: "100%", alignItems: "center" }}
              >
                <Text
                  style={{
                    color: colors.textAccent,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  {languageSet.noAccount.split(" ").map((word: any, index: any) =>
                    word === "Sign" || word === "Up" ? (
                      <Text key={index} style={{ fontWeight: "600" }}>
                        {word}{" "}
                      </Text>
                    ) : (
                      <Text key={index}>{word} </Text>
                    )
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
