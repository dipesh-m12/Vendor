import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Box } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import useThemeStore from "@/store/themeStore";
import { Phone, Clock, Users, SkipForward } from "lucide-react-native";

import ThemeWidget from "@/components/ThemeWidget";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomerHistoryModal from "@/components/modals/CustomerHistoryModal";
import UndoSystem from "@/components/modals/UndoModals";
import CusDetails_serviceTime_AllView__break from "@/components/modals/Cus_service_all_break";
import { translations } from "@/translations/tabsTranslations/queue/pageTranslations";
import LanguageWidget from "@/components/LanguageWidget";

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

  const langaugeSet = translations[language];

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
      langaugeSet.BreakStarted,
      langaugeSet.TakingAXMinuteBreakForY.replace("{X}", duration).replace(
        "{Y}",
        reason
      )
    );
    setShowTakeBreakModal(false);

    // Auto resume after break duration
    setTimeout(() => {
      setIsActive(true);
      Alert.alert(langaugeSet.BreakEnded, langaugeSet.YoureNowActiveAgain);
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
                {langaugeSet.QVuew}
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
                {isActive ? langaugeSet.Active : langaugeSet.Paused}
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
                  📋 {langaugeSet.RateCard}
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
                  ☕ {langaugeSet.TakeABreak}
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
              {langaugeSet.CurrentQueue}
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
                  {langaugeSet.NextCustomer}
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
                  {langaugeSet.CurrentCustomer}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  {langaugeSet.WaitXMin.replace(
                    "{X}",
                    currentCustomer.estimatedWait
                  )}
                  {/* : {currentCustomer.estimatedWait} min */}
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
                          {langaugeSet.NoteX.replace(
                            "{X}",
                            currentCustomer.note
                          )}
                          {/* : {currentCustomer.note} */}
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
                        {langaugeSet.Details}
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
                        {langaugeSet.Next}
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
                {langaugeSet.NoMoreCustomersLeft}
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
              {langaugeSet.NextInQueue}
            </Text>
            <TouchableOpacity onPress={() => setShowAllCustomersModal(true)}>
              <Text
                style={{
                  color: isDark ? "#A5B4FC" : "#3B82F6",
                  fontWeight: "600",
                }}
              >
                {langaugeSet.ViewAll}
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
                    {langaugeSet.EstWaitXMin.replace(
                      "{X}",
                      customer.estimatedWait
                    )}
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
                      {langaugeSet.Details}
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
                  {langaugeSet.ViewAllXCustomers.replace(
                    "{X}",
                    queueCustomers.length
                  )}
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
              {langaugeSet.TodaysStats}
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
                  {langaugeSet.InQueue}
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
                  {langaugeSet.Served}
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
              {langaugeSet.QuickActions}
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
                  {langaugeSet.CustomerHistory}
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
                  {langaugeSet.DownloadHistory}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>

      <CusDetails_serviceTime_AllView__break
        globalQueue={globalQueue}
        showCustomerDetailsModal={showCustomerDetailsModal}
        showAllCustomersModal={showAllCustomersModal}
        customDuration={customDuration}
        customReason={customReason}
        extraTimeInput={extraTimeInput}
        showCustomFields={showCustomFields}
        selectedBreakDuration={selectedBreakDuration}
        selectedCustomer={selectedCustomer}
        selectedBreakReason={selectedBreakReason}
        setSelectedBreakDuration={setSelectedBreakDuration}
        startBreak={startBreak}
        setShowAllCustomersModal={setShowAllCustomersModal}
        handleCallCustomer={handleCallCustomer}
        handleCustomerDetails={handleCustomerDetails}
        setShowCustomerDetailsModal={setShowCustomerDetailsModal}
        setExtraTimeInput={setExtraTimeInput}
        setGlobalQueue={setGlobalQueue}
        updateQueuePositions={updateQueuePositions}
        setShowCustomFields={setShowCustomFields}
        setCustomDuration={setCustomDuration}
        setCustomReason={setCustomReason}
        setSelectedBreakReason={setSelectedBreakReason}
        showServiceTimeModal={showServiceTimeModal}
        setShowServiceTimeModal={setShowServiceTimeModal}
        currentCustomer={currentCustomer}
        handleNextCustomer={handleNextCustomer}
        addExtraTime={addExtraTime}
        showTakeBreakModal={showTakeBreakModal}
        setShowTakeBreakModal={setShowTakeBreakModal}
      />

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
                {langaugeSet.CallCustomer}
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
                  {langaugeSet.Cancel}
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
                  {langaugeSet.CallNow}
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
      <LanguageWidget
        setLanguage={setLanguage}
        isDark={isDark}
        language={language}
      />
    </LinearGradient>
  );
}
