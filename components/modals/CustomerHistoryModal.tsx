import useThemeStore from "@/store/themeStore";
import {
  CusDettranslations,
  translations,
} from "@/translations/tabsTranslations/queue/modal_cusHis";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  Crown,
  Download,
  FileSpreadsheet,
  FileText,
  X,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const CustomerHistoryModal = ({
  showDownloadHistoryModal,
  setShowDownloadHistoryModal,
  isDark,
  customerHistoryData,
  maskSensitiveData,
  setMaskSensitiveData,
}: any) => {
  const [showChart, setShowChart] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 30 Days");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const { language } = useThemeStore();
  const langaugeSet = translations[language as keyof typeof translations];
  const cusDetLanguageSet =
    CusDettranslations[language as keyof typeof CusDettranslations];
  const screenWidth = Dimensions.get("window").width;

  const timeRangeOptions = [
    "Last 15 Days",
    "Last 30 Days",
    "Last 60 Days",
    "Last 90 Days",
    "Custom Range",
  ];

  // Process data for line chart
  const chartData = useMemo(() => {
    if (!customerHistoryData || customerHistoryData.length === 0) {
      return { labels: ["No Data"], data: [0] };
    }

    const dateGroups = customerHistoryData.reduce(
      (
        acc: { [x: string]: any },
        customer: { date: any }
      ) => {
        const date = customer.date;
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {}
    );

    const dates = Object.keys(dateGroups).sort();
    const labels = dates.map((date) => {
      const d = new Date(date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    const data = dates.map((date) => dateGroups[date]);

    return {
      labels: labels.length > 0 ? labels : ["No Data"],
      data: data.length > 0 ? data : [0],
    };
  }, [customerHistoryData]);

  const lineChartConfig = {
    backgroundColor: isDark ? "#1F2937" : "#F8FAFC",
    backgroundGradientFrom: isDark ? "#1F2937" : "#F8FAFC",
    backgroundGradientTo: isDark ? "#374151" : "#FFFFFF",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) =>
      isDark
        ? `rgba(156, 163, 175, ${opacity})`
        : `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 8,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#3B82F6",
      fill: "#3B82F6",
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: isDark ? "#374151" : "#E5E7EB",
      strokeWidth: 1,
    },
    fillShadowGradient: "#3B82F6",
    fillShadowGradientOpacity: 0.15,
  };

  const getServiceColor = (service: string | number) => {
    const colors: any = {
      "Hair Coloring": "#EF4444",
      Styling: "#F59E0B",
      Waxing: "#F59E0B",
      Massage: "#F59E0B",
      Makeup: "#EC4899",
      Haircut: "#10B981",
      Manicure: "#10B981",
      Facial: "#3B82F6",
    };
    return colors[service as keyof typeof colors] || "#6B7280";
  };

  const maskData = (
    data: {
      replace: (arg0: RegExp, arg1: string) => any;
      split: (arg0: string) => [any, any];
    },
    type: string
  ) => {
    if (!maskSensitiveData || !data) return data;

    if (type === "phone") {
      return data.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2");
    } else if (type === "email") {
      const [username, domain] = data.split("@");
      if (!username || !domain) return data;
      const maskedUsername = username.charAt(0) + "***" + username.slice(-1);
      return maskedUsername + "@" + domain;
    }
    return data;
  };

  const handleTimeRangeSelect = (option: string) => {
    setSelectedTimeRange(option);
    setShowDropdown(false);
  };

  const handleStartDateChange = (
    event: any,
    selectedDate?: Date
  ) => {
    setShowStartDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (
    event: any,
    selectedDate?: Date
  ) => {
    setShowEndDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handlePdfDownload = () => {
    setShowDownloadModal(true);
    setDownloadProgress(0);

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowDownloadModal(false);
            Alert.alert("Success", "PDF downloaded successfully!");
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleExcelDownload = () => {
    setShowPremiumModal(true);
  };

  // Premium Modal Component - FIXED
  const PremiumModal = () => (
    <Modal
      visible={showPremiumModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowPremiumModal(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: isDark ? "#374151" : "white",
            borderRadius: 20,
            padding: 24,
            width: "90%",
            maxWidth: 400,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setShowPremiumModal(false)}
            style={{ position: "absolute", right: 16, top: 16, zIndex: 1 }}
          >
            <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: "#FEF3C7",
              borderRadius: 50,
              padding: 16,
              marginBottom: 20,
              marginTop: 10,
            }}
          >
            <Crown size={40} color="#F59E0B" />
          </View>

          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: isDark ? "#F8FAFC" : "#1E3A8A",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Premium Feature
          </Text>

          <View
            style={{
              backgroundColor: "#FEF3C7",
              borderRadius: 12,
              padding: 12,
              marginBottom: 20,
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <FileSpreadsheet size={24} color="#F59E0B" />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#92400E",
                  marginLeft: 8,
                  flex: 1,
                }}
              >
                Excel Export is a Premium Feature
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: 14,
              color: isDark ? "#D1D5DB" : "#6B7280",
              marginBottom: 20,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            Upgrade to Premium to unlock Excel reports and more powerful
            features.
          </Text>

          {/* Premium Benefits Section */}
          <View style={{ width: "100%", marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: isDark ? "#F8FAFC" : "#1E3A8A",
                marginBottom: 12,
              }}
            >
              Premium Benefits:
            </Text>
            {[
              "Excel and CSV exports",
              "Advanced data filtering",
              "Unlimited customer history",
            ].map((benefit, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: "#10B981",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>✓</Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#D1D5DB" : "#4B5563",
                  }}
                >
                  {benefit}
                </Text>
              </View>
            ))}
          </View>

          {/* Buttons - NOW INSIDE THE MODAL */}
          <TouchableOpacity
            onPress={() => {
              setShowPremiumModal(false);
              Alert.alert("Premium", "Redirecting to premium upgrade...");
            }}
            style={{
              backgroundColor: "#3B82F6",
              paddingVertical: 14,
              borderRadius: 10,
              width: "100%",
              marginBottom: 10,
              shadowColor: "#3B82F6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "600",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Upgrade to Premium
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowPremiumModal(false)}
            style={{ paddingVertical: 10 }}
          >
            <Text
              style={{
                color: isDark ? "#93C5FD" : "#3B82F6",
                fontSize: 14,
              }}
            >
              Maybe Later
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );


  // Download Progress Modal - FIXED
  const DownloadModal = () => (
    <Modal
      visible={showDownloadModal}
      transparent
      animationType="fade"
      onRequestClose={() => { }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: isDark ? "#374151" : "white",
            borderRadius: 16,
            padding: 24,
            width: "80%",
            maxWidth: 300,
            alignItems: "center",
          }}
        >
          <Download size={40} color="#3B82F6" style={{ marginBottom: 16 }} />

          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: isDark ? "#F8FAFC" : "#1E3A8A",
              marginBottom: 8,
            }}
          >
            Downloading PDF
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: isDark ? "#9CA3AF" : "#6B7280",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            customer_history_{new Date().toISOString().split('T')[0]}.pdf
          </Text>

          <View
            style={{
              width: "100%",
              height: 8,
              backgroundColor: isDark ? "#1F2937" : "#E5E7EB",
              borderRadius: 4,
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: `${downloadProgress}%`,
                height: "100%",
                backgroundColor: "#3B82F6",
                borderRadius: 4,
              }}
            />
          </View>

          <Text
            style={{
              fontSize: 16,
              color: isDark ? "#93C5FD" : "#3B82F6",
              fontWeight: "600",
            }}
          >
            {downloadProgress}%
          </Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <Modal
        visible={showDownloadHistoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDownloadHistoryModal(false)}
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
              padding: 20,
              maxHeight: "95%",
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <BarChart3
                  size={24}
                  color={isDark ? "#93C5FD" : "#3B82F6"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: isDark ? "#F8FAFC" : "#1E3A8A",
                  }}
                >
                  {langaugeSet.downloadCustomerHistory}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowDownloadHistoryModal(false)}
              >
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Time Range Selector */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: isDark ? "#F8FAFC" : "#1E3A8A",
                    marginBottom: 8,
                  }}
                >
                  {langaugeSet.selectTimeRange}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDropdown(!showDropdown)}
                  style={{
                    borderWidth: 1,
                    borderColor: isDark ? "#4B5563" : "#D1D5DB",
                    backgroundColor: isDark ? "#1F2937" : "#F9FAFB",
                    borderRadius: 8,
                    padding: 12,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Calendar
                      size={16}
                      color={isDark ? "#93C5FD" : "#3B82F6"}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={{ color: isDark ? "#F8FAFC" : "#1E3A8A" }}>
                      {selectedTimeRange}
                    </Text>
                  </View>
                  <ChevronDown
                    size={16}
                    color={isDark ? "#9CA3AF" : "#6B7280"}
                    style={{
                      transform: [
                        { rotate: showDropdown ? "180deg" : "0deg" },
                      ],
                    }}
                  />
                </TouchableOpacity>

                {/* Dropdown Options */}
                {showDropdown && (
                  <View
                    style={{
                      marginTop: 8,
                      borderWidth: 1,
                      borderColor: isDark ? "#4B5563" : "#D1D5DB",
                      backgroundColor: isDark ? "#1F2937" : "white",
                      borderRadius: 8,
                      overflow: "hidden",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 5,
                    }}
                  >
                    {timeRangeOptions.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleTimeRangeSelect(option)}
                        style={{
                          padding: 12,
                          borderBottomWidth:
                            index < timeRangeOptions.length - 1 ? 1 : 0,
                          borderBottomColor: isDark ? "#4B5563" : "#E5E7EB",
                          backgroundColor:
                            selectedTimeRange === option
                              ? isDark
                                ? "#374151"
                                : "#EFF6FF"
                              : "transparent",
                        }}
                      >
                        <Text
                          style={{
                            color:
                              selectedTimeRange === option
                                ? isDark
                                  ? "#93C5FD"
                                  : "#3B82F6"
                                : isDark
                                  ? "#F8FAFC"
                                  : "#1E3A8A",
                            fontWeight:
                              selectedTimeRange === option ? "600" : "400",
                          }}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Custom Date Range */}
              {selectedTimeRange === "Custom Range" && (
                <View
                  style={{
                    marginBottom: 20,
                    flexDirection: "row",
                    gap: 12,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: isDark ? "#F8FAFC" : "#1E3A8A",
                        marginBottom: 6,
                      }}
                    >
                      Start Date
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowStartDatePicker(true)}
                      style={{
                        borderWidth: 1,
                        borderColor: isDark ? "#4B5563" : "#D1D5DB",
                        backgroundColor: isDark ? "#1F2937" : "white",
                        borderRadius: 8,
                        padding: 12,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Calendar
                        size={16}
                        color={isDark ? "#93C5FD" : "#3B82F6"}
                        style={{ marginRight: 8 }}
                      />
                      <Text style={{ color: isDark ? "#F8FAFC" : "#1E3A8A", fontSize: 14 }}>
                        {startDate.toLocaleDateString("en-GB")}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: isDark ? "#F8FAFC" : "#1E3A8A",
                        marginBottom: 6,
                      }}
                    >
                      End Date
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowEndDatePicker(true)}
                      style={{
                        borderWidth: 1,
                        borderColor: isDark ? "#4B5563" : "#D1D5DB",
                        backgroundColor: isDark ? "#1F2937" : "white",
                        borderRadius: 8,
                        padding: 12,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Calendar
                        size={16}
                        color={isDark ? "#93C5FD" : "#3B82F6"}
                        style={{ marginRight: 8 }}
                      />
                      <Text style={{ color: isDark ? "#F8FAFC" : "#1E3A8A", fontSize: 14 }}>
                        {endDate.toLocaleDateString("en-GB")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Date Pickers */}
              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleStartDateChange}
                  maximumDate={endDate}
                />
              )}

              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleEndDateChange}
                  minimumDate={startDate}
                  maximumDate={new Date()}
                />
              )}

              {/* Mask Sensitive Data Toggle */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => setMaskSensitiveData(!maskSensitiveData)}
                  activeOpacity={0.7}
                  style={{
                    width: 48,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: maskSensitiveData
                      ? "#10B981"
                      : isDark
                        ? "#4B5563"
                        : "#D1D5DB",
                    justifyContent: "center",
                    padding: 2,
                    marginRight: 12,
                  }}
                >
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: "white",
                      alignSelf: maskSensitiveData ? "flex-end" : "flex-start",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 2,
                      elevation: 3,
                    }}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#F8FAFC" : "#1E3A8A",
                  }}
                >
                  {langaugeSet.maskSensitiveData}
                </Text>
              </View>

              {/* Customer Flow Trend Chart */}
              <View style={{ marginBottom: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: isDark ? "#F8FAFC" : "#1E3A8A",
                    }}
                  >
                    {langaugeSet.customerFlowTrend}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowChart(!showChart)}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <ChevronDown
                      size={16}
                      color={isDark ? "#93C5FD" : "#3B82F6"}
                      style={{
                        transform: [{ rotate: showChart ? "180deg" : "0deg" }],
                        marginRight: 4,
                      }}
                    />
                    <Text
                      style={{
                        color: isDark ? "#93C5FD" : "#3B82F6",
                        fontSize: 14,
                      }}
                    >
                      {showChart
                        ? langaugeSet.hideChart
                        : langaugeSet.showChart}
                    </Text>
                  </TouchableOpacity>
                </View>

                {showChart && (
                  <View
                    style={{
                      backgroundColor: isDark ? "#1F2937" : "#F8FAFC",
                      borderRadius: 12,
                      padding: 10,
                      marginBottom: 10,
                    }}
                  >
                    <LineChart
                      data={{
                        labels: chartData.labels,
                        datasets: [
                          {
                            data: chartData.data,
                            strokeWidth: 3,
                          },
                        ],
                      }}
                      width={screenWidth - 80}
                      height={220}
                      chartConfig={lineChartConfig}
                      bezier
                      style={{
                        borderRadius: 8,
                      }}
                      withVerticalLines={false}
                      withHorizontalLines={true}
                      withDots={true}
                      withShadow={false}
                      withInnerLines={true}
                      withOuterLines={true}
                      segments={4}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 12,
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: isDark ? "#9CA3AF" : "#6B7280",
                        }}
                      >
                        {langaugeSet.totalCustomers?.replace(
                          "{X}",
                          customerHistoryData?.length || 0
                        ) ||
                          `Total: ${customerHistoryData?.length || 0
                          } customers`}
                      </Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            backgroundColor: "#3B82F6",
                            borderRadius: 4,
                            marginRight: 6,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            color: isDark ? "#9CA3AF" : "#6B7280",
                          }}
                        >
                          {langaugeSet.dailyCustomerCount}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>

              {/* Customer Details Table */}
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: isDark ? "#F8FAFC" : "#1E3A8A",
                    marginBottom: 12,
                  }}
                >
                  {cusDetLanguageSet.customerDetails}
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={true}
                  style={{ marginBottom: 10 }}
                >
                  <View>
                    {/* Table Header - Updated columns */}
                    <View
                      style={{
                        backgroundColor: isDark ? "#1E40AF" : "#EFF6FF",
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        padding: 12,
                        flexDirection: "row",
                        minWidth: screenWidth * 2,
                      }}
                    >
                      <Text style={[styles.headerText(isDark), { width: 50 }]}>S.No</Text>
                      <Text style={[styles.headerText(isDark), { width: 90 }]}>Date</Text>
                      <Text style={[styles.headerText(isDark), { width: 90 }]}>Customer ID</Text>
                      <Text style={[styles.headerText(isDark), { width: 120 }]}>Full Name</Text>
                      <Text style={[styles.headerText(isDark), { width: 100 }]}>Service</Text>
                      <Text style={[styles.headerText(isDark), { width: 70 }]}>Amount</Text>
                      <Text style={[styles.headerText(isDark), { width: 110 }]}>Phone</Text>
                      <Text style={[styles.headerText(isDark), { width: 180 }]}>Email</Text>
                      <Text style={[styles.headerText(isDark), { width: 90 }]}>Timestamp</Text>
                    </View>

                    {/* Table Rows */}
                    <ScrollView style={{ maxHeight: 300 }}>
                      {customerHistoryData && customerHistoryData.length > 0 ? (
                        customerHistoryData.map((customer: any, index: number) => (
                          <View
                            key={customer.id || index}
                            style={{
                              backgroundColor:
                                index % 2 === 0
                                  ? isDark
                                    ? "#374151"
                                    : "white"
                                  : isDark
                                    ? "#1F2937"
                                    : "#F8FAFC",
                              padding: 12,
                              flexDirection: "row",
                              borderBottomWidth: 1,
                              borderBottomColor: isDark ? "#4B5563" : "#E5E7EB",
                              minWidth: screenWidth * 2,
                            }}
                          >
                            <Text style={[styles.cellText(isDark), { width: 50 }]}>
                              {index + 1}
                            </Text>
                            <Text style={[styles.cellText(isDark), { width: 90 }]}>
                              {new Date(customer.date).toLocaleDateString("en-GB")}
                            </Text>
                            <Text style={[styles.cellText(isDark), { width: 90 }]}>
                              {customer.customerId || `CUST${1000 + index}`}
                            </Text>
                            <Text style={[styles.cellText(isDark), { width: 120 }]}>
                              {customer.name}
                            </Text>
                            <View style={{ width: 100 }}>
                              <View
                                style={{
                                  backgroundColor: getServiceColor(customer.service),
                                  paddingHorizontal: 8,
                                  paddingVertical: 4,
                                  borderRadius: 6,
                                  alignSelf: "flex-start",
                                  maxWidth: 95,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 10,
                                    color: "white",
                                    fontWeight: "600",
                                  }}
                                  numberOfLines={1}
                                >
                                  {customer.service}
                                </Text>
                              </View>
                            </View>
                            <Text style={[styles.cellText(isDark), { width: 70, fontWeight: "600" }]}>
                              ₹{customer.amount}
                            </Text>
                            <Text style={[styles.cellText(isDark), { width: 110 }]}>
                              {maskData(customer.phone, "phone")}
                            </Text>
                            <Text
                              style={[styles.cellText(isDark), { width: 180 }]}
                              numberOfLines={1}
                            >
                              {maskData(customer.email, "email")}
                            </Text>
                            <Text style={[styles.cellText(isDark), { width: 90 }]}>
                              {customer.time}
                            </Text>
                          </View>
                        ))
                      ) : (
                        <View
                          style={{
                            padding: 20,
                            alignItems: "center",
                            minWidth: screenWidth * 2,
                          }}
                        >
                          <Text
                            style={{
                              color: isDark ? "#9CA3AF" : "#6B7280",
                              fontSize: 14,
                            }}
                          >
                            No customer data available
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                </ScrollView>
              </View>

              {/* Download Buttons */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity
                  onPress={handlePdfDownload}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    backgroundColor: "#3B82F6",
                    paddingVertical: 14,
                    borderRadius: 10,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    shadowColor: "#3B82F6",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <FileText
                    size={18}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: 15,
                    }}
                  >
                    PDF
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleExcelDownload}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    backgroundColor: "#F59E0B",
                    paddingVertical: 14,
                    borderRadius: 10,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    shadowColor: "#F59E0B",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <FileSpreadsheet
                    size={18}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: 15,
                    }}
                  >
                    Excel
                  </Text>
                  <View
                    style={{
                      backgroundColor: "rgba(255,255,255,0.25)",
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 4,
                      marginLeft: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 9,
                        fontWeight: "700",
                      }}
                    >
                      PRO
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Premium Modal */}
      <PremiumModal />

      {/* Download Progress Modal */}
      <DownloadModal />
    </>
  );
};

const styles = {
  headerText: (isDark: boolean) => ({
    fontSize: 12,
    fontWeight: "600" as "600",
    color: isDark ? "#93C5FD" : "#3B82F6",
  }),
  cellText: (isDark: boolean) => ({
    fontSize: 12,
    color: isDark ? "#F8FAFC" : "#1E3A8A",
  }),
};

export default CustomerHistoryModal;
