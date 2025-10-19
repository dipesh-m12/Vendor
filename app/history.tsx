import useThemeStore from "@/store/themeStore";
import { Remtranslations, translations } from "@/translations/customerHistory";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  History,
  Search,
  SkipForward,
  User,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function CustomerHistoryScreen() {
  const router = useRouter();
  const { isDark, language } = useThemeStore();
  const [selectedDate, setSelectedDate] = useState(new Date());

  type CustomerHistoryItem = {
    id: string;
    name: string;
    arrivalTime: string;
    waitTime: string;
    status: string;
    gender: string;
    phone: string;
    timestamp: Date | string | number;
    position: number;
    totalServed: number;
    notes: string;
    service: string;
    serviceRate: number;
    previousVisits: any[];
  };

  const [customerHistory, setCustomerHistory] = useState<CustomerHistoryItem[]>([]);
  const [historyDetailsCustomer, setHistoryDetailsCustomer] = useState<CustomerHistoryItem | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [phoneToCall, setPhoneToCall] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedServiceHistory, setExpandedServiceHistory] = useState(false);
  const [previousServices, setPreviousServices] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [filteredHistory, setFilteredHistory] = useState<CustomerHistoryItem[]>([]);
  const [dateFilterType, setDateFilterType] = useState("day");
  const [showDateFilterDropdown, setShowDateFilterDropdown] = useState(false);

  // Date picker states
  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const historyLanguagseSet = translations[language];
  const remLanguageSet = Remtranslations[language];

  const handleApplyFilters = () => {
    setShowFilterModal(false);
    if (customerHistory.length > 0) {
      const sortedHistory = [...customerHistory].sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
      });
      setFilteredHistory(sortedHistory);
    }
  };

  const handleResetFilters = () => {
    setSortOrder("newest");
    setFilteredHistory(customerHistory);
  };

  // Load customer history
  useEffect(() => {
    setIsLoading(true);

    let startDateObj = new Date(selectedDate);
    let endDateObj = new Date(selectedDate);

    if (dateFilterType === "7days") {
      startDateObj = new Date();
      startDateObj.setDate(startDateObj.getDate() - 7);
    } else if (dateFilterType === "30days") {
      startDateObj = new Date();
      startDateObj.setDate(startDateObj.getDate() - 30);
    } else if (dateFilterType === "60days") {
      startDateObj = new Date();
      startDateObj.setDate(startDateObj.getDate() - 60);
    } else if (dateFilterType === "90days") {
      startDateObj = new Date();
      startDateObj.setDate(startDateObj.getDate() - 90);
    } else if (dateFilterType === "custom") {
      startDateObj = new Date(customStartDate);
      endDateObj = new Date(customEndDate);
      endDateObj.setHours(23, 59, 59, 999);
    }

    const loadHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem("customerHistory");
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          const filteredHistory = parsedHistory.filter((item: any) => {
            if (!item.timestamp) return false;
            const itemDate = new Date(item.timestamp);

            if (dateFilterType === "day") {
              return itemDate.toDateString() === selectedDate.toDateString();
            } else {
              return itemDate >= startDateObj && itemDate <= endDateObj;
            }
          });

          if (filteredHistory.length > 0) {
            setCustomerHistory(filteredHistory);
            setFilteredHistory(filteredHistory);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error("Error loading customer history:", e);
      }

      // Fallback to mock data
      setTimeout(() => {
        let mockHistory: any = [];

        if (dateFilterType === "day") {
          mockHistory = generateMockHistory(selectedDate);
        } else {
          const dayCount =
            dateFilterType === "7days"
              ? 7
              : dateFilterType === "30days"
                ? 30
                : dateFilterType === "60days"
                  ? 60
                  : dateFilterType === "90days"
                    ? 90
                    : 1;

          for (let i = 0; i < dayCount; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            mockHistory = [
              ...mockHistory,
              ...generateMockHistory(date, 5 + Math.floor(Math.random() * 10)),
            ];
          }
        }

        setCustomerHistory(mockHistory);
        setFilteredHistory(mockHistory);
        setIsLoading(false);
      }, 800);
    };

    loadHistory();
  }, [selectedDate, dateFilterType, customStartDate, customEndDate]);

  // Apply sorting
  useEffect(() => {
    if (customerHistory.length > 0) {
      const sortedHistory = [...customerHistory].sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
      });
      setFilteredHistory(sortedHistory);
    }
  }, [sortOrder, customerHistory]);

  // Handle search
  useEffect(() => {
    if (customerHistory.length === 0) return;

    if (!searchQuery.trim()) {
      setFilteredHistory(customerHistory);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = customerHistory.filter((item) => {
      return (
        item.name?.toLowerCase().includes(query) ||
        item.phone?.toLowerCase().includes(query) ||
        item.service?.toLowerCase().includes(query)
      );
    });

    setFilteredHistory(filtered);
  }, [searchQuery, customerHistory]);

  // Date picker handlers
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setCustomStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setCustomEndDate(selectedDate);
    }
  };

  const generateMockHistory = (date: Date, count: number | null = null) => {
    const dateString = date.toISOString().split("T")[0];
    const dateSeed = dateString
      .split("-")
      .reduce((a, b) => a + Number.parseInt(b), 0);
    const rng = (n: number) => (((dateSeed * 9301 + 49297) % 233280) / 233280) * n;

    const customerCount = count || Math.floor(rng(30)) + 10;
    const history: any[] = [];

    const services = [
      { name: "Hair Cutting", rate: 150 },
      { name: "Hair Styling", rate: 300 },
      { name: "Hair Coloring", rate: 500 },
      { name: "Facial", rate: 400 },
      { name: "Manicure", rate: 200 },
      { name: "Pedicure", rate: 250 },
      { name: "Beard Trim", rate: 100 },
      { name: "Hair Spa", rate: 600 },
      { name: "Makeup", rate: 800 },
      { name: "Waxing", rate: 350 },
    ];

    const names = [
      "Sarah Johnson",
      "Michael Chen",
      "Aisha Patel",
      "Carlos Rodriguez",
      "Emma Wilson",
      "Jamal Washington",
      "Hiroshi Tanaka",
      "Sofia Garcia",
      "Aditya Sharma",
      "Olivia Smith",
      "Wei Liu",
      "Isabella Rossi",
      "Fatima Al-Hassan",
      "David Kim",
      "Zoe Miller",
      "Raj Malhotra",
      "Priya Singh",
      "Ahmed Hassan",
      "Maria Gonzalez",
      "Kenji Yamamoto",
      "Ananya Desai",
      "John Smith",
      "Li Wei",
      "Sanjay Gupta",
      "Elena Petrova",
    ];

    for (let i = 0; i < customerCount; i++) {
      const seedOffset = (i * 13) % 100;
      const adjustedSeed = (dateSeed + seedOffset) % 1000;
      const adjustedRng = (n: number) =>
        (((adjustedSeed * 9301 + 49297) % 233280) / 233280) * n;

      const hour = Math.floor(adjustedRng(10)) + 9;
      const minute = Math.floor(adjustedRng(60));
      const waitTime = Math.floor(adjustedRng(25)) + 5;
      const gender = ["Male", "Female", "Other"][Math.floor(adjustedRng(3))];
      const status = adjustedRng(1) > 0.2 ? "served" : "skipped";
      const id = `H${date.getDate()}${1000 + i}`;
      const serviceIndex = Math.floor(adjustedRng(services.length));
      const service = services[serviceIndex];
      const nameIndex = Math.floor(adjustedRng(names.length));
      const name = names[nameIndex];

      const nameHash = name.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
      const phoneArea = 100 + (nameHash % 900);
      const phonePrefix = 100 + ((nameHash * 13) % 900);
      const phoneSuffix = 1000 + ((nameHash * 29) % 9000);
      const phone = `(${phoneArea}) ${phonePrefix}-${phoneSuffix}`;

      const visitCount = Math.floor(adjustedRng(5)) + 1;
      const previousVisits = [];

      for (let j = 0; j < visitCount; j++) {
        const visitDate = new Date(date);
        visitDate.setDate(
          visitDate.getDate() - Math.floor(adjustedRng(30)) - 1
        );
        const prevServiceIndex = Math.floor(adjustedRng(services.length));
        const prevService = services[prevServiceIndex];

        previousVisits.push({
          date: visitDate,
          service: prevService.name,
          rate: prevService.rate,
        });
      }

      history.push({
        id: id,
        name: name,
        arrivalTime: `${hour}:${minute.toString().padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`,
        waitTime: `${waitTime} min`,
        status,
        gender,
        phone: phone,
        timestamp: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          hour,
          minute
        ),
        position: i + 1,
        totalServed: customerCount,
        notes:
          status === "served"
            ? "Customer was satisfied with the service"
            : "Customer couldn't wait",
        service: service.name,
        serviceRate: service.rate,
        previousVisits: previousVisits,
      });
    }

    history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return history;
  };

  const handleBackToQueue = () => {
    router.back();
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (date: any) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const toggleHistoryDetails = (customer: any) => {
    setHistoryDetailsCustomer(customer);
    if (customer.previousVisits) {
      setPreviousServices(customer.previousVisits);
    } else {
      setPreviousServices([]);
    }
    setShowDetailsModal(true);
  };

  const handlePhoneClick = (phone: string) => {
    setPhoneToCall(phone);
    setShowCallModal(true);
  };

  const handleCall = () => {
    const phoneNumber = phoneToCall.replace(/[^0-9]/g, "");
    Linking.openURL(`tel:${phoneNumber}`);
    setShowCallModal(false);
  };

  const getGenderIcon = (gender: string) => {
    const color =
      gender?.toLowerCase() === "male"
        ? "#3B82F6"
        : gender?.toLowerCase() === "female"
          ? "#EC4899"
          : "#8B5CF6";
    return <User size={20} color={color} />;
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
    setDateFilterType("day");
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
    setDateFilterType("day");
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
    setDateFilterType("day");
  };

  const toggleServiceHistory = () => {
    setExpandedServiceHistory(!expandedServiceHistory);
  };

  const getDateFilterLabel = () => {
    switch (dateFilterType) {
      case "day":
        return "Today";
      case "7days":
        return "Last 7 Days";
      case "30days":
        return "Last 30 Days";
      case "60days":
        return "Last 60 Days";
      case "90days":
        return "Last 90 Days";
      case "custom":
        return "Custom Range";
      default:
        return "Select Date Range";
    }
  };

  const handleDateFilterSelect = (filterType: string) => {
    setDateFilterType(filterType);
    if (filterType !== "custom") {
      setShowDateFilterDropdown(false);
    }
  };

  const LoadingCard = () => (
    <View
      style={{
        padding: 16,
        backgroundColor: isDark ? "#374151" : "white",
        marginBottom: 1,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isDark ? "#4B5563" : "#E5E7EB",
            marginRight: 12,
          }}
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              height: 16,
              backgroundColor: isDark ? "#4B5563" : "#E5E7EB",
              borderRadius: 8,
              width: "60%",
              marginBottom: 8,
            }}
          />
          <View
            style={{
              height: 12,
              backgroundColor: isDark ? "#6B7280" : "#F3F4F6",
              borderRadius: 6,
              width: "40%",
            }}
          />
        </View>
        <View
          style={{
            width: 80,
            height: 24,
            backgroundColor: isDark ? "#4B5563" : "#E5E7EB",
            borderRadius: 12,
          }}
        />
      </View>
    </View>
  );

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
      {/* Header */}
      <View
        style={{
          backgroundColor: isDark ? "#374151" : "white",
          paddingHorizontal: 16,
          paddingTop: 60,
          paddingBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={handleBackToQueue}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <ArrowLeft size={16} color="#3B82F6" />
            <Text
              style={{
                color: "#3B82F6",
                marginLeft: 4,
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              {historyLanguagseSet.back}
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: isDark ? "#F8FAFC" : "#1E3A8A",
            }}
          >
            {historyLanguagseSet.customerHistory}
          </Text>

          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            style={{ padding: 8 }}
          >
            <Filter size={18} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Search and Date Selector */}
        <View
          style={{
            backgroundColor: isDark ? "#374151" : "white",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          {/* Search Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isDark ? "#4B5563" : "#F9FAFB",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: isDark ? "#6B7280" : "#E5E7EB",
            }}
          >
            <Search size={16} color="#3B82F6" />
            <TextInput
              style={{
                flex: 1,
                marginLeft: 8,
                fontSize: 14,
                color: isDark ? "#F9FAFB" : "#111827",
              }}
              placeholder={historyLanguagseSet.searchPlaceholder}
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Date Filter Button */}
          <TouchableOpacity
            onPress={() => setShowDateFilterDropdown(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: isDark ? "#4B5563" : "#F9FAFB",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: isDark ? "#6B7280" : "#E5E7EB",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Calendar size={18} color="#3B82F6" />
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 14,
                  color: isDark ? "#F9FAFB" : "#111827",
                }}
              >
                {getDateFilterLabel()}
              </Text>
            </View>
            <ChevronDown size={16} color="#3B82F6" />
          </TouchableOpacity>

          {/* Date Navigation for "day" filter */}
          {dateFilterType === "day" && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 16,
              }}
            >
              <Text
                style={{
                  color: "#3B82F6",
                  fontWeight: "500",
                  fontSize: 14,
                }}
              >
                {formatDate(selectedDate)}
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  onPress={handlePreviousDay}
                  style={{
                    padding: 4,
                    backgroundColor: isDark ? "#3B82F6" : "#DBEAFE",
                    borderRadius: 8,
                  }}
                >
                  <ChevronLeft size={16} color={isDark ? "white" : "#1E40AF"} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleTodayClick}
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    backgroundColor: isDark ? "#3B82F6" : "#DBEAFE",
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      color: isDark ? "white" : "#1E40AF",
                      fontSize: 12,
                    }}
                  >
                    Today
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleNextDay}
                  disabled={
                    selectedDate.toDateString() === new Date().toDateString()
                  }
                  style={{
                    padding: 4,
                    backgroundColor:
                      selectedDate.toDateString() === new Date().toDateString()
                        ? isDark
                          ? "#4B5563"
                          : "#F3F4F6"
                        : isDark
                          ? "#3B82F6"
                          : "#DBEAFE",
                    borderRadius: 8,
                  }}
                >
                  <ChevronRight
                    size={16}
                    color={
                      selectedDate.toDateString() === new Date().toDateString()
                        ? isDark
                          ? "#6B7280"
                          : "#9CA3AF"
                        : isDark
                          ? "white"
                          : "#1E40AF"
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* History List */}
        <View
          style={{
            backgroundColor: isDark ? "#374151" : "white",
            borderRadius: 12,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          {/* Header */}
          <View
            style={{
              backgroundColor: isDark ? "#4B5563" : "#DBEAFE",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: isDark ? "#6B7280" : "#93C5FD",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: isDark ? "#DBEAFE" : "#1E40AF",
                fontWeight: "500",
              }}
            >
              {historyLanguagseSet.customersServed}: {filteredHistory.length}
            </Text>
          </View>

          {/* Loading State */}
          {isLoading ? (
            <View>
              {Array.from({ length: 5 }).map((_, index) => (
                <LoadingCard key={index} />
              ))}
            </View>
          ) : (
            <ScrollView style={{ maxHeight: 400 }}>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((customer: any) => (
                  <TouchableOpacity
                    key={customer.id}
                    onPress={() => toggleHistoryDetails(customer)}
                    style={{
                      padding: 16,
                      backgroundColor: isDark ? "#374151" : "white",
                      borderBottomWidth: 1,
                      borderBottomColor: isDark ? "#4B5563" : "#F3F4F6",
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "flex-start" }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: isDark ? "#4B5563" : "#DBEAFE",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 12,
                        }}
                      >
                        {getGenderIcon(customer.gender)}
                      </View>

                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  fontWeight: "bold",
                                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                                  fontSize: 16,
                                }}
                              >
                                {customer.name}
                              </Text>
                              <View
                                style={{
                                  backgroundColor: isDark
                                    ? "#4B5563"
                                    : "#DBEAFE",
                                  paddingHorizontal: 8,
                                  paddingVertical: 2,
                                  borderRadius: 12,
                                  marginLeft: 8,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 10,
                                    color: isDark ? "#DBEAFE" : "#1E40AF",
                                  }}
                                >
                                  {customer.position}/{customer.totalServed}
                                </Text>
                              </View>
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 4,
                              }}
                            >
                              <Clock size={12} color="#3B82F6" />
                              <Text
                                style={{
                                  color: "#3B82F6",
                                  fontSize: 12,
                                  marginLeft: 4,
                                }}
                              >
                                {formatTimestamp(customer.timestamp)}
                              </Text>
                              <Text
                                style={{
                                  color: "#3B82F6",
                                  fontSize: 12,
                                  marginHorizontal: 8,
                                }}
                              >
                                •
                              </Text>
                              <Text
                                style={{
                                  color: "#3B82F6",
                                  fontSize: 12,
                                }}
                              >
                                Wait: {customer.waitTime}
                              </Text>
                            </View>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                paddingHorizontal: 12,
                                paddingVertical: 4,
                                borderRadius: 16,
                                backgroundColor:
                                  customer.status === "served"
                                    ? isDark
                                      ? "#065F46"
                                      : "#DCFCE7"
                                    : isDark
                                      ? "#92400E"
                                      : "#FEF3C7",
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                {customer.status === "served" ? (
                                  <CheckCircle
                                    size={12}
                                    color={isDark ? "#10B981" : "#059669"}
                                  />
                                ) : (
                                  <SkipForward
                                    size={12}
                                    color={isDark ? "#F59E0B" : "#D97706"}
                                  />
                                )}
                                <Text
                                  style={{
                                    color:
                                      customer.status === "served"
                                        ? isDark
                                          ? "#10B981"
                                          : "#059669"
                                        : isDark
                                          ? "#F59E0B"
                                          : "#D97706",
                                    fontSize: 10,
                                    fontWeight: "500",
                                    marginLeft: 4,
                                  }}
                                >
                                  {customer.status === "served"
                                    ? "Served"
                                    : "Skipped"}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View
                  style={{
                    padding: 32,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      backgroundColor: isDark ? "#4B5563" : "#DBEAFE",
                      borderRadius: 32,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12,
                    }}
                  >
                    <History size={24} color="#3B82F6" />
                  </View>
                  <Text
                    style={{
                      color: "#3B82F6",
                      fontWeight: "500",
                      fontSize: 16,
                    }}
                  >
                    {historyLanguagseSet.noCustomerHistory}
                  </Text>
                  <Text
                    style={{
                      color: "#6B7280",
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    {historyLanguagseSet.adjustSearchOrFilter}
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Filter History Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
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
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            {/* Header with Close Button */}
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
                  fontWeight: "600",
                  color: isDark ? "#F8FAFC" : "#1F2937",
                }}
              >
                Filter History
              </Text>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={{
                  padding: 4,
                }}
              >
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            {/* Sort By Section */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: isDark ? "#E5E7EB" : "#374151",
                  marginBottom: 16,
                }}
              >
                Sort By
              </Text>

              {/* Newest First Option */}
              <TouchableOpacity
                onPress={() => setSortOrder("newest")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: sortOrder === "newest" ? "#3B82F6" : isDark ? "#6B7280" : "#D1D5DB",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  {sortOrder === "newest" && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#3B82F6",
                      }}
                    />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: isDark ? "#F9FAFB" : "#1F2937",
                  }}
                >
                  Newest First
                </Text>
              </TouchableOpacity>

              {/* Oldest First Option */}
              <TouchableOpacity
                onPress={() => setSortOrder("oldest")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: sortOrder === "oldest" ? "#3B82F6" : isDark ? "#6B7280" : "#D1D5DB",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  {sortOrder === "oldest" && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#3B82F6",
                      }}
                    />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: isDark ? "#F9FAFB" : "#1F2937",
                  }}
                >
                  Oldest First
                </Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View
              style={{
                flexDirection: "row",
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={handleResetFilters}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? "#4B5563" : "#F3F4F6",
                  paddingVertical: 14,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: isDark ? "#F8FAFC" : "#1F2937",
                    fontWeight: "600",
                    fontSize: 15,
                  }}
                >
                  Reset
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleApplyFilters}
                style={{
                  flex: 1,
                  backgroundColor: "#3B82F6",
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
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Filter Modal */}
      <Modal
        visible={showDateFilterDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDateFilterDropdown(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPress={() => setShowDateFilterDropdown(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: isDark ? "#374151" : "white",
              borderRadius: 12,
              padding: 16,
              width: width * 0.85,
              maxWidth: 350,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: isDark ? "#F8FAFC" : "#1E3A8A",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              {historyLanguagseSet.selectDateRange}
            </Text>

            <View style={{ gap: 8 }}>
              {[
                { key: "day", label: "Today" },
                { key: "7days", label: "Last 7 Days" },
                { key: "30days", label: "Last 30 Days" },
                { key: "60days", label: "Last 60 Days" },
                { key: "90days", label: "Last 90 Days" },
                { key: "custom", label: "Custom Range" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => handleDateFilterSelect(option.key)}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor:
                      dateFilterType === option.key
                        ? isDark
                          ? "#3B82F6"
                          : "#DBEAFE"
                        : isDark
                          ? "#4B5563"
                          : "#F9FAFB",
                  }}
                >
                  <Text
                    style={{
                      color:
                        dateFilterType === option.key
                          ? isDark
                            ? "white"
                            : "#1E40AF"
                          : isDark
                            ? "#F9FAFB"
                            : "#374151",
                      textAlign: "center",
                      fontWeight: dateFilterType === option.key ? "600" : "400",
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Date Range Picker */}
            {dateFilterType === "custom" && (
              <View
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTopWidth: 1,
                  borderTopColor: isDark ? "#4B5563" : "#E5E7EB",
                }}
              >
                {/* Start Date */}
                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={{
                      color: isDark ? "#F9FAFB" : "#374151",
                      marginBottom: 8,
                      fontSize: 13,
                      fontWeight: "500",
                    }}
                  >
                    {historyLanguagseSet.startDate || "Start Date"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowStartDatePicker(true)}
                    style={{
                      borderWidth: 1,
                      borderColor: isDark ? "#6B7280" : "#D1D5DB",
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      backgroundColor: isDark ? "#4B5563" : "#F9FAFB",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: isDark ? "#F9FAFB" : "#374151", fontSize: 14 }}>
                      {customStartDate.toLocaleDateString("en-GB")}
                    </Text>
                    <Calendar size={16} color="#3B82F6" />
                  </TouchableOpacity>
                </View>

                {/* End Date */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      color: isDark ? "#F9FAFB" : "#374151",
                      marginBottom: 8,
                      fontSize: 13,
                      fontWeight: "500",
                    }}
                  >
                    {historyLanguagseSet.endDate || "End Date"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowEndDatePicker(true)}
                    style={{
                      borderWidth: 1,
                      borderColor: isDark ? "#6B7280" : "#D1D5DB",
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      backgroundColor: isDark ? "#4B5563" : "#F9FAFB",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: isDark ? "#F9FAFB" : "#374151", fontSize: 14 }}>
                      {customEndDate.toLocaleDateString("en-GB")}
                    </Text>
                    <Calendar size={16} color="#3B82F6" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => setShowDateFilterDropdown(false)}
                  style={{
                    backgroundColor: "#3B82F6",
                    paddingVertical: 12,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    {historyLanguagseSet.apply || "Apply"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={customStartDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleStartDateChange}
          maximumDate={customEndDate}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={customEndDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleEndDateChange}
          minimumDate={customStartDate}
          maximumDate={new Date()}
        />
      )}

      {/* Customer Details Modal - Add your existing modal code here */}
      {/* Call Modal - Add your existing modal code here */}
    </LinearGradient>
  );
}
