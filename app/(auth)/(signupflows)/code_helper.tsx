import useRegTypeStore from "@/store/regTypeStore";
import useThemeStore from "@/store/themeStore";
import { businessConnectionTranslations } from "@/translations/helperTranslations";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Building,
  Copy,
  LogOut,
  Scan,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function BusinessConnectionPage() {
  const router = useRouter();
  const { isDark, setLanguage, language, toggleTheme } = useThemeStore();
  const { regType } = useRegTypeStore();

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Owner states
  const [showQR, setShowQR] = useState(true);
  const [businessCode, setBusinessCode] = useState("BUS123456");
  const [joinRequests, setJoinRequests] = useState([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ]);
  const [connectedHelpers, setConnectedHelpers] = useState([
    {
      id: 1,
      name: "Mike Johnson",
      email: "mike@example.com",
      joinedDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      joinedDate: "2024-01-20",
    },
  ]);
  const languageSet = businessConnectionTranslations[language];

  // Helper states
  const [inputCode, setInputCode] = useState("");
  const [connectedBusiness, setConnectedBusiness] = useState<any>(null);
  // const [connectedBusiness, setConnectedBusiness] = useState({
  //   name: "Tech Solutions Inc",
  //   code: "BUS123456",
  //   joinedDate: "2024-01-15"
  // });

  // Modal states
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleCopyCode = () => {
    // Copy to clipboard logic
    Alert.alert("Copied", "Business code copied to clipboard");
  };

  const handleLeaveBusiness = () => {
    setConnectedBusiness(null);
    setShowLeaveModal(false);
    Alert.alert(
      languageSet.alertLeft.split(":")[0],
      languageSet.alertLeft.split(":")[1]
    );
  };

  const handleAcceptRequest = (request: any) => {
    setConnectedHelpers([
      ...connectedHelpers,
      {
        ...request,
        joinedDate: new Date().toISOString().split("T")[0],
      },
    ]);
    setJoinRequests(joinRequests.filter((req) => req.id !== request.id));
    setShowRequestModal(false);
    Alert.alert(
      languageSet.alertAccepted.split(":")[0],
      languageSet.alertAccepted.split(":")[1].replace("{name}", request.name)
    );
  };

  const handleRejectRequest = (request: any) => {
    setJoinRequests(joinRequests.filter((req) => req.id !== request.id));
    setShowRequestModal(false);
    Alert.alert(
      languageSet.alertRejected.split(":")[0],
      languageSet.alertRejected.split(":")[1].replace("{name}", request.name)
    );
  };

  const handleRemoveHelper = (helper: any) => {
    setConnectedHelpers(connectedHelpers.filter((h) => h.id !== helper.id));
    setShowRemoveModal(false);
    Alert.alert(
      languageSet.alertRemoved.split(":")[0],
      languageSet.alertRemoved.split(":")[1].replace("{name}", helper.name)
    );
  };

  const HelperView = () => {
    // Add a local state for the input
    const [localInputCode, setLocalInputCode] = useState("");
    const handleJoinBusiness = () => {
      if (!inputCode.trim()) {
        Alert.alert(
          languageSet.alertError.split(":")[0],
          languageSet.alertError.split(":")[1]
        );
        return;
      }

      // Simulate joining business
      setConnectedBusiness({
        name: "Tech Solutions Inc",
        code: inputCode,
        joinedDate: new Date().toISOString().split("T")[0],
      });
      setInputCode("");
      Alert.alert(
        languageSet.alertSuccess.split(":")[0],
        languageSet.alertSuccess.split(":")[1]
      );
    };

    return (
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 40 }}>
        {!connectedBusiness ? (
          <>
            {/* Header */}
            <View style={{ alignItems: "center", marginBottom: 40 }}>
              <Building size={48} color={isDark ? "#F8FAFC" : "#1E3A8A"} />
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                  marginTop: 16,
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                {languageSet.joinBusiness}
              </Text>
              <Text
                style={{
                  color: "#3B82F6",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                {languageSet.enterBusinessCodeOrScan}
              </Text>
            </View>

            {/* Input Field */}
            <View style={{ marginBottom: 24 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isDark ? "#374151" : "white",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: isDark ? "#4B5563" : "#E5E7EB",
                  marginBottom: 16,
                }}
              >
                <Building size={20} color="#3B82F6" />
                <TextInput
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    fontSize: 16,
                    color: isDark ? "#F9FAFB" : "#111827",
                  }}
                  placeholder={languageSet.enterBusinessCode}
                  placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                  defaultValue={inputCode} // Use defaultValue instead of value
                  onChangeText={setLocalInputCode} // Update local state
                  onEndEditing={() => setInputCode(localInputCode)} // Update main state when editing ends
                  autoCapitalize="characters"
                />
              </View>

              <TouchableOpacity
                onPress={handleJoinBusiness}
                style={{ marginBottom: 16 }}
              >
                <LinearGradient
                  colors={
                    isDark ? ["#6366F1", "#4338CA"] : ["#4F7DF7", "#2563EB"]
                  }
                  start={[0, 0]}
                  end={[1, 0]}
                  style={{
                    paddingVertical: 16,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <UserPlus size={20} color="white" />
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: 16,
                      marginLeft: 8,
                    }}
                  >
                    {languageSet.joinBusinessButton}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: isDark ? "#374151" : "white",
                  borderRadius: 12,
                  paddingVertical: 16,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: isDark ? "#4B5563" : "#E5E7EB",
                }}
              >
                <Scan size={20} color="#3B82F6" />
                <Text
                  style={{
                    color: "#3B82F6",
                    fontWeight: "600",
                    fontSize: 16,
                    marginLeft: 8,
                  }}
                >
                  {languageSet.scanQRCode}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Connected Business */}
            <View style={{ alignItems: "center", marginBottom: 40 }}>
              <UserCheck size={48} color="#10B981" />
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                  marginTop: 16,
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                {languageSet.connectedToBusiness}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: isDark ? "#374151" : "white",
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: isDark ? "#4B5563" : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                  marginBottom: 8,
                }}
              >
                {connectedBusiness.name}
              </Text>
              <Text
                style={{
                  color: isDark ? "#D1D5DB" : "#6B7280",
                  marginBottom: 4,
                }}
              >
                Code: {connectedBusiness.code}
              </Text>
              <Text
                style={{
                  color: isDark ? "#D1D5DB" : "#6B7280",
                }}
              >
                Joined: {connectedBusiness.joinedDate}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowLeaveModal(true)}
              style={{
                backgroundColor: "#EF4444",
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <LogOut size={20} color="white" />
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: 16,
                  marginLeft: 8,
                }}
              >
                {languageSet.leaveBusiness}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  const OwnerView = () => (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={{ alignItems: "center", marginBottom: 32 }}>
        <Users size={48} color={isDark ? "#F8FAFC" : "#1E3A8A"} />
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: isDark ? "#F8FAFC" : "#1E3A8A",
            marginTop: 16,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          {languageSet.businessConnection}
        </Text>
        <Text
          style={{
            color: "#3B82F6",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          {languageSet.shareCodeOrQR}
        </Text>
      </View>

      {/* Toggle Switch */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: isDark ? "#374151" : "white",
          borderRadius: 12,
          padding: 4,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: isDark ? "#4B5563" : "#E5E7EB",
        }}
      >
        <TouchableOpacity
          onPress={() => setShowQR(false)}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: !showQR ? "#3B82F6" : "transparent",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: !showQR ? "white" : isDark ? "#F8FAFC" : "#1E3A8A",
              fontWeight: "600",
            }}
          >
            {languageSet.code}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowQR(true)}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: showQR ? "#3B82F6" : "transparent",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: showQR ? "white" : isDark ? "#F8FAFC" : "#1E3A8A",
              fontWeight: "600",
            }}
          >
            {languageSet.qrCode}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Code/QR Display */}
      <View
        style={{
          backgroundColor: isDark ? "#374151" : "white",
          borderRadius: 16,
          padding: 24,
          alignItems: "center",
          marginBottom: 24,
          borderWidth: 1,
          borderColor: isDark ? "#4B5563" : "#E5E7EB",
        }}
      >
        {showQR ? (
          <QRCode
            value={businessCode}
            size={180}
            color="black"
            backgroundColor="white"
          />
        ) : (
          <>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: isDark ? "#F8FAFC" : "#1E3A8A",
                marginBottom: 16,
                letterSpacing: 2,
              }}
            >
              {businessCode}
            </Text>
            <TouchableOpacity
              onPress={handleCopyCode}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#3B82F6",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Copy size={16} color="white" />
              <Text
                style={{
                  color: "white",
                  marginLeft: 8,
                  fontWeight: "600",
                }}
              >
                {languageSet.copyCode}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Join Requests */}
      {joinRequests.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: isDark ? "#F8FAFC" : "#1E3A8A",
              marginBottom: 12,
            }}
          >
            {languageSet.joinRequests} ({joinRequests.length})
          </Text>
          {joinRequests.slice(0, 2).map((request) => (
            <TouchableOpacity
              key={request.id}
              onPress={() => {
                setSelectedItem(request);
                setShowRequestModal(true);
              }}
              style={{
                backgroundColor: isDark ? "#374151" : "white",
                borderRadius: 12,
                padding: 16,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: isDark ? "#4B5563" : "#E5E7EB",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <UserPlus size={20} color="#F59E0B" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: isDark ? "#F8FAFC" : "#1E3A8A",
                  }}
                >
                  {request.name}
                </Text>
                <Text
                  style={{
                    color: isDark ? "#D1D5DB" : "#6B7280",
                    fontSize: 14,
                  }}
                >
                  {request.email}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Connected Helpers */}
      <View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: isDark ? "#F8FAFC" : "#1E3A8A",
            marginBottom: 12,
          }}
        >
          {languageSet.connectedHelpers} ({connectedHelpers.length})
        </Text>
        {connectedHelpers.slice(0, 3).map((helper) => (
          <TouchableOpacity
            key={helper.id}
            onPress={() => {
              setSelectedItem(helper);
              setShowRemoveModal(true);
            }}
            style={{
              backgroundColor: isDark ? "#374151" : "white",
              borderRadius: 12,
              padding: 16,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: isDark ? "#4B5563" : "#E5E7EB",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <UserCheck size={20} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: isDark ? "#F8FAFC" : "#1E3A8A",
                }}
              >
                {helper.name}
              </Text>
              <Text
                style={{
                  color: isDark ? "#D1D5DB" : "#6B7280",
                  fontSize: 14,
                }}
              >
                {helper.email} • Joined {helper.joinedDate}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  if (isLoading) {
    return (
      <LinearGradient
        colors={
          isDark
            ? ["#1E1B4B", "#312E81", "#3730A3"]
            : ["#F1F5F9", "#E2E8F0", "#CBD5E1"]
        }
        start={[0, 0]}
        end={[0, 1]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text
          style={{
            color: isDark ? "#F8FAFC" : "#1E3A8A",
            marginTop: 16,
            fontSize: 16,
          }}
        >
          {languageSet.loading}
        </Text>
      </LinearGradient>
    );
  }

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
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 60,
          left: 15,
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
          zIndex: 1,
        }}
      >
        <ArrowLeft size={20} color="#3B82F6" />
        <Text
          style={{
            color: "#3B82F6",
            marginLeft: 4,
            fontSize: 16,
          }}
        >
          {languageSet.back}
        </Text>
      </TouchableOpacity>
      <View className="mt-10" />
      {/* Main Content */}
      {regType === "helper" ? <HelperView /> : <OwnerView />}

      {/* Join Request Modal */}
      <Modal
        visible={showRequestModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRequestModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              backgroundColor: isDark ? "#374151" : "white",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 400,
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
                {languageSet.joinRequest}
              </Text>
              <TouchableOpacity onPress={() => setShowRequestModal(false)}>
                <X size={24} color={isDark ? "#F8FAFC" : "#1E3A8A"} />
              </TouchableOpacity>
            </View>

            {selectedItem && (
              <>
                <Text
                  style={{
                    fontSize: 16,
                    color: isDark ? "#D1D5DB" : "#6B7280",
                    marginBottom: 24,
                  }}
                >
                  {languageSet.joinRequestText
                    .replace("{name}", selectedItem.name)
                    .replace("{email}", selectedItem.email)}
                </Text>

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => handleAcceptRequest(selectedItem)}
                    style={{
                      flex: 1,
                      backgroundColor: "#10B981",
                      paddingVertical: 12,
                      borderRadius: 8,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "600" }}>
                      {languageSet.accept}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleRejectRequest(selectedItem)}
                    style={{
                      flex: 1,
                      backgroundColor: "#EF4444",
                      paddingVertical: 12,
                      borderRadius: 8,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "600" }}>
                      {languageSet.reject}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Remove Helper Modal */}
      <Modal
        visible={showRemoveModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRemoveModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              backgroundColor: isDark ? "#374151" : "white",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 400,
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
                {languageSet.removeHelper}
              </Text>
              <TouchableOpacity onPress={() => setShowRemoveModal(false)}>
                <X size={24} color={isDark ? "#F8FAFC" : "#1E3A8A"} />
              </TouchableOpacity>
            </View>

            {selectedItem && (
              <>
                <Text
                  style={{
                    fontSize: 16,
                    color: isDark ? "#D1D5DB" : "#6B7280",
                    marginBottom: 24,
                  }}
                >
                  {languageSet.removeHelperText.replace(
                    "{name}",
                    selectedItem.name
                  )}
                </Text>

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => setShowRemoveModal(false)}
                    style={{
                      flex: 1,
                      backgroundColor: isDark ? "#4B5563" : "#E5E7EB",
                      paddingVertical: 12,
                      borderRadius: 8,
                      alignItems: "center",
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
                    onPress={() => handleRemoveHelper(selectedItem)}
                    style={{
                      flex: 1,
                      backgroundColor: "#EF4444",
                      paddingVertical: 12,
                      borderRadius: 8,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "600" }}>
                      {languageSet.remove}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Leave Business Modal */}
      <Modal
        visible={showLeaveModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLeaveModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              backgroundColor: isDark ? "#374151" : "white",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 400,
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
                {languageSet.leaveBusiness}
              </Text>
              <TouchableOpacity onPress={() => setShowLeaveModal(false)}>
                <X size={24} color={isDark ? "#F8FAFC" : "#1E3A8A"} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 16,
                color: isDark ? "#D1D5DB" : "#6B7280",
                marginBottom: 24,
              }}
            >
              {languageSet.leaveBusinessText.replace(
                "{name}",
                connectedBusiness?.name
              )}
            </Text>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowLeaveModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? "#4B5563" : "#E5E7EB",
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
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
                onPress={handleLeaveBusiness}
                style={{
                  flex: 1,
                  backgroundColor: "#EF4444",
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>
                  {languageSet.leave}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
