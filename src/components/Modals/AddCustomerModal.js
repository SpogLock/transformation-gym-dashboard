import React, { useState, useRef } from "react";
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
  Image,
  IconButton,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Flex,
  Badge,
  Avatar,
} from "@chakra-ui/react";
import { AttachmentIcon, AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { getPlans } from "services/planService";
import { uploadCustomerProfilePicture } from "services/customerService";

const AddCustomerModal = ({ isOpen, onClose, onAddCustomer }) => {
  const [formData, setFormData] = useState({
    picture: "",
    memberName: "",
    mobileNo: "",
    email: "",
    address: "",
    registrationDate: new Date().toISOString().split('T')[0],
    membershipStatus: "Active",
    memberType: "New",
    trainerRequired: "No",
    trainerName: "",
    customerPlan: "",
    plan_id: null,
    customerWeight: "",
    customerAge: "",
    monthlyFee: "",
    registrationFee: "",
    feePaidDate: new Date().toISOString().split('T')[0],
    nextDueDate: (() => {
      const paidDate = new Date();
      const nextDue = new Date(paidDate);
      nextDue.setMonth(nextDue.getMonth() + 1);
      return nextDue.toISOString().split('T')[0];
    })(),
  });

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const toast = useToast();
  const [plans, setPlans] = useState([]);
  React.useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const paginator = await getPlans({ is_active: true, per_page: 100 });
        setPlans(paginator?.data || []);
      } catch (e) {
        // silent fail
      }
    })();
  }, [isOpen]);

  // Glassy background styling
  const modalBg = useColorModeValue(
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.8) 110.84%)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );
  const modalBorder = useColorModeValue(
    "1.5px solid #FFFFFF",
    "1.5px solid rgba(255, 255, 255, 0.31)"
  );
  const modalShadow = useColorModeValue(
    "0px 7px 23px rgba(0, 0, 0, 0.05)",
    "none"
  );
  const textColor = useColorModeValue("gray.700", "white");
  const labelColor = useColorModeValue("gray.600", "gray.300");

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate next due date when fee paid date changes
      if (field === 'feePaidDate' && value) {
        const paidDate = new Date(value);
        const nextDue = new Date(paidDate);
        nextDue.setMonth(nextDue.getMonth() + 1);
        updated.nextDueDate = nextDue.toISOString().split('T')[0];
      }
      
      // Remove old auto-calculation logic - now handled by plan selection
      
      return updated;
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          picture: e.target.result,
          _selectedFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 400 },
          height: { ideal: 400 },
          facingMode: 'user'
        } 
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to take a photo",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/png');
      setFormData(prev => ({
        ...prev,
        picture: imageData
      }));
      
      stopCamera();
      toast({
        title: "Photo captured!",
        description: "Customer photo has been taken successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async () => {
    // Debug: Log form data before submission
    console.log('📝 Form data before submission:', formData);
    
    // Validate trainer name is required when trainer is required
    if (formData.trainerRequired === "Yes" && (!formData.trainerName || formData.trainerName.trim() === "")) {
      toast({
        title: "Validation Error",
        description: "Trainer name is required when trainer is required.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    
    // Generate a new ID for the customer and calculate next due date if not set
    const newCustomer = {
      ...formData,
      id: Date.now(), // Simple ID generation
      monthlyFee: formData.monthlyFee || "₨0",
      registrationFee: formData.registrationFee || "₨0",
      nextDueDate: formData.nextDueDate || (() => {
        const paidDate = new Date(formData.feePaidDate);
        const nextDue = new Date(paidDate);
        nextDue.setMonth(nextDue.getMonth() + 1);
        return nextDue.toISOString().split('T')[0];
      })(),
    };
    
    // Debug: Log the customer data being passed
    console.log('📤 Customer data being passed to parent:', newCustomer);
    try {
      await onAddCustomer(newCustomer);
      // Image upload will be handled after server returns the real ID via the list reload.
      // If needed later, we can enhance this to pass back the created ID and call uploadCustomerProfilePicture.
    } catch (e) {
      // no-op; parent toasts errors
    }
    
    // Reset form
    setFormData({
      picture: "",
      memberName: "",
      mobileNo: "",
      email: "",
      address: "",
      registrationDate: new Date().toISOString().split('T')[0],
      membershipStatus: "Active",
      memberType: "New",
      trainerRequired: "No",
      trainerName: "",
      customerPlan: "",
      plan_id: null,
      customerWeight: "",
      customerAge: "",
      monthlyFee: "",
      registrationFee: "",
      feePaidDate: new Date().toISOString().split('T')[0],
      nextDueDate: (() => {
        const paidDate = new Date();
        const nextDue = new Date(paidDate);
        nextDue.setMonth(nextDue.getMonth() + 1);
        return nextDue.toISOString().split('T')[0];
      })(),
    });
    
    onClose();
    
    toast({
      title: "Customer added!",
      description: "New customer has been added successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Removed static plans; using dynamic plans from API
  const statuses = ["Active", "Inactive"];
  const trainerOptions = ["Yes", "No"];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(10px)" bg="rgba(0, 0, 0, 0.3)" />
      <ModalContent
        bg={modalBg}
        border={modalBorder}
        boxShadow={modalShadow}
        backdropFilter="blur(21px)"
        borderRadius="20px"
        borderWidth="1.5px"
        borderStyle="solid"
        maxW="800px"
        mx="20px"
      >
        <ModalHeader
          color={textColor}
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          pb="4"
        >
          Add New Customer
        </ModalHeader>
        <ModalCloseButton color={textColor} onClick={stopCamera} />
        
        <ModalBody pb={6} maxH="70vh" overflowY="auto">
          <VStack spacing={6} align="stretch">
            {/* Profile Picture Section */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={4}>
                Profile Picture
              </Text>
              <VStack spacing={4} align="center">
                <Avatar
                  size="xl"
                  src={formData.picture || undefined}
                  name={formData.memberName || "Customer"}
                  border="4px solid"
                  borderColor="brand.300"
                />
                
                <HStack spacing={3}>
                  <Button
                    leftIcon={<AttachmentIcon />}
                    variant="outline"
                    colorScheme="teal"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Avatar
                  </Button>
                  <Button
                    leftIcon={<AddIcon />}
                    variant="outline"
                    colorScheme="blue"
                    size="sm"
                    onClick={startCamera}
                  >
                    Take Photo
                  </Button>
                </HStack>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </VStack>
            </Box>

            {/* Camera Modal */}
            {isCameraOpen && (
              <Box
                position="fixed"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="rgba(0, 0, 0, 0.8)"
                zIndex={9999}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={4}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: '300px',
                    height: '300px',
                    borderRadius: '12px',
                    objectFit: 'cover'
                  }}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                
                <HStack spacing={4}>
                  <Button
                    colorScheme="green"
                    onClick={capturePhoto}
                    leftIcon={<AddIcon />}
                  >
                    Capture Photo
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={stopCamera}
                    leftIcon={<DeleteIcon />}
                  >
                    Cancel
                  </Button>
                </HStack>
              </Box>
            )}

            <Divider borderColor="gray.200" />

            {/* Personal Information */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={4}>
                Personal Information
              </Text>
              
              <VStack spacing={4}>
                <HStack spacing={4} w="100%">
                  <FormControl isRequired flex="2">
                    <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
                      Full Name
                    </FormLabel>
                    <Input
                      value={formData.memberName}
                      onChange={(e) => handleInputChange("memberName", e.target.value)}
                      placeholder="Enter full name"
                      borderRadius="12px"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
                      }}
                    />
                  </FormControl>
                  
                  <FormControl isRequired flex="1">
                    <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
                      Age
                    </FormLabel>
                    <NumberInput
                      value={formData.customerAge}
                      onChange={(value) => handleInputChange("customerAge", value)}
                      min={1}
                      max={120}
                    >
                      <NumberInputField
                        placeholder="Age"
                        borderRadius="12px"
                        border="1px solid"
                        borderColor="gray.200"
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
                        }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </HStack>

                <HStack spacing={4} w="100%">
                  <FormControl isRequired flex="1">
                    <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
                      Mobile Number
                    </FormLabel>
                    <Input
                      value={formData.mobileNo}
                      onChange={(e) => handleInputChange("mobileNo", e.target.value)}
                      placeholder="+92 XXX XXXXXXX"
                      borderRadius="12px"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
                      }}
                    />
                  </FormControl>
                  
                  <FormControl isRequired flex="2">
                    <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
                      Email Address
                    </FormLabel>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter email address"
                      borderRadius="12px"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
                      }}
                    />
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
                    Address
                  </FormLabel>
                  <Textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter complete address"
                    rows={2}
                    borderRadius="12px"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{
                      borderColor: "brand.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
                    }}
                  />
                </FormControl>
              </VStack>
            </Box>

            <Divider borderColor="gray.200" />

            {/* Membership & Plan Information */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={4}>
                Membership & Plan Information
              </Text>
              
              <VStack spacing={4}>
                <HStack spacing={4} w="100%">
                  <FormControl isRequired flex="1">
                    <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
                      Registration Date
                    </FormLabel>
                    <Input
                      type="date"
                      value={formData.registrationDate}
                      onChange={(e) => handleInputChange("registrationDate", e.target.value)}
                      borderRadius="12px"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
                      }}
                    />
                  </FormControl>
                  
                  <FormControl isRequired flex="1">
                    <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
                      Member Type
                    </FormLabel>
                    <Select
                      value={formData.memberType}
                      onChange={(e) => handleInputChange("memberType", e.target.value)}
                      borderRadius="12px"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
                      }}
                    >
                      <option value="New">New Member</option>
                      <option value="Old">Old Member</option>
                    </Select>
                  </FormControl>
                </HStack>
                
                <FormControl isRequired>
                  <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
                    Membership Status
                  </FormLabel>
                  <Select
                    value={formData.membershipStatus}
                    onChange={(e) => handleInputChange("membershipStatus", e.target.value)}
                    borderRadius="12px"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{
                      borderColor: "brand.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
                    }}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </Select>
                </FormControl>

                <HStack spacing={4} w="100%">
                  <FormControl isRequired flex="1">
                    <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
                      Customer Plan
                    </FormLabel>
                    <Select
                      value={formData.plan_id || ''}
                      onChange={(e) => {
                        const planId = e.target.value;
                        const selected = plans.find(p => String(p.id) === String(planId));
                        if (selected) {
                          setFormData(prev => ({
                            ...prev,
                            plan_id: planId,
                            customerPlan: selected.name,
                            monthlyFee: `₨${Number(selected.monthly_fee).toLocaleString()}`,
                            registrationFee: `₨${Number(selected.registration_fee).toLocaleString()}`,
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
                      }}
                      borderRadius="12px"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
                      }}
                    >
                      <option value="">Select plan</option>
                      {plans.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl isRequired flex="1">
                    <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
                      Trainer Required
                    </FormLabel>
                    <Select
                      value={formData.trainerRequired}
                      onChange={(e) => handleInputChange("trainerRequired", e.target.value)}
                      borderRadius="12px"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
                      }}
                    >
                      {trainerOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  </FormControl>
                </HStack>

                {/* Trainer Name Field - Only show when trainer is required */}
                {formData.trainerRequired === "Yes" && (
                  <FormControl isRequired>
                    <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
                      Trainer Name
                    </FormLabel>
                    <Input
                      value={formData.trainerName}
                      onChange={(e) => handleInputChange("trainerName", e.target.value)}
                      placeholder="Enter trainer name"
                      borderRadius="12px"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
                      }}
                    />
                  </FormControl>
                )}

                <HStack spacing={4} w="100%">
                  <FormControl isRequired flex="1">
                    <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
                      Weight (kg)
                    </FormLabel>
                    <NumberInput
                      value={formData.customerWeight}
                      onChange={(value) => handleInputChange("customerWeight", value)}
                      min={1}
                      max={300}
                      precision={1}
                    >
                      <NumberInputField
                        placeholder="Enter weight in kg"
                        borderRadius="12px"
                        border="1px solid"
                        borderColor="gray.200"
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
                        }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl flex="1">
                    <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
                      Monthly Fee (₨)
                    </FormLabel>
                    <NumberInput
                      value={formData.monthlyFee ? formData.monthlyFee.replace(/[^0-9]/g, '') : ''}
                      onChange={(value) => handleInputChange("monthlyFee", value ? `₨${Number(value).toLocaleString()}` : '')}
                      min={0}
                      precision={0}
                    >
                      <NumberInputField
                        placeholder="Enter monthly fee"
                        borderRadius="12px"
                        border="1px solid"
                        borderColor="gray.200"
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
                        }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Auto-filled based on selected plan, but can be manually adjusted
                    </Text>
                  </FormControl>
                </HStack>
              </VStack>
            </Box>

            <Divider borderColor="gray.200" />

            {/* Fee Payment Information */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={4}>
                Fee Payment Information
              </Text>
              
              <VStack spacing={4}>
                <HStack spacing={4} w="100%">
                  <FormControl isRequired flex="1">
                    <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
                      Registration Fee (₨)
                    </FormLabel>
                    <NumberInput
                      value={formData.registrationFee ? formData.registrationFee.replace(/[^0-9]/g, '') : ''}
                      onChange={(value) => handleInputChange("registrationFee", value ? `₨${Number(value).toLocaleString()}` : '')}
                      min={0}
                      precision={0}
                    >
                      <NumberInputField
                        placeholder="Enter registration fee"
                        borderRadius="12px"
                        border="1px solid"
                        borderColor="gray.200"
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
                        }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Auto-filled based on selected plan, but can be manually adjusted
                    </Text>
                  </FormControl>
                  
                  <FormControl isRequired flex="1">
                    <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
                      Fee Paid Date
                    </FormLabel>
                    <Input
                      type="date"
                      value={formData.feePaidDate}
                      onChange={(e) => handleInputChange("feePaidDate", e.target.value)}
                      borderRadius="12px"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
                      }}
                    />
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel color={labelColor} fontSize="sm" fontWeight="medium">
                    Next Due Date
                  </FormLabel>
                  <Input
                    type="date"
                    value={formData.nextDueDate}
                    onChange={(e) => handleInputChange("nextDueDate", e.target.value)}
                    borderRadius="12px"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{
                      borderColor: "brand.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-teal-500)",
                    }}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Auto-filled from fee paid date. Adjust if the billing cycle needs to change.
                  </Text>
                </FormControl>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter
          pt={0}
          pb={6}
          px={6}
          justifyContent="center"
          gap={4}
        >
          <Button
            onClick={onClose}
            variant="outline"
            colorScheme="gray"
            borderRadius="12px"
            px={8}
            py={3}
            fontSize="md"
            fontWeight="medium"
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={handleSubmit}
            borderRadius="12px"
            px={8}
            py={3}
            fontSize="md"
            fontWeight="medium"
            bg="linear-gradient(81.62deg, brand.500 2.25%, brand.600 79.87%)"
            backgroundImage="linear-gradient(81.62deg, var(--chakra-colors-brand-500) 2.25%, var(--chakra-colors-brand-600) 79.87%)"
            color="white"
            _hover={{
              bg: "linear-gradient(81.62deg, brand.600 2.25%, #234E52 79.87%)",
              color: "white"
            }}
            _active={{
              bg: "brand.600"
            }}
            _focus={{ boxShadow: "0 0 0 2px rgba(49, 151, 149, 0.4)" }}
            _disabled={{
              opacity: 0.7,
              cursor: "not-allowed",
              bg: "linear-gradient(81.62deg, brand.500 2.25%, brand.600 79.87%)",
              backgroundImage: "linear-gradient(81.62deg, var(--chakra-colors-brand-500) 2.25%, var(--chakra-colors-brand-600) 79.87%)",
              color: "white"
            }}
          >
            Add Customer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddCustomerModal;