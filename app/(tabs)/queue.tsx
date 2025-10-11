import useThemeStore from "@/store/themeStore";
import { Box } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  Clock,
  Coffee,
  FileText,
  Pause,
  Phone,
  Play,
  Users,
  X
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


import CustomerDetailsModal from "@/components/CustomerDetailsModal";
import FullQueueModal from "@/components/FullQueueModal";
import CusDetails_serviceTime_AllView__break from "@/components/modals/Cus_service_all_break";
import CustomerHistoryModal from "@/components/modals/CustomerHistoryModal";
import TakeBreakModal from "@/components/modals/TakeBreakModal";
import UndoSystem from "@/components/modals/UndoModals";
import { translations } from "@/translations/tabsTranslations/queue/pageTranslations";
import { SafeAreaView } from "react-native-safe-area-context";
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
  services?: { name: string; price: number }[];
  totalCharge?: number;
}

// Sample customer history data
const customerHistoryData = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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

  // Update your globalQueue state with services data
  const [globalQueue, setGlobalQueue] = useState<Customer[]>([
    {
      id: 1,
      name: "Michael Chen",
      phone: "(528) 598-4688",
      estimatedWait: 19,
      joinTime: "20:50",
      note: "Returning customer",
      position: 1,
      services: [
        { name: "Haircut", price: 200 },
        { name: "Beard Trim", price: 100 },
      ],
      totalCharge: 300,
    },
    {
      id: 2,
      name: "Fatima Al-Hassan",
      phone: "(555) 123-4567",
      estimatedWait: 14,
      joinTime: "20:52",
      position: 2,
      services: [
        { name: "Hair Styling", price: 250 },
        { name: "Manicure", price: 150 },
      ],
      totalCharge: 400,
    },
    {
      id: 3,
      name: "Carlos Rodriguez",
      phone: "(555) 987-6543",
      estimatedWait: 16,
      joinTime: "20:54",
      position: 3,
      services: [
        { name: "Facial", price: 300 },
      ],
      totalCharge: 300,
    },
    {
      id: 4,
      name: "Michael Chen",
      phone: "(528) 598-4688",
      estimatedWait: 15,
      joinTime: "20:55",
      position: 4,
      services: [
        { name: "Hair Color", price: 500 },
        { name: "Hair Treatment", price: 350 },
      ],
      totalCharge: 850,
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

  const [todayStats] = useState({ inQueue: 9, served: 43 });
  const [serviceStartTime] = useState(Date.now());
  const [currentServiceDuration] = useState(30); // 30 minutes service time

  const [showDownloadHistoryModal, setShowDownloadHistoryModal] =
    useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 30 Days");
  const [maskSensitiveData, setMaskSensitiveData] = useState(false);
  const [showChart, setShowChart] = useState(true);

  // Add missing customDuration state
  const [customDuration, setCustomDuration] = useState<number>(0);


  // Add these state variables for break functionality
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakDuration, setBreakDuration] = useState<number>(0);
  const [breakReason, setBreakReason] = useState<string>('');
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [customReason, setCustomReason] = useState<string>('');
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [selectedBreakDuration, setSelectedBreakDuration] = useState<number>(0);
  const [selectedBreakReason, setSelectedBreakReason] = useState<string>('');

  const langaugeSet = translations[language];

  // Countdown timer for break
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isOnBreak && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            // Time's up, auto-resume
            handleResumeBreak();
            return 0;
          }
          return prev - 1;
        });
      }, 1000); // Update every second
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnBreak, remainingTime]);

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

  const handleStartBreak = (duration: number, reason: string) => {
    // Set break state
    setIsOnBreak(true);
    setBreakDuration(duration);
    setBreakReason(reason);
    setRemainingTime(duration * 60);
    setIsActive(false);

    // Show alert
    Alert.alert(
      langaugeSet.BreakStarted || "Break Started",
      langaugeSet.TakingAXMinuteBreakForY?.replace("{X}", duration.toString()).replace("{Y}", reason)
      || `Taking a ${duration} minute break for ${reason}`
    );

    setShowTakeBreakModal(false);

    // Auto resume after break duration
    setTimeout(() => {
      handleResumeBreak();
    }, duration * 60 * 1000);
  };

  const handleResumeBreak = () => {
    setIsOnBreak(false);
    setBreakDuration(0);
    setBreakReason('');
    setIsActive(true);

    Alert.alert(
      langaugeSet.BreakEnded || "Break Ended",
      langaugeSet.YoureNowActiveAgain || "You're now active again"
    );
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
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
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
                paddingVertical: 8,
                borderRadius: 20,
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
              {isActive ? (
                <Pause size={12} color="#16A34A" fill="#16A34A" />
              ) : (
                <Play size={12} color="#DC2626" fill="#DC2626" />
              )}
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
            <TouchableOpacity
              onPress={() => router.push("/(ratecard)/preview" as any)}
              style={{ flex: 1 }}
            >
              <LinearGradient
                colors={["#4F7DF7", "#2563EB"]}
                start={[0, 0]}
                end={[1, 0]}
                style={{
                  paddingVertical: 14,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileText size={18} color="white" style={{ marginRight: 6 }} />
                <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
                  {langaugeSet.RateCard}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleTakeBreak} style={{ flex: 1 }}>
              <View
                style={{
                  paddingVertical: 14,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#FED7AA",
                  borderWidth: 1,
                  borderColor: "#F59E0B",
                }}
              >
                <Coffee size={18} color="#D97706" style={{ marginRight: 6 }} />
                <Text style={{ color: "#D97706", fontWeight: "600", fontSize: 15 }}>
                  {langaugeSet.TakeABreak}
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
                fontSize: 20,
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
                    : ["#4F7DF7", "#2563EB"]
                }
                start={[0, 0]}
                end={[1, 0]}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "600", marginRight: 4, fontSize: 14 }}>
                  {langaugeSet.NextCustomer}
                </Text>
                <ChevronRight size={14} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Current Customer */}
          {currentCustomer ? (
            <View
              style={{
                backgroundColor: isDark ? "#374151" : "white",
                borderRadius: 8,
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
                    <TouchableOpacity onPress={() => handleCallCustomer(currentCustomer)}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: isDark ? "#A5B4FC" : "#3B82F6",
                          marginBottom: 8,
                        }}
                      >
                        {currentCustomer.phone}
                      </Text>
                    </TouchableOpacity>
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
                borderRadius: 8,
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
                fontSize: 16,
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
            {queueCustomers.slice(0, 2).map((customer) => (
              <View
                key={customer.id}
                style={{
                  backgroundColor: isDark ? "#374151" : "white",
                  borderRadius: 8,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: isDark ? "#4B5563" : "#E5E7EB",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "#4F7DF7",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>
                      {customer.position}
                    </Text>
                  </View>

                  {/* Customer Info Section */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 15,
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
                      {langaugeSet.EstWaitXMin.replace("{X}", customer.estimatedWait)}
                    </Text>
                  </View>

                  {/* Action Buttons - Call, Next, Details */}
                  <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                    {/* Call Button */}
                    <TouchableOpacity
                      onPress={() => handleCallCustomer(customer)}
                      style={{
                        backgroundColor: isDark ? "#1E3A8A" : "#EFF6FF",
                        padding: 10,
                        borderRadius: 8,
                      }}
                    >
                      <Phone size={18} color="#3B82F6" />
                    </TouchableOpacity>

                    {/* Next Button - Only for position 1 */}
                    {customer.position === 1 && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#10B981",
                          paddingHorizontal: 14,
                          paddingVertical: 10,
                          borderRadius: 8,
                        }}
                      >
                        <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>
                          Next
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Details Button */}
                    <TouchableOpacity
                      onPress={() => handleCustomerDetails(customer)}
                      style={{
                        backgroundColor: isDark ? "#1E40AF" : "#EFF6FF",
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: isDark ? "#93C5FD" : "#3B82F6",
                          fontWeight: "600",
                          fontSize: 13,
                        }}
                      >
                        Details
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {queueCustomers.length > 2 && (
              <TouchableOpacity
                onPress={() => setShowAllCustomersModal(true)}
                style={{
                  backgroundColor: isDark ? "#374151" : "white",
                  borderRadius: 8,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: isDark ? "#4B5563" : "#E5E7EB",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: isDark ? "#A5B4FC" : "#3B82F6",
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  {langaugeSet.ViewAllXCustomers.replace("{X}", queueCustomers.length)}
                </Text>
              </TouchableOpacity>
            )}
          </View>


          {/* Stats and Actions Combined Card */}
          <View
            style={{
              backgroundColor: isDark ? "#374151" : "white",
              borderRadius: 8,
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
                  borderRadius: 8,
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
                  borderRadius: 8,
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

      <FullQueueModal
        visible={showAllCustomersModal}
        onClose={() => setShowAllCustomersModal(false)}
        customers={globalQueue}
        onNext={(customer) => {
          setShowAllCustomersModal(false);
          handleNextCustomer();
        }}
        onDetails={(customer) => {
          setSelectedCustomer(customer);
          setShowAllCustomersModal(false);
          setShowCustomerDetailsModal(true);
        }}
        updateQueuePositions={updateQueuePositions}
        setGlobalQueue={setGlobalQueue}
      />
      <CustomerDetailsModal
        visible={showCustomerDetailsModal}
        onClose={() => setShowCustomerDetailsModal(false)}
        customer={selectedCustomer}
        onCall={handleCallCustomer}
        updateQueuePositions={updateQueuePositions}
        setGlobalQueue={setGlobalQueue}
      />
      <CusDetails_serviceTime_AllView__break
        globalQueue={globalQueue}
        showCustomerDetailsModal={false}
        showAllCustomersModal={false}
        customDuration={customDuration}
        customReason={customReason}  // ADD THIS
        extraTimeInput={extraTimeInput}
        showCustomFields={showCustomFields}  // ADD THIS
        selectedBreakDuration={selectedBreakDuration}  // ADD THIS
        selectedCustomer={selectedCustomer}
        selectedBreakReason={selectedBreakReason}  // ADD THIS
        setSelectedBreakDuration={setSelectedBreakDuration}  // ADD THIS
        startBreak={handleStartBreak}  // ADD THIS (reuse your existing function)
        setShowAllCustomersModal={setShowAllCustomersModal}
        handleCallCustomer={handleCallCustomer}
        handleCustomerDetails={handleCustomerDetails}
        setShowCustomerDetailsModal={setShowCustomerDetailsModal}
        setExtraTimeInput={setExtraTimeInput}
        setGlobalQueue={setGlobalQueue}
        updateQueuePositions={updateQueuePositions}
        setShowCustomFields={setShowCustomFields}  // ADD THIS
        setCustomDuration={setCustomDuration}
        setCustomReason={setCustomReason}  // ADD THIS
        setSelectedBreakReason={setSelectedBreakReason}  // ADD THIS
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
              padding: 24,
              width: "90%",
              maxWidth: 350,
            }}
          >
            <View style={{ alignItems: "flex-end", marginBottom: 12 }}>
              <TouchableOpacity onPress={() => setShowCallConfirmModal(false)}>
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: isDark ? "#F8FAFC" : "#1E3A8A",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Make a Call
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: isDark ? "#9CA3AF" : "#6B7280",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              Call this customer?
            </Text>

            {selectedCustomer && (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                  textAlign: "center",
                  marginBottom: 24,
                }}
              >
                {selectedCustomer.phone}
              </Text>
            )}

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowCallConfirmModal(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: isDark ? "#4B5563" : "#E5E7EB",
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
                style={{ flex: 1 }}
              >
                <LinearGradient
                  colors={["#4F7DF7", "#2563EB"]}
                  start={[0, 0]}
                  end={[1, 0]}
                  style={{
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>
                    Call
                  </Text>
                </LinearGradient>
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

      <UndoSystem

      />

      {/* Take a Break Modal */}
      <TakeBreakModal
        visible={showTakeBreakModal}
        onClose={() => setShowTakeBreakModal(false)}
        onStartBreak={handleStartBreak}
        isDark={isDark}
      />
      {/* Queue Paused Modal */}
      <Modal
        visible={isOnBreak}
        transparent
        animationType="fade"
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
              backgroundColor: "white",
              borderRadius: 16,
              padding: 24,
              width: "90%",
              maxWidth: 350,
              alignItems: "center",
            }}
          >
            {/* Coffee Icon */}
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#EFF6FF",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Coffee size={40} color="#3B82F6" />
            </View>

            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#1E3A8A",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Queue Paused
            </Text>

            {/* Timer Display */}
            <View
              style={{
                backgroundColor: "#EFF6FF",
                paddingVertical: 16,
                paddingHorizontal: 32,
                borderRadius: 12,
                marginBottom: 16,
                width: "100%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "#2563EB",
                }}
              >
                {Math.floor(remainingTime / 60).toString().padStart(2, '0')}:{(remainingTime % 60).toString().padStart(2, '0')}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 14,
                color: "#6B7280",
                textAlign: "center",
                marginBottom: 24,
                lineHeight: 20,
              }}
            >
              You&apos;re currently on a break. Queue operations are paused until you resume.
            </Text>

            <TouchableOpacity
              onPress={handleResumeBreak}
              style={{
                width: "100%",
                backgroundColor: "#2563EB",
                paddingVertical: 14,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: 15,
                }}
              >
                Resume Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* <ThemeWidget isDark={isDark} toggleTheme={toggleTheme} />
        <LanguageWidget
          setLanguage={setLanguage}
          isDark={isDark}
          language={language}
        /> */}
    </LinearGradient>
  );
}
