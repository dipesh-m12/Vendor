import useThemeStore from "@/store/themeStore";
import { ArrowLeft, Pause, SkipForward, Trash2 } from "lucide-react-native";
import React from "react";
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Customer {
    id: number;
    name: string;
    phone: string;
    estimatedWait: number;
    joinTime: string;
    note?: string;
    position: number;
    isHeld?: boolean;
    services?: { name: string; price: number }[];
    totalCharge?: number;
}

interface FullQueueModalProps {
    visible: boolean;
    onClose: () => void;
    customers: Customer[];
    onNext: (customer: Customer) => void;
    onDetails: (customer: Customer) => void;
    updateQueuePositions: (queue: Customer[]) => Customer[];
    setGlobalQueue: React.Dispatch<React.SetStateAction<Customer[]>>;
    addToUndoHistory: (type: "next" | "skip" | "remove", customer: Customer, previousQueue: Customer[]) => void;
}

const FullQueueModal: React.FC<FullQueueModalProps> = ({
    visible,
    onClose,
    customers,
    onNext,
    onDetails,
    updateQueuePositions,
    setGlobalQueue,
    addToUndoHistory,
}) => {
    const { isDark } = useThemeStore();

    // Dark mode color palette
    const colors = {
        // Backgrounds
        pageBg: isDark ? "#111827" : "#F6FAFF",
        cardBg: isDark ? "rgba(31, 41, 55, 0.95)" : "#F6FAFF",
        headerBg: isDark ? "#1F2937" : "#F6FAFF",

        // Text colors
        textPrimary: isDark ? "#DBEAFE" : "#2B3674",
        textSecondary: isDark ? "#BFDBFE" : "#4762FF",
        headingPrimary: isDark ? "#DBEAFE" : "#1E3A8A",

        // Badge and accent colors
        badgeBg: isDark ? "#1E3A8A" : "#E6F0FF",
        badgeText: isDark ? "#93C5FD" : "#1745AE",
        nextBadgeBg: isDark ? "rgba(34, 197, 94, 0.2)" : "#E4F6E7",
        nextBadgeText: isDark ? "#4ADE80" : "#27AE60",
        detailsBadgeBg: isDark ? "#1E3A8A" : "#E6F0FF",
        detailsBadgeText: isDark ? "#93C5FD" : "#267FFF",

        // Border and card colors
        borderColor: isDark ? "#374151" : "#E6F0FF",
        cardShadow: isDark ? "rgba(0, 0, 0, 0.3)" : "#B6D2FF44",

        // Button colors
        backButtonColor: isDark ? "#60A5FA" : "#3B82F6",
        positionBadgeBg: isDark ? "#60A5FA" : "#3B82F6",
        positionBadgeFirst: isDark ? "#4ADE80" : "#22C55E",

        // Meta info
        phoneTagBg: isDark ? "rgba(96, 165, 250, 0.15)" : "#EAF2FF",
        phoneTagText: isDark ? "#93C5FD" : "#267FFF",

        // Action button colors - Hold
        holdBg: isDark ? "rgba(252, 211, 77, 0.15)" : "#FEF3C7",
        holdBorder: isDark ? "#F59E0B" : "#FEC06B",
        holdText: isDark ? "#FCD34D" : "#B45309",
        holdIcon: isDark ? "#FBBF24" : "#B45309",

        // Action button colors - Skip
        skipBg: isDark ? "rgba(96, 165, 250, 0.15)" : "#EFF6FF",
        skipBorder: isDark ? "#60A5FA" : "#A1C3F3",
        skipText: isDark ? "#93C5FD" : "#3B82F6",
        skipIcon: isDark ? "#60A5FA" : "#3B82F6",

        // Action button colors - Remove
        removeBg: isDark ? "rgba(252, 165, 165, 0.15)" : "#FEE2E2",
        removeBorder: isDark ? "#F87171" : "#EF4444",
        removeText: isDark ? "#FCA5A5" : "#EF4444",
        removeIcon: isDark ? "#F87171" : "#EF4444",
    };

    const handleRemoveCustomer = (customer: Customer) => {
        const currentQueue = [...customers];

        // Add to global undo history
        addToUndoHistory("remove", customer, currentQueue);

        // Remove customer from queue
        setGlobalQueue((prev: Customer[]) =>
            updateQueuePositions(prev.filter((c) => c.id !== customer.id))
        );
    };

    const handleHold = (customer: Customer) => {
        const isCurrentlyHeld = customer.isHeld || false;
        if (isCurrentlyHeld) {
            setGlobalQueue((prev: Customer[]) => {
                const filtered = prev.filter((c) => c.id !== customer.id);
                const unheldCustomer = { ...customer, isHeld: false };
                return updateQueuePositions([unheldCustomer, ...filtered]);
            });
        } else {
            setGlobalQueue((prev: Customer[]) => {
                const filtered = prev.filter((c) => c.id !== customer.id);
                const heldCustomer = { ...customer, isHeld: true };
                return updateQueuePositions([...filtered, heldCustomer]);
            });
        }
    };

    const handleSkip = (customer: Customer) => {
        const currentQueue = [...customers];

        // Add to global undo history
        addToUndoHistory("skip", customer, currentQueue);

        // Skip customer (move to end of queue)
        setGlobalQueue((prev: Customer[]) =>
            updateQueuePositions([
                ...prev.filter((c) => c.id !== customer.id),
                { ...customer, position: prev.length }
            ])
        );
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.pageBg,
                }}
            >
                {/* Header */}
                <View
                    style={{
                        backgroundColor: colors.headerBg,
                        paddingHorizontal: 20,
                        paddingTop: 32,
                        paddingBottom: 8,
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        borderBottomWidth: isDark ? 1 : 0,
                        borderBottomColor: colors.borderColor,
                    }}
                >
                    <TouchableOpacity
                        onPress={onClose}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 10,
                        }}
                    >
                        <ArrowLeft size={20} color={colors.backButtonColor} />
                        <Text
                            style={{
                                fontSize: 15,
                                color: colors.backButtonColor,
                                marginLeft: 6,
                                fontWeight: "500",
                            }}
                        >
                            Back to Queue
                        </Text>
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: 21,
                            fontWeight: "700",
                            color: colors.headingPrimary,
                            marginBottom: 2,
                        }}
                    >
                        Full Queue
                    </Text>
                    <View
                        style={{
                            marginTop: 4,
                            backgroundColor: colors.badgeBg,
                            alignSelf: "flex-start",
                            borderRadius: 8,
                            paddingVertical: 3,
                            paddingHorizontal: 12,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                color: colors.badgeText,
                                fontWeight: "600",
                            }}
                        >
                            Customers in Queue: {customers.length}
                        </Text>
                    </View>
                </View>

                {/* Customer List */}
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        padding: 16,
                        paddingBottom: 60,
                    }}
                >
                    {customers.map((customer, index) => (
                        <View
                            key={customer.id}
                            style={{
                                backgroundColor: colors.cardBg,
                                borderRadius: 12,
                                padding: 20,
                                marginBottom: 16,
                                borderWidth: 1,
                                borderColor: colors.borderColor,
                                shadowColor: colors.cardShadow,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.12,
                                shadowRadius: 6,
                                elevation: 2,
                            }}
                        >
                            {/* Header Row: Name, Badge, Next/Details */}
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 7 }}>
                                <View
                                    style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: 12,
                                        backgroundColor: customer.position === 1
                                            ? colors.positionBadgeFirst
                                            : colors.positionBadgeBg,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: 8,
                                    }}
                                >
                                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>
                                        {customer.position}
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textPrimary }}>
                                    {customer.name}
                                </Text>
                                {index === 0 && (
                                    <View
                                        style={{
                                            marginLeft: 10,
                                            backgroundColor: colors.nextBadgeBg,
                                            borderRadius: 8,
                                            paddingHorizontal: 13,
                                            paddingVertical: 2,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: colors.nextBadgeText,
                                                fontWeight: "600",
                                                fontSize: 16,
                                                letterSpacing: 0.2,
                                            }}
                                        >
                                            Next
                                        </Text>
                                    </View>
                                )}
                                <View style={{ flex: 1 }} />
                                <TouchableOpacity
                                    onPress={() => onDetails(customer)}
                                    style={{
                                        backgroundColor: colors.detailsBadgeBg,
                                        borderRadius: 8,
                                        paddingHorizontal: 17,
                                        paddingVertical: 2,
                                        marginLeft: 4,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: colors.detailsBadgeText,
                                            fontWeight: "600",
                                            fontSize: 16,
                                            letterSpacing: 0.15,
                                        }}
                                    >
                                        Details
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Meta Row */}
                            <View style={{ marginLeft: 32, marginBottom: 4 }}>
                                <Text style={{
                                    fontSize: 13,
                                    color: colors.textSecondary,
                                    fontWeight: "500",
                                    marginBottom: 3
                                }}>
                                    Est. wait: {customer.estimatedWait} min
                                </Text>
                                <View
                                    style={{
                                        backgroundColor: colors.phoneTagBg,
                                        paddingHorizontal: 8,
                                        paddingVertical: 2,
                                        borderRadius: 8,
                                        alignSelf: "flex-start",
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 13,
                                        color: colors.phoneTagText,
                                        fontWeight: "500"
                                    }}>
                                        {customer.phone}
                                    </Text>
                                </View>
                            </View>

                            {/* Action Buttons Row */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 12,
                                    marginTop: 11,
                                    marginLeft: 4,
                                }}
                            >
                                {/* Hold */}
                                <TouchableOpacity
                                    onPress={() => handleHold(customer)}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        backgroundColor: colors.holdBg,
                                        borderRadius: 7,
                                        paddingVertical: 3,
                                        paddingHorizontal: 11,
                                        borderWidth: 1,
                                        borderColor: colors.holdBorder,
                                        marginRight: 5,
                                    }}
                                >
                                    <Pause size={15} color={colors.holdIcon} style={{ marginRight: 4 }} />
                                    <Text
                                        style={{
                                            color: colors.holdText,
                                            fontWeight: "500",
                                            fontSize: 15,
                                        }}
                                    >
                                        {customer.isHeld ? "Unhold" : "Hold"}
                                    </Text>
                                </TouchableOpacity>

                                {/* Skip */}
                                <TouchableOpacity
                                    onPress={() => handleSkip(customer)}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        backgroundColor: colors.skipBg,
                                        borderRadius: 7,
                                        paddingVertical: 3,
                                        paddingHorizontal: 12,
                                        borderWidth: 1,
                                        borderColor: colors.skipBorder,
                                        marginRight: 5,
                                    }}
                                >
                                    <SkipForward size={15} color={colors.skipIcon} style={{ marginRight: 4 }} />
                                    <Text
                                        style={{
                                            color: colors.skipText,
                                            fontWeight: "500",
                                            fontSize: 15,
                                        }}
                                    >
                                        Skip
                                    </Text>
                                </TouchableOpacity>

                                {/* Remove */}
                                <TouchableOpacity
                                    onPress={() => handleRemoveCustomer(customer)}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        backgroundColor: colors.removeBg,
                                        borderRadius: 7,
                                        paddingVertical: 3,
                                        paddingHorizontal: 10,
                                        borderWidth: 1,
                                        borderColor: colors.removeBorder,
                                    }}
                                >
                                    <Trash2 size={15} color={colors.removeIcon} style={{ marginRight: 4 }} />
                                    <Text
                                        style={{
                                            color: colors.removeText,
                                            fontWeight: "500",
                                            fontSize: 15,
                                        }}
                                    >
                                        Remove
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );
};

export default FullQueueModal;
