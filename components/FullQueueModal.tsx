import { ArrowLeft, Pause, SkipForward, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
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
}

const FullQueueModal: React.FC<FullQueueModalProps> = ({
    visible,
    onClose,
    customers,
    onNext,
    onDetails,
    updateQueuePositions,
    setGlobalQueue,
}) => {
    const [showUndoNotification, setShowUndoNotification] = useState(false);
    const [lastRemovedCustomer, setLastRemovedCustomer] = useState<Customer | null>(null);
    const [previousQueue, setPreviousQueue] = useState<Customer[]>([]);

    const handleRemoveCustomer = (customer: Customer) => {
        setPreviousQueue([...customers]);
        setLastRemovedCustomer(customer);
        setGlobalQueue((prev: Customer[]) =>
            updateQueuePositions(prev.filter((c) => c.id !== customer.id))
        );
        setShowUndoNotification(true);
        setTimeout(() => {
            setShowUndoNotification(false);
        }, 5000);
    };

    const handleUndo = () => {
        if (lastRemovedCustomer && previousQueue.length > 0) {
            setGlobalQueue(previousQueue);
            setShowUndoNotification(false);
            setLastRemovedCustomer(null);
        }
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
        setGlobalQueue((prev: Customer[]) =>
            updateQueuePositions(prev.filter((c) => c.id !== customer.id))
        );
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#F6FAFF",
                }}
            >
                {/* Header */}
                <View
                    style={{
                        backgroundColor: "#F6FAFF",
                        paddingHorizontal: 20,
                        paddingTop: 32,
                        paddingBottom: 8,
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
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
                        <ArrowLeft size={20} color="#3B82F6" />
                        <Text
                            style={{
                                fontSize: 15,
                                color: "#3B82F6",
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
                            color: "#1E3A8A",
                            marginBottom: 2,
                        }}
                    >
                        Full Queue
                    </Text>
                    <View
                        style={{
                            marginTop: 4,
                            backgroundColor: "#E6F0FF",
                            alignSelf: "flex-start",
                            borderRadius: 8,
                            paddingVertical: 3,
                            paddingHorizontal: 12,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                color: "#1745AE",
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
                                backgroundColor: "#F6FAFF",
                                borderRadius: 12,
                                padding: 20,
                                marginBottom: 16,
                                borderWidth: 1,
                                borderColor: "#E6F0FF",
                                shadowColor: "#B6D2FF44",
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
                                        backgroundColor: customer.position === 1 ? "#22C55E" : "#3B82F6",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: 8,
                                    }}
                                >
                                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>
                                        {customer.position}
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 16, fontWeight: "600", color: "#2B3674" }}>
                                    {customer.name}
                                </Text>
                                {index === 0 && (
                                    <View
                                        style={{
                                            marginLeft: 10,
                                            backgroundColor: "#E4F6E7",
                                            borderRadius: 8,
                                            paddingHorizontal: 13,
                                            paddingVertical: 2,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "#27AE60",
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
                                        backgroundColor: "#E6F0FF",
                                        borderRadius: 8,
                                        paddingHorizontal: 17,
                                        paddingVertical: 2,
                                        marginLeft: 4,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#267FFF",
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
                                <Text style={{ fontSize: 13, color: "#4762FF", fontWeight: "500", marginBottom: 3 }}>
                                    Est. wait: {customer.estimatedWait} min
                                </Text>
                                <View
                                    style={{
                                        backgroundColor: "#EAF2FF",
                                        paddingHorizontal: 8,
                                        paddingVertical: 2,
                                        borderRadius: 8,
                                        alignSelf: "flex-start",
                                    }}
                                >
                                    <Text style={{ fontSize: 13, color: "#267FFF", fontWeight: "500" }}>
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
                                        backgroundColor: "#FEF3C7",
                                        borderRadius: 7,
                                        paddingVertical: 3,
                                        paddingHorizontal: 11,
                                        borderWidth: 1,
                                        borderColor: "#FEC06B",
                                        marginRight: 5,
                                    }}
                                >
                                    <Pause size={15} color="#B45309" style={{ marginRight: 4 }} />
                                    <Text
                                        style={{
                                            color: "#B45309",
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
                                        backgroundColor: "#EFF6FF",
                                        borderRadius: 7,
                                        paddingVertical: 3,
                                        paddingHorizontal: 12,
                                        borderWidth: 1,
                                        borderColor: "#A1C3F3",
                                        marginRight: 5,
                                    }}
                                >
                                    <SkipForward size={15} color="#3B82F6" style={{ marginRight: 4 }} />
                                    <Text
                                        style={{
                                            color: "#3B82F6",
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
                                        backgroundColor: "#FEE2E2",
                                        borderRadius: 7,
                                        paddingVertical: 3,
                                        paddingHorizontal: 10,
                                        borderWidth: 1,
                                        borderColor: "#EF4444",
                                    }}
                                >
                                    <Trash2 size={15} color="#EF4444" style={{ marginRight: 4 }} />
                                    <Text
                                        style={{
                                            color: "#EF4444",
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
                {/* Undo Notification */}
                {showUndoNotification && (
                    <View
                        style={{
                            position: "absolute",
                            bottom: 24,
                            left: 12,
                            right: 12,
                            backgroundColor: "#3B82F6",
                            borderRadius: 12,
                            padding: 16,
                            flexDirection: "row",
                            alignItems: "center",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8,
                        }}
                    >
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 12,
                            }}
                        >
                            <Text style={{ fontSize: 20 }}>ℹ️</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    color: "white",
                                    fontWeight: "700",
                                    fontSize: 15,
                                    marginBottom: 2,
                                }}
                            >
                                Customer removed from queue
                            </Text>
                            <Text
                                style={{
                                    color: "rgba(255, 255, 255, 0.8)",
                                    fontSize: 12,
                                }}
                            >
                                Undo available
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleUndo}
                            style={{
                                backgroundColor: "white",
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 6,
                                marginRight: 7,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#3B82F6",
                                    fontWeight: "600",
                                    fontSize: 13,
                                }}
                            >
                                Undo
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setShowUndoNotification(false)}
                            style={{
                                backgroundColor: "rgba(255,255,255,0.13)",
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                borderRadius: 6,
                            }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    fontWeight: "600",
                                    fontSize: 13,
                                }}
                            >
                                More
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
    );
};

export default FullQueueModal;
