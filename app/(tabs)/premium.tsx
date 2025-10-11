import useThemeStore from "@/store/themeStore";
import { translations } from "@/translations/tabsTranslations/premiumPageTranslations";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  BarChart2,
  Calendar,
  CheckCircle,
  Clock,
  LogOut,
  Settings,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PremiumPage() {
  const router = useRouter();
  const { isDark, language } = useThemeStore();

  const languageSet = translations[language];
  type PlanType = "monthly" | "yearly";
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("monthly");
  const [hasActivePlan, setHasActivePlan] = useState(false);

  const plans: Record<PlanType, { price: string; period: any; savings: string }> = {
    monthly: {
      price: "$9.99",
      period: languageSet.periodMonthly,
      savings: "",
    },
    yearly: {
      price: "$89.99",
      period: languageSet.periodYearly,
      savings: languageSet.savingsYearly,
    },
  };

  const features = [
    {
      icon: <Shield color={hasActivePlan ? "#10B981" : "#4285F4"} size={18} />,
      title: languageSet.feature1Title,
      description: languageSet.feature1Description,
    },
    {
      icon: <Zap color={hasActivePlan ? "#10B981" : "#4285F4"} size={18} />,
      title: languageSet.feature2Title,
      description: languageSet.feature2Description,
    },
    {
      icon: <Clock color={hasActivePlan ? "#10B981" : "#4285F4"} size={18} />,
      title: languageSet.feature3Title,
      description: languageSet.feature3Description,
    },
    {
      icon: <Users color={hasActivePlan ? "#10B981" : "#4285F4"} size={18} />,
      title: languageSet.feature4Title,
      description: languageSet.feature4Description,
    },
  ];

  const containerBg = isDark ? "#1F2937" : "#F1F5F9";
  const cardBg = isDark ? "#374151" : "#FFFFFF";
  const textPrimary = isDark ? "#F9FAFB" : "#1E293B";
  const textSecondary = isDark ? "#9CA3AF" : "#64748B";
  const borderColor = isDark ? "#4B5563" : "#E2E8F0";

  // Simulated active plan data
  const activePlanData = {
    startDate: "January 10, 2025",
    renewalDate: "January 10, 2026",
    price: selectedPlan === "yearly" ? "$89.99" : "$9.99",
    planType: selectedPlan,
  };

  const handleUpgrade = () => {
    console.log(
      `Upgrading to ${selectedPlan} plan for ${plans[selectedPlan].price}`
    );
    // Simulate successful upgrade
    setHasActivePlan(true);
  };

  const FeatureItem = ({ feature }: any) => (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>{feature.icon}</View>
      <View style={styles.featureContent}>
        <Text style={[styles.featureTitle, { color: textPrimary }]}>
          {feature.title}
        </Text>
        <Text style={[styles.featureDescription, { color: textSecondary }]}>
          {feature.description}
        </Text>
      </View>
      {hasActivePlan && <CheckCircle size={18} color="#10B981" />}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: containerBg }}>
      <LinearGradient
        colors={
          isDark
            ? ["#1E1B4B", "#312E81", "#3730A3"]
            : ["#EFF6FF", "#DBEAFE", "#BFDBFE"]
        }
        start={[0, 0]}
        end={[0, 1]}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: isDark
                ? "rgba(55, 65, 81, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
              borderBottomColor: borderColor,
            },
          ]}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={20} color="#4285F4" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: textPrimary }]}>
              {hasActivePlan
                ? languageSet.activePlan || "Your Active Plan"
                : languageSet.premiumPlans}
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Active Status Banner - Only shown when plan is active */}
          {hasActivePlan && (
            <View style={styles.statusBanner}>
              <LinearGradient
                colors={["#10B981", "#059669"]}
                start={[0, 0]}
                end={[1, 0]}
                style={styles.statusBannerGradient}
              >
                <CheckCircle size={24} color="white" />
                <View style={styles.statusTextContainer}>
                  <Text style={styles.statusTitle}>Premium Active</Text>
                  <Text style={styles.statusSubtitle}>
                    Your subscription is active and running smoothly
                  </Text>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Premium Card */}
          <View style={[styles.premiumCard, { backgroundColor: cardBg }]}>
            {/* Header with Star */}
            <View style={styles.premiumHeader}>
              <Star color="#F59E0B" size={24} fill={hasActivePlan ? "#F59E0B" : "none"} />
              <Text style={[styles.premiumTitle, { color: textPrimary }]}>
                {hasActivePlan
                  ? selectedPlan === "yearly"
                    ? "Premium Yearly"
                    : "Premium Monthly"
                  : languageSet.premiumTitle}
              </Text>
              {hasActivePlan && (
                <View style={styles.activeBadge}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeBadgeText}>Active</Text>
                </View>
              )}
            </View>

            <Text style={[styles.premiumSubtitle, { color: textSecondary }]}>
              {hasActivePlan
                ? "Everything you have access to with your premium plan"
                : languageSet.premiumSubtitle}
            </Text>

            {/* Plan Toggle - Only shown when not active */}
            {!hasActivePlan && (
              <View style={styles.planToggleContainer}>
                <View
                  style={[
                    styles.planToggle,
                    {
                      backgroundColor: isDark
                        ? "rgba(66, 133, 244, 0.2)"
                        : "#EFF6FF",
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedPlan("monthly")}
                    style={[
                      styles.planButton,
                      selectedPlan === "monthly" && {
                        backgroundColor: cardBg,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.planButtonText,
                        {
                          color:
                            selectedPlan === "monthly"
                              ? "#4285F4"
                              : textSecondary,
                          fontWeight: selectedPlan === "monthly" ? "600" : "400",
                        },
                      ]}
                    >
                      {languageSet.monthly}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelectedPlan("yearly")}
                    style={[
                      styles.planButton,
                      selectedPlan === "yearly" && {
                        backgroundColor: cardBg,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.planButtonText,
                        {
                          color:
                            selectedPlan === "yearly" ? "#4285F4" : textSecondary,
                          fontWeight: selectedPlan === "yearly" ? "600" : "400",
                        },
                      ]}
                    >
                      {languageSet.yearly}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Price */}
            <View style={styles.priceContainer}>
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: textPrimary }]}>
                  {plans[selectedPlan].price}
                </Text>
                <Text style={[styles.pricePeriod, { color: textSecondary }]}>
                  / {plans[selectedPlan].period}
                </Text>
              </View>
              {plans[selectedPlan].savings && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>
                    {plans[selectedPlan].savings}
                  </Text>
                </View>
              )}
            </View>

            {/* Subscription Info - Only shown when active */}
            {hasActivePlan && (
              <View style={[styles.infoSection, { borderTopColor: borderColor }]}>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Calendar size={18} color="#4285F4" />
                    <Text style={[styles.infoLabel, { color: textSecondary }]}>
                      Started
                    </Text>
                    <Text style={[styles.infoValue, { color: textPrimary }]}>
                      {activePlanData.startDate}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Calendar size={18} color="#10B981" />
                    <Text style={[styles.infoLabel, { color: textSecondary }]}>
                      Renews
                    </Text>
                    <Text style={[styles.infoValue, { color: textPrimary }]}>
                      {activePlanData.renewalDate}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.renewalNotice,
                    {
                      backgroundColor: isDark
                        ? "rgba(59, 130, 246, 0.1)"
                        : "#EFF6FF",
                    },
                  ]}
                >
                  <AlertCircle size={16} color="#4285F4" />
                  <Text style={[styles.renewalText, { color: "#4285F4" }]}>
                    Auto-renews on {activePlanData.renewalDate}
                  </Text>
                </View>
              </View>
            )}

            {/* Features */}
            <View style={styles.featuresContainer}>
              <Text style={[styles.sectionTitle, { color: textPrimary }]}>
                {hasActivePlan ? "Premium Features" : "Features Included"}
              </Text>
              {features.map((feature, index) => (
                <FeatureItem key={index} feature={feature} />
              ))}
            </View>

            {/* CTA Button - Only show upgrade when not active */}
            {!hasActivePlan && (
              <TouchableOpacity
                onPress={handleUpgrade}
                style={styles.upgradeButton}
              >
                <Text style={styles.upgradeButtonText}>
                  {languageSet.upgradeButton}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Testimonial - Only shown when not active */}
          {!hasActivePlan && (
            <View style={[styles.testimonialCard, { backgroundColor: cardBg }]}>
              <Text style={[styles.testimonialText, { color: textSecondary }]}>
                {`"${languageSet.testimonialText}"`}
              </Text>
              <View style={styles.testimonialAuthor}>
                <View
                  style={[
                    styles.authorAvatar,
                    {
                      backgroundColor: isDark
                        ? "rgba(66, 133, 244, 0.2)"
                        : "#EFF6FF",
                    },
                  ]}
                >
                  <Users size={16} color="#4285F4" />
                </View>
                <View style={styles.authorInfo}>
                  <Text style={[styles.authorName, { color: textPrimary }]}>
                    Sarah Johnson
                  </Text>
                  <Text style={[styles.authorTitle, { color: textSecondary }]}>
                    Salon Owner
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Navigation */}
        <View
          style={[
            styles.bottomNav,
            {
              backgroundColor: isDark
                ? "rgba(55, 65, 81, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
              borderTopColor: borderColor,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/queue")}
            style={styles.navButton}
          >
            <Users size={20} color="#9CA3AF" />
            <Text style={[styles.navButtonText, { color: "#9CA3AF" }]}>
              Queue
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/stats")}
            style={styles.navButton}
          >
            <BarChart2 size={20} color="#9CA3AF" />
            <Text style={[styles.navButtonText, { color: "#9CA3AF" }]}>
              Stats
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Star size={20} color="#4285F4" />
            <Text style={[styles.navButtonText, { color: "#4285F4" }]}>
              Premium
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/settings")}
            style={styles.navButton}
          >
            <Settings size={20} color="#9CA3AF" />
            <Text style={[styles.navButtonText, { color: "#9CA3AF" }]}>
              Settings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log("Logging out...");
              router.push("/(auth)/signin");
            }}
            style={styles.navButton}
          >
            <LogOut size={20} color="#9CA3AF" />
            <Text style={[styles.navButtonText, { color: "#9CA3AF" }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 140,
  },
  statusBanner: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  statusBannerGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  statusTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  premiumCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  premiumHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  activeBadgeText: {
    color: "#059669",
    fontSize: 11,
    fontWeight: "600",
  },
  premiumSubtitle: {
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  planToggleContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  planToggle: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 12,
  },
  planButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  planButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  priceContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 36,
    fontWeight: "bold",
  },
  pricePeriod: {
    fontSize: 16,
    marginLeft: 8,
  },
  savingsBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  savingsText: {
    color: "#059669",
    fontSize: 12,
    fontWeight: "600",
  },
  infoSection: {
    borderTopWidth: 1,
    paddingTop: 20,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  infoItem: {
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  renewalNotice: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  renewalText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  featureIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  upgradeButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  upgradeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  testimonialCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testimonialText: {
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
    marginBottom: 12,
  },
  testimonialAuthor: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
  },
  authorTitle: {
    fontSize: 12,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
  },
  navButton: {
    alignItems: "center",
    padding: 8,
  },
  navButtonText: {
    fontSize: 10,
    marginTop: 4,
  },
});
