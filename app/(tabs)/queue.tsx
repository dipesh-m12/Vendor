import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  Dimensions,
  Modal,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Box } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import useThemeStore from "@/store/themeStore";
import {
  Phone,
  Clock,
  Users,
  X,
  AlertTriangle,
  SkipForward,
  ChevronRight,
  Plus,
} from "lucide-react-native";

import ThemeWidget from "@/components/ThemeWidget";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomerHistoryModal from "@/components/modals/CustomerHistoryModal";
import UndoSystem from "@/components/modals/UndoModals";

// QVuew Logo Component (scaled down)
const QVuewLogo = ({ isDark }: { isDark: boolean }) => (
  <Box alignItems="center" justifyContent="center" width={64} height={64}>
    <LinearGradient
      colors={isDark ? ["#6366F1", "#3730A3"] : ["#4F7DF7", "#1E40AF"]}
      start={[0, 0]}
      end={[0, 1]}
      style={{
        width: 64,
        height: 64,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        width={32}
        height={32}
        borderWidth={3}
        borderColor="white"
        borderRadius={4}
        justifyContent="center"
        alignItems="center"
        backgroundColor="transparent"
      >
        <Box
          width={16}
          height={16}
          backgroundColor={isDark ? "#312E81" : "#1E40AF"}
          borderRadius={2}
          borderWidth={3}
          borderColor="white"
        />
      </Box>
    </LinearGradient>
  </Box>
);

interface Customer {
  id: number;
  name: string;
  phone: string;
  estimatedWait: number;
  joinTime: string;
  note?: string;
  position: number;
}

// Sample customer history data
const customerHistoryData = [
  {
    id: 1,
    date: "2025-08-06",
    customerId: "CUST1002",
    name: "Neha Patel",
    service: "Hair Coloring",
    amount: 200,
    phone: "9103558700",
    email: "neha.patel@example.com",
    time: "14:55 PM",
  },
  {
    id: 2,
    date: "2025-08-06",
    customerId: "CUST1003",
    name: "Kavita Gupta",
    service: "Styling",
    amount: 150,
    phone: "9668375634",
    email: "kavita.gupta@example.com",
    time: "13:13 PM",
  },
  {
    id: 3,
    date: "2025-08-07",
    customerId: "CUST1004",
    name: "Kavita Gupta",
    service: "Waxing",
    amount: 400,
    phone: "9348212037",
    email: "kavita.gupta@example.com",
    time: "18:24 PM",
  },
  {
    id: 4,
    date: "2025-08-07",
    customerId: "CUST1005",
    name: "Arjun Kapoor",
    service: "Massage",
    amount: 200,
    phone: "9713539429",
    email: "arjun.kapoor@example.com",
    time: "9:50 AM",
  },
  {
    id: 5,
    date: "2025-08-08",
    customerId: "CUST1006",
    name: "Vikram Malhotra",
    service: "Makeup",
    amount: 450,
    phone: "9915597770",
    email: "vikram.malhotra@example.com",
    time: "12:52 PM",
  },
  {
    id: 6,
    date: "2025-08-08",
    customerId: "CUST1007",
    name: "Vikram Malhotra",
    service: "Haircut",
    amount: 550,
    phone: "9483071745",
    email: "vikram.malhotra@example.com",
    time: "11:19 AM",
  },
  {
    id: 7,
    date: "2025-08-09",
    customerId: "CUST1008",
    name: "Ananya Desai",
    service: "Styling",
    amount: 600,
    phone: "9674664300",
    email: "ananya.desai@example.com",
    time: "11:56 AM",
  },
  {
    id: 8,
    date: "2025-08-09",
    customerId: "CUST1009",
    name: "Deepak Chopra",
    service: "Waxing",
    amount: 600,
    phone: "9477451428",
    email: "deepak.chopra@example.com",
    time: "9:10 AM",
  },
];

export default function QVuewScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, language, setLanguage } = useThemeStore();
  const [isActive, setIsActive] = useState(true);

  const [globalQueue, setGlobalQueue] = useState<Customer[]>([
    {
      id: 1,
      name: "Michael Chen",
      phone: "(528) 598-4688",
      estimatedWait: 19,
      joinTime: "20:50",
      note: "Returning customer",
      position: 1,
    },
    {
      id: 2,
      name: "Fatima Al-Hassan",
      phone: "(555) 123-4567",
      estimatedWait: 14,
      joinTime: "20:52",
      position: 2,
    },
    {
      id: 3,
      name: "Carlos Rodriguez",
      phone: "(555) 987-6543",
      estimatedWait: 16,
      joinTime: "20:54",
      position: 3,
    },
    {
      id: 4,
      name: "Michael Chen",
      phone: "(528) 598-4688",
      estimatedWait: 15,
      joinTime: "20:55",
      position: 4,
    },
  ]);
  const [extraTimeInput, setExtraTimeInput] = useState("0");
  const currentCustomer = globalQueue.length > 0 ? globalQueue[0] : null;
  const queueCustomers = globalQueue.slice(1);

  const [showAllCustomersModal, setShowAllCustomersModal] = useState(false);
  const [showTakeBreakModal, setShowTakeBreakModal] = useState(false);
  const [showCustomerDetailsModal, setShowCustomerDetailsModal] =
    useState(false);
  const [showCallConfirmModal, setShowCallConfirmModal] = useState(false);
  const [showServiceTimeModal, setShowServiceTimeModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedBreakReason, setSelectedBreakReason] = useState("");
  const [selectedBreakDuration, setSelectedBreakDuration] = useState(15);
  const [customReason, setCustomReason] = useState("");
  const [customDuration, setCustomDuration] = useState("");
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [todayStats] = useState({ inQueue: 9, served: 43 });
  const [serviceStartTime] = useState(Date.now());
  const [currentServiceDuration] = useState(30); // 30 minutes service time

  const [showDownloadHistoryModal, setShowDownloadHistoryModal] =
    useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 30 Days");
  const [maskSensitiveData, setMaskSensitiveData] = useState(false);
  const [showChart, setShowChart] = useState(true);

  // Service time check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentCustomer) {
        setShowServiceTimeModal(true);
      }
    }, currentServiceDuration * 60 * 1000); // Convert minutes to milliseconds

    return () => clearTimeout(timer);
  }, [currentCustomer, currentServiceDuration]);

  const toggleStatus = () => {
    setIsActive(!isActive);
  };

  const handleCallCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCallConfirmModal(true);
  };

  const confirmCall = () => {
    if (selectedCustomer) {
      // Simulate calling functionality
      Alert.alert("Calling", `Calling ${selectedCustomer.name}...`);
      setShowCallConfirmModal(false);
    }
  };

  const handleCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetailsModal(true);
  };

  const handleTakeBreak = () => {
    setShowTakeBreakModal(true);
  };

  const startBreak = () => {
    const reason = showCustomFields ? customReason : selectedBreakReason;
    const duration = showCustomFields
      ? parseInt(customDuration)
      : selectedBreakDuration;

    setIsActive(false);
    Alert.alert(
      "Break Started",
      `Taking a ${duration} minute break for ${reason}`
    );
    setShowTakeBreakModal(false);

    // Auto resume after break duration
    setTimeout(() => {
      setIsActive(true);
      Alert.alert("Break Ended", "You're now active again");
    }, duration * 60 * 1000);
  };

  const updateQueuePositions = (queue: Customer[]) => {
    return queue.map((customer, index) => ({
      ...customer,
      position: index + 1,
    }));
  };

  const handleNextCustomer = () => {
    if (globalQueue.length > 0) {
      setGlobalQueue((prev) => updateQueuePositions(prev.slice(1)));
      setShowServiceTimeModal(false);
    }
  };

  const addExtraTime = () => {
    // Add 5 more minutes
    setShowServiceTimeModal(false);
    setTimeout(() => {
      setShowServiceTimeModal(true);
    }, 5 * 60 * 1000);
  };

  const skipCurrentCustomer = () => {
    if (globalQueue.length > 0) {
      const skippedCustomer = globalQueue[0];
      setGlobalQueue((prev) =>
        updateQueuePositions([
          ...prev.slice(1),
          { ...skippedCustomer, position: prev.length },
        ])
      );
      setShowServiceTimeModal(false);
    }
  };

  const removeCustomer = () => {
    if (globalQueue.length > 0) {
      setGlobalQueue((prev) => updateQueuePositions(prev.slice(1)));
    }
    setShowServiceTimeModal(false);
  };

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
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 13, paddingBottom: 100 }}
      >
        <SafeAreaView>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
              // paddingTop: Platform.OS === "ios" ? 40 : 20,
            }}
          >
            <QVuewLogo isDark={isDark} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                }}
              >
                QVuew
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: isDark ? "#A5B4FC" : "#3B82F6",
                }}
              >
                ABC Business Services
              </Text>
            </View>

            <TouchableOpacity
              onPress={toggleStatus}
              style={{
                backgroundColor: isActive ? "#DCFCE7" : "#FEE2E2",
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: isActive ? "#16A34A" : "#DC2626",
                  fontWeight: "600",
                  fontSize: 13,
                  marginRight: 4,
                }}
              >
                {isActive ? "Active" : "Paused"}
              </Text>
              <Text
                style={{
                  color: isActive ? "#16A34A" : "#DC2626",
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                {isActive ? "||" : "▷"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
            <TouchableOpacity
              onPress={() => router.push("/(ratecard)/preview" as any)}
              style={{ flex: 1 }}
            >
              <LinearGradient
                colors={
                  isDark ? ["#6366F1", "#4338CA"] : ["#4F7DF7", "#2563EB"]
                }
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
                  style={{ color: "white", fontWeight: "600", fontSize: 16 }}
                >
                  📋 Rate Card
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleTakeBreak} style={{ flex: 1 }}>
              <View
                style={{
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#FED7AA",
                  borderWidth: 1,
                  borderColor: "#F59E0B",
                }}
              >
                <Text
                  style={{ color: "#D97706", fontWeight: "600", fontSize: 16 }}
                >
                  ☕ Take a Break
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Current Queue Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: isDark ? "#F8FAFC" : "#1E3A8A",
              }}
            >
              Current Queue
            </Text>
            <TouchableOpacity
              onPress={handleNextCustomer}
              disabled={globalQueue.length === 0}
            >
              <LinearGradient
                colors={
                  globalQueue.length === 0
                    ? ["#9CA3AF", "#6B7280"]
                    : isDark
                    ? ["#6366F1", "#4338CA"]
                    : ["#4F7DF7", "#2563EB"]
                }
                start={[0, 0]}
                end={[1, 0]}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "600", marginRight: 4 }}
                >
                  Next Customer
                </Text>
                <SkipForward size={16} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Current Customer */}
          {currentCustomer ? (
            <View
              style={{
                backgroundColor: isDark ? "#374151" : "white",
                borderRadius: 12,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: isDark ? "#4B5563" : "#E5E7EB",
                overflow: "hidden",
              }}
            >
              {/* Blue Header Bar */}
              <View
                style={{
                  backgroundColor: "#4F7DF7",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  Current Customer
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  Wait: {currentCustomer.estimatedWait} min
                </Text>
              </View>

              {/* Customer Details Section */}
              <View style={{ padding: 16 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: isDark ? "#F8FAFC" : "#1E3A8A",
                        marginBottom: 4,
                      }}
                    >
                      {currentCustomer.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: isDark ? "#A5B4FC" : "#3B82F6",
                        marginBottom: currentCustomer.note ? 8 : 0,
                      }}
                    >
                      {currentCustomer.phone}
                    </Text>
                    {currentCustomer.note && (
                      <View
                        style={{
                          backgroundColor: isDark ? "#1E40AF" : "#EFF6FF",
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 6,
                          alignSelf: "flex-start",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: isDark ? "#93C5FD" : "#3B82F6",
                            fontWeight: "500",
                          }}
                        >
                          Note: {currentCustomer.note}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity
                      onPress={() => handleCustomerDetails(currentCustomer)}
                      style={{
                        backgroundColor: isDark ? "#1E40AF" : "#EFF6FF",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: isDark ? "#93C5FD" : "#3B82F6",
                          fontWeight: "600",
                        }}
                      >
                        Details
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleNextCustomer()}
                      style={{
                        backgroundColor: isDark ? "#059669" : "#10B981",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ color: "white", fontWeight: "600" }}>
                        Next
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: isDark ? "#374151" : "white",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: isDark ? "#4B5563" : "#E5E7EB",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                }}
              >
                No more customers left
              </Text>
            </View>
          )}

          {/* Next in Queue */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: isDark ? "#A5B4FC" : "#1E3A8A",
              }}
            >
              Next in Queue
            </Text>
            <TouchableOpacity onPress={() => setShowAllCustomersModal(true)}>
              <Text
                style={{
                  color: isDark ? "#A5B4FC" : "#3B82F6",
                  fontWeight: "600",
                }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {/* Queue List */}
          <View style={{ gap: 12, marginBottom: 24 }}>
            {queueCustomers.slice(0, 3).map((customer) => (
              <View
                key={customer.id}
                style={{
                  backgroundColor: isDark ? "#374151" : "white",
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: isDark ? "#4B5563" : "#E5E7EB",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: isDark ? "#6366F1" : "#4F7DF7",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {customer.position}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: isDark ? "#F8FAFC" : "#1E3A8A",
                      marginBottom: 2,
                    }}
                  >
                    {customer.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: isDark ? "#9CA3AF" : "#6B7280",
                    }}
                  >
                    Est. wait: {customer.estimatedWait} min
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => handleCallCustomer(customer)}
                    style={{
                      backgroundColor: isDark ? "#059669" : "#10B981",
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    <Phone size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleCustomerDetails(customer)}
                    style={{
                      backgroundColor: isDark ? "#1E40AF" : "#EFF6FF",
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: isDark ? "#93C5FD" : "#3B82F6",
                        fontWeight: "600",
                        fontSize: 12,
                      }}
                    >
                      Details
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {queueCustomers.length > 3 && (
              <TouchableOpacity
                onPress={() => setShowAllCustomersModal(true)}
                style={{
                  backgroundColor: isDark ? "#374151" : "white",
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: isDark ? "#4B5563" : "#E5E7EB",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: isDark ? "#A5B4FC" : "#3B82F6",
                    fontWeight: "600",
                  }}
                >
                  View All ({queueCustomers.length} customers)
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Stats and Actions Combined Card */}
          <View
            style={{
              backgroundColor: isDark ? "#374151" : "white",
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: isDark ? "#4B5563" : "#E5E7EB",
            }}
          >
            {/* Today's Stats */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: isDark ? "#A5B4FC" : "#1E3A8A",
                marginBottom: 16,
              }}
            >
              Today's Stats
            </Text>

            <View style={{ flexDirection: "row", gap: 16, marginBottom: 24 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: isDark ? "#4B5563" : "#F8FAFC",
                  padding: 12,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#9CA3AF" : "#6B7280",
                    marginBottom: 4,
                  }}
                >
                  In Queue
                </Text>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    color: isDark ? "#F8FAFC" : "#1E3A8A",
                  }}
                >
                  {todayStats.inQueue}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: isDark ? "#4B5563" : "#F8FAFC",
                  padding: 12,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#9CA3AF" : "#6B7280",
                    marginBottom: 4,
                  }}
                >
                  Served
                </Text>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    color: isDark ? "#F8FAFC" : "#1E3A8A",
                  }}
                >
                  {todayStats.served}
                </Text>
              </View>
            </View>

            {/* Quick Actions */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: isDark ? "#A5B4FC" : "#1E3A8A",
                marginBottom: 16,
              }}
            >
              Quick Actions
            </Text>

            <View style={{ gap: 12 }}>
              <TouchableOpacity
                onPress={() => router.push("/history")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isDark ? "#4B5563" : "#F8FAFC",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Clock
                  size={20}
                  color={isDark ? "#93C5FD" : "#3B82F6"}
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: isDark ? "#F8FAFC" : "#1E3A8A",
                    fontWeight: "500",
                  }}
                >
                  Customer History
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowDownloadHistoryModal(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isDark ? "#4B5563" : "#F8FAFC",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Users
                  size={20}
                  color={isDark ? "#93C5FD" : "#3B82F6"}
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: isDark ? "#F8FAFC" : "#1E3A8A",
                    fontWeight: "500",
                  }}
                >
                  Download History
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Service Time Modal */}
      <Modal
        visible={showServiceTimeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowServiceTimeModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingTop: 60,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#FEF3C7",
              borderRadius: 16,
              padding: 0,
              width: "100%",
              maxWidth: 400,
              borderWidth: 1,
              borderColor: "#F59E0B",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            {/* Header Section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: 16,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#FEF3C7",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor: "#F59E0B",
                  marginRight: 12,
                }}
              >
                <Clock size={20} color="#D97706" />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#92400E",
                    marginBottom: 2,
                  }}
                >
                  Still with {currentCustomer?.name}?
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setShowServiceTimeModal(false)}
                style={{
                  padding: 4,
                }}
              >
                <X size={24} color="#A16207" />
              </TouchableOpacity>
            </View>

            {/* Content Section */}
            <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
              <Text
                style={{
                  fontSize: 15,
                  color: "#A16207",
                  lineHeight: 22,
                  marginBottom: 20,
                }}
              >
                It looks like you're still with the current customer. Ready for
                the next one or need more time?
              </Text>

              {/* Action Buttons */}
              <View style={{ gap: 12 }}>
                {/* Next Customer Button */}
                <TouchableOpacity
                  onPress={handleNextCustomer}
                  style={{
                    backgroundColor: "#2563EB",
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: "#2563EB",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  <ChevronRight
                    size={18}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: 16,
                      letterSpacing: 0.5,
                    }}
                  >
                    Next Customer
                  </Text>
                </TouchableOpacity>

                {/* Extend Time Button */}
                <TouchableOpacity
                  onPress={addExtraTime}
                  style={{
                    backgroundColor: "transparent",
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: "#D97706",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Plus size={16} color="#D97706" style={{ marginRight: 8 }} />
                  <Text
                    style={{
                      color: "#D97706",
                      fontWeight: "600",
                      fontSize: 15,
                      letterSpacing: 0.3,
                    }}
                  >
                    Extend Time (+5m)
                  </Text>
                </TouchableOpacity>

                {/* Dismiss Button */}
                <TouchableOpacity
                  onPress={() => setShowServiceTimeModal(false)}
                  style={{
                    backgroundColor: "transparent",
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#A16207",
                      fontWeight: "500",
                      fontSize: 14,
                    }}
                  >
                    Dismiss
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Bottom helper text */}
          <View
            style={{
              marginTop: 16,
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#9CA3AF",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Still working with {currentCustomer?.name}. Tap Next when ready.
            </Text>
          </View>
        </View>
      </Modal>

      {/* Take Break Modal */}
      <Modal
        visible={showTakeBreakModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTakeBreakModal(false)}
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
              padding: 20,
              width: "100%",
              maxWidth: 400,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                }}
              >
                Take a Break
              </Text>
              <TouchableOpacity onPress={() => setShowTakeBreakModal(false)}>
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: isDark ? "#A5B4FC" : "#3B82F6",
                marginBottom: 12,
              }}
            >
              Select break reason:
            </Text>

            <View style={{ gap: 8, marginBottom: 20 }}>
              {[
                { label: "☕ Tea Break", value: "Tea Break" },
                { label: "🍽️ Lunch Break", value: "Lunch Break" },
                { label: "👥 Staff Meeting", value: "Staff Meeting" },
                { label: "🚨 Emergency", value: "Emergency" },
              ].map((reason) => (
                <TouchableOpacity
                  key={reason.value}
                  onPress={() => {
                    setSelectedBreakReason(reason.value);
                    setCustomReason("");
                    setCustomDuration("");
                    setShowCustomFields(false);
                  }}
                  style={{
                    backgroundColor:
                      selectedBreakReason === reason.value
                        ? isDark
                          ? "#6366F1"
                          : "#EFF6FF"
                        : isDark
                        ? "#4B5563"
                        : "#F8FAFC",
                    padding: 12,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor:
                      selectedBreakReason === reason.value
                        ? "#3B82F6"
                        : isDark
                        ? "#6B7280"
                        : "#E5E7EB",
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedBreakReason === reason.value
                          ? "white"
                          : isDark
                          ? "#F8FAFC"
                          : "#1E3A8A",
                      fontWeight:
                        selectedBreakReason === reason.value ? "600" : "400",
                    }}
                  >
                    {reason.label}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() => {
                  setSelectedBreakReason("");
                  setCustomReason("");
                  setCustomDuration("");
                  setShowCustomFields(true);
                }}
                style={{
                  backgroundColor: showCustomFields
                    ? isDark
                      ? "#6366F1"
                      : "#EFF6FF"
                    : isDark
                    ? "#4B5563"
                    : "#F8FAFC",
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: showCustomFields
                    ? "#3B82F6"
                    : isDark
                    ? "#6B7280"
                    : "#E5E7EB",
                }}
              >
                <Text
                  style={{
                    color: showCustomFields
                      ? "#3B82F6"
                      : isDark
                      ? "#F8FAFC"
                      : "#1E3A8A",
                    fontWeight: showCustomFields ? "600" : "400",
                  }}
                >
                  + Custom Reason
                </Text>
              </TouchableOpacity>

              {showCustomFields && (
                <View style={{ gap: 8 }}>
                  <TextInput
                    style={{
                      backgroundColor: isDark ? "#4B5563" : "#F8FAFC",
                      padding: 12,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: isDark ? "#6B7280" : "#E5E7EB",
                      color: isDark ? "#F8FAFC" : "#1E3A8A",
                    }}
                    placeholder="Enter custom reason"
                    placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                    value={customReason}
                    onChangeText={setCustomReason}
                  />
                </View>
              )}
            </View>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: isDark ? "#A5B4FC" : "#3B82F6",
                marginBottom: 12,
              }}
            >
              Select duration:
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 20,
              }}
            >
              {[5, 10, 15, 30, 45, 60].map((duration) => (
                <TouchableOpacity
                  key={duration}
                  onPress={() => {
                    setSelectedBreakDuration(duration);
                    setShowCustomFields(false);
                  }}
                  style={{
                    backgroundColor:
                      selectedBreakDuration === duration
                        ? isDark
                          ? "#6366F1"
                          : "#4F7DF7"
                        : isDark
                        ? "#4B5563"
                        : "#F8FAFC",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor:
                      selectedBreakDuration === duration
                        ? "#3B82F6"
                        : isDark
                        ? "#6B7280"
                        : "#E5E7EB",
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedBreakDuration === duration
                          ? "white"
                          : isDark
                          ? "#F8FAFC"
                          : "#1E3A8A",
                      fontWeight:
                        selectedBreakDuration === duration ? "600" : "400",
                    }}
                  >
                    {duration >= 60 ? `${duration / 60} hr` : `${duration} min`}
                  </Text>
                </TouchableOpacity>
              ))}

              {showCustomFields && (
                <TextInput
                  style={{
                    backgroundColor: isDark ? "#4B5563" : "#F8FAFC",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isDark ? "#6B7280" : "#E5E7EB",
                    color: isDark ? "#F8FAFC" : "#1E3A8A",
                    minWidth: 80,
                  }}
                  placeholder="Custom"
                  placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                  value={customDuration}
                  onChangeText={setCustomDuration}
                  keyboardType="numeric"
                />
              )}
            </View>

            {!showCustomFields && (
              <View
                style={{
                  backgroundColor: isDark ? "#4B5563" : "#F1F5F9",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#9CA3AF" : "#6B7280",
                    fontWeight: "600",
                    marginBottom: 4,
                  }}
                >
                  Customer notification preview:
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#F8FAFC" : "#1E3A8A",
                  }}
                >
                  We're on a {selectedBreakReason || "[Reason]"} (
                  {selectedBreakDuration} min). Please stay queued. Service will
                  resume shortly.
                </Text>
              </View>
            )}

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowTakeBreakModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? "#4B5563" : "#F8FAFC",
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: isDark ? "#6B7280" : "#E5E7EB",
                }}
              >
                <Text
                  style={{
                    color: isDark ? "#F8FAFC" : "#1E3A8A",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={startBreak}
                disabled={!selectedBreakReason && !customReason}
                style={{
                  flex: 1,
                  backgroundColor:
                    !selectedBreakReason && !customReason
                      ? isDark
                        ? "#374151"
                        : "#E5E7EB"
                      : isDark
                      ? "#6366F1"
                      : "#4F7DF7",
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  Start Break
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* View All Customers Modal */}
      <Modal
        visible={showAllCustomersModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAllCustomersModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: isDark ? "#374151" : "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 17,
              maxHeight: "80%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                }}
              >
                All Customers ({globalQueue.length})
              </Text>
              <TouchableOpacity onPress={() => setShowAllCustomersModal(false)}>
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              <View style={{ gap: 12 }}>
                {globalQueue.map((customer) => (
                  <View
                    key={customer.id}
                    style={{
                      backgroundColor: isDark ? "#4B5563" : "#F8FAFC",
                      borderRadius: 12,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: isDark ? "#6B7280" : "#E5E7EB",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: isDark ? "#6366F1" : "#4F7DF7",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        {customer.position}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: isDark ? "#F8FAFC" : "#1E3A8A",
                          marginBottom: 2,
                        }}
                      >
                        {customer.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: isDark ? "#9CA3AF" : "#6B7280",
                        }}
                      >
                        Est. wait: {customer.estimatedWait} min
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <TouchableOpacity
                        onPress={() => handleCallCustomer(customer)}
                        style={{
                          backgroundColor: isDark ? "#059669" : "#10B981",
                          padding: 8,
                          borderRadius: 8,
                        }}
                      >
                        <Phone size={16} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setShowAllCustomersModal(false);
                          handleCustomerDetails(customer);
                        }}
                        style={{
                          backgroundColor: isDark ? "#1E40AF" : "#EFF6FF",
                          padding: 8,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: isDark ? "#93C5FD" : "#3B82F6",
                            fontWeight: "600",
                            fontSize: 12,
                          }}
                        >
                          Details
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Customer Details Modal */}
      <Modal
        visible={showCustomerDetailsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomerDetailsModal(false)}
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
              padding: 20,
              width: "100%",
              maxWidth: 400,
              maxHeight: "90%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                }}
              >
                {selectedCustomer?.position === 1
                  ? "Current Customer"
                  : "In Queue"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowCustomerDetailsModal(false)}
              >
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedCustomer && (
                <View style={{ gap: 20 }}>
                  {/* Customer Name */}
                  <View>
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        color: isDark ? "#F8FAFC" : "#1E3A8A",
                        textAlign: "center",
                      }}
                    >
                      {selectedCustomer.name}
                    </Text>
                  </View>

                  {/* Contact Information */}
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: isDark ? "#93C5FD" : "#3B82F6",
                        marginBottom: 12,
                      }}
                    >
                      Contact Information
                    </Text>
                    <View style={{ gap: 8 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>
                          Phone Number
                        </Text>
                        <Text
                          style={{
                            color: isDark ? "#F8FAFC" : "#1E3A8A",
                            fontWeight: "600",
                          }}
                        >
                          {selectedCustomer.phone}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>
                          Gender
                        </Text>
                        <Text
                          style={{
                            color: isDark ? "#F8FAFC" : "#1E3A8A",
                            fontWeight: "600",
                          }}
                        >
                          {selectedCustomer.gender || "Other"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Queue Information */}
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: isDark ? "#93C5FD" : "#3B82F6",
                        marginBottom: 12,
                      }}
                    >
                      Queue Information
                    </Text>
                    <View style={{ gap: 8 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>
                          Queue Position
                        </Text>
                        <Text
                          style={{
                            color: isDark ? "#F8FAFC" : "#1E3A8A",
                            fontWeight: "600",
                          }}
                        >
                          {selectedCustomer.position}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>
                          Join Time
                        </Text>
                        <Text
                          style={{
                            color: isDark ? "#F8FAFC" : "#1E3A8A",
                            fontWeight: "600",
                          }}
                        >
                          {selectedCustomer.joinTime}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>
                          Estimated Time
                        </Text>
                        <Text
                          style={{
                            color: isDark ? "#F8FAFC" : "#1E3A8A",
                            fontWeight: "600",
                          }}
                        >
                          {selectedCustomer.estimatedWait} minutes
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Service Information */}
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: isDark ? "#93C5FD" : "#3B82F6",
                        marginBottom: 12,
                      }}
                    >
                      Service Information
                    </Text>
                    <View style={{ gap: 8 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>
                          Requested Service
                        </Text>
                        <Text
                          style={{
                            color: isDark ? "#F8FAFC" : "#1E3A8A",
                            fontWeight: "600",
                          }}
                        >
                          {selectedCustomer.service || "General Inquiry"}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>
                          Service Charges
                        </Text>
                        <Text
                          style={{
                            color: isDark ? "#F8FAFC" : "#1E3A8A",
                            fontWeight: "600",
                          }}
                        >
                          ₹ {selectedCustomer.charges || "155"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Add Extra Time */}
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: isDark ? "#93C5FD" : "#3B82F6",
                        marginBottom: 12,
                      }}
                    >
                      Add Extra Time
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 8,
                        marginBottom: 12,
                      }}
                    >
                      {[
                        "-10 min",
                        "-5 min",
                        "+5 min",
                        "+10 min",
                        "+15 min",
                        "+30 min",
                      ].map((time) => (
                        <TouchableOpacity
                          key={time}
                          onPress={() => {
                            const minutes = parseInt(
                              time.replace(/[^\d-]/g, "")
                            );
                            const isNegative = time.includes("-");
                            const actualMinutes = isNegative
                              ? -Math.abs(minutes)
                              : minutes;
                            setExtraTimeInput(actualMinutes.toString());
                          }}
                          style={{
                            backgroundColor: time.includes("-")
                              ? isDark
                                ? "#DC2626"
                                : "#FEE2E2"
                              : isDark
                              ? "#059669"
                              : "#D1FAE5",
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: time.includes("-")
                              ? isDark
                                ? "#DC2626"
                                : "#F87171"
                              : isDark
                              ? "#059669"
                              : "#10B981",
                          }}
                        >
                          <Text
                            style={{
                              color: time.includes("-")
                                ? isDark
                                  ? "#FCA5A5"
                                  : "#DC2626"
                                : isDark
                                ? "#A7F3D0"
                                : "#059669",
                              fontSize: 12,
                              fontWeight: "600",
                            }}
                          >
                            {time}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        value={extraTimeInput}
                        onChangeText={setExtraTimeInput}
                        placeholder="0"
                        placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                        keyboardType="numeric"
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          borderColor: isDark ? "#4B5563" : "#D1D5DB",
                          backgroundColor: isDark ? "#1F2937" : "#F9FAFB",
                          borderRadius: 8,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          color: isDark ? "#F8FAFC" : "#1E3A8A",
                          fontSize: 14,
                        }}
                      />

                      <TouchableOpacity
                        onPress={() => {
                          const minutes = parseInt(extraTimeInput) || 0;

                          if (minutes !== 0) {
                            setGlobalQueue((prev) =>
                              prev.map((customer) =>
                                customer.id === selectedCustomer.id
                                  ? {
                                      ...customer,
                                      estimatedWait: Math.max(
                                        0,
                                        customer.estimatedWait + minutes
                                      ),
                                    }
                                  : customer
                              )
                            );

                            Alert.alert(
                              "Time Updated",
                              `${minutes > 0 ? "Added" : "Reduced"} ${Math.abs(
                                minutes
                              )} minutes`
                            );
                            setExtraTimeInput("0");
                          } else {
                            Alert.alert("Done", "No changes made");
                          }
                        }}
                        style={{
                          backgroundColor: isDark ? "#3B82F6" : "#2563EB",
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "600",
                            fontSize: 14,
                          }}
                        >
                          Add Minutes
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Recent History */}
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: isDark ? "#93C5FD" : "#3B82F6",
                        marginBottom: 12,
                      }}
                    >
                      Recent History
                    </Text>
                    <View
                      style={{
                        backgroundColor: isDark ? "#1E40AF" : "#EFF6FF",
                        padding: 12,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: isDark ? "#93C5FD" : "#3B82F6",
                          fontWeight: "600",
                        }}
                      >
                        {selectedCustomer.isReturning
                          ? "Repeated Customer"
                          : "New Customer"}
                      </Text>
                      {selectedCustomer.note && (
                        <Text
                          style={{
                            fontSize: 12,
                            color: isDark ? "#A5B4FC" : "#6366F1",
                            marginTop: 4,
                          }}
                        >
                          {selectedCustomer.note}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
                    <TouchableOpacity
                      onPress={() => {
                        // Hold/Unhold functionality
                        const isCurrentlyHeld =
                          selectedCustomer.isHeld || false;

                        if (isCurrentlyHeld) {
                          // Unhold - move back to original position logic
                          setGlobalQueue((prev) =>
                            prev.map((customer) =>
                              customer.id === selectedCustomer.id
                                ? { ...customer, isHeld: false }
                                : customer
                            )
                          );
                          Alert.alert(
                            "Customer Released",
                            `${selectedCustomer.name} is no longer on hold`
                          );
                        } else {
                          // Hold - move to end of queue
                          setGlobalQueue((prev) => {
                            const filtered = prev.filter(
                              (c) => c.id !== selectedCustomer.id
                            );
                            const heldCustomer = {
                              ...selectedCustomer,
                              isHeld: true,
                            };
                            return updateQueuePositions([
                              ...filtered,
                              heldCustomer,
                            ]);
                          });
                          Alert.alert(
                            "Customer Held",
                            `${selectedCustomer.name} moved to end of queue`
                          );
                        }

                        setShowCustomerDetailsModal(false);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: selectedCustomer.isHeld
                          ? isDark
                            ? "#F59E0B"
                            : "#FBBF24"
                          : isDark
                          ? "#6B7280"
                          : "#9CA3AF",
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "600",
                          fontSize: 12,
                        }}
                      >
                        {selectedCustomer.isHeld ? "Unhold" : "Hold"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        // Skip functionality - remove from queue
                        setGlobalQueue((prev) =>
                          updateQueuePositions(
                            prev.filter((c) => c.id !== selectedCustomer.id)
                          )
                        );
                        Alert.alert(
                          "Customer Skipped",
                          `${selectedCustomer.name} removed from queue`
                        );
                        setShowCustomerDetailsModal(false);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: isDark ? "#4F7DF7" : "#3B82F6",
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "600",
                          fontSize: 12,
                        }}
                      >
                        Skip
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          "Remove Customer",
                          `Remove ${selectedCustomer.name} from queue?`,
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Remove",
                              style: "destructive",
                              onPress: () => {
                                setGlobalQueue((prev) =>
                                  updateQueuePositions(
                                    prev.filter(
                                      (c) => c.id !== selectedCustomer.id
                                    )
                                  )
                                );
                                setShowCustomerDetailsModal(false);
                                Alert.alert(
                                  "Customer Removed",
                                  `${selectedCustomer.name} has been removed from queue`
                                );
                              },
                            },
                          ]
                        );
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: isDark ? "#DC2626" : "#EF4444",
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "600",
                          fontSize: 12,
                        }}
                      >
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Call Confirmation Modal */}
      <Modal
        visible={showCallConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCallConfirmModal(false)}
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
              padding: 20,
              width: "100%",
              maxWidth: 350,
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Phone size={48} color={isDark ? "#10B981" : "#059669"} />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                  marginTop: 12,
                  textAlign: "center",
                }}
              >
                Call Customer?
              </Text>
              {selectedCustomer && (
                <View style={{ alignItems: "center", marginTop: 8 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: isDark ? "#A5B4FC" : "#3B82F6",
                      marginBottom: 4,
                    }}
                  >
                    {selectedCustomer.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: isDark ? "#9CA3AF" : "#6B7280",
                    }}
                  >
                    {selectedCustomer.phone}
                  </Text>
                </View>
              )}
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowCallConfirmModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? "#4B5563" : "#F8FAFC",
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: isDark ? "#6B7280" : "#E5E7EB",
                }}
              >
                <Text
                  style={{
                    color: isDark ? "#F8FAFC" : "#1E3A8A",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmCall}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? "#10B981" : "#059669",
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Phone size={16} color="white" style={{ marginRight: 8 }} />
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Call Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Charts */}
      <CustomerHistoryModal
        showDownloadHistoryModal={showDownloadHistoryModal}
        setShowDownloadHistoryModal={setShowDownloadHistoryModal}
        isDark={isDark}
        customerHistoryData={customerHistoryData}
        selectedTimeRange={selectedTimeRange}
        maskSensitiveData={maskSensitiveData}
        setMaskSensitiveData={setMaskSensitiveData}
      />

      <UndoSystem />
      <ThemeWidget isDark={isDark} toggleTheme={toggleTheme} />
    </LinearGradient>
  );
}
