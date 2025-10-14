import useThemeStore from "@/store/themeStore";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Filter,
  Info,
  TrendingDown,
  User,
  Users,
  X
} from "lucide-react-native";

import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";

import { translations } from "@/translations/tabsTranslations/statsTransaltions";

const screenWidth = Dimensions.get("window").width;

// Custom Donut Chart Component
const DonutChart = ({ data, size = 200, strokeWidth = 40 }: any) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulativePercent = 0;

  return (
    <Svg
      width={size}
      height={size}
      style={{ transform: [{ rotate: "-90deg" }] }}
    >
      {data.map((item: any, index: number) => {
        const percentage = item.percentage;
        const rotation = (cumulativePercent / 100) * 360;

        cumulativePercent += percentage;

        return (
          <G key={index} rotation={rotation} origin={`${center}, ${center}`}>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={item.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${(circumference * percentage) / 100} ${circumference}`}
              strokeLinecap="butt"
            />
          </G>
        );
      })}
    </Svg>
  );
};

export default function StatisticsPage() {
  const router = useRouter();
  const { isDark, language } = useThemeStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 7 Days");
  const [showTimeRangeModal, setShowTimeRangeModal] = useState(false);

  const languageSet = translations[language];

  const timeRangeOptions = [
    "Last 7 Days",
    "Last 15 Days",
    "Last 30 Days",
    "Last 60 Days",
    "Last 90 Days",
  ];

  // Donut chart data
  const donutData = [
    {
      name: "Served",
      value: 285,
      percentage: 76,
      color: "#4285F4",
    },
    {
      name: "Customers Skipped",
      value: 53,
      percentage: 14,
      color: "#FB923C",
    },
    {
      name: "Customers Left",
      value: 35,
      percentage: 9,
      color: "#EF4444",
    },
  ];

  const peakHours = [
    { time: "10:00 AM - 11:00 AM", traffic: "High Traffic" },
    { time: "2:00 PM - 3:00 PM", traffic: "High Traffic" },
    { time: "12:00 PM - 1:00 PM", traffic: "High Traffic" },
  ];

  // Dark mode color palette
  const colors = {
    // Page backgrounds
    containerBg: isDark ? "#111827" : "#F3F4F6", // dark:from-gray-900
    cardBg: isDark ? "rgba(31, 41, 55, 0.95)" : "#FFFFFF", // dark:bg-gray-800/95
    headerBg: isDark ? "#1F2937" : "white", // dark:bg-gray-800

    // Text colors
    textPrimary: isDark ? "#DBEAFE" : "#1F2937", // dark:text-blue-100
    textSecondary: isDark ? "#BFDBFE" : "#6B7280", // dark:text-blue-200
    textAccent: isDark ? "#93C5FD" : "#3B82F6", // dark:text-blue-300
    textAccentLight: isDark ? "#60A5FA" : "#1E40AF", // dark:text-blue-400

    // Heading colors
    headingPrimary: isDark ? "#DBEAFE" : "#1E40AF",
    headingAccent: isDark ? "#93C5FD" : "#3B82F6",

    // Button colors
    buttonBg: isDark ? "#1E3A8A" : "#EFF6FF", // dark:bg-blue-900
    buttonText: isDark ? "#93C5FD" : "#1E40AF",

    // Border colors
    borderColor: isDark ? "#374151" : "#E5E7EB", // dark:border-gray-700
    borderBlue: isDark ? "#1E3A8A" : "#3B82F6", // dark:border-blue-900

    // Status colors
    amberText: isDark ? "#FCD34D" : "#F59E0B", // dark:text-amber-300
    amberLight: isDark ? "#FBBF24" : "#F59E0B", // dark:text-amber-400
    redText: isDark ? "#FCA5A5" : "#EF4444", // dark:text-red-300
    redLight: isDark ? "#F87171" : "#EF4444", // dark:text-red-400

    // Info tooltip
    tooltipBg: isDark ? "#1E3A8A" : "#EFF6FF", // dark:bg-blue-900
    tooltipText: isDark ? "#93C5FD" : "#3B82F6",

    // Additional UI colors
    greenText: "#10B981",
    progressBar: isDark ? "#60A5FA" : "#3B82F6",
    progressBg: isDark ? "#374151" : "#E5E7EB",
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.containerBg }}>
      {/* Header */}
      <View
        style={{
          paddingTop: 60,
          paddingBottom: 16,
          paddingHorizontal: 16,
          backgroundColor: colors.headerBg,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderColor,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 16, padding: 4 }}
          >
            <ArrowLeft size={24} color={colors.headingPrimary} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: colors.headingPrimary,
            }}
          >
            Statistics
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Time Range Filter */}
        <View
          style={{
            backgroundColor: colors.cardBg,
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 12,
            borderRadius: 12,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Filter size={18} color={colors.textAccentLight} />
              <Text
                style={{
                  color: colors.headingPrimary,
                  fontWeight: "600",
                  marginLeft: 8,
                  fontSize: 14,
                }}
              >
                Time Range
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowTimeRangeModal(true)}
              style={{
                backgroundColor: colors.buttonBg,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: colors.buttonText, marginRight: 4, fontSize: 13 }}
              >
                {selectedTimeRange}
              </Text>
              <ChevronDown size={16} color={colors.buttonText} />
            </TouchableOpacity>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 8 }}>
            Showing statistics for the last 7 days
          </Text>
        </View>

        {/* Stats Grid - 2x2 */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 16,
            gap: 12,
            marginBottom: 12,
          }}
        >
          {/* Customers Served */}
          <View
            style={{
              flex: 1,
              minWidth: (screenWidth - 44) / 2,
              backgroundColor: colors.cardBg,
              borderRadius: 12,
              padding: 14,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Users size={18} color={colors.textAccentLight} style={{ marginRight: 6 }} />
              <Text
                style={{
                  fontSize: 13,
                  color: colors.headingAccent,
                  fontWeight: "500",
                  flex: 1,
                  lineHeight: 18,
                }}
                numberOfLines={2}
              >
                Customers{"\n"}Served
              </Text>
            </View>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: colors.headingPrimary,
                marginBottom: 4,
              }}
            >
              246
            </Text>
            <Text style={{ fontSize: 11, color: colors.textSecondary }}>
              Last 7 Days
            </Text>
          </View>

          {/* Avg Wait Time */}
          <View
            style={{
              flex: 1,
              minWidth: (screenWidth - 44) / 2,
              backgroundColor: colors.cardBg,
              borderRadius: 12,
              padding: 14,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Clock size={18} color={colors.textAccentLight} style={{ marginRight: 6 }} />
              <Text
                style={{
                  fontSize: 13,
                  color: colors.headingAccent,
                  fontWeight: "500",
                  flex: 1,
                  lineHeight: 18,
                }}
                numberOfLines={2}
              >
                Avg. Wait{"\n"}Time
              </Text>
            </View>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: colors.headingPrimary,
                marginBottom: 4,
              }}
            >
              15 min
            </Text>
            <Text style={{ fontSize: 11, color: colors.textSecondary }}>
              Last 7 Days
            </Text>
          </View>

          {/* Customers Skipped */}
          <View
            style={{
              flex: 1,
              minWidth: (screenWidth - 44) / 2,
              backgroundColor: colors.cardBg,
              borderRadius: 12,
              padding: 14,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <AlertCircle size={18} color={colors.amberLight} style={{ marginRight: 6 }} />
              <Text
                style={{
                  fontSize: 13,
                  color: colors.amberText,
                  fontWeight: "500",
                  flex: 1,
                  lineHeight: 18,
                }}
                numberOfLines={2}
              >
                Customers{"\n"}Skipped
              </Text>
            </View>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: colors.amberText,
                marginBottom: 4,
              }}
            >
              44
            </Text>
            <Text style={{ fontSize: 11, color: colors.textSecondary }}>
              Last 7 Days
            </Text>
          </View>

          {/* Customers Left */}
          <View
            style={{
              flex: 1,
              minWidth: (screenWidth - 44) / 2,
              backgroundColor: colors.cardBg,
              borderRadius: 12,
              padding: 14,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <ArrowLeft size={18} color={colors.redLight} style={{ marginRight: 6 }} />
              <Text
                style={{
                  fontSize: 13,
                  color: colors.redText,
                  fontWeight: "500",
                  flex: 1,
                  lineHeight: 18,
                }}
                numberOfLines={2}
              >
                Customers{"\n"}Left
              </Text>
            </View>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: colors.redText,
                marginBottom: 4,
              }}
            >
              30
            </Text>
            <Text style={{ fontSize: 11, color: colors.textSecondary }}>
              Last 7 Days
            </Text>
          </View>
        </View>

        {/* Customer Distribution */}
        <View
          style={{
            backgroundColor: colors.cardBg,
            marginHorizontal: 16,
            marginBottom: 12,
            borderRadius: 12,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ArrowDown size={18} color={colors.textAccentLight} />
              <Text
                style={{
                  color: colors.headingPrimary,
                  fontWeight: "600",
                  marginLeft: 8,
                  fontSize: 14,
                }}
              >
                Customer Distribution
              </Text>
            </View>
            <Text style={{
              color: colors.buttonText,
              fontSize: 13,
              fontWeight: "500",
              backgroundColor: colors.buttonBg,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12
            }}>
              373 total
            </Text>
          </View>

          {/* Donut Chart */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <View style={{ position: "relative", width: 200, height: 200 }}>
              <DonutChart data={donutData} size={200} strokeWidth={40} />

              {/* Center Text */}
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 48,
                    fontWeight: "bold",
                    color: colors.textPrimary,
                  }}
                >
                  373
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                  }}
                >
                  total
                </Text>
              </View>
            </View>
          </View>

          {/* Legend */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: "#4285F4",
                  borderRadius: 5,
                  marginBottom: 6,
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: colors.textPrimary,
                  marginBottom: 2,
                }}
              >
                Served
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: colors.textPrimary,
                  marginBottom: 2,
                }}
              >
                285
              </Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                (76%)
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: "#FB923C",
                  borderRadius: 5,
                  marginBottom: 6,
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: colors.textPrimary,
                  marginBottom: 2,
                }}
              >
                Customers Skipped
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: colors.textPrimary,
                  marginBottom: 2,
                }}
              >
                53
              </Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                (14%)
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: "#EF4444",
                  borderRadius: 5,
                  marginBottom: 6,
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: colors.textPrimary,
                  marginBottom: 2,
                }}
              >
                Customers Left
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: colors.textPrimary,
                  marginBottom: 2,
                }}
              >
                35
              </Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                (9%)
              </Text>
            </View>
          </View>
        </View>

        {/* Customer Insights */}
        <View
          style={{
            backgroundColor: colors.cardBg,
            marginHorizontal: 16,
            marginBottom: 12,
            borderRadius: 12,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <BarChart3 size={18} color={colors.textAccentLight} />
            <Text
              style={{
                color: colors.headingPrimary,
                fontWeight: "600",
                marginLeft: 8,
                flex: 1,
                fontSize: 14,
              }}
            >
              Customer Insights
            </Text>
            <Info size={18} color={colors.headingAccent} />
          </View>

          {/* Metrics Row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.borderColor,
            }}
          >
            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: colors.textSecondary,
                  marginBottom: 4,
                }}
              >
                Visited
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: colors.textPrimary,
                  marginBottom: 4,
                }}
              >
                358
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ArrowDown size={12} color={colors.redText} />
                <Text style={{ color: colors.redText, fontSize: 11, marginLeft: 2 }}>
                  21%
                </Text>
              </View>
            </View>

            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: colors.textSecondary,
                  marginBottom: 4,
                }}
              >
                Served
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: colors.textPrimary,
                  marginBottom: 4,
                }}
              >
                285
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ArrowDown size={12} color={colors.redText} />
                <Text style={{ color: colors.redText, fontSize: 11, marginLeft: 2 }}>
                  22%
                </Text>
              </View>
            </View>

            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: colors.textSecondary,
                  marginBottom: 4,
                }}
              >
                Conversion
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: colors.textPrimary,
                  marginBottom: 4,
                }}
              >
                80%
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ArrowUp size={12} color={colors.greenText} />
                <Text style={{ color: colors.greenText, fontSize: 11, marginLeft: 2 }}>
                  1%
                </Text>
              </View>
            </View>

            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: colors.textSecondary,
                  marginBottom: 4,
                }}
              >
                Retention
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: colors.textPrimary,
                  marginBottom: 4,
                }}
              >
                41%
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ArrowUp size={12} color={colors.greenText} />
                <Text style={{ color: colors.greenText, fontSize: 11, marginLeft: 2 }}>
                  8%
                </Text>
              </View>
            </View>
          </View>

          {/* What is Conversion Rate */}
          <View
            style={{
              backgroundColor: colors.tooltipBg,
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: colors.headingPrimary,
                fontWeight: "600",
                marginBottom: 4,
                fontSize: 13,
              }}
            >
              What is Conversion Rate?
            </Text>
            <Text
              style={{
                color: colors.tooltipText,
                fontSize: 12,
                lineHeight: 16,
              }}
            >
              Conversion rate shows what percentage of customers who visited
              were actually served. It&apos;s calculated as (Customers Served ÷
              Customers Visited) × 100%. A higher conversion rate means you&apos;re
              efficiently serving most of the customers who visit.
            </Text>
          </View>

          {/* Key Insights */}
          <View>
            <Text
              style={{
                color: colors.textPrimary,
                fontWeight: "600",
                marginBottom: 12,
                fontSize: 13,
              }}
            >
              Key insights
            </Text>

            {/* Traffic trend */}
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
                alignItems: "flex-start",
              }}
            >
              <View
                style={{
                  backgroundColor: isDark ? "rgba(252, 165, 165, 0.2)" : "#FEE2E2",
                  borderRadius: 4,
                  padding: 4,
                  marginRight: 10,
                  marginTop: 2,
                }}
              >
                <TrendingDown size={14} color={colors.redText} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontWeight: "600",
                    fontSize: 13,
                    marginBottom: 2,
                  }}
                >
                  Traffic trend:
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    lineHeight: 16,
                  }}
                >
                  Customer visits are down by 21% compared to the previous
                  period. Review your marketing strategy to attract more
                  customers.
                </Text>
              </View>
            </View>

            {/* Customer retention */}
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
                alignItems: "flex-start",
              }}
            >
              <View
                style={{
                  backgroundColor: isDark ? "rgba(219, 234, 254, 0.2)" : "#DBEAFE",
                  borderRadius: 4,
                  padding: 4,
                  marginRight: 10,
                  marginTop: 2,
                }}
              >
                <User size={14} color={colors.headingPrimary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontWeight: "600",
                    fontSize: 13,
                    marginBottom: 2,
                  }}
                >
                  Customer retention:
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    lineHeight: 16,
                  }}
                >
                  41% of your customers are returning visitors. Your loyalty
                  efforts are working well.
                </Text>
              </View>
            </View>

            {/* Best performing day */}
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
                alignItems: "flex-start",
              }}
            >
              <View
                style={{
                  backgroundColor: isDark ? "rgba(243, 232, 255, 0.2)" : "#F3E8FF",
                  borderRadius: 4,
                  padding: 4,
                  marginRight: 10,
                  marginTop: 2,
                }}
              >
                <Calendar size={14} color="#8B5CF6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontWeight: "600",
                    fontSize: 13,
                    marginBottom: 2,
                  }}
                >
                  Best performing day:
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    lineHeight: 16,
                  }}
                >
                  Wed has your highest conversion rate. Consider studying what
                  makes Wed successful and apply those practices to other days.
                </Text>
              </View>
            </View>

            {/* Attention needed */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <View
                style={{
                  backgroundColor: isDark ? "rgba(254, 243, 199, 0.2)" : "#FEF3C7",
                  borderRadius: 4,
                  padding: 4,
                  marginRight: 10,
                  marginTop: 2,
                }}
              >
                <AlertCircle size={14} color={colors.amberText} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontWeight: "600",
                    fontSize: 13,
                    marginBottom: 2,
                  }}
                >
                  Attention needed:
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    lineHeight: 16,
                  }}
                >
                  Customer skips have decreased by 38%. Customers leaving
                  without service has decreased by 29%.
                </Text>
              </View>
            </View>
          </View>

          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 11,
              textAlign: "center",
              marginTop: 16,
            }}
          >
            This week
          </Text>
        </View>

        {/* Peak Hours */}
        <View
          style={{
            backgroundColor: colors.cardBg,
            marginHorizontal: 16,
            marginBottom: 12,
            borderRadius: 12,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Calendar size={18} color={colors.textAccentLight} />
            <Text
              style={{
                color: colors.headingPrimary,
                fontWeight: "600",
                marginLeft: 8,
                fontSize: 14,
              }}
            >
              Peak Hours
            </Text>
          </View>

          {peakHours.map((hour, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 12,
                borderBottomWidth: index < peakHours.length - 1 ? 1 : 0,
                borderBottomColor: colors.borderColor,
              }}
            >
              <Text style={{ color: colors.textPrimary, fontWeight: "500", fontSize: 13 }}>
                {hour.time}
              </Text>
              <Text style={{ color: colors.headingAccent, fontSize: 13 }}>
                {hour.traffic}
              </Text>
            </View>
          ))}
        </View>

        {/* Service Completion */}
        <View
          style={{
            backgroundColor: colors.cardBg,
            marginHorizontal: 16,
            marginBottom: 20,
            borderRadius: 12,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <CheckCircle size={18} color={colors.greenText} />
            <Text
              style={{
                color: colors.headingPrimary,
                fontWeight: "600",
                marginLeft: 8,
                fontSize: 14,
              }}
            >
              Service Completion
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.progressBg,
              borderRadius: 8,
              height: 8,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                backgroundColor: colors.progressBar,
                borderRadius: 8,
                height: 8,
                width: "85%",
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>0%</Text>
            <Text
              style={{
                color: colors.headingAccent,
                fontWeight: "600",
                fontSize: 14,
              }}
            >
              85% Completed
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>100%</Text>
          </View>
        </View>
      </ScrollView>

      {/* Time Range Modal */}
      <Modal
        visible={showTimeRangeModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowTimeRangeModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 12,
              padding: 20,
              width: "80%",
              maxWidth: 300,
            }}
          >
            {/* Header with Close Button */}
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
                  color: colors.textPrimary,
                  flex: 1,
                  textAlign: "center",
                }}
              >
                Select Time Range
              </Text>
              <TouchableOpacity
                onPress={() => setShowTimeRangeModal(false)}
                style={{
                  position: "absolute",
                  right: 0,
                  padding: 4,
                }}
              >
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {timeRangeOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setSelectedTimeRange(option);
                  setShowTimeRangeModal(false);
                }}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor:
                    selectedTimeRange === option
                      ? colors.buttonBg
                      : "transparent",
                  borderRadius: 8,
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    color: selectedTimeRange === option ? colors.buttonText : colors.textPrimary,
                    fontWeight: selectedTimeRange === option ? "600" : "400",
                    fontSize: 14,
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}
