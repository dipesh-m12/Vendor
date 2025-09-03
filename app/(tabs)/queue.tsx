/* eslint-disable react-hooks/rules-of-hooks */
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ThemeWidget from "@/components/ThemeWidget";
import LanguageWidget from "@/components/LanguageWidget";
import useThemeStore from "@/store/themeStore";

const queue = () => {
  const { isDark, toggleTheme, setLanguage, language } = useThemeStore();

  return (
    <SafeAreaView>
      <Text>queue</Text>
      <TouchableOpacity onPress={() => useRouter().push("/qrcode")}>
        <Text>Go to qrcode</Text>

        {/* Simple Theme Toggle */}
        <ThemeWidget isDark={isDark} toggleTheme={toggleTheme} />

        {/* Language Widget */}
        <LanguageWidget
          setLanguage={setLanguage}
          isDark={isDark}
          language={language}
        />
        {/* Main Content */}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default queue;

const styles = StyleSheet.create({});
