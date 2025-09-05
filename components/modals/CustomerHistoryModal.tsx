import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import {
  BarChart3,
  X,
  Calendar,
  ChevronDown,
  FileText,
  FileSpreadsheet,
} from "lucide-react-native";

const CustomerHistoryModal = ({
  showDownloadHistoryModal,
  setShowDownloadHistoryModal,
  isDark,
  customerHistoryData,
  selectedTimeRange,
  maskSensitiveData,
  setMaskSensitiveData,
}: any) => {
  const [showChart, setShowChart] = useState(true);
  const screenWidth = Dimensions.get("window").width;

  // Process data for line chart
  const chartData = useMemo(() => {
    // Group customers by date and count them
    const dateGroups = customerHistoryData.reduce((acc, customer) => {
      const date = customer.date;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Get last 7 days of data or available dates
    const dates = Object.keys(dateGroups).sort();
    const labels = dates.map((date) => {
      const d = new Date(date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    const data = dates.map((date) => dateGroups[date]);

    return { labels, data };
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
      r: "5",
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
    fillShadowGradientOpacity: 0.1,
  };

  const getServiceColor = (service) => {
    const colors = {
      "Hair Coloring": "#EF4444",
      Styling: "#10B981",
      Waxing: "#F59E0B",
      Massage: "#8B5CF6",
      Makeup: "#EC4899",
      Haircut: "#3B82F6",
    };
    return colors[service] || "#6B7280";
  };

  const maskData = (data, type) => {
    if (!maskSensitiveData) return data;

    if (type === "phone") {
      return data.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2");
    } else if (type === "email") {
      const [username, domain] = data.split("@");
      const maskedUsername = username.charAt(0) + "***" + username.slice(-1);
      return maskedUsername + "@" + domain;
    }
    return data;
  };

  // Simplified table data for mobile view
  const mobileTableData = customerHistoryData.map((customer) => ({
    ...customer,
    displayName: customer.name.split(" ")[0], // Show only first name
  }));

  return (
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
          justifyContent: "center",
          alignItems: "center",
          padding: 5,
        }}
      >
        <View
          style={{
            backgroundColor: isDark ? "#374151" : "white",
            borderRadius: 16,
            padding: 10,
            width: "95%",
            maxWidth: 1000,
            maxHeight: "90%",
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
                Download Customer History
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
                Select Time Range
              </Text>
              <TouchableOpacity
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
                <ChevronDown size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

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
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: maskSensitiveData
                    ? "#10B981"
                    : isDark
                    ? "#4B5563"
                    : "#D1D5DB",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: "white",
                    marginLeft: maskSensitiveData ? 22 : 2,
                  }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 14,
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                }}
              >
                Mask sensitive data (phone/email)
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
                  Customer Flow Trend
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
                    {showChart ? "Hide Chart" : "Show Chart"}
                  </Text>
                </TouchableOpacity>
              </View>

              {showChart && (
                <View
                  style={{
                    backgroundColor: isDark ? "#1F2937" : "#F8FAFC",
                    borderRadius: 8,
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
                          strokeWidth: 2,
                        },
                      ],
                    }}
                    width={screenWidth - 60} // Adjust for modal padding
                    height={200}
                    chartConfig={lineChartConfig}
                    bezier
                    style={{
                      borderRadius: 8,
                    }}
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
                      Total: {customerHistoryData.length} customers
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
                        Daily customer count
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Customer Details Table - Mobile Optimized */}
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                  marginBottom: 12,
                }}
              >
                Customer Details
              </Text>

              {/* Mobile Card View */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                style={{ marginBottom: 10 }}
              >
                <View style={{ minWidth: screenWidth - 40 }}>
                  {/* Table Header */}
                  <View
                    style={{
                      backgroundColor: isDark ? "#1E40AF" : "#EFF6FF",
                      borderRadius: 8,
                      padding: 12,
                      flexDirection: "row",
                      marginBottom: 8,
                      minWidth: 800, // Ensure minimum width for all columns
                    }}
                  >
                    <View style={{ width: 100 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: isDark ? "#93C5FD" : "#3B82F6",
                        }}
                      >
                        Name
                      </Text>
                    </View>
                    <View style={{ width: 80 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: isDark ? "#93C5FD" : "#3B82F6",
                        }}
                      >
                        Service
                      </Text>
                    </View>
                    <View style={{ width: 60 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: isDark ? "#93C5FD" : "#3B82F6",
                        }}
                      >
                        Amount
                      </Text>
                    </View>
                    <View style={{ width: 110 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: isDark ? "#93C5FD" : "#3B82F6",
                        }}
                      >
                        Phone
                      </Text>
                    </View>
                    <View style={{ width: 180 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: isDark ? "#93C5FD" : "#3B82F6",
                        }}
                      >
                        Email
                      </Text>
                    </View>
                    <View style={{ width: 70 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: isDark ? "#93C5FD" : "#3B82F6",
                        }}
                      >
                        Time
                      </Text>
                    </View>
                    <View style={{ width: 80 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: isDark ? "#93C5FD" : "#3B82F6",
                        }}
                      >
                        Date
                      </Text>
                    </View>
                  </View>

                  {/* Table Rows */}
                  <ScrollView style={{ maxHeight: 300 }}>
                    {customerHistoryData.map((customer, index) => (
                      <View
                        key={customer.id}
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
                          minWidth: 800,
                        }}
                      >
                        <View style={{ width: 100 }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: isDark ? "#F8FAFC" : "#1E3A8A",
                            }}
                          >
                            {customer.name}
                          </Text>
                        </View>
                        <View style={{ width: 80 }}>
                          <View
                            style={{
                              backgroundColor: getServiceColor(
                                customer.service
                              ),
                              paddingHorizontal: 6,
                              paddingVertical: 2,
                              borderRadius: 4,
                              alignSelf: "flex-start",
                              maxWidth: 70,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 9,
                                color: "white",
                                fontWeight: "600",
                              }}
                              numberOfLines={1}
                            >
                              {customer.service}
                            </Text>
                          </View>
                        </View>
                        <View style={{ width: 60 }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: isDark ? "#F8FAFC" : "#1E3A8A",
                            }}
                          >
                            ₹{customer.amount}
                          </Text>
                        </View>
                        <View style={{ width: 110 }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: isDark ? "#F8FAFC" : "#1E3A8A",
                            }}
                          >
                            {maskData(customer.phone, "phone")}
                          </Text>
                        </View>
                        <View style={{ width: 180 }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: isDark ? "#F8FAFC" : "#1E3A8A",
                            }}
                            numberOfLines={1}
                          >
                            {maskData(customer.email, "email")}
                          </Text>
                        </View>
                        <View style={{ width: 70 }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: isDark ? "#F8FAFC" : "#1E3A8A",
                            }}
                          >
                            {customer.time}
                          </Text>
                        </View>
                        <View style={{ width: 80 }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color: isDark ? "#F8FAFC" : "#1E3A8A",
                            }}
                          >
                            {new Date(customer.date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                              }
                            )}
                          </Text>
                        </View>
                      </View>
                    ))}
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
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Alert.alert("Download PDF", "PDF download started");
                }}
                style={{
                  flex: 1,
                  backgroundColor: "#3B82F6",
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <FileText size={16} color="white" style={{ marginRight: 8 }} />
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Download as PDF
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Download Excel",
                    "Excel download started (Premium feature)"
                  );
                }}
                style={{
                  flex: 1,
                  position: "relative",
                  backgroundColor: "#F59E0B",
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                    marginLeft: 6,
                    position: "absolute",
                    right: 4,
                    top: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 10,
                      fontWeight: "600",
                    }}
                  >
                    Premium
                  </Text>
                </View>
                <FileSpreadsheet
                  size={16}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Download as Excel
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CustomerHistoryModal;
