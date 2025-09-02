import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Box } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import useThemeStore from "@/store/themeStore";
import ThemeWidget from "@/components/ThemeWidget";
import LanguageWidget from "@/components/LanguageWidget";
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react-native";
import { loginTranslations } from "@/translations/loginTranslations";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, language, setLanguage } = useThemeStore();
  const languageSet = loginTranslations[language];
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
      colors={
        isDark
          ? ["#1E1B4B", "#312E81", "#3730A3"]
          : ["#F1F5F9", "#E2E8F0", "#CBD5E1"]
      }
      start={[0, 0]}
      end={[0, 1]}
      style={{ flex: 1 }}
    >
      {/* <ThemeWidget isDark={isDark} toggleTheme={toggleTheme} />
      <LanguageWidget
        setLanguage={setLanguage}
        isDark={isDark}
        language={language}
      /> */}

      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 60,
          left: 15,
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <ArrowLeft size={20} color="#3B82F6" />
        <Text
          style={{
            color: "#3B82F6",
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
          marginTop: -50,
          width: "100%",
        }}
      >
        {/* Header */}
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: isDark ? "#F8FAFC" : "#1E3A8A",
            marginBottom: 8,
            textAlign: "left",
          }}
        >
          {languageSet.welcomeBack}
        </Text>
        <Text
          style={{
            color: "#3B82F6",
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
              backgroundColor: isDark ? "#374151" : "white",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: isDark ? "#4B5563" : "#E5E7EB",
            }}
          >
            <Mail size={20} color="#3B82F6" />
            <TextInput
              style={{
                flex: 1,
                marginLeft: 12,
                fontSize: 16,
                color: isDark ? "#F9FAFB" : "#111827",
              }}
              placeholder={languageSet.emailOrPhone}
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View className="h-5">
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
              backgroundColor: isDark ? "#374151" : "white",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: isDark ? "#4B5563" : "#E5E7EB",
            }}
          >
            <Lock size={20} color="#3B82F6" />
            <TextInput
              style={{
                flex: 1,
                marginLeft: 12,
                fontSize: 16,
                color: isDark ? "#F9FAFB" : "#111827",
              }}
              placeholder={languageSet.password}
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
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
                <Eye size={20} color="#3B82F6" />
              ) : (
                <EyeOff size={20} color="#3B82F6" />
              )}
            </TouchableOpacity>
          </View>
          <View className="h-5">
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
              color: isDark ? "#A5B4FC" : "#3B82F6",
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
                {languageSet.logIn}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Box>

        {/* Sign Up Link */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/signup")}
          className=" text-center w-full"
        >
          <Text
            style={{
              color: "#3B82F6",
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
    </LinearGradient>
  );
}
