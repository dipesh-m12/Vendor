import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, TextInput, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import useThemeStore from "@/store/themeStore";
import ThemeWidget from "@/components/ThemeWidget";
import LanguageWidget from "@/components/LanguageWidget";
import { ArrowLeft, Mail, Lock } from "lucide-react-native";
import { forgotPassTranslations } from "@/translations/forgotPassTranslations";
import { z } from "zod";
import { SafeAreaView } from "react-native-safe-area-context";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const codeSchema = z.object({
  code: z.array(z.string().length(1)).length(4),
});

const passwordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { isDark, language } = useThemeStore();
  const languageSet = forgotPassTranslations[language];
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [errors, setErrors] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const codeInputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    setCountdown(30);
    Alert.alert("Success", "Code resent successfully");
  };

  const handleCodeChange = (value: any, index: any) => {
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    if (value && index < 3) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const validateStep1 = () => {
    const result = emailSchema.safeParse({ email });
    if (result.success) {
      setErrors((prev) => ({ ...prev, email: "" }));
      return true;
    } else {
      setErrors((prev) => ({ ...prev, email: result.error.issues[0].message }));
      return false;
    }
  };

  const validateStep2 = () => {
    const result = codeSchema.safeParse({ code: verificationCode });
    if (result.success) {
      setErrors((prev) => ({ ...prev, code: "" }));
      return true;
    } else {
      setErrors((prev) => ({ ...prev, code: "Please enter a 4-digit code" }));
      return false;
    }
  };

  const validateStep3 = () => {
    const result = passwordSchema.safeParse({ newPassword, confirmPassword });
    if (result.success) {
      setErrors((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }));
      return true;
    } else {
      const newErrors = { newPassword: "", confirmPassword: "" };
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === "newPassword")
          newErrors.newPassword = issue.message;
        if (issue.path[0] === "confirmPassword")
          newErrors.confirmPassword = issue.message;
      });
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return false;
    }
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      router.push("/(auth)/signin");
    }
  };

  useEffect(() => {
    setErrors({ email: "", code: "", newPassword: "", confirmPassword: "" });
  }, [email, verificationCode, newPassword, confirmPassword]);

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
              backgroundColor:
                step >= stepNum ? "#3B82F6" : isDark ? "#4B5563" : "#E5E7EB",
              borderRadius: 2,
            }}
          />
        ))}
      </View>
      <Text style={{ color: "#3B82F6", fontSize: 14 }}>
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
          color: isDark ? "#F8FAFC" : "#1E3A8A",
          marginBottom: 8,
        }}
      >
        {languageSet.forgotPassword}
      </Text>
      <Text
        style={{
          color: "#3B82F6",
          fontSize: 16,
          marginBottom: 32,
        }}
      >
        {languageSet.enterEmail}
      </Text>
      <View style={{ width: "100%", marginBottom: 8 }}>
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
            placeholder={languageSet.emailAddress}
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
      <TouchableOpacity
        style={{ width: "100%", marginBottom: 24 }}
        onPress={handleNextStep}
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
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
            {languageSet.sendVerificationCode}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      <Text
        style={{
          color: "#3B82F6",
          fontSize: 14,
          textAlign: "center",
        }}
        className=" w-full"
      >
        {languageSet.verificationSent}
      </Text>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: isDark ? "#F8FAFC" : "#1E3A8A",
          marginBottom: 8,
        }}
      >
        {languageSet.verifyYourEmail}
      </Text>
      <Text
        style={{
          color: "#3B82F6",
          fontSize: 16,
          marginBottom: 32,
        }}
      >
        {languageSet.enterCode}
      </Text>
      <View
        style={{
          backgroundColor: isDark ? "#374151" : "white",
          borderRadius: 12,
          padding: 20,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: isDark ? "#4B5563" : "#E5E7EB",
          width: "100%",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: isDark ? "#F9FAFB" : "#111827",
            marginBottom: 8,
          }}
        >
          {languageSet.enterVerificationCode}
        </Text>
        <Text
          style={{
            color: "#3B82F6",
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          {languageSet.codeSent}
        </Text>
        <View
          style={{ flexDirection: "row", gap: 12, justifyContent: "center" }}
        >
          {verificationCode.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (codeInputRefs.current[index] = ref)}
              style={{
                width: 50,
                height: 50,
                backgroundColor: isDark ? "#4B5563" : "#F9FAFB",
                borderRadius: 8,
                textAlign: "center",
                fontSize: 18,
                fontWeight: "600",
                color: isDark ? "#F9FAFB" : "#111827",
                borderWidth: 1,
                borderColor: isDark ? "#6B7280" : "#D1D5DB",
              }}
              value={digit}
              onChangeText={(value) => handleCodeChange(value, index)}
              maxLength={1}
              keyboardType="numeric"
            />
          ))}
        </View>
      </View>
      <View className="h-5 w-full">
        {errors.code ? (
          <Text
            style={{
              color: "red",
              fontSize: 11,
              textAlign: "left",
              marginTop: 4,
            }}
          >
            {errors.code}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity
        style={{ width: "100%", marginBottom: 24 }}
        onPress={handleNextStep}
        disabled={!verificationCode.every((d) => d !== "")}
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
            opacity: verificationCode.every((d) => d !== "") ? 1 : 0.5,
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
            {languageSet.verifyCode}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={countdown > 0}
        onPress={handleResend}
        style={{ width: "100%", alignItems: "center" }}
      >
        <Text
          style={{
            color: "#3B82F6",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {languageSet.didntReceive}{" "}
          {countdown > 0 ? `Resend Code in ${countdown}s` : "Resend Code"}
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: isDark ? "#F8FAFC" : "#1E3A8A",
          marginBottom: 8,
        }}
      >
        {languageSet.createNewPassword}
      </Text>
      <Text
        style={{
          color: "#3B82F6",
          fontSize: 16,
          marginBottom: 32,
        }}
      >
        {languageSet.enterNewPassword}
      </Text>
      <View style={{ width: "100%", marginBottom: 8 }}>
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
            placeholder={languageSet.newPassword}
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true}
          />
        </View>
        <View className="h-5">
          {errors.newPassword ? (
            <Text
              style={{
                color: "red",
                fontSize: 11,
                textAlign: "left",
                marginTop: 4,
              }}
            >
              {errors.newPassword}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={{ width: "100%", marginBottom: 8 }}>
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
            placeholder={languageSet.confirmNewPassword}
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
          />
        </View>
        <View className="h-5">
          {errors.confirmPassword ? (
            <Text
              style={{
                color: "red",
                fontSize: 11,
                textAlign: "left",
                marginTop: 4,
              }}
            >
              {errors.confirmPassword}
            </Text>
          ) : null}
        </View>
      </View>
      <TouchableOpacity
        style={{ width: "100%", marginBottom: 24 }}
        onPress={handleNextStep}
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
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
            {languageSet.updatePassword}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/(auth)/signin")}
        style={{ width: "100%", alignItems: "center" }}
      >
        <Text
          style={{
            color: "#3B82F6",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {`${languageSet.rememberPassword.split("?")[0]}?`}{" "}
          <Text style={{ fontWeight: "600" }}>
            {languageSet.rememberPassword.split("?")[1]}
          </Text>
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView className="flex-1">
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
        {/* <ThemeWidget isDark={isDark} toggleTheme={toggleTheme} /> */}
        {/* <LanguageWidget
          setLanguage={setLanguage}
          isDark={isDark}
          language={language}
        /> */}
        <TouchableOpacity
          onPress={() => (step === 1 ? router.back() : setStep(step - 1))}
          style={{
            position: "absolute",
            top: 30,
            left: 15,
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 0,
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
        {renderStepIndicator()}

        <View
          style={{
            flex: 1,
            alignItems: "flex-start",
            // justifyContent: "",
            paddingHorizontal: 16,
            marginTop: 40,
            width: "100%",
          }}
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
