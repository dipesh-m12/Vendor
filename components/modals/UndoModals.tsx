// components/modals/UndoModals.tsx
import useThemeStore from "@/store/themeStore";
import { translations } from "@/translations/tabsTranslations/queue/modal_undo";
import { Info, RotateCcw, X } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface UndoAction {
  id: string;
  type: "next" | "skip" | "remove";
  customerName: string;
  timestamp: string;
  previousQueue: any[];
}

interface UndoSystemProps {
  visible: boolean;
  onClose: () => void;
  onUndo: () => void;
  onShowHistory: () => void;
  latestAction: UndoAction | null;
  undoHistory: UndoAction[];
  onUndoSpecific: (actionId: string) => void;
  showHistoryModal: boolean;
  onCloseHistory: () => void;
}

const UndoSystem: React.FC<UndoSystemProps> = ({
  visible,
  onClose,
  onUndo,
  onShowHistory,
  latestAction,
  undoHistory,
  onUndoSpecific,
  showHistoryModal,
  onCloseHistory,
}) => {
  const { isDark, language } = useThemeStore();
  const languageSet = translations[language];
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (visible) {
      // Auto-hide after 5 seconds
      timeoutRef.current = setTimeout(() => {
        onClose();
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, onClose]);

  const getActionLabel = (type: string) => {
    switch (type) {
      case "next":
        return languageSet.completed || "Completed";
      case "skip":
        return languageSet.skipped || "Skipped";
      case "remove":
        return languageSet.removed || "Removed";
      default:
        return "Action";
    }
  };

  const getMessage = (action: UndoAction | null) => {
    if (!action) return "";
    return `${getActionLabel(action.type)}: ${action.customerName}`;
  };

  return (
    <>
      {/* Notification Banner */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            paddingBottom: 20,
            paddingHorizontal: 20,
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
                  {getMessage(latestAction)}
                </Text>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 13,
                  }}
                >
                  {latestAction?.timestamp}
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
                  {languageSet.undo}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onShowHistory}
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
                  {languageSet.more}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Recent Actions Modal */}
      <Modal
        visible={showHistoryModal}
        transparent
        animationType="fade"
        onRequestClose={onCloseHistory}
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
              maxHeight: "70%",
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
                {languageSet.undo_recent_actions}
              </Text>
              <TouchableOpacity
                onPress={onCloseHistory}
                style={{
                  padding: 4,
                }}
              >
                <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            {/* Actions List */}
            <ScrollView style={{ maxHeight: 400 }}>
              <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                {undoHistory.length > 0 ? (
                  undoHistory.map((action, index) => (
                    <View
                      key={action.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: 16,
                        borderBottomWidth:
                          index < undoHistory.length - 1 ? 1 : 0,
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
                          {getActionLabel(action.type)}: {action.customerName}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: isDark ? "#A5B4FC" : "#6B7280",
                          }}
                        >
                          {action.timestamp}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => onUndoSpecific(action.id)}
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
                          {languageSet.undo}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <View
                    style={{
                      padding: 40,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: isDark ? "#9CA3AF" : "#6B7280",
                        textAlign: "center",
                      }}
                    >
                      No recent actions to undo
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Close Button */}
            <View
              style={{
                paddingHorizontal: 20,
                paddingBottom: 20,
                borderTopWidth: 1,
                borderTopColor: isDark ? "#4B5563" : "#F3F4F6",
                paddingTop: 16,
              }}
            >
              <TouchableOpacity
                onPress={onCloseHistory}
                style={{
                  backgroundColor: "#3B82F6",
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
                  {languageSet.close}
                </Text>
              </TouchableOpacity>

              {/* View All Count */}
              {undoHistory.length > 0 && (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 12,
                    color: "#3B82F6",
                    fontSize: 14,
                  }}
                >
                  {languageSet.view_all || "View All"} ({undoHistory.length}{" "}
                  {undoHistory.length === 1 ? "customer" : "customers"})
                </Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default UndoSystem;
