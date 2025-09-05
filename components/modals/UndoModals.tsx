import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, Animated } from "react-native";
import { Info, RotateCcw, X } from "lucide-react-native";
import useThemeStore from "@/store/themeStore";

// First Modal - Notification Banner
const UndoNotificationBanner = ({
  visible,
  onClose,
  onUndo,
  onMore,
  customerName = "Customer",
  message = "Customer removed from queue",
}: any) => {
  const { isDark } = useThemeStore();
  if (!visible) return null;

  return (
    <View
      style={{
        position: "absolute",
        bottom: 240,
        left: 20,
        right: 20,
        zIndex: 1001,
      }}
    >
      <View
        style={{
          backgroundColor: "#3B82F6",
          borderRadius: 12,
          padding: 16,
          flexDirection: "column",
          alignItems: "stretch",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        {/* Info Icon and Content */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.2)",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Info size={16} color="white" />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 2,
              }}
            >
              {message}
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 13,
              }}
            >
              Undo available
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 16,
          }}
        >
          <TouchableOpacity
            onPress={onUndo}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 6,
              paddingHorizontal: 12,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 6,
            }}
          >
            <RotateCcw size={14} color="white" style={{ marginRight: 4 }} />
            <Text
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              Undo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onMore}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 8,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              More
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Second Modal - Recent Actions
const UndoRecentActionsModal = ({ visible, onClose, onUndoAction }: any) => {
  // Dummy data for recent actions
  const recentActions = [
    {
      id: 1,
      action: "Completed",
      customerName: "Fatima Al-Hassan",
      time: "02:17",
    },
    {
      id: 2,
      action: "Completed",
      customerName: "Sarah Johnson",
      time: "02:17",
    },
    {
      id: 3,
      action: "Completed",
      customerName: "Hiroshi Tanaka",
      time: "02:17",
    },
  ];
  const { isDark } = useThemeStore();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
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
            padding: 0,
            width: "100%",
            maxWidth: 400,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: isDark ? "#F8FAFC" : "#1E40AF",
              }}
            >
              Undo Recent Actions
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                padding: 4,
              }}
            >
              <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
            </TouchableOpacity>
          </View>
          {/* Actions List */}
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            {recentActions.map((action, index) => (
              <View
                key={action.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 16,
                  borderBottomWidth: index < recentActions.length - 1 ? 1 : 0,
                  borderBottomColor: isDark ? "#4B5563" : "#F3F4F6",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      color: isDark ? "#F8FAFC" : "#1E40AF",
                      marginBottom: 2,
                    }}
                  >
                    {action.action}: {action.customerName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: isDark ? "#A5B4FC" : "#6B7280",
                    }}
                  >
                    {action.time}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => onUndoAction(action)}
                  style={{
                    backgroundColor: isDark ? "#1E40AF" : "#DBEAFE",
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    marginLeft: 12,
                  }}
                >
                  <Text
                    style={{
                      color: isDark ? "#93C5FD" : "#3B82F6",
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    Undo
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {/* Close Button */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: isDark ? "#3B82F6" : "#3B82F6",
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
// Combined Component Example
const UndoSystem = () => {
  const [showNotification, setShowNotification] = useState(true);
  const [showRecentActions, setShowRecentActions] = useState(false);

  const handleUndo = () => {
    console.log("Undo action triggered");
    setShowNotification(false);
    // Add your undo logic here
  };

  const handleMore = () => {
    setShowRecentActions(true);
    // Keep notification visible or hide based on your preference
    // setShowNotification(false);
  };

  const handleUndoAction = (action) => {
    console.log("Undoing action:", action);
    // Add your specific undo logic here
    setShowRecentActions(false);
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const handleCloseRecentActions = () => {
    setShowRecentActions(false);
  };

  return (
    <>
      {/* Notification Banner */}
      <UndoNotificationBanner
        visible={showNotification}
        onClose={handleCloseNotification}
        onUndo={handleUndo}
        onMore={handleMore}
        message="Customer removed from queue"
      />

      {/* Recent Actions Modal */}
      <UndoRecentActionsModal
        visible={showRecentActions}
        onClose={handleCloseRecentActions}
        onUndoAction={handleUndoAction}
      />
    </>
  );
};

export default UndoSystem;
