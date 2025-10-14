import useRegTypeStore from "@/store/regTypeStore";
import useThemeStore from "@/store/themeStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  DollarSign,
  Edit2,
  Mail,
  Phone,
  Save,
  Search,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// Mock data - replace with actual data from your store/API
const mockServices = [
  { id: 1, name: "Haircut", duration: 30, price: 500 },
  { id: 2, name: "Hair Coloring", duration: 60, price: 1500 },
  { id: 3, name: "Facial", duration: 45, price: 800 },
  { id: 4, name: "Manicure", duration: 30, price: 400 },
  { id: 5, name: "Pedicure", duration: 45, price: 600 },
  { id: 6, name: "Hair Spa", duration: 90, price: 2000 },
  { id: 7, name: "Makeup", duration: 60, price: 1200 },
  { id: 8, name: "Massage", duration: 60, price: 1000 },
];

const mockNewRequests = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+91 9876543210",
    requestedDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@example.com",
    phone: "+91 9876543211",
    requestedDate: "2024-01-16",
  },
];

const mockCurrentHelpers = [
  {
    id: 1,
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+91 9876543212",
    joinedDate: "2024-01-15",
    assignedServices: [1, 2, 3],
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+91 9876543213",
    joinedDate: "2024-01-20",
    assignedServices: [4, 5],
  },
];

export default function ManageEmployeePage() {
  const router = useRouter();
  const { isDark } = useThemeStore();
  const { regType } = useRegTypeStore();

  // Dark mode color palette - MATCHING all other pages
  const colors = {
    // Page backgrounds - consistent gradient
    gradientStart: isDark ? "#111827" : "#F1F5F9", // dark:from-gray-900
    gradientMid: isDark ? "#1F2937" : "#E2E8F0", // dark:bg-gray-800
    gradientEnd: isDark ? "#374151" : "#CBD5E1", // dark:border-gray-700

    // Card backgrounds
    cardBg: isDark ? "rgba(31, 41, 55, 0.95)" : "white", // dark:bg-gray-800/95
    modalBg: isDark ? "#374151" : "white", // dark:bg-gray-700

    // Text colors - blue palette
    textPrimary: isDark ? "#DBEAFE" : "#1E3A8A", // dark:text-blue-100
    textSecondary: isDark ? "#BFDBFE" : "#6B7280", // dark:text-blue-200
    textAccent: isDark ? "#93C5FD" : "#3B82F6", // dark:text-blue-300
    textMuted: isDark ? "#9CA3AF" : "#6B7280", // dark:text-gray-400

    // Icon colors
    iconColor: isDark ? "#60A5FA" : "#3B82F6", // dark:text-blue-400

    // Border colors
    borderColor: isDark ? "#374151" : "#E5E7EB", // dark:border-gray-700
    modalBorder: isDark ? "#4B5563" : "#E5E7EB", // dark:border-gray-600

    // Input backgrounds
    inputBg: isDark ? "#1F2937" : "#F9FAFB", // dark:bg-gray-800
    inputBorder: isDark ? "#4B5563" : "#E5E7EB", // dark:border-gray-600
    inputText: isDark ? "#F9FAFB" : "#111827", // dark:text-white
    placeholderColor: isDark ? "#9CA3AF" : "#6B7280",

    // Special backgrounds
    requestAvatarBg: isDark ? "rgba(251, 146, 60, 0.15)" : "#FEF3C7",
    helperAvatarBg: isDark ? "rgba(34, 197, 94, 0.15)" : "#D1FAE5",
    infoBg: isDark ? "#1F2937" : "#EFF6FF", // dark:bg-gray-800
    serviceBadgeBg: isDark ? "#1F2937" : "#EFF6FF",

    // Selected service
    selectedBorder: "#3B82F6",
    selectedBg: isDark ? "rgba(59, 130, 246, 0.1)" : "#EFF6FF",

    // Empty state
    emptyIconColor: isDark ? "#4B5563" : "#E5E7EB",
  };

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [newRequests, setNewRequests] = useState(mockNewRequests);
  const [currentHelpers, setCurrentHelpers] = useState(mockCurrentHelpers);

  // Modal states
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedHelper, setSelectedHelper] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter services based on search
  const filteredServices = mockServices.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAcceptRequest = (request: any) => {
    setSelectedHelper(request);
    setSelectedServices([]);
    setSearchQuery("");
    setAssignModalVisible(true);
  };

  const handleRejectRequest = (request: any) => {
    Alert.alert(
      "Reject Request",
      `Are you sure you want to reject ${request.name}'s request?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            setNewRequests((prev) => prev.filter((r) => r.id !== request.id));
            Alert.alert(
              "Success",
              `${request.name}'s request has been rejected`
            );
          },
        },
      ]
    );
  };

  const handleEditHelper = (helper: any) => {
    setSelectedHelper(helper);
    setSelectedServices(helper.assignedServices);
    setSearchQuery("");
    setEditModalVisible(true);
  };

  const toggleServiceSelection = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleProceedAssign = () => {
    if (selectedServices.length === 0) {
      Alert.alert("Error", "Please select at least one service");
      return;
    }

    const newHelper = {
      ...selectedHelper,
      id: Date.now(),
      assignedServices: selectedServices,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setCurrentHelpers((prev) => [...prev, newHelper]);
    setNewRequests((prev) => prev.filter((r) => r.id !== selectedHelper.id));
    setAssignModalVisible(false);
    setSelectedServices([]);
    setSearchQuery("");
    Alert.alert("Success", `${selectedHelper.name} has been added as a helper`);
  };

  const handleSaveChanges = () => {
    if (selectedServices.length === 0) {
      Alert.alert("Error", "Please select at least one service");
      return;
    }

    setCurrentHelpers((prev) =>
      prev.map((helper) =>
        helper.id === selectedHelper.id
          ? { ...helper, assignedServices: selectedServices }
          : helper
      )
    );
    setEditModalVisible(false);
    setSelectedServices([]);
    setSearchQuery("");
    Alert.alert(
      "Success",
      `${selectedHelper.name}'s services have been updated`
    );
  };

  const ServiceSelectionModal = ({
    visible,
    onClose,
    onSubmit,
    title,
    submitText,
  }: any) => (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <View
          style={{
            backgroundColor: colors.modalBg,
            borderRadius: 16,
            maxHeight: "80%",
            overflow: "hidden",
            borderWidth: 1,
            borderColor: colors.borderColor,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.modalBorder,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: colors.textPrimary,
              }}
            >
              {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Helper Info */}
          {selectedHelper && (
            <View
              style={{
                backgroundColor: colors.infoBg,
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.modalBorder,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: colors.textPrimary,
                  marginBottom: 4,
                }}
              >
                {selectedHelper.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <Mail size={14} color={colors.textMuted} />
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    marginLeft: 6,
                  }}
                >
                  {selectedHelper.email}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Phone size={14} color={colors.textMuted} />
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    marginLeft: 6,
                  }}
                >
                  {selectedHelper.phone}
                </Text>
              </View>
            </View>
          )}

          {/* Search Bar */}
          <View
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.modalBorder,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.inputBg,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: colors.inputBorder,
              }}
            >
              <Search size={20} color={colors.textMuted} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search services..."
                placeholderTextColor={colors.placeholderColor}
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontSize: 16,
                  color: colors.inputText,
                }}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <X size={20} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Services List */}
          <ScrollView style={{ maxHeight: 300 }}>
            <View style={{ padding: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.textMuted,
                  marginBottom: 12,
                }}
              >
                Select services to assign ({selectedServices.length} selected)
              </Text>

              {filteredServices.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <TouchableOpacity
                    key={service.id}
                    onPress={() => toggleServiceSelection(service.id)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: isSelected ? colors.selectedBg : colors.inputBg,
                      borderRadius: 12,
                      padding: 14,
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: isSelected
                        ? colors.selectedBorder
                        : colors.inputBorder,
                    }}
                  >
                    {isSelected ? (
                      <CheckCircle2 size={24} color={colors.selectedBorder} />
                    ) : (
                      <Circle size={24} color={colors.textMuted} />
                    )}
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: colors.textPrimary,
                          marginBottom: 4,
                        }}
                      >
                        {service.name}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Clock size={14} color={colors.textMuted} />
                          <Text
                            style={{
                              fontSize: 14,
                              color: colors.textMuted,
                              marginLeft: 4,
                            }}
                          >
                            {service.duration} min
                          </Text>
                        </View>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <DollarSign size={14} color={colors.textMuted} />
                          <Text
                            style={{
                              fontSize: 14,
                              color: colors.textMuted,
                            }}
                          >
                            ₹{service.price}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}

              {filteredServices.length === 0 && (
                <View
                  style={{
                    padding: 32,
                    alignItems: "center",
                  }}
                >
                  <Search
                    size={48}
                    color={colors.emptyIconColor}
                    style={{ marginBottom: 12 }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.textMuted,
                      textAlign: "center",
                    }}
                  >
                    No services found
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View
            style={{
              flexDirection: "row",
              padding: 16,
              gap: 12,
              borderTopWidth: 1,
              borderTopColor: colors.modalBorder,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                backgroundColor: colors.inputBg,
                paddingVertical: 14,
                borderRadius: 8,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.borderColor,
              }}
            >
              <Text
                style={{
                  color: colors.textPrimary,
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSubmit}
              disabled={selectedServices.length === 0}
              style={{
                flex: 1,
                backgroundColor:
                  selectedServices.length === 0 ? "#9CA3AF" : "#3B82F6",
                paddingVertical: 14,
                borderRadius: 8,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {submitText === "Save Changes" ? (
                <Save size={20} color="white" />
              ) : (
                <CheckCircle2 size={20} color="white" />
              )}
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: 16,
                  marginLeft: 8,
                }}
              >
                {submitText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
      start={[0, 0]}
      end={[0, 1]}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View
        style={{
          paddingTop: 48,
          paddingBottom: 16,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 12 }}
        >
          <ArrowLeft size={24} color={colors.iconColor} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: colors.textPrimary,
            }}
          >
            Manage Employees
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.textMuted,
              marginTop: 2,
            }}
          >
            Assign services to your team
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* New Requests Section */}
        {newRequests.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <UserPlus size={20} color={colors.iconColor} />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: colors.textPrimary,
                  marginLeft: 8,
                }}
              >
                New Requests ({newRequests.length})
              </Text>
            </View>

            {newRequests.map((request) => (
              <View
                key={request.id}
                style={{
                  backgroundColor: colors.cardBg,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: colors.borderColor,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: colors.requestAvatarBg,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <UserPlus size={24} color="#F59E0B" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: colors.textPrimary,
                        marginBottom: 4,
                      }}
                    >
                      {request.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 2,
                      }}
                    >
                      <Mail size={14} color={colors.textMuted} />
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.textSecondary,
                          marginLeft: 6,
                        }}
                      >
                        {request.email}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 2,
                      }}
                    >
                      <Phone size={14} color={colors.textMuted} />
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.textSecondary,
                          marginLeft: 6,
                        }}
                      >
                        {request.phone}
                      </Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Calendar size={14} color={colors.textMuted} />
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.textSecondary,
                          marginLeft: 6,
                        }}
                      >
                        Requested: {request.requestedDate}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => handleAcceptRequest(request)}
                    style={{
                      flex: 1,
                      backgroundColor: "#10B981",
                      paddingVertical: 12,
                      borderRadius: 8,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircle2 size={18} color="white" />
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "600",
                        fontSize: 15,
                        marginLeft: 6,
                      }}
                    >
                      Accept
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleRejectRequest(request)}
                    style={{
                      flex: 1,
                      backgroundColor: "#EF4444",
                      paddingVertical: 12,
                      borderRadius: 8,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <X size={18} color="white" />
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "600",
                        fontSize: 15,
                        marginLeft: 6,
                      }}
                    >
                      Reject
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Current Helpers Section */}
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <UserCheck size={20} color={colors.iconColor} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: colors.textPrimary,
                marginLeft: 8,
              }}
            >
              Current Helpers ({currentHelpers.length})
            </Text>
          </View>

          {currentHelpers.map((helper) => (
            <TouchableOpacity
              key={helper.id}
              onPress={() => handleEditHelper(helper)}
              style={{
                backgroundColor: colors.cardBg,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: colors.borderColor,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "flex-start" }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.helperAvatarBg,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UserCheck size={24} color="#10B981" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: colors.textPrimary,
                      marginBottom: 4,
                    }}
                  >
                    {helper.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <Mail size={14} color={colors.textMuted} />
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.textSecondary,
                        marginLeft: 6,
                      }}
                    >
                      {helper.email}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <Calendar size={14} color={colors.textMuted} />
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.textSecondary,
                        marginLeft: 6,
                      }}
                    >
                      Joined: {helper.joinedDate}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: colors.serviceBadgeBg,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 6,
                      alignSelf: "flex-start",
                    }}
                  >
                    <Briefcase size={14} color={colors.iconColor} />
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.iconColor,
                        fontWeight: "500",
                        marginLeft: 4,
                      }}
                    >
                      {helper.assignedServices.length} service
                      {helper.assignedServices.length !== 1 ? "s" : ""} assigned
                    </Text>
                  </View>
                </View>
                <Edit2 size={20} color={colors.iconColor} />
              </View>
            </TouchableOpacity>
          ))}

          {currentHelpers.length === 0 && (
            <View
              style={{
                backgroundColor: colors.cardBg,
                borderRadius: 12,
                padding: 32,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.borderColor,
              }}
            >
              <UserCheck
                size={48}
                color={colors.emptyIconColor}
                style={{ marginBottom: 12 }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: colors.textMuted,
                  marginBottom: 4,
                }}
              >
                No helpers yet
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textMuted,
                  textAlign: "center",
                }}
              >
                Accept requests to add helpers to your team
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Assign Services Modal */}
      <ServiceSelectionModal
        visible={assignModalVisible}
        onClose={() => {
          setAssignModalVisible(false);
          setSelectedServices([]);
          setSearchQuery("");
        }}
        onSubmit={handleProceedAssign}
        title="Assign Services"
        submitText="Proceed"
      />

      {/* Edit Helper Modal */}
      <ServiceSelectionModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedServices([]);
          setSearchQuery("");
        }}
        onSubmit={handleSaveChanges}
        title="Edit Assigned Services"
        submitText="Save Changes"
      />
    </LinearGradient>
  );
}
