import { ArrowLeft, Pause, Phone, SkipForward, Trash2, User } from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Data Types
interface Customer {
    id: number;
    name: string;
    phone: string;
    estimatedWait: number;
    joinTime: string;
    note?: string;
    position: number;
    isHeld?: boolean;
    gender?: string;
    service?: string;
    charges?: number;
    services?: { name: string; price: number }[];
    totalCharge?: number;
    isReturning?: boolean;
}

interface CustomerDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    customer: Customer | null;
    onCall: (customer: Customer) => void;
    updateQueuePositions: (queue: Customer[]) => Customer[];
    setGlobalQueue: React.Dispatch<React.SetStateAction<Customer[]>>;
    globalQueue: Customer[];
    addToUndoHistory: (type: "next" | "skip" | "remove", customer: Customer, previousQueue: Customer[]) => void;
}

const quickTimes = [
    { label: "-10 min", value: -10 },
    { label: "-5 min", value: -5 },
    { label: "+5 min", value: 5 },
    { label: "+10 min", value: 10 },
    { label: "+15 min", value: 15 },
    { label: "+30 min", value: 30 },
];

// Component
const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
    visible,
    onClose,
    customer,
    onCall,
    updateQueuePositions,
    setGlobalQueue,
    globalQueue,
    addToUndoHistory,
}) => {
    const [extraTimeInput, setExtraTimeInput] = useState("0");

    if (!customer) return null;
    const isCurrentCustomer = customer.position === 1;

    // Actions
    const handleHold = () => {
        const isCurrentlyHeld = customer.isHeld || false;
        if (isCurrentlyHeld) {
            setGlobalQueue((prev: Customer[]) => {
                const filtered = prev.filter((c) => c.id !== customer.id);
                const unheldCustomer = { ...customer, isHeld: false };
                return updateQueuePositions([unheldCustomer, ...filtered]);
            });
            Alert.alert("Customer Released", `${customer.name} is no longer on hold`);
        } else {
            setGlobalQueue((prev: Customer[]) => {
                const filtered = prev.filter((c) => c.id !== customer.id);
                const heldCustomer = { ...customer, isHeld: true };
                return updateQueuePositions([...filtered, heldCustomer]);
            });
            Alert.alert("Customer Held", `${customer.name} moved to end of queue`);
        }
        onClose();
    };

    const handleSkip = () => {
        const currentQueue = [...globalQueue];

        // Add to global undo history
        addToUndoHistory("skip", customer, currentQueue);

        // Skip customer (move to end of queue)
        setGlobalQueue((prev: Customer[]) =>
            updateQueuePositions([
                ...prev.filter((c) => c.id !== customer.id),
                { ...customer, position: prev.length }
            ])
        );

        // Alert.alert("Customer Skipped", `${customer.name} moved to end of queue`);
        onClose();
    };

    const handleRemove = () => {
        const currentQueue = [...globalQueue];

        // Add to global undo history
        addToUndoHistory("remove", customer, currentQueue);

        // Remove customer from queue
        setGlobalQueue((prev: Customer[]) =>
            updateQueuePositions(prev.filter((c) => c.id !== customer.id))
        );

        onClose();

        
        
    };


    const handleAddTime = () => {
        const minutes = parseInt(extraTimeInput) || 0;
        if (minutes !== 0) {
            setGlobalQueue((prev: Customer[]) =>
                prev.map((c) =>
                    c.id === customer.id
                        ? { ...c, estimatedWait: Math.max(0, c.estimatedWait + minutes) }
                        : c
                )
            );
            Alert.alert(
                "Time Updated",
                `${minutes > 0 ? "Added" : "Reduced"} ${Math.abs(minutes)} minutes`
            );
            setExtraTimeInput("0");
        }
    };

    // UI
    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={{ flex: 1, backgroundColor: "#F6FAFF" }}>
                {/* Header */}
                <View style={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 8 }}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
                    >
                        <ArrowLeft size={20} color="#267FFF" />
                        <Text style={{
                            fontSize: 15, color: "#267FFF", marginLeft: 7, fontWeight: "600"
                        }}>Back to Queue</Text>
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: 18, fontWeight: "700", color: "#183783", letterSpacing: 0.1, marginBottom: 2,
                    }}>Customer Details</Text>
                    <Text style={{
                        fontSize: 20, color: "#183783", fontWeight: "700", marginTop: 2,
                    }}>{customer.name}</Text>
                </View>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
                    {/* Contact Info Card */}
                    <View style={{
                        backgroundColor: "#fff",
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: "#E7EDF7",
                        paddingVertical: 15,
                        paddingHorizontal: 18,
                        marginBottom: 13,
                        shadowColor: "#E7EDF7",
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.05,
                        shadowRadius: 6,
                        elevation: 1,
                    }}>
                        <Text style={{
                            fontSize: 16, fontWeight: "700", color: "#183783", marginBottom: 10
                        }}>Contact Information</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                            <Phone size={17} color="#267FFF" style={{ marginRight: 8 }} />
                            <Text style={{ fontSize: 16, fontWeight: "600", color: "#267FFF" }}>
                                {customer.phone}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 0 }}>
                            <User size={17} color="#183783" style={{ marginRight: 8 }} />
                            <Text style={{ fontSize: 15, color: "#757DB1", fontWeight: "500", marginRight: 2 }}>Gender :</Text>
                            <Text style={{ fontSize: 15, color: "#183783", fontWeight: "700", marginLeft: 6 }}>{customer.gender || "Male"}</Text>
                        </View>
                    </View>
                    {/* Queue Info Card */}
                    <View style={{
                        backgroundColor: "#fff",
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: "#E7EDF7",
                        paddingVertical: 15,
                        paddingHorizontal: 18,
                        marginBottom: 13,
                    }}>
                        <Text style={{
                            fontSize: 16, fontWeight: "700", color: "#183783", marginBottom: 10
                        }}>Queue Information</Text>
                        <View style={{
                            backgroundColor: "#F6FAFF", borderRadius: 9,
                            marginBottom: 8, paddingVertical: 9, paddingHorizontal: 11, flexDirection: "row", justifyContent: "space-between",
                        }}>
                            <Text style={{ fontSize: 15, color: "#757DB1", fontWeight: "500" }}>Queue Position</Text>
                            <Text style={{ fontSize: 15, color: "#183783", fontWeight: "600" }}>{customer.position}</Text>
                        </View>
                        <View style={{
                            backgroundColor: "#F6FAFF", borderRadius: 9,
                            marginBottom: 8, paddingVertical: 9, paddingHorizontal: 11, flexDirection: "row", justifyContent: "space-between",
                        }}>
                            <Text style={{ fontSize: 15, color: "#757DB1", fontWeight: "500" }}>Join Time</Text>
                            <Text style={{ fontSize: 15, color: "#183783", fontWeight: "600" }}>{customer.joinTime}</Text>
                        </View>
                        <View style={{
                            backgroundColor: "#F6FAFF", borderRadius: 9,
                            paddingVertical: 9, paddingHorizontal: 11, flexDirection: "row", justifyContent: "space-between",
                        }}>
                            <Text style={{ fontSize: 15, color: "#757DB1", fontWeight: "500" }}>Estimated Wait</Text>
                            <Text style={{ fontSize: 15, color: "#267FFF", fontWeight: "700" }}>
                                {customer.estimatedWait} minutes
                            </Text>
                        </View>
                    </View>
                    {/* Service Info Card */}
                    <View style={{
                        backgroundColor: "#fff",
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: "#E7EDF7",
                        paddingVertical: 15,
                        paddingHorizontal: 18,
                        marginBottom: 13,
                    }}>
                        <Text style={{
                            fontSize: 16, fontWeight: "700", color: "#183783", marginBottom: 10
                        }}>Service Information</Text>
                        <View style={{
                            backgroundColor: "#F2F8FF",
                            borderRadius: 8,
                            padding: 10,
                        }}>
                            {customer.services && customer.services.length > 0 ? (
                                <>
                                    {customer.services.map((service, idx) => (
                                        <View key={idx} style={{
                                            flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 3,
                                        }}>
                                            <Text style={{ fontSize: 15, color: "#183783", fontWeight: "500" }}>{idx + 1}. {service.name}</Text>
                                            <Text style={{ fontSize: 15, color: "#183783", fontWeight: "700" }}>₹ {service.price}</Text>
                                        </View>
                                    ))}
                                    <View style={{
                                        borderBottomWidth: 1, borderBottomColor: "#D0DEFA", marginVertical: 10, marginHorizontal: -10,
                                    }} />
                                    <View style={{
                                        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                                    }}>
                                        <Text style={{ fontSize: 16, color: "#144FAA", fontWeight: "700" }}>Total Service Charges</Text>
                                        <Text style={{ fontSize: 16, color: "#144FAA", fontWeight: "700" }}>
                                            ₹ {customer.totalCharge || customer.services.reduce((sum, s) => sum + s.price, 0)}
                                        </Text>
                                    </View>
                                </>
                            ) : (
                                <Text style={{
                                    textAlign: "center", color: "#757DB1", fontSize: 14, fontStyle: "italic"
                                }}>No services requested</Text>
                            )}
                        </View>
                    </View>
                    {/* Add Extra Time Card */}
                    <View style={{
                        backgroundColor: "#fff",
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: "#E7EDF7",
                        paddingVertical: 15,
                        paddingHorizontal: 18,
                        marginBottom: 13,
                    }}>
                        <Text style={{
                            fontSize: 16, fontWeight: "700", color: "#183783", marginBottom: 10
                        }}>Add Extra Time</Text>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 9, gap: 6 }}>
                            {quickTimes.map(qt => (
                                <TouchableOpacity
                                    key={qt.label}
                                    onPress={() => setExtraTimeInput(qt.value.toString())}
                                    style={{
                                        backgroundColor: qt.value < 0 ? "#FEE2E2" : "#E6F0FF",
                                        borderRadius: 7,
                                        paddingHorizontal: 15,
                                        paddingVertical: 6,
                                        marginRight: 6,
                                        marginBottom: 6,
                                    }}
                                >
                                    <Text style={{
                                        color: qt.value < 0 ? "#EF4444" : "#267FFF",
                                        fontWeight: "600",
                                        fontSize: 15,
                                    }}>{qt.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                            <TextInput
                                value={extraTimeInput}
                                onChangeText={setExtraTimeInput}
                                placeholder="0"
                                placeholderTextColor="#7D8695"
                                keyboardType="numeric"
                                style={{
                                    width: 60,
                                    borderWidth: 1,
                                    borderColor: "#E7EDF7",
                                    backgroundColor: "#F6FAFF",
                                    borderRadius: 8,
                                    paddingHorizontal: 12,
                                    paddingVertical: 8,
                                    color: "#183783",
                                    fontSize: 15,
                                    textAlign: "center",
                                }}
                            />
                            <TouchableOpacity
                                onPress={handleAddTime}
                                style={{
                                    backgroundColor: "#E6E6E6",
                                    paddingHorizontal: 19,
                                    paddingVertical: 9,
                                    borderRadius: 7,
                                }}
                            >
                                <Text style={{
                                    color: "#667099", fontWeight: "700", fontSize: 15
                                }}>Add Minutes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Recent History Card */}
                    <View style={{
                        backgroundColor: "#fff",
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: "#E7EDF7",
                        paddingVertical: 15,
                        paddingHorizontal: 18,
                        marginBottom: 14,
                    }}>
                        <Text style={{
                            fontSize: 16, fontWeight: "700", color: "#183783", marginBottom: 10
                        }}>Recent History</Text>
                        <View style={{
                            backgroundColor: "#E6F0FF",
                            borderRadius: 7,
                            padding: 12,
                            alignItems: "center",
                        }}>
                            <Text style={{
                                fontSize: 14,
                                color: "#7584A3",
                                fontStyle: "italic",
                            }}>No recent activity found</Text>
                        </View>
                    </View>
                    {/* Action Buttons */}
                    <View style={{ flexDirection: "row", gap: 13 }}>
                        <TouchableOpacity
                            onPress={handleHold}
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#FEFCE8",
                                paddingVertical: 13,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: "#FFE588",
                                marginRight: 5,
                            }}
                        >
                            <Pause size={17} color="#F59E0B" style={{ marginRight: 7 }} />
                            <Text style={{ color: "#B45309", fontWeight: "600", fontSize: 15 }}>
                                {customer.isHeld ? "Unhold" : "Hold"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSkip}
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#EFF6FF",
                                paddingVertical: 13,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: "#BBCDFB",
                                marginRight: 5,
                            }}
                        >
                            <SkipForward size={17} color="#3B82F6" style={{ marginRight: 7 }} />
                            <Text style={{ color: "#267FFF", fontWeight: "600", fontSize: 15 }}>
                                Skip
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleRemove}
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#FEE2E2",
                                paddingVertical: 13,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: "#EF4444",
                            }}
                        >
                            <Trash2 size={17} color="#EF4444" style={{ marginRight: 7 }} />
                            <Text style={{ color: "#EF4444", fontWeight: "600", fontSize: 15 }}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

export default CustomerDetailsModal;