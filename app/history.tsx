import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Linking,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import useThemeStore from "@/store/themeStore";
import {
  ArrowLeft,
  User,
  Phone,
  History,
  Calendar,
  Clock,
  CheckCircle,
  SkipForward,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  X,
  Filter,
  Search,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations, Remtranslations } from "@/translations/customerHistory";
const { width } = Dimensions.get("window");

export default function CustomerHistoryScreen() {
  const router = useRouter();
  const { isDark, language } = useThemeStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customerHistory, setCustomerHistory] = useState([]);
  const [historyDetailsCustomer, setHistoryDetailsCustomer] = useState(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [phoneToCall, setPhoneToCall] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedServiceHistory, setExpandedServiceHistory] = useState(false);
  const [previousServices, setPreviousServices] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [dateFilterType, setDateFilterType] = useState("day");
  const [showDateFilterDropdown, setShowDateFilterDropdown] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const historyLanguagseSet = translations[language];
  const remLanguageSet = Remtranslations[language];

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
    } else if (
      dateFilterType === "custom" &&
      customStartDate &&
      customEndDate
    ) {
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

  const generateMockHistory = (date, count = null) => {
    const dateString = date.toISOString().split("T")[0];
    const dateSeed = dateString
      .split("-")
      .reduce((a, b) => a + Number.parseInt(b), 0);
    const rng = (n) => (((dateSeed * 9301 + 49297) % 233280) / 233280) * n;

    const customerCount = count || Math.floor(rng(30)) + 10;
    const history = [];

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
      const adjustedRng = (n) =>
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
        arrivalTime: `${hour}:${minute.toString().padStart(2, "0")} ${
          hour >= 12 ? "PM" : "AM"
        }`,
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

    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return history;
  };

  const handleBackToQueue = () => {
    router.back();
  };

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const toggleHistoryDetails = (customer) => {
    setHistoryDetailsCustomer(customer);
    if (customer.previousVisits) {
      setPreviousServices(customer.previousVisits);
    } else {
      setPreviousServices([]);
    }
    setShowDetailsModal(true);
  };

  const handlePhoneClick = (phone, e) => {
    setPhoneToCall(phone);
    setShowCallModal(true);
  };

  const handleCall = () => {
    const phoneNumber = phoneToCall.replace(/[^0-9]/g, "");
    Linking.openURL(`tel:${phoneNumber}`);
    setShowCallModal(false);
  };

  const getGenderIcon = (gender) => {
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

  const handleDateFilterSelect = (filterType) => {
    setDateFilterType(filterType);
    setShowDateFilterDropdown(false);
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
            <Text
              style={{
                color: isDark ? "#DBEAFE" : "#1E40AF",
                fontSize: 12,
              }}
            >
              {dateFilterType === "day" &&
              selectedDate.toLocaleDateString() ===
                new Date().toLocaleDateString()
                ? "Today"
                : dateFilterType === "day"
                ? "Selected Date"
                : getDateFilterLabel()}
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
                            {/* <ChevronRight
                              size={16}
                              color="#3B82F6"
                              style={{ marginLeft: 8 }}
                            /> */}
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
          <View
            style={{
              backgroundColor: isDark ? "#374151" : "white",
              borderRadius: 12,
              padding: 16,
              width: width * 0.8,
              maxWidth: 300,
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
                <Text
                  style={{
                    color: isDark ? "#F9FAFB" : "#374151",
                    marginBottom: 8,
                  }}
                >
                  {historyLanguagseSet.startDate}
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: isDark ? "#6B7280" : "#D1D5DB",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    color: isDark ? "#F9FAFB" : "#374151",
                    backgroundColor: isDark ? "#4B5563" : "#F9FAFB",
                    marginBottom: 12,
                  }}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                  value={customStartDate}
                  onChangeText={setCustomStartDate}
                />

                <Text
                  style={{
                    color: isDark ? "#F9FAFB" : "#374151",
                    marginBottom: 8,
                  }}
                >
                  {historyLanguagseSet.endDate}
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: isDark ? "#6B7280" : "#D1D5DB",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    color: isDark ? "#F9FAFB" : "#374151",
                    backgroundColor: isDark ? "#4B5563" : "#F9FAFB",
                    marginBottom: 16,
                  }}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                  value={customEndDate}
                  onChangeText={setCustomEndDate}
                />

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
                      fontWeight: "500",
                    }}
                  >
                    {historyLanguagseSet.apply}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Customer Details Modal */}
      <Modal
        visible={showDetailsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
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
              maxHeight: "90%",
            }}
          >
            {/* Modal Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? "#4B5563" : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                }}
              >
                {historyLanguagseSet.customerDetails}
              </Text>
              <TouchableOpacity
                onPress={() => setShowDetailsModal(false)}
                style={{ padding: 8 }}
              >
                <X size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 16 }}>
              {historyDetailsCustomer && (
                <>
                  <View style={{ gap: 16 }}>
                    {/* Customer Header */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: isDark ? "#4B5563" : "#DBEAFE",
                        padding: 12,
                        borderRadius: 12,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: isDark ? "#6B7280" : "white",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 12,
                          }}
                        >
                          {getGenderIcon(historyDetailsCustomer.gender)}
                        </View>
                        <View>
                          <Text
                            style={{
                              fontWeight: "bold",
                              color: isDark ? "#F8FAFC" : "#1E40AF",
                              fontSize: 16,
                            }}
                          >
                            {historyDetailsCustomer.name}
                          </Text>
                          <Text
                            style={{
                              color: isDark ? "#DBEAFE" : "#3B82F6",
                              fontSize: 12,
                            }}
                          >
                            Position: {historyDetailsCustomer.position}/
                            {historyDetailsCustomer.totalServed}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 4,
                          borderRadius: 16,
                          backgroundColor:
                            historyDetailsCustomer.status === "served"
                              ? isDark
                                ? "#065F46"
                                : "#DCFCE7"
                              : isDark
                              ? "#92400E"
                              : "#FEF3C7",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          {historyDetailsCustomer.status === "served" ? (
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
                                historyDetailsCustomer.status === "served"
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
                            {historyDetailsCustomer.status === "served"
                              ? "Served"
                              : "Skipped"}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Customer Information */}
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: isDark ? "#F8FAFC" : "#1E3A8A",
                          marginBottom: 12,
                        }}
                      >
                        {remLanguageSet.customerInformation}
                      </Text>

                      <View style={{ gap: 12 }}>
                        <TouchableOpacity
                          onPress={() =>
                            handlePhoneClick(historyDetailsCustomer.phone)
                          }
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: isDark ? "#4B5563" : "#DBEAFE",
                            padding: 12,
                            borderRadius: 12,
                          }}
                        >
                          <Phone size={18} color="#3B82F6" />
                          <View style={{ marginLeft: 12 }}>
                            <Text
                              style={{
                                fontSize: 12,
                                color: isDark ? "#DBEAFE" : "#3B82F6",
                              }}
                            >
                              {historyLanguagseSet.phoneNumber}
                            </Text>
                            <Text
                              style={{
                                fontWeight: "500",
                                color: isDark ? "#F8FAFC" : "#1E40AF",
                              }}
                            >
                              {historyDetailsCustomer.phone}
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: isDark ? "#4B5563" : "#DBEAFE",
                            padding: 12,
                            borderRadius: 12,
                          }}
                        >
                          <User size={18} color="#3B82F6" />
                          <View style={{ marginLeft: 12 }}>
                            <Text
                              style={{
                                fontSize: 12,
                                color: isDark ? "#DBEAFE" : "#3B82F6",
                              }}
                            >
                              {historyLanguagseSet.gender}
                            </Text>
                            <Text
                              style={{
                                fontWeight: "500",
                                color: isDark ? "#F8FAFC" : "#1E40AF",
                              }}
                            >
                              {historyDetailsCustomer.gender || "Not specified"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Time Information */}
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: isDark ? "#F8FAFC" : "#1E3A8A",
                          marginBottom: 12,
                        }}
                      >
                        {remLanguageSet.timeInformation}
                      </Text>

                      <View style={{ gap: 12 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: isDark ? "#4B5563" : "#DBEAFE",
                            padding: 12,
                            borderRadius: 12,
                          }}
                        >
                          <Clock size={18} color="#3B82F6" />
                          <View style={{ marginLeft: 12 }}>
                            <Text
                              style={{
                                fontSize: 12,
                                color: isDark ? "#DBEAFE" : "#3B82F6",
                              }}
                            >
                              {historyLanguagseSet.arrivalTime}
                            </Text>
                            <Text
                              style={{
                                fontWeight: "500",
                                color: isDark ? "#F8FAFC" : "#1E40AF",
                              }}
                            >
                              {historyDetailsCustomer.arrivalTime}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: isDark ? "#4B5563" : "#DBEAFE",
                            padding: 12,
                            borderRadius: 12,
                          }}
                        >
                          <History size={18} color="#3B82F6" />
                          <View style={{ marginLeft: 12 }}>
                            <Text
                              style={{
                                fontSize: 12,
                                color: isDark ? "#DBEAFE" : "#3B82F6",
                              }}
                            >
                              {historyLanguagseSet.waitDuration}
                            </Text>
                            <Text
                              style={{
                                fontWeight: "500",
                                color: isDark ? "#F8FAFC" : "#1E40AF",
                              }}
                            >
                              {historyDetailsCustomer.waitTime}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: isDark ? "#4B5563" : "#DBEAFE",
                            padding: 12,
                            borderRadius: 12,
                          }}
                        >
                          <CheckCircle size={18} color="#3B82F6" />
                          <View style={{ marginLeft: 12 }}>
                            <Text
                              style={{
                                fontSize: 12,
                                color: isDark ? "#DBEAFE" : "#3B82F6",
                              }}
                            >
                              {historyDetailsCustomer.status === "served"
                                ? historyLanguagseSet.servedTime
                                : historyLanguagseSet.skippedTime}
                            </Text>
                            <Text
                              style={{
                                fontWeight: "500",
                                color: isDark ? "#F8FAFC" : "#1E40AF",
                              }}
                            >
                              {formatTimestamp(
                                historyDetailsCustomer.timestamp
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Service Information */}
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: isDark ? "#F8FAFC" : "#1E3A8A",
                          marginBottom: 12,
                        }}
                      >
                        {remLanguageSet.serviceInformation}
                      </Text>

                      <View
                        style={{
                          backgroundColor: isDark ? "#4B5563" : "#DBEAFE",
                          padding: 12,
                          borderRadius: 12,
                          marginBottom: 12,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: isDark ? "#DBEAFE" : "#3B82F6",
                            marginBottom: 4,
                          }}
                        >
                          {historyLanguagseSet.currentService}
                        </Text>
                        <Text
                          style={{
                            fontWeight: "500",
                            color: isDark ? "#F8FAFC" : "#1E40AF",
                          }}
                        >
                          {historyDetailsCustomer.service ||
                            "No service recorded"}
                        </Text>
                        {historyDetailsCustomer.serviceRate && (
                          <Text
                            style={{
                              color: isDark ? "#DBEAFE" : "#3B82F6",
                              fontSize: 12,
                              marginTop: 4,
                            }}
                          >
                            {remLanguageSet.rate}: ₹
                            {historyDetailsCustomer.serviceRate}
                          </Text>
                        )}
                      </View>

                      {/* Previous Services */}
                      {previousServices.length > 0 && (
                        <View>
                          <TouchableOpacity
                            onPress={toggleServiceHistory}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              backgroundColor: isDark ? "#4B5563" : "#DBEAFE",
                              padding: 12,
                              borderRadius: 12,
                              marginBottom: expandedServiceHistory ? 12 : 0,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                color: isDark ? "#DBEAFE" : "#3B82F6",
                              }}
                            >
                              {historyLanguagseSet.previousServices}
                            </Text>
                            {expandedServiceHistory ? (
                              <ChevronUp size={16} color="#3B82F6" />
                            ) : (
                              <ChevronDown size={16} color="#3B82F6" />
                            )}
                          </TouchableOpacity>

                          {expandedServiceHistory && (
                            <View
                              style={{
                                backgroundColor: isDark ? "#4B5563" : "#DBEAFE",
                                padding: 12,
                                borderRadius: 12,
                              }}
                            >
                              <View style={{ gap: 12 }}>
                                {previousServices.map((visit, index) => (
                                  <View
                                    key={index}
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <View>
                                      <Text
                                        style={{
                                          color: isDark ? "#F8FAFC" : "#1E40AF",
                                          fontSize: 14,
                                        }}
                                      >
                                        {visit.service}
                                      </Text>
                                      <Text
                                        style={{
                                          color: isDark ? "#DBEAFE" : "#3B82F6",
                                          fontSize: 10,
                                        }}
                                      >
                                        {formatShortDate(visit.date)}
                                      </Text>
                                    </View>
                                    <Text
                                      style={{
                                        color: isDark ? "#DBEAFE" : "#3B82F6",
                                        fontWeight: "500",
                                      }}
                                    >
                                      ₹{visit.rate}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            </View>
                          )}
                        </View>
                      )}
                    </View>

                    {/* Notes */}
                    {historyDetailsCustomer.notes && (
                      <View>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "600",
                            color: isDark ? "#F8FAFC" : "#1E3A8A",
                            marginBottom: 12,
                          }}
                        >
                          {historyLanguagseSet.notes}
                        </Text>
                        <View
                          style={{
                            backgroundColor: isDark ? "#4B5563" : "#DBEAFE",
                            padding: 12,
                            borderRadius: 12,
                          }}
                        >
                          <Text
                            style={{
                              color: isDark ? "#DBEAFE" : "#3B82F6",
                            }}
                          >
                            {historyDetailsCustomer.notes}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                  <View className="h-20" />
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Call Confirmation Modal */}
      <Modal
        visible={showCallModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCallModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: isDark ? "#374151" : "white",
              borderRadius: 12,
              padding: 16,
              width: width * 0.8,
              maxWidth: 320,
            }}
          >
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
                  fontWeight: "bold",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                }}
              >
                {historyLanguagseSet.makeCall}
              </Text>
              <TouchableOpacity
                onPress={() => setShowCallModal(false)}
                style={{ padding: 8 }}
              >
                <X size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <Text
                style={{
                  color: "#3B82F6",
                  marginBottom: 8,
                }}
              >
                {remLanguageSet.callCustomer}
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                }}
              >
                {phoneToCall}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => setShowCallModal(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: isDark ? "#6B7280" : "#D1D5DB",
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: isDark ? "#9CA3AF" : "#6B7280",
                  }}
                >
                  {historyLanguagseSet.cancel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCall}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  backgroundColor: "#3B82F6",
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "500",
                  }}
                >
                  {historyLanguagseSet.call}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
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
              padding: 16,
            }}
          >
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
                  fontWeight: "bold",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                }}
              >
                {historyLanguagseSet.filterHistory}
              </Text>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={{ padding: 8 }}
              >
                <X size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: isDark ? "#F8FAFC" : "#1E3A8A",
                marginBottom: 16,
              }}
            >
              {historyLanguagseSet.sortBy}
            </Text>

            <View style={{ gap: 12, marginBottom: 24 }}>
              <TouchableOpacity
                onPress={() => setSortOrder("newest")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: "#3B82F6",
                    marginRight: 12,
                    alignItems: "center",
                    justifyContent: "center",
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
                    color: isDark ? "#F9FAFB" : "#374151",
                  }}
                >
                  {historyLanguagseSet.newestFirst}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSortOrder("oldest")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: "#3B82F6",
                    marginRight: 12,
                    alignItems: "center",
                    justifyContent: "center",
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
                    color: isDark ? "#F9FAFB" : "#374151",
                  }}
                >
                  {historyLanguagseSet.oldestFirst}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setSortOrder("newest");
                  setShowFilterModal(false);
                }}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: isDark ? "#6B7280" : "#D1D5DB",
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: isDark ? "#9CA3AF" : "#6B7280",
                  }}
                >
                  {historyLanguagseSet.reset}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  backgroundColor: "#3B82F6",
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "500",
                  }}
                >
                  {historyLanguagseSet.applyFilters}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
