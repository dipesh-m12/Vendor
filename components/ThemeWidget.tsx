import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

const ThemeWidget = ({ isDark, toggleTheme }: any) => {
  return (
    <Pressable
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
    </Pressable>
  );
};

export default ThemeWidget;

const styles = StyleSheet.create({});
