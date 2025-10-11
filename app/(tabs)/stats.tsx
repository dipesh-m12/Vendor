import useThemeStore from "@/store/themeStore";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Filter,
  Info,
  TrendingDown,
  TrendingUp,
  User,
  Users,
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

  const containerBg = isDark ? "#1F2937" : "#F3F4F6";
  const cardBg = isDark ? "#374151" : "#FFFFFF";
  const textPrimary = isDark ? "#F9FAFB" : "#1F2937";
  const textSecondary = isDark ? "#9CA3AF" : "#6B7280";
  const borderColor = isDark ? "#4B5563" : "#E5E7EB";

  return (
    <View style={{ flex: 1, backgroundColor: containerBg }}>
      {/* Header */}
      <View
        style={{
          paddingTop: 60,
          paddingBottom: 16,
          paddingHorizontal: 16,
          backgroundColor: isDark ? "#374151" : "white",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 16, padding: 4 }}
          >
            <ArrowLeft size={24} color="#1E40AF" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1E40AF",
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
            backgroundColor: cardBg,
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
              <Filter size={18} color="#1E40AF" />
              <Text
                style={{
                  color: "#1E40AF",
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
                backgroundColor: "#EFF6FF",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#1E40AF", marginRight: 4, fontSize: 13 }}
              >
                {selectedTimeRange}
              </Text>
              <ChevronDown size={16} color="#1E40AF" />
            </TouchableOpacity>
          </View>
          <Text style={{ color: textSecondary, fontSize: 12, marginTop: 8 }}>
            Showing statistics for the last 7 days
          </Text>
        </View>

        {/* Stats Grid - 2x2 */}
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
              backgroundColor: cardBg,
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
              <Users size={18} color="#3B82F6" style={{ marginRight: 6 }} />
              <Text
                style={{
                  fontSize: 13,
                  color: "#3B82F6",
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
                color: "#1E40AF",
                marginBottom: 4,
              }}
            >
              246
            </Text>
            <Text style={{ fontSize: 11, color: textSecondary }}>
              Last 7 Days
            </Text>
          </View>

          {/* Avg Wait Time */}
          <View
            style={{
              flex: 1,
              minWidth: (screenWidth - 44) / 2,
              backgroundColor: cardBg,
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
              <Clock size={18} color="#3B82F6" style={{ marginRight: 6 }} />
              <Text
                style={{
                  fontSize: 13,
                  color: "#3B82F6",
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
                color: "#1E40AF",
                marginBottom: 4,
              }}
            >
              15 min
            </Text>
            <Text style={{ fontSize: 11, color: textSecondary }}>
              Last 7 Days
            </Text>
          </View>

          {/* Customers Skipped */}
          <View
            style={{
              flex: 1,
              minWidth: (screenWidth - 44) / 2,
              backgroundColor: cardBg,
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
              <AlertCircle size={18} color="#F59E0B" style={{ marginRight: 6 }} />
              <Text
                style={{
                  fontSize: 13,
                  color: "#F59E0B",
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
                color: "#F59E0B",
                marginBottom: 4,
              }}
            >
              44
            </Text>
            <Text style={{ fontSize: 11, color: textSecondary }}>
              Last 7 Days
            </Text>
          </View>

          {/* Customers Left */}
          <View
            style={{
              flex: 1,
              minWidth: (screenWidth - 44) / 2,
              backgroundColor: cardBg,
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
              <ArrowLeft size={18} color="#EF4444" style={{ marginRight: 6 }} />
              <Text
                style={{
                  fontSize: 13,
                  color: "#EF4444",
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
                color: "#EF4444",
                marginBottom: 4,
              }}
            >
              30
            </Text>
            <Text style={{ fontSize: 11, color: textSecondary }}>
              Last 7 Days
            </Text>
          </View>
        </View>

        {/* Customer Distribution */}
        <View
          style={{
            backgroundColor: cardBg,
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
              <TrendingUp size={18} color="#1E40AF" />
              <Text
                style={{
                  color: "#1E40AF",
                  fontWeight: "600",
                  marginLeft: 8,
                  fontSize: 14,
                }}
              >
                Customer Distribution
              </Text>
            </View>
            <Text style={{ color: "#1E40AF", fontSize: 13, fontWeight: "500", backgroundColor: "#F3F4F6", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
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
                    color: textPrimary,
                  }}
                >
                  373
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: textSecondary,
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
                  color: textPrimary,
                  marginBottom: 2,
                }}
              >
                Served
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: textPrimary,
                  marginBottom: 2,
                }}
              >
                285
              </Text>
              <Text style={{ fontSize: 11, color: textSecondary }}>
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
                  color: textPrimary,
                  marginBottom: 2,
                }}
              >
                Customers Skipped
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: textPrimary,
                  marginBottom: 2,
                }}
              >
                53
              </Text>
              <Text style={{ fontSize: 11, color: textSecondary }}>
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
                  color: textPrimary,
                  marginBottom: 2,
                }}
              >
                Customers  Left
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: textPrimary,
                  marginBottom: 2,
                }}
              >
                35
              </Text>
              <Text style={{ fontSize: 11, color: textSecondary }}>
                (9%)
              </Text>
            </View>
          </View>
        </View>

        {/* Customer Insights */}
        <View
          style={{
            backgroundColor: cardBg,
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
            <BarChart3 size={18} color="#1E40AF" />
            <Text
              style={{
                color: "#1E40AF",
                fontWeight: "600",
                marginLeft: 8,
                flex: 1,
                fontSize: 14,
              }}
            >
              Customer Insights
            </Text>
            <Info size={18} color="#3B82F6" />
          </View>

          {/* Metrics Row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: borderColor,
            }}
          >
            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: textSecondary,
                  marginBottom: 4,
                }}
              >
                Visited
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: textPrimary,
                  marginBottom: 4,
                }}
              >
                358
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TrendingDown size={12} color="#EF4444" />
                <Text style={{ color: "#EF4444", fontSize: 11, marginLeft: 2 }}>
                  21%
                </Text>
              </View>
            </View>

            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: textSecondary,
                  marginBottom: 4,
                }}
              >
                Served
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: textPrimary,
                  marginBottom: 4,
                }}
              >
                285
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TrendingDown size={12} color="#EF4444" />
                <Text style={{ color: "#EF4444", fontSize: 11, marginLeft: 2 }}>
                  22%
                </Text>
              </View>
            </View>

            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: textSecondary,
                  marginBottom: 4,
                }}
              >
                Conversion
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: textPrimary,
                  marginBottom: 4,
                }}
              >
                80%
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TrendingUp size={12} color="#10B981" />
                <Text style={{ color: "#10B981", fontSize: 11, marginLeft: 2 }}>
                  1%
                </Text>
              </View>
            </View>

            <View style={{ alignItems: "center", flex: 1 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: textSecondary,
                  marginBottom: 4,
                }}
              >
                Retention
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: textPrimary,
                  marginBottom: 4,
                }}
              >
                41%
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TrendingUp size={12} color="#10B981" />
                <Text style={{ color: "#10B981", fontSize: 11, marginLeft: 2 }}>
                  8%
                </Text>
              </View>
            </View>
          </View>

          {/* What is Conversion Rate */}
          <View
            style={{
              backgroundColor: "#EFF6FF",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: "#1E40AF",
                fontWeight: "600",
                marginBottom: 4,
                fontSize: 13,
              }}
            >
              What is Conversion Rate?
            </Text>
            <Text
              style={{
                color: "#3B82F6",
                fontSize: 12,
                lineHeight: 16,
              }}
            >
              Conversion rate shows what percentage of customers who visited
              were actually served. It&apos;s calculated as (Customers Served ÷
              Customers Visited) × 100%. A higher conversion rate means you're
              efficiently serving most of the customers who visit.
            </Text>
          </View>

          {/* Key Insights */}
          <View>
            <Text
              style={{
                color: textPrimary,
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
                  backgroundColor: "#FEE2E2",
                  borderRadius: 4,
                  padding: 4,
                  marginRight: 10,
                  marginTop: 2,
                }}
              >
                <TrendingDown size={14} color="#EF4444" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: textPrimary,
                    fontWeight: "600",
                    fontSize: 13,
                    marginBottom: 2,
                  }}
                >
                  Traffic trend:
                </Text>
                <Text
                  style={{
                    color: textSecondary,
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
                  backgroundColor: "#DBEAFE",
                  borderRadius: 4,
                  padding: 4,
                  marginRight: 10,
                  marginTop: 2,
                }}
              >
                <User size={14} color="#1E40AF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: textPrimary,
                    fontWeight: "600",
                    fontSize: 13,
                    marginBottom: 2,
                  }}
                >
                  Customer retention:
                </Text>
                <Text
                  style={{
                    color: textSecondary,
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
                  backgroundColor: "#F3E8FF",
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
                    color: textPrimary,
                    fontWeight: "600",
                    fontSize: 13,
                    marginBottom: 2,
                  }}
                >
                  Best performing day:
                </Text>
                <Text
                  style={{
                    color: textSecondary,
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
                  backgroundColor: "#FEF3C7",
                  borderRadius: 4,
                  padding: 4,
                  marginRight: 10,
                  marginTop: 2,
                }}
              >
                <AlertCircle size={14} color="#F59E0B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: textPrimary,
                    fontWeight: "600",
                    fontSize: 13,
                    marginBottom: 2,
                  }}
                >
                  Attention needed:
                </Text>
                <Text
                  style={{
                    color: textSecondary,
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
              color: textSecondary,
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
            backgroundColor: cardBg,
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
            <Calendar size={18} color="#1E40AF" />
            <Text
              style={{
                color: "#1E40AF",
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
                borderBottomColor: borderColor,
              }}
            >
              <Text style={{ color: textPrimary, fontWeight: "500", fontSize: 13 }}>
                {hour.time}
              </Text>
              <Text style={{ color: "#3B82F6", fontSize: 13 }}>
                {hour.traffic}
              </Text>
            </View>
          ))}
        </View>

        {/* Service Completion */}
        <View
          style={{
            backgroundColor: cardBg,
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
            <CheckCircle size={18} color="#10B981" />
            <Text
              style={{
                color: "#1E40AF",
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
              backgroundColor: "#E5E7EB",
              borderRadius: 8,
              height: 8,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                backgroundColor: "#3B82F6",
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
            <Text style={{ color: textSecondary, fontSize: 12 }}>0%</Text>
            <Text
              style={{
                color: "#3B82F6",
                fontWeight: "600",
                fontSize: 14,
              }}
            >
              85% Completed
            </Text>
            <Text style={{ color: textSecondary, fontSize: 12 }}>100%</Text>
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
              backgroundColor: cardBg,
              borderRadius: 12,
              padding: 20,
              width: "80%",
              maxWidth: 300,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: textPrimary,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Select Time Range
            </Text>
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
                      ? "#EFF6FF"
                      : "transparent",
                  borderRadius: 8,
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    color: selectedTimeRange === option ? "#1E40AF" : textPrimary,
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
