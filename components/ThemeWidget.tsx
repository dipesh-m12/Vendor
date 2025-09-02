import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const ThemeWidget = ({ isDark, toggleTheme }: any) => {
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={{
        position: "absolute",
        top: 60,
        right: 20,
        padding: 10,
        backgroundColor: isDark ? "#374151" : "white",
        borderRadius: 8,
      }}
    >
      <Text>{isDark ? "🌙" : "☀️"}</Text>
    </TouchableOpacity>
  );
};

export default ThemeWidget;

const styles = StyleSheet.create({});
