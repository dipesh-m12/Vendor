// components/AddCustomerModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import {
  UserPlus,
  ArrowLeft,
  Search,
  Phone,
  Mic,
  MicOff,
  X,
  User,
  Users,
} from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import useThemeStore from "@/store/themeStore";
import { translations } from "@/translations/tabsTranslations/cusotmerAddModaltranslations";

interface Customer {
  id: string;
  name: string;
  phone: string;
  service?: string;
  gender?: string;
  lastService?: string;
  waitTime?: number;
  notes?: string;
}

interface AddCustomerModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddCustomerModal({
  visible,
  onClose,
}: AddCustomerModalProps) {
  const { isDark, language } = useThemeStore();
  const languageSet = translations[language];

  // Modal state
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [showExistingCustomerForm, setShowExistingCustomerForm] =
    useState(false);

  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    phone: "",
    name: "",
    service: "",
    gender: "",
    waitTime: 15,
    notes: "",
  });

  // Existing customer search state
  const [searchPhone, setSearchPhone] = useState("");
  const [searchResults, setSearchResults] = useState<Customer[]>([]);

  // Form validation
  const [formErrors, setFormErrors] = useState({
    phone: "",
    service: "",
  });

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");

  // Sample services - replace with your actual services
  const services = [
    "Haircut",
    "Beard Trim",
    "Manicure",
    "Pedicure",
    "Facial",
    "Hair Wash",
    "Styling",
  ];

  // Sample existing customers - replace with your actual data source
  const existingCustomers: Customer[] = [
    {
      id: "1",
      name: "John Doe",
      phone: "1234567890",
      lastService: "Haircut",
      gender: "Male",
    },
    {
      id: "2",
      name: "Jane Smith",
      phone: "9876543210",
      lastService: "Facial",
      gender: "Female",
    },
  ];

  const resetModal = () => {
    setShowNewCustomerForm(false);
    setShowExistingCustomerForm(false);
    setNewCustomer({
      phone: "",
      name: "",
      service: "",
      gender: "",
      waitTime: 15,
      notes: "",
    });
    setSearchPhone("");
    setSearchResults([]);
    setFormErrors({ phone: "", service: "" });
    setTranscription("");
    setIsRecording(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleNewCustomerClick = () => {
    setShowNewCustomerForm(true);
    setShowExistingCustomerForm(false);
  };

  const handleExistingCustomerClick = () => {
    setShowExistingCustomerForm(true);
    setShowNewCustomerForm(false);
  };

  const handlePhoneChange = (phone: string) => {
    setNewCustomer({ ...newCustomer, phone });
    if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" });
  };

  const handleSearchPhoneChange = (phone: string) => {
    setSearchPhone(phone);
    if (phone.length >= 3) {
      const results = existingCustomers.filter((customer) =>
        customer.phone.includes(phone)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const validateForm = () => {
    const errors = { phone: "", service: "" };
    let isValid = true;

    if (!newCustomer.phone || newCustomer.phone.length < 10) {
      errors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    if (!newCustomer.service) {
      errors.service = "Please select a service";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddNewCustomer = () => {
    if (validateForm()) {
      // Add customer logic here
      console.log("Adding new customer:", newCustomer);
      Alert.alert("Success", "Customer added to queue!");
      handleClose();
    }
  };

  const handleSelectExistingCustomer = (customer: Customer) => {
    setNewCustomer({
      phone: customer.phone,
      name: customer.name,
      service: customer.lastService || "",
      gender: customer.gender || "",
      waitTime: 15,
      notes: "",
    });
    setShowExistingCustomerForm(false);
    setShowNewCustomerForm(true);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Stop recording logic here
      setTranscription("Sample transcription");
      setNewCustomer({ ...newCustomer, name: "Sample transcription" });
    } else {
      setIsRecording(true);
      setTranscription("");
      // Start recording logic here
    }
  };

  const getGenderIcon = (gender?: string) => {
    if (gender === "Female") return <User size={16} color="#EC4899" />;
    if (gender === "Male") return <User size={16} color="#3B82F6" />;
    return <Users size={16} color="#6B7280" />;
  };

  const containerBg = isDark ? "#1F2937" : "#FFFFFF";
  const overlayBg = isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)";
  const cardBg = isDark ? "#374151" : "#FFFFFF";
  const borderColor = isDark ? "#4B5563" : "#E5E7EB";
  const textPrimary = isDark ? "#F9FAFB" : "#111827";
  const textSecondary = isDark ? "#D1D5DB" : "#6B7280";
  const inputBg = isDark ? "#374151" : "#FFFFFF";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: overlayBg,
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: containerBg,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: "90%",
            minHeight: "80%",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: borderColor,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: textPrimary,
              }}
            >
              {languageSet.addCustomer}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <X size={24} color={textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
          >
            {!showNewCustomerForm && !showExistingCustomerForm ? (
              <View style={{ gap: 16 }}>
                <Text style={{ color: "#3B82F6", marginBottom: 16 }}>
                  {languageSet.chooseHowToAdd}
                </Text>

                {/* New Customer Card */}
                <TouchableOpacity
                  onPress={handleNewCustomerClick}
                  style={{
                    backgroundColor: cardBg,
                    borderWidth: 1,
                    borderColor: isDark ? "#3B82F6" : "#DBEAFE",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: isDark ? "#1E40AF" : "#DBEAFE",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 16,
                      }}
                    >
                      <UserPlus size={24} color="#3B82F6" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: textPrimary,
                          marginBottom: 4,
                        }}
                      >
                        {languageSet.newCustomer}
                      </Text>
                      <Text style={{ color: textSecondary, fontSize: 14 }}>
                        {languageSet.newCustomerDescription}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Existing Customer Card */}
                <TouchableOpacity
                  onPress={handleExistingCustomerClick}
                  style={{
                    backgroundColor: cardBg,
                    borderWidth: 1,
                    borderColor: isDark ? "#3B82F6" : "#DBEAFE",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: isDark ? "#1E40AF" : "#DBEAFE",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 16,
                      }}
                    >
                      <UserPlus size={24} color="#3B82F6" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: textPrimary,
                          marginBottom: 4,
                        }}
                      >
                        {languageSet.repeatCustomer}
                      </Text>
                      <Text style={{ color: textSecondary, fontSize: 14 }}>
                        {languageSet.repeatCustomerDescription}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ) : showNewCustomerForm ? (
              <View style={{ gap: 16 }}>
                <TouchableOpacity
                  onPress={() => setShowNewCustomerForm(false)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <ArrowLeft size={16} color="#3B82F6" />
                  <Text
                    style={{
                      color: "#3B82F6",
                      marginLeft: 4,
                      fontWeight: "500",
                    }}
                  >
                    {languageSet.backToOptions}
                  </Text>
                </TouchableOpacity>

                {/* Phone Number Field */}
                <View>
                  <Text
                    style={{
                      color: textPrimary,
                      fontWeight: "500",
                      marginBottom: 8,
                    }}
                  >
                    {languageSet.phoneNumberRequired}
                  </Text>
                  <TextInput
                    value={newCustomer.phone}
                    onChangeText={handlePhoneChange}
                    placeholder={languageSet.phoneNumber}
                    placeholderTextColor={textSecondary}
                    keyboardType="phone-pad"
                    style={{
                      backgroundColor: inputBg,
                      borderWidth: 1,
                      borderColor: formErrors.phone ? "#EF4444" : borderColor,
                      borderRadius: 8,
                      padding: 12,
                      color: textPrimary,
                    }}
                  />
                  {formErrors.phone ? (
                    <Text
                      style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}
                    >
                      {formErrors.phone}
                    </Text>
                  ) : null}
                </View>

                {/* Name Field with Voice */}
                <View>
                  <Text
                    style={{
                      color: textPrimary,
                      fontWeight: "500",
                      marginBottom: 8,
                    }}
                  >
                    {languageSet.name}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <TextInput
                      value={newCustomer.name}
                      onChangeText={(name) =>
                        setNewCustomer({ ...newCustomer, name })
                      }
                      placeholder={languageSet.name}
                      placeholderTextColor={textSecondary}
                      style={{
                        flex: 1,
                        backgroundColor: inputBg,
                        borderWidth: 1,
                        borderColor: borderColor,
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                        borderRightWidth: 0,
                        padding: 12,
                        color: textPrimary,
                      }}
                    />
                    <TouchableOpacity
                      onPress={toggleRecording}
                      style={{
                        backgroundColor: isRecording ? "#EF4444" : "#6B7280",
                        paddingHorizontal: 12,
                        justifyContent: "center",
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                      }}
                    >
                      {isRecording ? (
                        <MicOff size={20} color="white" />
                      ) : (
                        <Mic size={20} color="white" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {transcription ? (
                    <Text
                      style={{
                        color: "#3B82F6",
                        fontSize: 12,
                        marginTop: 4,
                        fontStyle: "italic",
                      }}
                    >
                      {isRecording
                        ? "Listening..."
                        : `Heard: "${transcription}"`}
                    </Text>
                  ) : null}
                </View>

                {/* Service Field */}
                <View>
                  <Text
                    style={{
                      color: textPrimary,
                      fontWeight: "500",
                      marginBottom: 8,
                    }}
                  >
                    {languageSet.serviceRequired}
                  </Text>
                  <View
                    style={{
                      backgroundColor: inputBg,
                      borderWidth: 1,
                      borderColor: formErrors.service ? "#EF4444" : borderColor,
                      borderRadius: 8,
                    }}
                  >
                    <Picker
                      selectedValue={newCustomer.service}
                      onValueChange={(service) =>
                        setNewCustomer({ ...newCustomer, service })
                      }
                      style={{ color: textPrimary }}
                    >
                      <Picker.Item label={languageSet.service} value="" />
                      {services.map((service) => (
                        <Picker.Item
                          key={service}
                          label={service}
                          value={service}
                        />
                      ))}
                    </Picker>
                  </View>
                  {formErrors.service ? (
                    <Text
                      style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}
                    >
                      {formErrors.service}
                    </Text>
                  ) : null}
                </View>

                {/* Gender Field */}
                <View>
                  <Text
                    style={{
                      color: textPrimary,
                      fontWeight: "500",
                      marginBottom: 8,
                    }}
                  >
                    {languageSet.gender}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 16 }}>
                    {["Male", "Female", "Child"].map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        onPress={() =>
                          setNewCustomer({ ...newCustomer, gender })
                        }
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <View
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 8,
                            borderWidth: 2,
                            borderColor: "#3B82F6",
                            backgroundColor:
                              newCustomer.gender === gender
                                ? "#3B82F6"
                                : "transparent",
                          }}
                        />
                        <Text style={{ color: textPrimary }}>{gender}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Wait Time Field */}
                <View>
                  <Text
                    style={{
                      color: textPrimary,
                      fontWeight: "500",
                      marginBottom: 8,
                    }}
                  >
                    {languageSet.estimatedWait}
                  </Text>
                  <TextInput
                    value={newCustomer.waitTime.toString()}
                    onChangeText={(value) =>
                      setNewCustomer({
                        ...newCustomer,
                        waitTime: Number(value) || 15,
                      })
                    }
                    placeholder="15"
                    placeholderTextColor={textSecondary}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: inputBg,
                      borderWidth: 1,
                      borderColor: borderColor,
                      borderRadius: 8,
                      padding: 12,
                      color: textPrimary,
                    }}
                  />
                </View>

                {/* Notes Field */}
                <View>
                  <Text
                    style={{
                      color: textPrimary,
                      fontWeight: "500",
                      marginBottom: 8,
                    }}
                  >
                    {languageSet.notes}
                  </Text>
                  <TextInput
                    value={newCustomer.notes}
                    onChangeText={(notes) =>
                      setNewCustomer({ ...newCustomer, notes })
                    }
                    placeholder={languageSet.notes}
                    placeholderTextColor={textSecondary}
                    multiline
                    numberOfLines={3}
                    style={{
                      backgroundColor: inputBg,
                      borderWidth: 1,
                      borderColor: borderColor,
                      borderRadius: 8,
                      padding: 12,
                      color: textPrimary,
                      minHeight: 80,
                      textAlignVertical: "top",
                    }}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleAddNewCustomer}
                  style={{
                    backgroundColor: "#3B82F6",
                    borderRadius: 8,
                    paddingVertical: 16,
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: 16,
                    }}
                  >
                    {languageSet.addToQueue}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ gap: 16 }}>
                <TouchableOpacity
                  onPress={() => setShowExistingCustomerForm(false)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <ArrowLeft size={16} color="#3B82F6" />
                  <Text
                    style={{
                      color: "#3B82F6",
                      marginLeft: 4,
                      fontWeight: "500",
                    }}
                  >
                    {languageSet.backToOptions}
                  </Text>
                </TouchableOpacity>

                {/* Search Field */}
                <View>
                  <Text
                    style={{
                      color: textPrimary,
                      fontWeight: "500",
                      marginBottom: 8,
                    }}
                  >
                    {languageSet.searchByPhone}
                  </Text>
                  <View style={{ position: "relative" }}>
                    <TextInput
                      value={searchPhone}
                      onChangeText={handleSearchPhoneChange}
                      placeholder={languageSet.searchByPhone}
                      placeholderTextColor={textSecondary}
                      keyboardType="phone-pad"
                      style={{
                        backgroundColor: inputBg,
                        borderWidth: 1,
                        borderColor: borderColor,
                        borderRadius: 8,
                        padding: 12,
                        paddingLeft: 40,
                        color: textPrimary,
                      }}
                    />
                    <Search
                      size={18}
                      color="#3B82F6"
                      style={{
                        position: "absolute",
                        left: 12,
                        top: 13,
                      }}
                    />
                  </View>
                </View>

                {/* Search Results */}
                {searchResults.length > 0 ? (
                  <View
                    style={{
                      backgroundColor: isDark ? "#374151" : "#EFF6FF",
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: "#3B82F6",
                        fontSize: 14,
                        fontWeight: "500",
                        marginBottom: 8,
                      }}
                    >
                      {languageSet.foundMatchingCustomers.replace(
                        "{count}",
                        searchResults.length.toString()
                      )}
                    </Text>
                    <ScrollView style={{ maxHeight: 300 }}>
                      {searchResults.map((customer) => (
                        <TouchableOpacity
                          key={customer.id}
                          onPress={() => handleSelectExistingCustomer(customer)}
                          style={{
                            backgroundColor: cardBg,
                            borderRadius: 8,
                            padding: 12,
                            marginBottom: 8,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 16,
                              backgroundColor: isDark ? "#1E40AF" : "#DBEAFE",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: 12,
                            }}
                          >
                            {getGenderIcon(customer.gender)}
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                fontWeight: "500",
                                color: textPrimary,
                                marginBottom: 2,
                              }}
                            >
                              {customer.name}
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Phone size={12} color="#3B82F6" />
                              <Text
                                style={{
                                  color: textSecondary,
                                  fontSize: 12,
                                  marginLeft: 4,
                                }}
                              >
                                {customer.phone} • {customer.lastService}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ) : searchPhone.length >= 3 ? (
                  <View
                    style={{
                      backgroundColor: isDark ? "#374151" : "#EFF6FF",
                      borderRadius: 8,
                      padding: 16,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: textSecondary, marginBottom: 8 }}>
                      {languageSet.noCustomersFound}
                    </Text>
                    <TouchableOpacity onPress={handleNewCustomerClick}>
                      <Text
                        style={{
                          color: "#3B82F6",
                          textDecorationLine: "underline",
                        }}
                      >
                        {languageSet.addAsNewCustomer}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
