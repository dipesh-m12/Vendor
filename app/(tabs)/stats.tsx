import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import useThemeStore from "@/store/themeStore";
import {
  ArrowLeft,
  Filter,
  ChevronDown,
  Users,
  Clock,
  UserX,
  TrendingDown,
  TrendingUp,
  Calendar,
  CheckCircle,
  User,
  Info,
  BarChart3,
  X,
} from "lucide-react-native";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { translations } from "@/translations/tabsTranslations/statsTransaltions";

const screenWidth = Dimensions.get("window").width;

export default function StatisticsPage() {
  const router = useRouter();
  const { isDark, language } = useThemeStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 7 Days");
  const [showTimeRangeModal, setShowTimeRangeModal] = useState(false);
  const [showCustomerInsightsModal, setShowCustomerInsightsModal] =
    useState(false);

  const languageSet = translations[language];

  const timeRangeOptions = [
    "Last 7 Days",
    "Last 15 Days",
    "Last 30 Days",
    "Last 60 Days",
    "Last 90 Days",
  ];

  // Sample data - replace with real data
  const statsData = {
    customersServed: 253,
    customersSkipped: 47,
    customersLeft: 30,
    avgWaitTime: "15 min",
    totalCustomers: 330,
    conversionRate: "68%",
    retentionRate: "39%",
    visited: 370,
    served: 253,
    serviceCompletion: 85,
  };

  const pieData = [
    {
      name: languageSet.served,
      population: 253,
      color: "#4285F4",
      legendFontColor: isDark ? "#F9FAFB" : "#374151",
      legendFontSize: 12,
    },
    {
      name: languageSet.skipped,
      population: 47,
      color: "#FB923C",
      legendFontColor: isDark ? "#F9FAFB" : "#374151",
      legendFontSize: 12,
    },
    {
      name: languageSet.left,
      population: 30,
      color: "#EF4444",
      legendFontColor: isDark ? "#F9FAFB" : "#374151",
      legendFontSize: 12,
    },
  ];

  const peakHours = [
    { time: "10:00 AM - 11:00 AM", traffic: "High Traffic" },
    { time: "2:00 PM - 3:00 PM", traffic: "High Traffic" },
    { time: "12:00 PM - 1:00 PM", traffic: "High Traffic" },
  ];
  // languageSet.highTraffic

  const containerBg = isDark ? "#1F2937" : "#F1F5F9";
  const cardBg = isDark ? "#374151" : "#FFFFFF";
  const textPrimary = isDark ? "#F9FAFB" : "#1E293B";
  const textSecondary = isDark ? "#9CA3AF" : "#64748B";
  const borderColor = isDark ? "#4B5563" : "#E2E8F0";

  const StatCard = ({
    icon,
    title,
    value,
    subtitle,
    color = "#4285F4",
    trend,
  }: any) => (
    <View
      style={{
        backgroundColor: cardBg,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: isDark ? "rgba(66, 133, 244, 0.2)" : "#EFF6FF",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          {icon}
        </View>
        <Text style={{ color: textPrimary, fontWeight: "600", flex: 1 }}>
          {title}
        </Text>
        {trend && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {trend > 0 ? (
              <TrendingUp size={16} color="#10B981" />
            ) : (
              <TrendingDown size={16} color="#EF4444" />
            )}
            <Text
              style={{
                color: trend > 0 ? "#10B981" : "#EF4444",
                fontSize: 12,
                marginLeft: 4,
              }}
            >
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: color,
          marginBottom: 4,
        }}
      >
        {value}
      </Text>
      <Text style={{ color: textSecondary, fontSize: 14 }}>{subtitle}</Text>
    </View>
  );

  const InsightCard = ({
    icon,
    title,
    description,
    color = "#4285F4",
  }: any) => (
    <View
      style={{
        backgroundColor: isDark ? "rgba(66, 133, 244, 0.1)" : "#EFF6FF",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "flex-start",
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: color,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
          marginTop: 2,
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: textPrimary,
            fontWeight: "600",
            marginBottom: 4,
          }}
        >
          {title}
        </Text>
        <Text style={{ color: textSecondary, fontSize: 14, lineHeight: 20 }}>
          {description}
        </Text>
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
          paddingTop: 60,
          paddingBottom: 16,
          paddingHorizontal: 16,
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "white",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 16, padding: 4 }}
          >
            <ArrowLeft size={24} color="#4285F4" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: textPrimary,
            }}
          >
            {languageSet.statistics}
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Time Range Filter */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Filter size={20} color="#4285F4" />
            <Text
              style={{
                color: textPrimary,
                fontWeight: "600",
                marginLeft: 8,
                flex: 1,
              }}
            >
              {languageSet.timeRange}
            </Text>
            <TouchableOpacity
              onPress={() => setShowTimeRangeModal(true)}
              style={{
                backgroundColor: isDark ? "rgba(66, 133, 244, 0.2)" : "#EFF6FF",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#4285F4", marginRight: 4 }}>
                {selectedTimeRange}
              </Text>
              <ChevronDown size={16} color="#4285F4" />
            </TouchableOpacity>
          </View>
          <Text style={{ color: textSecondary, fontSize: 14 }}>
            Showing statistics for the last 7 days
          </Text>
        </View>

        {/* Stats Grid */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "stretch",
          }}
        >
          <View style={{ width: "48%" }}>
            <StatCard
              icon={<Users size={20} color="#4285F4" />}
              title={languageSet.customersServed}
              value="253"
              subtitle="Last 7 Days"
              color="#4285F4"
            />
          </View>
          <View style={{ width: "48%" }}>
            <StatCard
              icon={<Clock size={20} color="#4285F4" />}
              title={languageSet.avgWaitTime}
              value="15 min"
              subtitle="Last 7 Days"
              color="#4285F4"
            />
          </View>
          <View style={{ width: "48%" }}>
            <StatCard
              icon={<UserX size={20} color="#FB923C" />}
              title={languageSet.customersSkipped}
              value="47"
              subtitle="Last 7 Days"
              color="#FB923C"
            />
          </View>
          <View style={{ width: "48%" }}>
            <StatCard
              icon={<TrendingDown size={20} color="#EF4444" />}
              title={languageSet.customersLeft}
              value="30"
              subtitle="Last 7 Days"
              color="#EF4444"
            />
          </View>
        </View>

        {/* Customer Distribution */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BarChart3 size={20} color="#4285F4" />
              <Text
                style={{
                  color: textPrimary,
                  fontWeight: "600",
                  marginLeft: 8,
                }}
              >
                {languageSet.customerDistribution}
              </Text>
            </View>
            <Text style={{ color: "#4285F4", fontSize: 14 }}>330 total</Text>
          </View>

          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <PieChart
              data={pieData}
              width={screenWidth - 80}
              height={220}
              chartConfig={{
                backgroundColor: cardBg,
                backgroundGradientFrom: cardBg,
                backgroundGradientTo: cardBg,
                color: (opacity = 1) => `rgba(66, 133, 244, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 0]}
              absolute
            />
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            {pieData.map((item, index) => (
              <View key={index} style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: item.color,
                    borderRadius: 6,
                    marginBottom: 4,
                  }}
                />
                <Text style={{ color: textPrimary, fontWeight: "600" }}>
                  {item.name}
                </Text>
                <Text style={{ color: textSecondary, fontSize: 12 }}>
                  {item.population} ({Math.round((item.population / 330) * 100)}
                  %)
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Customer Insights */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <BarChart3 size={20} color="#4285F4" />
            <Text
              style={{
                color: textPrimary,
                fontWeight: "600",
                marginLeft: 8,
                flex: 1,
              }}
            >
              {languageSet.customerInsights}
            </Text>
            <TouchableOpacity
              onPress={() => setShowCustomerInsightsModal(true)}
            >
              <Info size={20} color={textSecondary} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: 16,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{ color: textSecondary, fontSize: 12, marginBottom: 4 }}
              >
                Visited
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: textPrimary,
                  marginBottom: 2,
                }}
              >
                370
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TrendingDown size={12} color="#EF4444" />
                <Text style={{ color: "#EF4444", fontSize: 10, marginLeft: 2 }}>
                  28%
                </Text>
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{ color: textSecondary, fontSize: 12, marginBottom: 4 }}
              >
                Served
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#8B5CF6",
                  marginBottom: 2,
                }}
              >
                253
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TrendingUp size={12} color="#10B981" />
                <Text style={{ color: "#10B981", fontSize: 10, marginLeft: 2 }}>
                  12%
                </Text>
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{ color: textSecondary, fontSize: 12, marginBottom: 4 }}
              >
                Conversion
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#10B981",
                  marginBottom: 2,
                }}
              >
                68%
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TrendingUp size={12} color="#10B981" />
                <Text style={{ color: "#10B981", fontSize: 10, marginLeft: 2 }}>
                  5%
                </Text>
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{ color: textSecondary, fontSize: 12, marginBottom: 4 }}
              >
                Retention
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#F59E0B",
                  marginBottom: 2,
                }}
              >
                39%
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: isDark ? "rgba(66, 133, 244, 0.1)" : "#EFF6FF",
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <Text
              style={{ color: "#4285F4", fontWeight: "500", marginBottom: 4 }}
            >
              {languageSet.whatIsConversionRate}
            </Text>
            <Text
              style={{ color: textSecondary, fontSize: 13, lineHeight: 16 }}
            >
              {languageSet.conversionRateDefinition}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: isDark ? "rgba(66, 133, 244, 0.05)" : "#F8FAFC",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <Text
              style={{
                color: textPrimary,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              {languageSet.keyInsights}
            </Text>
            <InsightCard
              icon={<TrendingDown size={16} color="white" />}
              title={languageSet.trafficTrend}
              description="Customer visits are down by 28% compared to the previous period. Review your marketing strategy to attract more customers."
              color="#EF4444"
            />
            <InsightCard
              icon={<User size={16} color="white" />}
              title={languageSet.customerRetention}
              description="39% of your customers are returning visitors."
              color="#4285F4"
            />
            <InsightCard
              icon={<Calendar size={16} color="white" />}
              title={languageSet.bestPerformanceDay}
              description="Sun has your highest conversion rate. Consider studying what makes Sun successful and apply those practices to other days."
              color="#8B5CF6"
            />
          </View>
        </View>

        {/* Peak Hours */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Calendar size={20} color="#4285F4" />
            <Text
              style={{
                color: textPrimary,
                fontWeight: "600",
                marginLeft: 8,
              }}
            >
              {languageSet.peakHours}
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
              <Text style={{ color: textPrimary, fontWeight: "500" }}>
                {hour.time}
              </Text>
              <Text style={{ color: "#4285F4", fontSize: 14 }}>
                {hour.traffic}
              </Text>
            </View>
          ))}
        </View>

        {/* Service Completion */}
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <CheckCircle size={20} color="#10B981" />
            <Text
              style={{
                color: textPrimary,
                fontWeight: "600",
                marginLeft: 8,
              }}
            >
              {languageSet.serviceCompletion}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: isDark ? "#4B5563" : "#E2E8F0",
              borderRadius: 8,
              height: 8,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                backgroundColor: "#4285F4",
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
            <Text style={{ color: textSecondary, fontSize: 14 }}>0%</Text>
            <Text
              style={{
                color: "#4285F4",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              85% {languageSet.completed}
            </Text>
            <Text style={{ color: textSecondary, fontSize: 14 }}>100%</Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showCustomerInsightsModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowCustomerInsightsModal(false)}
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
              width: "90%",
              maxWidth: 400,
            }}
          >
            <View
              className="flex flex-row-reverse"
              style={{ marginBottom: 20 }}
            >
              <X
                color={isDark ? "white" : "black"}
                onPress={() => setShowCustomerInsightsModal(false)}
              />
            </View>

            {/* Description */}
            <Text
              style={{
                fontSize: 14,
                color: isDark ? "#9CA3AF" : "#6B7280",
                lineHeight: 20,
                marginBottom: 12,
              }}
            >
              {languageSet.chartDescription}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: isDark ? "#9CA3AF" : "#6B7280",
                lineHeight: 20,
                marginBottom: 24,
              }}
            >
              {languageSet.trendsDescription}
            </Text>
          </View>
        </View>
      </Modal>

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
                fontSize: 18,
                fontWeight: "bold",
                color: textPrimary,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              {languageSet.selectTimeRange}
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
                      ? isDark
                        ? "rgba(66, 133, 244, 0.2)"
                        : "#EFF6FF"
                      : "transparent",
                  borderRadius: 8,
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    color:
                      selectedTimeRange === option ? "#4285F4" : textPrimary,
                    fontWeight: selectedTimeRange === option ? "600" : "400",
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
