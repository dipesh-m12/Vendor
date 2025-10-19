import useThemeStore from "@/store/themeStore";
import { Box } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Armchair,
  ChevronRight,
  Clock,
  Coffee,
  FileText,
  Pause,
  Phone,
  Play,
  Users,
  X,
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
import ChairManagementModal from "@/components/modals/ChairManagementModal";
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

  // Dark mode color palette - MATCHING Statistics & FullQueue pages
  const colors = {
    // Page backgrounds - consistent gradient
    gradientStart: isDark ? "#111827" : "#F1F5F9", // dark:from-gray-900
    gradientMid: isDark ? "#1F2937" : "#E2E8F0", // dark:bg-gray-800
    gradientEnd: isDark ? "#374151" : "#CBD5E1", // dark:border-gray-700

    // Card backgrounds
    cardBg: isDark ? "rgba(31, 41, 55, 0.95)" : "white", // dark:bg-gray-800/95
    cardBgAlt: isDark ? "#374151" : "#F8FAFC", // dark:bg-gray-700

    // Text colors - blue palette for consistency
    textPrimary: isDark ? "#DBEAFE" : "#1E3A8A", // dark:text-blue-100
    textSecondary: isDark ? "#BFDBFE" : "#3B82F6", // dark:text-blue-200
    textAccent: isDark ? "#93C5FD" : "#3B82F6", // dark:text-blue-300
    textMuted: isDark ? "#9CA3AF" : "#6B7280", // dark:text-gray-400
    textWhite: isDark ? "#F9FAFB" : "#1E3A8A", // dark:text-gray-50

    // Border colors
    borderColor: isDark ? "#374151" : "#E5E7EB", // dark:border-gray-700

    // Button colors
    buttonPrimaryBg: isDark ? "#1E3A8A" : "#EFF6FF", // dark:bg-blue-900
    buttonPrimaryText: isDark ? "#93C5FD" : "#3B82F6", // dark:text-blue-300
    buttonSuccessBg: isDark ? "#059669" : "#D1FAE5",
    buttonSuccessText: isDark ? "white" : "#10B981",

    // Status colors
    activeBg: isDark ? "rgba(34, 197, 94, 0.2)" : "#DCFCE7",
    activeText: isDark ? "#4ADE80" : "#16A34A",
    pausedBg: isDark ? "rgba(239, 68, 68, 0.2)" : "#FEE2E2",
    pausedText: isDark ? "#F87171" : "#DC2626",

    // Chair button
    chairBg: isDark ? "#374151" : "#F3F4F6", // dark:border-gray-700
    chairText: isDark ? "#60A5FA" : "#3B82F6", // dark:text-blue-400

    // Break button - amber tones
    breakBg: isDark ? "rgba(252, 211, 77, 0.15)" : "#FED7AA",
    breakBorder: isDark ? "#F59E0B" : "#F59E0B",
    breakText: isDark ? "#FCD34D" : "#D97706", // dark:text-amber-300
    breakIcon: isDark ? "#FBBF24" : "#D97706", // dark:text-amber-400

    // Current customer header
    currentHeaderBg: isDark ? "#1E40AF" : "#4F7DF7", // dark:bg-blue-900

    // Note badge
    noteBadgeBg: isDark ? "#1E3A8A" : "#EFF6FF", // dark:bg-blue-900
    noteBadgeText: isDark ? "#93C5FD" : "#3B82F6", // dark:text-blue-300

    // Position badge
    positionBadgeBg: isDark ? "#60A5FA" : "#4F7DF7", // dark:text-blue-400

    // Phone button
    phoneBg: isDark ? "#1E3A8A" : "#EFF6FF", // dark:bg-blue-900
    phoneIcon: isDark ? "#60A5FA" : "#3B82F6", // dark:text-blue-400

    // Modal backgrounds
    modalOverlay: "rgba(0, 0, 0, 0.5)",
    modalBg: isDark ? "#374151" : "white", // dark:bg-gray-700
    modalCloseIcon: isDark ? "#9CA3AF" : "#6B7280",
  };

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
      services: [{ name: "Facial", price: 300 }],
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
  const [userType, setUserType] = useState<"owner" | "helper">("helper");
  const [showChairManagementModal, setShowChairManagementModal] =
    useState(false);

  // Add these state variables for break functionality
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakDuration, setBreakDuration] = useState<number>(0);
  const [breakReason, setBreakReason] = useState<string>("");
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [customReason, setCustomReason] = useState<string>("");
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [selectedBreakDuration, setSelectedBreakDuration] = useState<number>(0);
  const [selectedBreakReason, setSelectedBreakReason] = useState<string>("");

  const [showUndoNotification, setShowUndoNotification] = useState(false);
  const [showUndoHistory, setShowUndoHistory] = useState(false);
  const [undoHistory, setUndoHistory] = useState<any[]>([]);
  const [latestUndoAction, setLatestUndoAction] = useState<any>(null);
  const [showFullQueueModal, setShowFullQueueModal] = useState(false);

  const langaugeSet = translations[language];

  // Countdown timer for break
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isOnBreak && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            handleResumeBreak();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
    }, currentServiceDuration * 60 * 1000);

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

  const addToUndoHistory = (
    type: "next" | "skip" | "remove",
    customer: any,
    previousQueue: any[]
  ) => {
    const action = {
      id: `undo-${Date.now()}-${Math.random()}`,
      type,
      customerName: customer.name,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      previousQueue,
    };

    setUndoHistory((prev) => [action, ...prev.slice(0, 9)]);
    setLatestUndoAction(action);
    setShowUndoNotification(true);
  };

  const handleStartBreak = (duration: number, reason: string) => {
    setIsOnBreak(true);
    setBreakDuration(duration);
    setBreakReason(reason);
    setRemainingTime(duration * 60);
    setIsActive(false);

    Alert.alert(
      langaugeSet.BreakStarted || "Break Started",
      langaugeSet.TakingAXMinuteBreakForY?.replace(
        "{X}",
        duration.toString()
      ).replace("{Y}", reason) ||
        `Taking a ${duration} minute break for ${reason}`
    );

    setShowTakeBreakModal(false);

    setTimeout(() => {
      handleResumeBreak();
    }, duration * 60 * 1000);
  };

  const handleResumeBreak = () => {
    setIsOnBreak(false);
    setBreakDuration(0);
    setBreakReason("");
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
      const currentCustomer = globalQueue[0];
      const previousQueue = [...globalQueue];

      setGlobalQueue((prev) => updateQueuePositions(prev.slice(1)));
      setShowServiceTimeModal(false);

      addToUndoHistory("next", currentCustomer, previousQueue);
    }
  };

  const addExtraTime = () => {
    setShowServiceTimeModal(false);
    setTimeout(() => {
      setShowServiceTimeModal(true);
    }, 5 * 60 * 1000);
  };

  const skipCurrentCustomer = () => {
    if (globalQueue.length > 0) {
      const skippedCustomer = globalQueue[0];
      const previousQueue = [...globalQueue];

      setGlobalQueue((prev) =>
        updateQueuePositions([
          ...prev.slice(1),
          { ...skippedCustomer, position: prev.length },
        ])
      );
      setShowServiceTimeModal(false);

      addToUndoHistory("skip", skippedCustomer, previousQueue);
    }
  };

  const removeCustomer = () => {
    if (globalQueue.length > 0) {
      const removedCustomer = globalQueue[0];
      const previousQueue = [...globalQueue];

      setGlobalQueue((prev) => updateQueuePositions(prev.slice(1)));
      setShowServiceTimeModal(false);

      addToUndoHistory("remove", removedCustomer, previousQueue);
    }
  };

  const handleUndo = () => {
    if (latestUndoAction) {
      setGlobalQueue(latestUndoAction.previousQueue);
      setUndoHistory((prev) =>
        prev.filter((a) => a.id !== latestUndoAction.id)
      );
      setShowUndoNotification(false);
    }
  };

  const handleUndoSpecific = (actionId: string) => {
    const action = undoHistory.find((a) => a.id === actionId);
    if (action) {
      setGlobalQueue(action.previousQueue);
      setUndoHistory((prev) => prev.filter((a) => a.id !== actionId));
      setShowUndoHistory(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
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
            }}
          >
            <QVuewLogo isDark={isDark} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: colors.textPrimary,
                }}
              >
                {langaugeSet.QVuew}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                }}
              >
                ABC Business Services
              </Text>
            </View>

            {/* Right side buttons container */}
            <View style={{ alignItems: "flex-end", gap: 8 }}>
              {/* Active/Paused Toggle */}
              <TouchableOpacity
                onPress={toggleStatus}
                style={{
                  backgroundColor: isActive ? colors.activeBg : colors.pausedBg,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: isActive ? colors.activeText : colors.pausedText,
                    fontWeight: "600",
                    fontSize: 13,
                    marginRight: 4,
                  }}
                >
                  {isActive ? langaugeSet.Active : langaugeSet.Paused}
                </Text>
                {isActive ? (
                  <Pause
                    size={12}
                    color={colors.activeText}
                    fill={colors.activeText}
                  />
                ) : (
                  <Play
                    size={12}
                    color={colors.pausedText}
                    fill={colors.pausedText}
                  />
                )}
              </TouchableOpacity>

              {/* Chair Management Button */}
              <TouchableOpacity
                onPress={() => setShowChairManagementModal(true)}
                style={{
                  backgroundColor: colors.chairBg,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Armchair size={16} color={colors.chairText} />
                <Text
                  style={{
                    color: colors.chairText,
                    fontWeight: "600",
                    fontSize: 13,
                    marginLeft: 6,
                  }}
                >
                  Chairs
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
            {userType !== "owner" ? (
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
                  <FileText
                    size={18}
                    color="white"
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{ color: "white", fontWeight: "600", fontSize: 15 }}
                  >
                    {langaugeSet.RateCard}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={toggleStatus} style={{ flex: 1 }}>
                <LinearGradient
                  colors={
                    isActive ? ["#10B981", "#059669"] : ["#EF4444", "#DC2626"]
                  }
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
                  {isActive ? (
                    <Pause size={18} color="white" style={{ marginRight: 6 }} />
                  ) : (
                    <Play size={18} color="white" style={{ marginRight: 6 }} />
                  )}
                  <Text
                    style={{ color: "white", fontWeight: "600", fontSize: 15 }}
                  >
                    {isActive ? langaugeSet.Active : langaugeSet.Paused}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Take a Break button */}
            <TouchableOpacity onPress={handleTakeBreak} style={{ flex: 1 }}>
              <View
                style={{
                  paddingVertical: 14,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.breakBg,
                  borderWidth: 1,
                  borderColor: colors.breakBorder,
                }}
              >
                <Coffee
                  size={18}
                  color={colors.breakIcon}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    color: colors.breakText,
                    fontWeight: "600",
                    fontSize: 15,
                  }}
                >
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
                color: colors.textPrimary,
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
                <Text
                  style={{
                    color: "white",
                    fontWeight: "600",
                    marginRight: 4,
                    fontSize: 14,
                  }}
                >
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
                backgroundColor: colors.cardBg,
                borderRadius: 8,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: colors.borderColor,
                overflow: "hidden",
              }}
            >
              {/* Blue Header Bar */}
              <View
                style={{
                  backgroundColor: colors.currentHeaderBg,
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
                        color: colors.textWhite,
                        marginBottom: 4,
                      }}
                    >
                      {currentCustomer.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleCallCustomer(currentCustomer)}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.textSecondary,
                          marginBottom: 8,
                        }}
                      >
                        {currentCustomer.phone}
                      </Text>
                    </TouchableOpacity>
                    {currentCustomer.note && (
                      <View
                        style={{
                          backgroundColor: colors.noteBadgeBg,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 6,
                          alignSelf: "flex-start",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: colors.noteBadgeText,
                            fontWeight: "500",
                          }}
                        >
                          {langaugeSet.NoteX.replace(
                            "{X}",
                            currentCustomer.note
                          )}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity
                      onPress={() => handleCustomerDetails(currentCustomer)}
                      style={{
                        backgroundColor: colors.buttonPrimaryBg,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.buttonPrimaryText,
                          fontWeight: "600",
                        }}
                      >
                        {langaugeSet.Details}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleNextCustomer()}
                      style={{
                        backgroundColor: colors.buttonSuccessBg,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.buttonSuccessText,
                          fontWeight: "600",
                        }}
                      >
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
                backgroundColor: colors.cardBg,
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: colors.borderColor,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: colors.textWhite,
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
                color: colors.textSecondary,
              }}
            >
              {langaugeSet.NextInQueue}
            </Text>
            <TouchableOpacity onPress={() => setShowFullQueueModal(true)}>
              <Text
                style={{
                  color: colors.textAccent,
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
                  backgroundColor: colors.cardBg,
                  borderRadius: 8,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: colors.borderColor,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: colors.positionBadgeBg,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 14,
                      }}
                    >
                      {customer.position}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        color: colors.textWhite,
                        marginBottom: 2,
                      }}
                    >
                      {customer.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.textMuted,
                      }}
                    >
                      {langaugeSet.EstWaitXMin.replace(
                        "{X}",
                        customer.estimatedWait
                      )}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleCallCustomer(customer)}
                      style={{
                        backgroundColor: colors.phoneBg,
                        padding: 10,
                        borderRadius: 8,
                      }}
                    >
                      <Phone size={18} color={colors.phoneIcon} />
                    </TouchableOpacity>

                    {customer.position === 1 && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#10B981",
                          paddingHorizontal: 14,
                          paddingVertical: 10,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "600",
                            fontSize: 13,
                          }}
                        >
                          Next
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={() => handleCustomerDetails(customer)}
                      style={{
                        backgroundColor: colors.buttonPrimaryBg,
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.buttonPrimaryText,
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
                  backgroundColor: colors.cardBg,
                  borderRadius: 8,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: colors.borderColor,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.textAccent,
                    fontWeight: "600",
                    fontSize: 14,
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
              backgroundColor: colors.cardBg,
              borderRadius: 8,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.borderColor,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: colors.textSecondary,
                marginBottom: 16,
              }}
            >
              {langaugeSet.TodaysStats}
            </Text>

            <View style={{ flexDirection: "row", gap: 16, marginBottom: 24 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.cardBgAlt,
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textMuted,
                    marginBottom: 4,
                  }}
                >
                  {langaugeSet.InQueue}
                </Text>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    color: colors.textWhite,
                  }}
                >
                  {todayStats.inQueue}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.cardBgAlt,
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textMuted,
                    marginBottom: 4,
                  }}
                >
                  {langaugeSet.Served}
                </Text>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    color: colors.textWhite,
                  }}
                >
                  {todayStats.served}
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: colors.textSecondary,
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
                  backgroundColor: colors.cardBgAlt,
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Clock
                  size={20}
                  color={colors.textAccent}
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.textWhite,
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
                  backgroundColor: colors.cardBgAlt,
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Users
                  size={20}
                  color={colors.textAccent}
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.textWhite,
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
        visible={showFullQueueModal}
        onClose={() => setShowFullQueueModal(false)}
        customers={globalQueue}
        onNext={(customer) => {
          setSelectedCustomer(customer);
          setShowServiceTimeModal(true);
          setShowFullQueueModal(false);
        }}
        onDetails={(customer) => {
          setSelectedCustomer(customer);
          setShowCustomerDetailsModal(true);
        }}
        updateQueuePositions={updateQueuePositions}
        setGlobalQueue={setGlobalQueue}
        addToUndoHistory={addToUndoHistory}
      />

      <CustomerDetailsModal
        visible={showCustomerDetailsModal}
        onClose={() => setShowCustomerDetailsModal(false)}
        customer={selectedCustomer}
        onCall={handleCallCustomer}
        updateQueuePositions={updateQueuePositions}
        setGlobalQueue={setGlobalQueue}
        globalQueue={globalQueue}
        addToUndoHistory={addToUndoHistory}
      />

      <CusDetails_serviceTime_AllView__break
        globalQueue={globalQueue}
        showCustomerDetailsModal={false}
        showAllCustomersModal={false}
        customDuration={customDuration}
        customReason={customReason}
        extraTimeInput={extraTimeInput}
        showCustomFields={showCustomFields}
        selectedBreakDuration={selectedBreakDuration}
        selectedCustomer={selectedCustomer}
        selectedBreakReason={selectedBreakReason}
        setSelectedBreakDuration={setSelectedBreakDuration}
        startBreak={handleStartBreak}
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
            backgroundColor: colors.modalOverlay,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: colors.modalBg,
              borderRadius: 16,
              padding: 24,
              width: "90%",
              maxWidth: 350,
            }}
          >
            <View style={{ alignItems: "flex-end", marginBottom: 12 }}>
              <TouchableOpacity onPress={() => setShowCallConfirmModal(false)}>
                <X size={24} color={colors.modalCloseIcon} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: colors.textWhite,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Make a Call
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: colors.textMuted,
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
                  color: colors.textWhite,
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
                  borderColor: colors.borderColor,
                }}
              >
                <Text
                  style={{
                    color: colors.textWhite,
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={confirmCall} style={{ flex: 1 }}>
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
        visible={showUndoNotification}
        onClose={() => setShowUndoNotification(false)}
        onUndo={handleUndo}
        onShowHistory={() => {
          setShowUndoNotification(false);
          setShowUndoHistory(true);
        }}
        latestAction={latestUndoAction}
        undoHistory={undoHistory}
        onUndoSpecific={handleUndoSpecific}
        showHistoryModal={showUndoHistory}
        onCloseHistory={() => setShowUndoHistory(false)}
      />

      <TakeBreakModal
        visible={showTakeBreakModal}
        onClose={() => setShowTakeBreakModal(false)}
        onStartBreak={handleStartBreak}
        isDark={isDark}
      />

      {/* Queue Paused Modal */}
      <Modal visible={isOnBreak} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: colors.modalOverlay,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: colors.modalBg,
              borderRadius: 16,
              padding: 24,
              width: "90%",
              maxWidth: 350,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.buttonPrimaryBg,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Coffee size={40} color={colors.buttonPrimaryText} />
            </View>

            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.textWhite,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Queue Paused
            </Text>

            <View
              style={{
                backgroundColor: colors.buttonPrimaryBg,
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
                  color: colors.buttonPrimaryText,
                }}
              >
                {Math.floor(remainingTime / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(remainingTime % 60).toString().padStart(2, "0")}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 14,
                color: colors.textMuted,
                textAlign: "center",
                marginBottom: 24,
                lineHeight: 20,
              }}
            >
              You're currently on a break. Queue operations are paused until you
              resume.
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

      <ChairManagementModal
        visible={showChairManagementModal}
        onClose={() => setShowChairManagementModal(false)}
        isDark={isDark}
      />
    </LinearGradient>
  );
}
