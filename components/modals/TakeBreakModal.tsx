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
  onStartBreak: (duration: number, reason: string) => void; // Fixed order
  isDark?: boolean;
}

const TakeBreakModal = ({ visible, onClose, onStartBreak, isDark = false }: TakeBreakModalProps) => {
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
      onStartBreak(duration, reason); // Fixed order
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
        <View style={{
          backgroundColor: 'white',
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
                color: '#1E3A8A',
              }}>
                Take a Break
              </Text>
              <TouchableOpacity onPress={resetModal}>
                <X size={24} color="#3B82F6" />
              </TouchableOpacity>
            </View>

            {/* Select break reason */}
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#3B82F6',
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
                        ? (isSelected ? '#FEE2E2' : '#FEF2F2')
                        : (isSelected ? '#2563EB' : '#EFF6FF'),
                    }}
                  >
                    <Icon
                      size={18}
                      color={reason.isEmergency
                        ? '#DC2626'
                        : (isSelected ? 'white' : '#3B82F6')
                      }
                      style={{ marginRight: 10 }}
                    />
                    <Text style={{
                      fontSize: 15,
                      fontWeight: isSelected ? '600' : '400',
                      color: reason.isEmergency
                        ? '#DC2626'
                        : (isSelected ? 'white' : '#3B82F6'),
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
                  backgroundColor: showCustomReason ? '#2563EB' : '#EFF6FF',
                }}
              >
                <Plus
                  size={18}
                  color={showCustomReason ? 'white' : '#3B82F6'}
                  style={{ marginRight: 10 }}
                />
                <Text style={{
                  fontSize: 15,
                  fontWeight: showCustomReason ? '600' : '400',
                  color: showCustomReason ? 'white' : '#3B82F6',
                }}>
                  Custom Reason
                </Text>
              </TouchableOpacity>

              {showCustomReason && (
                <TextInput
                  value={customReason}
                  onChangeText={setCustomReason}
                  placeholder="Enter custom reason"
                  style={{
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: '#1E3A8A',
                    backgroundColor: 'white',
                  }}
                />
              )}
            </View>

            {/* Select duration */}
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#3B82F6',
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
                      backgroundColor: isSelected ? '#2563EB' : '#EFF6FF',
                      minWidth: 100,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontWeight: isSelected ? '600' : '400',
                      color: isSelected ? 'white' : '#3B82F6',
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
                  backgroundColor: showCustomDuration ? '#2563EB' : '#EFF6FF',
                  minWidth: 100,
                  justifyContent: 'center',
                }}
              >
                <Plus
                  size={16}
                  color={showCustomDuration ? 'white' : '#3B82F6'}
                  style={{ marginRight: 6 }}
                />
                <Text style={{
                  fontSize: 14,
                  fontWeight: showCustomDuration ? '600' : '400',
                  color: showCustomDuration ? 'white' : '#3B82F6',
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
                  keyboardType="numeric"
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: '#1E3A8A',
                    backgroundColor: 'white',
                  }}
                />
                <Text style={{
                  fontSize: 15,
                  color: '#6B7280',
                }}>
                  minutes
                </Text>
              </View>
            )}

            {/* Customer notification preview */}
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#3B82F6',
              marginBottom: 12,
            }}>
              Customer notification preview:
            </Text>

            <View style={{
              backgroundColor: '#F3F4F6',
              padding: 16,
              borderRadius: 8,
              marginBottom: 24,
            }}>
              <Text style={{
                fontSize: 14,
                color: '#1E3A8A',
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
                  borderColor: '#D1D5DB',
                  backgroundColor: 'white',
                }}
              >
                <Text style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: '#3B82F6',
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
                    : '#9CA3AF',
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