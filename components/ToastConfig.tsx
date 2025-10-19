import { CheckCircle, Info, XCircle } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Custom toast configuration
export const toastConfig = {
  success: (props: any) => (
    <View style={[styles.toastContainer, styles.successToast]}>
      <View style={styles.iconContainer}>
        <CheckCircle size={24} color="white" fill="white" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.mainText}>{props.text1}</Text>
        {props.text2 && <Text style={styles.secondaryText}>{props.text2}</Text>}
      </View>
    </View>
  ),

  info: (props: any) => (
    <View style={[styles.toastContainer, styles.infoToast]}>
      <View style={styles.iconContainer}>
        <Info size={24} color="white" fill="white" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.mainText}>{props.text1}</Text>
        {props.text2 && <Text style={styles.secondaryText}>{props.text2}</Text>}
      </View>
    </View>
  ),

  error: (props: any) => (
    <View style={[styles.toastContainer, styles.errorToast]}>
      <View style={styles.iconContainer}>
        <XCircle size={24} color="white" fill="white" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.mainText}>{props.text1}</Text>
        {props.text2 && <Text style={styles.secondaryText}>{props.text2}</Text>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 60,
  },
  successToast: {
    backgroundColor: "#10B981",
  },
  infoToast: {
    backgroundColor: "#3B82F6",
  },
  errorToast: {
    backgroundColor: "#EF4444",
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  mainText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  secondaryText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "400",
  },
});
