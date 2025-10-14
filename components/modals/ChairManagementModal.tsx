import { LinearGradient } from "expo-linear-gradient";
import { Armchair, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Chair {
  id: number;
  name: string;
  assignedPerson: string;
  isActive: boolean;
}

interface ChairManagementModalProps {
  visible: boolean;
  onClose: () => void;
  isDark: boolean;
}

export default function ChairManagementModal({
  visible,
  onClose,
  isDark,
}: ChairManagementModalProps) {
  // Mock data for chairs
  const [chairs, setChairs] = useState<Chair[]>([
    { id: 1, name: "Chair 1", assignedPerson: "John Doe", isActive: true },
    { id: 2, name: "Chair 2", assignedPerson: "Jane Smith", isActive: true },
    { id: 3, name: "Chair 3", assignedPerson: "Mike Johnson", isActive: false },
    { id: 4, name: "Chair 4", assignedPerson: "Sarah Williams", isActive: true },
  ]);

  const toggleChairStatus = (chairId: number) => {
    setChairs((prevChairs) =>
      prevChairs.map((chair) =>
        chair.id === chairId ? { ...chair, isActive: !chair.isActive } : chair
      )
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: isDark ? "#374151" : "white",
            borderRadius: 16,
            padding: 24,
            width: "100%",
            maxWidth: 400,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: isDark ? "#F8FAFC" : "#1E3A8A",
              }}
            >
              Manage your Chairs
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
            </TouchableOpacity>
          </View>

          {/* Chairs Grid */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              {chairs.map((chair) => (
                <TouchableOpacity
                  key={chair.id}
                  onPress={() => toggleChairStatus(chair.id)}
                  style={{
                    width: "47%",
                    alignItems: "center",
                  }}
                >
                  {/* Chair Circle */}
                  <View
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 60,
                      backgroundColor: chair.isActive
                        ? isDark
                          ? "#10B981"
                          : "#D1FAE5"
                        : isDark
                        ? "#6B7280"
                        : "#F3F4F6",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12,
                      borderWidth: 3,
                      borderColor: chair.isActive
                        ? "#10B981"
                        : isDark
                        ? "#4B5563"
                        : "#D1D5DB",
                    }}
                  >
                    <Armchair
                      size={48}
                      color={
                        chair.isActive
                          ? isDark
                            ? "white"
                            : "#10B981"
                          : isDark
                          ? "#9CA3AF"
                          : "#6B7280"
                      }
                    />
                  </View>

                  {/* Chair Name */}
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: isDark ? "#F8FAFC" : "#1E3A8A",
                      marginBottom: 4,
                    }}
                  >
                    {chair.name}
                  </Text>

                  {/* Assigned Person */}
                  <Text
                    style={{
                      fontSize: 14,
                      color: isDark ? "#9CA3AF" : "#6B7280",
                      marginBottom: 8,
                    }}
                  >
                    {chair.assignedPerson}
                  </Text>

                  {/* Status Badge */}
                  <View
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 12,
                      backgroundColor: chair.isActive
                        ? "#DCFCE7"
                        : "#FEE2E2",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: chair.isActive ? "#16A34A" : "#DC2626",
                      }}
                    >
                      {chair.isActive ? "Active" : "Paused"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{ marginTop: 24 }}
          >
            <LinearGradient
              colors={["#4F7DF7", "#2563EB"]}
              start={[0, 0]}
              end={[1, 0]}
              style={{
                paddingVertical: 14,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
                Done
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}