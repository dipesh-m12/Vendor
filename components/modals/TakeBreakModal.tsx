import { AlertTriangle, Coffee, Plus, Users, Utensils, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface TakeBreakModalProps {
  visible: boolean;
  onClose: () => void;
  onStartBreak: (duration: number, reason: string) => void;
  isDark?: boolean;
}

const TakeBreakModal = ({ visible, onClose, onStartBreak, isDark = false }: TakeBreakModalProps) => {
  // Dark mode color palette - MATCHING all other pages
  const colors = {
    // Modal backgrounds
    modalBg: isDark ? "#374151" : "white", // dark:bg-gray-700
    modalOverlay: "rgba(0, 0, 0, 0.5)",

    // Text colors - blue palette
    textPrimary: isDark ? "#DBEAFE" : "#1E3A8A", // dark:text-blue-100
    textSecondary: isDark ? "#BFDBFE" : "#3B82F6", // dark:text-blue-200
    textAccent: isDark ? "#93C5FD" : "#3B82F6", // dark:text-blue-300
    textMuted: isDark ? "#9CA3AF" : "#6B7280", // dark:text-gray-400

    // Icon colors
    iconColor: isDark ? "#60A5FA" : "#3B82F6", // dark:text-blue-400
    closeIcon: isDark ? "#9CA3AF" : "#3B82F6",

    // Input fields
    inputBg: isDark ? "#1F2937" : "white", // dark:bg-gray-800
    inputBorder: isDark ? "#4B5563" : "#D1D5DB", // dark:border-gray-600
    inputText: isDark ? "#F9FAFB" : "#1E3A8A",
    placeholderColor: isDark ? "#9CA3AF" : "#6B7280",

    // Reason buttons
    reasonUnselected: isDark ? "rgba(96, 165, 250, 0.15)" : "#EFF6FF",
    reasonSelected: "#2563EB",
    reasonEmergencyUnselected: isDark ? "rgba(239, 68, 68, 0.2)" : "#FEF2F2",
    reasonEmergencySelected: "#FEE2E2",
    reasonText: isDark ? "#93C5FD" : "#3B82F6",

    // Duration buttons
    durationUnselected: isDark ? "rgba(96, 165, 250, 0.15)" : "#EFF6FF",
    durationSelected: "#2563EB",
    durationText: isDark ? "#93C5FD" : "#3B82F6",

    // Preview box
    previewBg: isDark ? "#1F2937" : "#F3F4F6", // dark:bg-gray-800

    // Cancel button
    cancelBorder: isDark ? "#4B5563" : "#D1D5DB",
    cancelBg: isDark ? "transparent" : "white",
    cancelText: isDark ? "#93C5FD" : "#3B82F6",

    // Disabled button
    disabledBg: "#9CA3AF",
  };

  const [selectedReason, setSelectedReason] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [customReason, setCustomReason] = useState('');
  const [customDuration, setCustomDuration] = useState('');
  const [showCustomReason, setShowCustomReason] = useState(false);
  const [showCustomDuration, setShowCustomDuration] = useState(false);

  const breakReasons = [
    { id: 'tea', label: 'Tea Break', icon: Coffee },
    { id: 'lunch', label: 'Lunch Break', icon: Utensils },
    { id: 'meeting', label: 'Staff Meeting', icon: Users },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle, isEmergency: true },
  ];

  const durations = [5, 10, 15, 30, 45, 60];

  const handleStartBreak = () => {
    const reason = showCustomReason ? customReason : selectedReason;
    const duration = showCustomDuration ? parseInt(customDuration) : selectedDuration;

    if (reason && duration) {
      onStartBreak(duration, reason);
      resetModal();
    }
  };

  const resetModal = () => {
    setSelectedReason('');
    setSelectedDuration(null);
    setCustomReason('');
    setCustomDuration('');
    setShowCustomReason(false);
    setShowCustomDuration(false);
    onClose();
  };

  const getDisplayReason = () => {
    if (showCustomReason) return customReason || '[Reason]';
    return breakReasons.find(r => r.id === selectedReason)?.label || '[Reason]';
  };

  const getDisplayDuration = () => {
    if (showCustomDuration) return customDuration || '0';
    return selectedDuration?.toString() || '0';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={resetModal}
    >
      <View style={{
        flex: 1,
        backgroundColor: colors.modalOverlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
        <View style={{
          backgroundColor: colors.modalBg,
          borderRadius: 12,
          padding: 24,
          width: '100%',
          maxWidth: 420,
          maxHeight: '90%',
        }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '600',
                color: colors.textPrimary,
              }}>
                Take a Break
              </Text>
              <TouchableOpacity onPress={resetModal}>
                <X size={24} color={colors.closeIcon} />
              </TouchableOpacity>
            </View>

            {/* Select break reason */}
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.textSecondary,
              marginBottom: 12,
            }}>
              Select break reason:
            </Text>

            <View style={{ gap: 8, marginBottom: 24 }}>
              {breakReasons.map((reason) => {
                const Icon = reason.icon;
                const isSelected = selectedReason === reason.id;

                return (
                  <TouchableOpacity
                    key={reason.id}
                    onPress={() => {
                      setSelectedReason(reason.id);
                      setShowCustomReason(false);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 8,
                      backgroundColor: reason.isEmergency
                        ? (isSelected ? colors.reasonEmergencySelected : colors.reasonEmergencyUnselected)
                        : (isSelected ? colors.reasonSelected : colors.reasonUnselected),
                    }}
                  >
                    <Icon
                      size={18}
                      color={reason.isEmergency
                        ? '#DC2626'
                        : (isSelected ? 'white' : colors.reasonText)
                      }
                      style={{ marginRight: 10 }}
                    />
                    <Text style={{
                      fontSize: 15,
                      fontWeight: isSelected ? '600' : '400',
                      color: reason.isEmergency
                        ? '#DC2626'
                        : (isSelected ? 'white' : colors.reasonText),
                    }}>
                      {reason.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Custom Reason */}
              <TouchableOpacity
                onPress={() => {
                  setShowCustomReason(!showCustomReason);
                  if (!showCustomReason) setSelectedReason('');
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: showCustomReason ? colors.reasonSelected : colors.reasonUnselected,
                }}
              >
                <Plus
                  size={18}
                  color={showCustomReason ? 'white' : colors.reasonText}
                  style={{ marginRight: 10 }}
                />
                <Text style={{
                  fontSize: 15,
                  fontWeight: showCustomReason ? '600' : '400',
                  color: showCustomReason ? 'white' : colors.reasonText,
                }}>
                  Custom Reason
                </Text>
              </TouchableOpacity>

              {showCustomReason && (
                <TextInput
                  value={customReason}
                  onChangeText={setCustomReason}
                  placeholder="Enter custom reason"
                  placeholderTextColor={colors.placeholderColor}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.inputBorder,
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: colors.inputText,
                    backgroundColor: colors.inputBg,
                  }}
                />
              )}
            </View>

            {/* Select duration */}
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.textSecondary,
              marginBottom: 12,
            }}>
              Select duration:
            </Text>

            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 24,
            }}>
              {durations.map((duration) => {
                const isSelected = selectedDuration === duration && !showCustomDuration;
                return (
                  <TouchableOpacity
                    key={duration}
                    onPress={() => {
                      setSelectedDuration(duration);
                      setShowCustomDuration(false);
                    }}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 20,
                      borderRadius: 8,
                      backgroundColor: isSelected ? colors.durationSelected : colors.durationUnselected,
                      minWidth: 100,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontWeight: isSelected ? '600' : '400',
                      color: isSelected ? 'white' : colors.durationText,
                    }}>
                      {duration >= 60 ? `${duration / 60} hr` : `${duration} min`}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Custom Duration Button */}
              <TouchableOpacity
                onPress={() => {
                  setShowCustomDuration(!showCustomDuration);
                  if (!showCustomDuration) setSelectedDuration(null);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  backgroundColor: showCustomDuration ? colors.durationSelected : colors.durationUnselected,
                  minWidth: 100,
                  justifyContent: 'center',
                }}
              >
                <Plus
                  size={16}
                  color={showCustomDuration ? 'white' : colors.durationText}
                  style={{ marginRight: 6 }}
                />
                <Text style={{
                  fontSize: 14,
                  fontWeight: showCustomDuration ? '600' : '400',
                  color: showCustomDuration ? 'white' : colors.durationText,
                }}>
                  Custom Duration
                </Text>
              </TouchableOpacity>
            </View>

            {/* Custom Duration Input */}
            {showCustomDuration && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 24,
                gap: 8,
              }}>
                <TextInput
                  value={customDuration}
                  onChangeText={setCustomDuration}
                  placeholder="12"
                  placeholderTextColor={colors.placeholderColor}
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: colors.inputBorder,
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: colors.inputText,
                    backgroundColor: colors.inputBg,
                  }}
                />
                <Text style={{
                  fontSize: 15,
                  color: colors.textMuted,
                }}>
                  minutes
                </Text>
              </View>
            )}

            {/* Customer notification preview */}
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.textSecondary,
              marginBottom: 12,
            }}>
              Customer notification preview:
            </Text>

            <View style={{
              backgroundColor: colors.previewBg,
              padding: 16,
              borderRadius: 8,
              marginBottom: 24,
            }}>
              <Text style={{
                fontSize: 14,
                color: colors.textPrimary,
                lineHeight: 20,
              }}>
                We&apos;re on a {getDisplayReason()} ({getDisplayDuration()} min). Please stay queued. Service will resume shortly.
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={{
              flexDirection: 'row',
              gap: 12,
            }}>
              <TouchableOpacity
                onPress={resetModal}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 8,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.cancelBorder,
                  backgroundColor: colors.cancelBg,
                }}
              >
                <Text style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: colors.cancelText,
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleStartBreak}
                disabled={!((selectedReason || (showCustomReason && customReason)) &&
                  (selectedDuration || (showCustomDuration && customDuration)))}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 8,
                  alignItems: 'center',
                  backgroundColor: ((selectedReason || (showCustomReason && customReason)) &&
                    (selectedDuration || (showCustomDuration && customDuration)))
                    ? '#2563EB'
                    : colors.disabledBg,
                }}
              >
                <Text style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: 'white',
                }}>
                  Start Break
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default TakeBreakModal;
