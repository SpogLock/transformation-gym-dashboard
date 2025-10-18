import React, { useState } from "react";
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
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

const AddStaffModal = ({ isOpen, onClose, onAddStaff }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "staff",
    password: "",
    password_confirmation: "",
  });

  const toast = useToast();

  const textColor = useColorModeValue("gray.700", "white");
  const modalBg = useColorModeValue(
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.8) 110.84%)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );
  const modalBorder = useColorModeValue(
    "1.5px solid #FFFFFF",
    "1.5px solid rgba(255, 255, 255, 0.31)"
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.role || !formData.password || !formData.password_confirmation) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      toast({
        title: "Password mismatch",
        description: "Password and confirmation do not match.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (onAddStaff) {
      onAddStaff({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });
    }

    setFormData({ name: "", email: "", phone: "", role: "staff", password: "", password_confirmation: "" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay backdropFilter="blur(10px)" bg="rgba(0, 0, 0, 0.3)" />
      <ModalContent bg={modalBg} border={modalBorder} borderRadius="20px">
        <ModalHeader color={textColor} fontSize="xl" fontWeight="bold" textAlign="center">
          Add Staff
        </ModalHeader>
        <ModalCloseButton color={textColor} />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel color={textColor}>Full Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Jane Doe"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={textColor}>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. jane@example.com"
              />
            </FormControl>

            <FormControl>
              <FormLabel color={textColor}>Phone</FormLabel>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +1 555 0100"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={textColor}>Role</FormLabel>
              <Select name="role" value={formData.role} onChange={handleChange}>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={textColor}>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Set a password (min 8 characters)"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={textColor}>Confirm Password</FormLabel>
              <Input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Confirm password"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            borderRadius="12px"
            px={6}
            bg="linear-gradient(81.62deg, brand.500 2.25%, brand.600 79.87%)"
            backgroundImage="linear-gradient(81.62deg, var(--chakra-colors-brand-500) 2.25%, var(--chakra-colors-brand-600) 79.87%)"
            color="white"
            _hover={{
              bg: "linear-gradient(81.62deg, brand.600 2.25%, #234E52 79.87%)",
              color: "white",
            }}
            _active={{ bg: "brand.600" }}
            _focus={{ boxShadow: "0 0 0 2px rgba(49, 151, 149, 0.4)" }}
            _disabled={{
              opacity: 0.7,
              cursor: "not-allowed",
              bg: "linear-gradient(81.62deg, brand.500 2.25%, brand.600 79.87%)",
              backgroundImage: "linear-gradient(81.62deg, var(--chakra-colors-brand-500) 2.25%, var(--chakra-colors-brand-600) 79.87%)",
              color: "white"
            }}
          >
            Add Staff
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddStaffModal;


