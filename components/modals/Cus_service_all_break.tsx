import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Clock, X, ChevronRight, Plus, Phone } from "lucide-react-native";
import useThemeStore from "@/store/themeStore";
import { translations } from "@/translations/tabsTranslations/queue/multimodal_translate";

const CusDetails_serviceTime_AllView__break = ({
  globalQueue,
  showCustomerDetailsModal,
  showAllCustomersModal,
  customDuration,
  customReason,
  extraTimeInput,
  showCustomFields,
  selectedBreakDuration,
  selectedCustomer,
  selectedBreakReason,
  setSelectedBreakDuration,
  startBreak,
  setShowAllCustomersModal,
  handleCallCustomer,
  handleCustomerDetails,
  setShowCustomerDetailsModal,
  setExtraTimeInput,
  setGlobalQueue,
  updateQueuePositions,
  setShowCustomFields,
  setCustomDuration,
  setCustomReason,
  setSelectedBreakReason,
  showServiceTimeModal,
  setShowServiceTimeModal,
  currentCustomer,
  handleNextCustomer,
  addExtraTime,
  showTakeBreakModal,
  setShowTakeBreakModal,
}: any) => {
  const { isDark, language } = useThemeStore();
  const languageSet = translations[language];

  //   const updateQueuePositions = (queue: any[]): any[] => {
  //   return queue.map((customer, index) => ({
  //     ...customer,
  //     position: index + 1, // Update position to reflect new queue order (1-based)
  //   }));
  // };

  return (
    <>
      {/* Service Time Modal */}
      <Modal
        visible={showServiceTimeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowServiceTimeModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingTop: 60,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#FEF3C7",
              borderRadius: 16,
              padding: 0,
              width: "100%",
              maxWidth: 400,
              borderWidth: 1,
              borderColor: "#F59E0B",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            {/* Header Section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: 16,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#FEF3C7",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor: "#F59E0B",
                  marginRight: 12,
                }}
              >
                <Clock size={20} color="#D97706" />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#92400E",
                    marginBottom: 2,
                  }}
                >
                  {languageSet.stillWithCustomer.replace(
                    "{currentCustomer?.name}",
                    currentCustomer?.name
                  )}
                  {/* Still with {currentCustomer?.name}? */}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setShowServiceTimeModal(false)}
                style={{
                  padding: 4,
                }}
              >
                <X size={24} color="#A16207" />
              </TouchableOpacity>
            </View>

            {/* Content Section */}
            <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
              <Text
                style={{
                  fontSize: 15,
                  color: "#A16207",
                  lineHeight: 22,
                  marginBottom: 20,
                }}
              >
                {languageSet.readyForNextCustomer}
              </Text>

              {/* Action Buttons */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                  display: "flex",
                }}
              >
                {/* Next Customer Button */}
                <TouchableOpacity
                  onPress={handleNextCustomer}
                  style={{
                    flex: 1,
                    backgroundColor: "#2563EB",
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: "#2563EB",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  <ChevronRight
                    size={18}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: 16,
                      letterSpacing: 0.5,
                    }}
                  >
                    {languageSet.nextCustomer}
                  </Text>
                </TouchableOpacity>

                {/* Extend Time Button */}
                <TouchableOpacity
                  onPress={addExtraTime}
                  style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: "#D97706",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Plus size={16} color="#D97706" style={{ marginRight: 8 }} />
                  <Text
                    style={{
                      color: "#D97706",
                      fontWeight: "600",
                      fontSize: 15,
                      letterSpacing: 0.3,
                    }}
                  >
                    {languageSet.extendTime}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Bottom helper text */}
          <View
            style={{
              marginTop: 16,
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#9CA3AF",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              {languageSet.stillWorkingWithCustomer.replace(
                "{currentCustomer?.name}",
                currentCustomer?.name
              )}
              {/* Still working with {currentCustomer?.name}. Tap Next when ready. */}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Take Break Modal */}
      <Modal
        visible={showTakeBreakModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTakeBreakModal(false)}
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
              padding: 20,
              width: "100%",
              maxWidth: 400,
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
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                }}
              >
                {languageSet.takeABreak}
              </Text>
              <TouchableOpacity onPress={() => setShowTakeBreakModal(false)}>
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: isDark ? "#A5B4FC" : "#3B82F6",
                marginBottom: 12,
              }}
            >
              {languageSet.selectBreakReason}
            </Text>

            <View style={{ gap: 8, marginBottom: 20 }}>
              {[
                { label: "☕ Tea Break", value: "Tea Break" },
                { label: "🍽️ Lunch Break", value: "Lunch Break" },
                { label: "👥 Staff Meeting", value: "Staff Meeting" },
                { label: "🚨 Emergency", value: "Emergency" },
              ].map((reason) => (
                <TouchableOpacity
                  key={reason.value}
                  onPress={() => {
                    setSelectedBreakReason(reason.value);
                    setCustomReason("");
                    setCustomDuration("");
                    setShowCustomFields(false);
                  }}
                  style={{
                    backgroundColor:
                      selectedBreakReason === reason.value
                        ? isDark
                          ? "#6366F1"
                          : "#EFF6FF"
                        : isDark
                        ? "#4B5563"
                        : "#F8FAFC",
                    padding: 12,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor:
                      selectedBreakReason === reason.value
                        ? "#3B82F6"
                        : isDark
                        ? "#6B7280"
                        : "#E5E7EB",
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedBreakReason === reason.value
                          ? "#3B82F6"
                          : isDark
                          ? "#F8FAFC"
                          : "#1E3A8A",
                      fontWeight:
                        selectedBreakReason === reason.value ? "600" : "400",
                    }}
                  >
                    {reason.label}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() => {
                  setSelectedBreakReason("");
                  setCustomReason("");
                  setCustomDuration("");
                  setShowCustomFields(true);
                }}
                style={{
                  backgroundColor: showCustomFields
                    ? isDark
                      ? "#6366F1"
                      : "#EFF6FF"
                    : isDark
                    ? "#4B5563"
                    : "#F8FAFC",
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: showCustomFields
                    ? "#3B82F6"
                    : isDark
                    ? "#6B7280"
                    : "#E5E7EB",
                }}
              >
                <Text
                  style={{
                    color: showCustomFields
                      ? "#3B82F6"
                      : isDark
                      ? "#F8FAFC"
                      : "#1E3A8A",
                    fontWeight: showCustomFields ? "600" : "400",
                  }}
                >
                  + Custom Reason
                </Text>
              </TouchableOpacity>

              {showCustomFields && (
                <View style={{ gap: 8 }}>
                  <TextInput
                    style={{
                      backgroundColor: isDark ? "#4B5563" : "#F8FAFC",
                      padding: 12,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: isDark ? "#6B7280" : "#E5E7EB",
                      color: isDark ? "#F8FAFC" : "#1E3A8A",
                    }}
                    placeholder="Enter custom reason"
                    placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                    value={customReason}
                    onChangeText={setCustomReason}
                  />
                </View>
              )}
            </View>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: isDark ? "#A5B4FC" : "#3B82F6",
                marginBottom: 12,
              }}
            >
              {languageSet.selectDuration}
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 20,
              }}
            >
              {[5, 10, 15, 30, 45, 60].map((duration) => (
                <TouchableOpacity
                  key={duration}
                  onPress={() => {
                    setSelectedBreakDuration(duration);
                    setShowCustomFields(false);
                  }}
                  style={{
                    backgroundColor:
                      selectedBreakDuration === duration
                        ? isDark
                          ? "#6366F1"
                          : "#4F7DF7"
                        : isDark
                        ? "#4B5563"
                        : "#F8FAFC",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor:
                      selectedBreakDuration === duration
                        ? "#3B82F6"
                        : isDark
                        ? "#6B7280"
                        : "#E5E7EB",
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedBreakDuration === duration
                          ? "white"
                          : isDark
                          ? "#F8FAFC"
                          : "#1E3A8A",
                      fontWeight:
                        selectedBreakDuration === duration ? "600" : "400",
                    }}
                  >
                    {duration >= 60 ? `${duration / 60} hr` : `${duration} min`}
                  </Text>
                </TouchableOpacity>
              ))}

              {showCustomFields && (
                <TextInput
                  style={{
                    backgroundColor: isDark ? "#4B5563" : "#F8FAFC",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isDark ? "#6B7280" : "#E5E7EB",
                    color: isDark ? "#F8FAFC" : "#1E3A8A",
                    minWidth: 80,
                  }}
                  placeholder="Custom"
                  placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                  value={customDuration}
                  onChangeText={setCustomDuration}
                  keyboardType="numeric"
                />
              )}
            </View>

            {!showCustomFields && (
              <View
                style={{
                  backgroundColor: isDark ? "#4B5563" : "#F1F5F9",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#9CA3AF" : "#6B7280",
                    fontWeight: "600",
                    marginBottom: 4,
                  }}
                >
                  {languageSet.customerNotificationPreview}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#F8FAFC" : "#1E3A8A",
                  }}
                >
                  We&apos;re on a {selectedBreakReason || "[Reason]"} (
                  {selectedBreakDuration} min). Please stay queued. Service will
                  resume shortly.
                </Text>
              </View>
            )}

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowTakeBreakModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? "#4B5563" : "#F8FAFC",
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: isDark ? "#6B7280" : "#E5E7EB",
                }}
              >
                <Text
                  style={{
                    color: isDark ? "#F8FAFC" : "#1E3A8A",
                    fontWeight: "600",
                  }}
                >
                  {languageSet.cancel}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={startBreak}
                disabled={!selectedBreakReason && !customReason}
                style={{
                  flex: 1,
                  backgroundColor:
                    !selectedBreakReason && !customReason
                      ? isDark
                        ? "#374151"
                        : "#E5E7EB"
                      : isDark
                      ? "#6366F1"
                      : "#4F7DF7",
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {languageSet.startBreak}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* View All Customers Modal */}
      <Modal
        visible={showAllCustomersModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAllCustomersModal(false)}
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
              padding: 17,
              maxHeight: "80%",
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
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                }}
              >
                {languageSet.allCustomers.replace(
                  "{globalQueue.length}",
                  globalQueue.length
                )}
                {/* All Customers ({globalQueue.length}) */}
              </Text>
              <TouchableOpacity onPress={() => setShowAllCustomersModal(false)}>
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              <View style={{ gap: 12 }}>
                {globalQueue.map((customer: any) => (
                  <View
                    key={customer.id}
                    style={{
                      backgroundColor: isDark ? "#4B5563" : "#F8FAFC",
                      borderRadius: 12,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: isDark ? "#6B7280" : "#E5E7EB",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: isDark ? "#6366F1" : "#4F7DF7",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        {customer.position}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
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
                        {languageSet.estimatedWait.replace(
                          "{customer.estimatedWait}",
                          customer.estimatedWait
                        )}
                        {/* Est. wait: {customer.estimatedWait} min */}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <TouchableOpacity
                        onPress={() => handleCallCustomer(customer)}
                        style={{
                          backgroundColor: isDark ? "#059669" : "#10B981",
                          padding: 8,
                          borderRadius: 8,
                        }}
                      >
                        <Phone size={16} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setShowAllCustomersModal(false);
                          handleCustomerDetails(customer);
                        }}
                        style={{
                          backgroundColor: isDark ? "#1E40AF" : "#EFF6FF",
                          padding: 8,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: isDark ? "#93C5FD" : "#3B82F6",
                            fontWeight: "600",
                            fontSize: 12,
                          }}
                        >
                          {languageSet.details}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Customer Details Modal */}
      <Modal
        visible={showCustomerDetailsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomerDetailsModal(false)}
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
              padding: 20,
              width: "100%",
              maxWidth: 400,
              maxHeight: "90%",
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
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                }}
              >
                {selectedCustomer?.position === 1
                  ? languageSet.currentCustomer
                  : languageSet.inQueue}
              </Text>
              <TouchableOpacity
                onPress={() => setShowCustomerDetailsModal(false)}
              >
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedCustomer && (
                <View style={{ gap: 20 }}>
                  {/* Customer Name */}
                  <View>
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        color: isDark ? "#F8FAFC" : "#1E3A8A",
                        textAlign: "center",
                      }}
                    >
                      {selectedCustomer.name}
                    </Text>
                  </View>

                  {/* Contact Information */}
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: isDark ? "#93C5FD" : "#3B82F6",
                        marginBottom: 12,
                      }}
                    >
                      {languageSet.contactInformation}
                    </Text>
                    <View style={{ gap: 8 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>
                          {languageSet.phoneNumber}
                        </Text>
                        <Text
                          style={{
                            color: isDark ? "#F8FAFC" : "#1E3A8A",
                            fontWeight: "600",
                          }}
                        >
                          {selectedCustomer.phone}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>
                          {languageSet.gender}
                        </Text>
                        <Text
                          style={{
                            color: isDark ? "#F8FAFC" : "#1E3A8A",
                            fontWeight: "600",
                          }}
                        >
                          {selectedCustomer.gender || "Other"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Queue Information */}
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: isDark ? "#93C5FD" : "#3B82F6",
                        marginBottom: 12,
                      }}
                    >
                      {languageSet.queueInformation}
                    </Text>
                    <View style={{ gap: 8 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>
                          {languageSet.queuePosition}
                        </Text>
                        <Text
                          style={{
                            color: isDark ? "#F8FAFC" : "#1E3A8A",
                            fontWeight: "600",
                          }}
                        >
                          {selectedCustomer.position}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>
                          {languageSet.joinTime}
                        </Text>
                        <Text
                          style={{
                            color: isDark ? "#F8FAFC" : "#1E3A8A",
                            fontWeight: "600",
                          }}
                        >
                          {selectedCustomer.joinTime}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>
                          {languageSet.estimatedTime}
                        </Text>
                        <Text
                          style={{
                            color: isDark ? "#F8FAFC" : "#1E3A8A",
                            fontWeight: "600",
                          }}
                        >
                          {selectedCustomer.estimatedWait} minutes
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Service Information */}
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: isDark ? "#93C5FD" : "#3B82F6",
                        marginBottom: 12,
                      }}
                    >
                      {languageSet.serviceInformation}
                    </Text>
                    <View style={{ gap: 8 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>
                          {languageSet.requestedService}
                        </Text>
                        <Text
                          style={{
                            color: isDark ? "#F8FAFC" : "#1E3A8A",
                            fontWeight: "600",
                          }}
                        >
                          {selectedCustomer.service || "General Inquiry"}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}>
                          {languageSet.serviceCharges}
                        </Text>
                        <Text
                          style={{
                            color: isDark ? "#F8FAFC" : "#1E3A8A",
                            fontWeight: "600",
                          }}
                        >
                          ₹ {selectedCustomer.charges || "155"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Add Extra Time */}
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: isDark ? "#93C5FD" : "#3B82F6",
                        marginBottom: 12,
                      }}
                    >
                      {languageSet.addExtraTime}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 8,
                        marginBottom: 12,
                      }}
                    >
                      {[
                        "-10 min",
                        "-5 min",
                        "+5 min",
                        "+10 min",
                        "+15 min",
                        "+30 min",
                      ].map((time) => (
                        <TouchableOpacity
                          key={time}
                          onPress={() => {
                            const minutes = parseInt(
                              time.replace(/[^\d-]/g, "")
                            );
                            const isNegative = time.includes("-");
                            const actualMinutes = isNegative
                              ? -Math.abs(minutes)
                              : minutes;
                            setExtraTimeInput(actualMinutes.toString());
                          }}
                          style={{
                            backgroundColor: time.includes("-")
                              ? isDark
                                ? "#DC2626"
                                : "#FEE2E2"
                              : isDark
                              ? "#059669"
                              : "#D1FAE5",
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: time.includes("-")
                              ? isDark
                                ? "#DC2626"
                                : "#F87171"
                              : isDark
                              ? "#059669"
                              : "#10B981",
                          }}
                        >
                          <Text
                            style={{
                              color: time.includes("-")
                                ? isDark
                                  ? "#FCA5A5"
                                  : "#DC2626"
                                : isDark
                                ? "#A7F3D0"
                                : "#059669",
                              fontSize: 12,
                              fontWeight: "600",
                            }}
                          >
                            {time}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        value={extraTimeInput}
                        onChangeText={setExtraTimeInput}
                        placeholder="0"
                        placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                        keyboardType="numeric"
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          borderColor: isDark ? "#4B5563" : "#D1D5DB",
                          backgroundColor: isDark ? "#1F2937" : "#F9FAFB",
                          borderRadius: 8,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          color: isDark ? "#F8FAFC" : "#1E3A8A",
                          fontSize: 14,
                        }}
                      />

                      <TouchableOpacity
                        onPress={() => {
                          const minutes = parseInt(extraTimeInput) || 0;

                          if (minutes !== 0) {
                            setGlobalQueue((prev: any) =>
                              prev.map((customer: any) =>
                                customer.id === selectedCustomer.id
                                  ? {
                                      ...customer,
                                      estimatedWait: Math.max(
                                        0,
                                        customer.estimatedWait + minutes
                                      ),
                                    }
                                  : customer
                              )
                            );

                            Alert.alert(
                              languageSet.timeUpdated,
                              `${
                                minutes > 0
                                  ? languageSet.added
                                  : languageSet.reduced
                              } ${Math.abs(minutes)} minutes`
                            );
                            setExtraTimeInput("0");
                          } else {
                            Alert.alert(
                              languageSet.done,
                              languageSet.noChangesMade
                            );
                          }
                        }}
                        style={{
                          backgroundColor: isDark ? "#3B82F6" : "#2563EB",
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "600",
                            fontSize: 14,
                          }}
                        >
                          {languageSet.addMinutes}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Recent History */}
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: isDark ? "#93C5FD" : "#3B82F6",
                        marginBottom: 12,
                      }}
                    >
                      {languageSet.recentHistory}
                    </Text>
                    <View
                      style={{
                        backgroundColor: isDark ? "#1E40AF" : "#EFF6FF",
                        padding: 12,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: isDark ? "#93C5FD" : "#3B82F6",
                          fontWeight: "600",
                        }}
                      >
                        {selectedCustomer.isReturning
                          ? languageSet.repeatedCustomer
                          : languageSet.newCustomer}
                      </Text>
                      {selectedCustomer.note && (
                        <Text
                          style={{
                            fontSize: 12,
                            color: isDark ? "#A5B4FC" : "#6366F1",
                            marginTop: 4,
                          }}
                        >
                          {selectedCustomer.note}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
                    <TouchableOpacity
                      onPress={() => {
                        // Validate inputs
                        if (!globalQueue || !selectedCustomer) {
                          console.error(
                            "globalQueue or selectedCustomer is undefined",
                            {
                              globalQueue,
                              selectedCustomer,
                            }
                          );
                          Alert.alert(
                            languageSet.error || "Error",
                            languageSet.invalidData ||
                              "Cannot perform action: Invalid queue or customer data"
                          );
                          return;
                        }

                        const isCurrentlyHeld =
                          selectedCustomer.isHeld || false;

                        if (isCurrentlyHeld) {
                          // Unhold - move to front of queue
                          setGlobalQueue((prev: any) => {
                            const filtered = prev.filter(
                              (c: any) => c.id !== selectedCustomer.id
                            );
                            const unheldCustomer = {
                              ...selectedCustomer,
                              isHeld: false,
                            };
                            return updateQueuePositions([
                              unheldCustomer,
                              ...filtered,
                            ]);
                          });
                          Alert.alert(
                            languageSet.customerReleased,
                            languageSet.customerNoLongerOnHold.replace(
                              "{selectedCustomer.name}",
                              selectedCustomer.name
                            )
                          );
                        } else {
                          // Hold - move to end of queue
                          setGlobalQueue((prev: any) => {
                            const filtered = prev.filter(
                              (c: any) => c.id !== selectedCustomer.id
                            );
                            const heldCustomer = {
                              ...selectedCustomer,
                              isHeld: true,
                            };
                            return updateQueuePositions([
                              ...filtered,
                              heldCustomer,
                            ]);
                          });
                          Alert.alert(
                            languageSet.customerHeld,
                            languageSet.customerMovedToEnd.replace(
                              "{selectedCustomer.name}",
                              selectedCustomer.name
                            )
                          );
                        }

                        setShowCustomerDetailsModal(false);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: selectedCustomer.isHeld
                          ? isDark
                            ? "#F59E0B"
                            : "#FBBF24"
                          : isDark
                          ? "#6B7280"
                          : "#9CA3AF",
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "600",
                          fontSize: 12,
                        }}
                      >
                        {selectedCustomer.isHeld ? "Unhold" : "Hold"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        // Skip functionality - remove from queue
                        setGlobalQueue((prev) =>
                          updateQueuePositions(
                            prev.filter((c) => c.id !== selectedCustomer.id)
                          )
                        );
                        Alert.alert(
                          languageSet.customerSkipped,
                          languageSet.customerRemovedFromQueue.replace(
                            "{selectedCustomer.name}",
                            selectedCustomer.name
                          )
                          // `${selectedCustomer.name} removed from queue`
                        );
                        setShowCustomerDetailsModal(false);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: isDark ? "#4F7DF7" : "#3B82F6",
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "600",
                          fontSize: 12,
                        }}
                      >
                        Skip
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          languageSet.removeCustomer,
                          languageSet.confirmRemoveCustomer.replace(
                            "{selectedCustomer.name}",
                            selectedCustomer.name
                          ),
                          // `Remove ${selectedCustomer.name} from queue?`,
                          [
                            { text: languageSet.cancel, style: "cancel" },
                            {
                              text: languageSet.remove,
                              style: "destructive",
                              onPress: () => {
                                setGlobalQueue((prev) =>
                                  updateQueuePositions(
                                    prev.filter(
                                      (c) => c.id !== selectedCustomer.id
                                    )
                                  )
                                );
                                setShowCustomerDetailsModal(false);
                                Alert.alert(
                                  languageSet.customerRemoved,
                                  languageSet.customerHasBeenRemoved.replace(
                                    "{selectedCustomer.name}",
                                    selectedCustomer.name
                                  )
                                  // `${selectedCustomer.name} has been removed from queue`
                                );
                              },
                            },
                          ]
                        );
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: isDark ? "#DC2626" : "#EF4444",
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "600",
                          fontSize: 12,
                        }}
                      >
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CusDetails_serviceTime_AllView__break;
