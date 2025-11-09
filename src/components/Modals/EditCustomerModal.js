import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  useColorModeValue,
  Text,
  Box,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Avatar,
} from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
import { getPlans } from "services/planService";

const normalizeCurrencyValue = (value) => {
  if (value === undefined || value === null || value === "") return "";

  const numeric = Number.parseFloat(value.toString().replace(/[^0-9.]/g, ""));
  if (Number.isNaN(numeric)) return "";

  return Number.isInteger(numeric) ? `${numeric}` : numeric.toString();
};

const EditCustomerModal = ({ isOpen, onClose, customer, onSave }) => {
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (customer) {
      setFormData({
        picture: customer.picture || "",
        memberName: customer.memberName || "",
        mobileNo: customer.mobileNo || "",
        email: customer.email || "",
        address: customer.address || "",
        registrationDate: customer.registrationDate || new Date().toISOString().split('T')[0],
        membershipStatus: customer.membershipStatus || "Active",
        memberType: customer.memberType || "New",
        trainerRequired: customer.trainerRequired || "No",
        trainerName: customer.trainerName || "",
        customerPlan: customer.customerPlan || "",
        plan_id: customer.planId ? String(customer.planId) : "", // Convert to string for select
        customerWeight: (customer.customerWeight || "").replace(" kg", ""),
        customerAge: customer.customerAge || "",
        monthlyFee: normalizeCurrencyValue(customer.monthlyFee),
        registrationFee: normalizeCurrencyValue(customer.registrationFee),
        feePaidDate: customer.feePaidDate || new Date().toISOString().split('T')[0],
        nextDueDate: customer.nextDueDate || "",
      });
      setSelectedFile(null);
    }
  }, [customer]);

  const [plans, setPlans] = useState([]);
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const paginator = await getPlans({ is_active: true, per_page: 100 });
        setPlans(paginator?.data || []);
      } catch (_) {}
    })();
  }, [isOpen]);

  const labelColor = useColorModeValue("gray.600", "gray.300");
  const textColor = useColorModeValue("gray.700", "white");

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-update monthly fee and registration fee based on selected plan
      if (field === 'customerPlan') {
        const selectedPlan = plans.find(p => p.name === value);
        if (selectedPlan) {
          updated.monthlyFee = selectedPlan.monthly_fee;
          updated.registrationFee = selectedPlan.registration_fee;
          updated.plan_id = selectedPlan.id;
        } else {
          // Reset if no plan selected or custom
          updated.monthlyFee = "";
          updated.registrationFee = "";
          updated.plan_id = null;
        }
      }
      
      return updated;
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, picture: e.target.result }));
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const submit = () => {
    // Validate trainer name is required when trainer is required
    if (formData.trainerRequired === "Yes" && (!formData.trainerName || formData.trainerName.trim() === "")) {
      // You can add toast notification here if needed
      console.error("Trainer name is required when trainer is required");
      return;
    }
    
    if (onSave) {
      onSave(formData, selectedFile);
    }
  };

  const statuses = ["Active", "Inactive"];
  const trainerOptions = ["Yes", "No"];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(10px)" bg="rgba(0, 0, 0, 0.3)" />
      <ModalContent borderRadius="20px">
        <ModalHeader color={textColor} fontSize="2xl" fontWeight="bold" textAlign="center" pb="4">
          Edit Customer
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} maxH="70vh" overflowY="auto">
          <VStack spacing={6} align="stretch">
            <Box>
              <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={4}>
                Avatar
              </Text>
              <VStack spacing={4} align="center">
                <Avatar
                  size="xl"
                  src={formData.picture || undefined}
                  name={formData.memberName || "Customer"}
                  border="4px solid"
                  borderColor="brand.300"
                />
                <Button
                  leftIcon={<AttachmentIcon />}
                  variant="outline"
                  colorScheme="teal"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Avatar
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />
              </VStack>
            </Box>

            <Divider borderColor="gray.200" />

            <VStack spacing={4}>
              <HStack spacing={4} w="100%">
                <FormControl isRequired flex="2">
                  <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">Full Name</FormLabel>
                  <Input value={formData.memberName} onChange={(e) => handleInputChange("memberName", e.target.value)} />
                </FormControl>
                <FormControl isRequired flex="1">
                  <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">Age</FormLabel>
                  <NumberInput value={formData.customerAge} onChange={(v) => handleInputChange("customerAge", v)} min={1} max={120}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </HStack>

              <HStack spacing={4} w="100%">
                <FormControl isRequired flex="1">
                  <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">Mobile Number</FormLabel>
                  <Input value={formData.mobileNo} onChange={(e) => handleInputChange("mobileNo", e.target.value)} />
                </FormControl>
                <FormControl isRequired flex="2">
                  <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">Email Address</FormLabel>
                  <Input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">Address</FormLabel>
                <Input value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} />
              </FormControl>

              <HStack spacing={4} w="100%">
                <FormControl isRequired flex="1">
                  <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">Member Type</FormLabel>
                  <Select value={formData.memberType} onChange={(e) => handleInputChange("memberType", e.target.value)}>
                    <option value="New">New Member</option>
                    <option value="Old">Old Member</option>
                  </Select>
                </FormControl>
                <FormControl isRequired flex="1">
                  <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">Membership Status</FormLabel>
                  <Select value={formData.membershipStatus} onChange={(e) => handleInputChange("membershipStatus", e.target.value)}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </FormControl>
              </HStack>

              <HStack spacing={4} w="100%">
                <FormControl isRequired flex="1">
                  <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">Customer Plan</FormLabel>
                  <Select value={formData.plan_id || ''} onChange={(e) => {
                    const planId = e.target.value;
                    const selected = plans.find(p => String(p.id) === String(planId));
                    if (selected) {
                      setFormData(prev => ({
                        ...prev,
                        plan_id: planId,
                        customerPlan: selected.name,
                        monthlyFee: normalizeCurrencyValue(selected.monthly_fee),
                        registrationFee: normalizeCurrencyValue(selected.registration_fee),
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        plan_id: '',
                        customerPlan: '',
                        monthlyFee: '',
                        registrationFee: '',
                      }));
                    }
                  }}>
                    <option value="">Select plan</option>
                    {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </Select>
                </FormControl>
                <FormControl isRequired flex="1">
                  <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">Trainer Required</FormLabel>
                  <Select value={formData.trainerRequired} onChange={(e) => handleInputChange("trainerRequired", e.target.value)}>
                    {trainerOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </Select>
                </FormControl>
              </HStack>

              {/* Trainer Name Field - Only show when trainer is required */}
              {formData.trainerRequired === "Yes" && (
                <FormControl isRequired>
                  <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">Trainer Name</FormLabel>
                  <Input
                    value={formData.trainerName}
                    onChange={(e) => handleInputChange("trainerName", e.target.value)}
                    placeholder="Enter trainer name"
                  />
                </FormControl>
              )}

              <HStack spacing={4} w="100%">
                <FormControl isRequired flex="1">
                  <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">Weight (kg)</FormLabel>
                  <NumberInput value={formData.customerWeight} onChange={(v) => handleInputChange("customerWeight", v)} min={1} max={300} precision={1}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl flex="1">
                  <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">Monthly Fee (₨)</FormLabel>
                  <NumberInput value={formData.monthlyFee} onChange={(value) => handleInputChange("monthlyFee", value)} min={0} precision={0}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </HStack>

              <HStack spacing={4} w="100%">
                <FormControl flex="1">
                  <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">Registration Fee (₨)</FormLabel>
                  <NumberInput value={formData.registrationFee} onChange={(value) => handleInputChange("registrationFee", value)} min={0} precision={0}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl flex="1">
                  <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">Fee Paid Date</FormLabel>
                  <Input type="date" value={formData.feePaidDate} onChange={(e) => handleInputChange("feePaidDate", e.target.value)} />
                </FormControl>
              </HStack>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter pt={0} pb={6} px={6} justifyContent="center" gap={4}>
          <Button onClick={onClose} variant="outline" colorScheme="gray" borderRadius="12px" px={8} py={3} fontSize="md" fontWeight="medium">Cancel</Button>
          <Button onClick={submit} borderRadius="12px" px={8} py={3} fontSize="md" fontWeight="medium" bg="brand.500" color="white" _hover={{ bg: "brand.400" }}>Save Changes</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCustomerModal;


