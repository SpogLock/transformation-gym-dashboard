// Chakra imports
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Box,
  Image,
  Button,
  useColorModeValue,
  Divider,
  Badge,
  IconButton,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { CloseIcon, EditIcon, EmailIcon, CalendarIcon } from "@chakra-ui/icons";
import React, { useState } from "react";

const EmailPreview = ({ isOpen, onClose, campaign, onSend, onSchedule, onEdit }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardLabelColor = useColorModeValue("gray.600", "gray.300");
  const toast = useToast();

  // Sample customer data for preview
  const sampleCustomer = {
    name: "Alex Martinez",
    email: "alex@gmail.com",
    gymName: "FitZone Gym"
  };

  const handleSendNow = () => {
    toast({
      title: "Campaign Sent!",
      description: `"${campaign.name}" has been sent to ${campaign.recipients} recipients`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onSend && onSend();
    onClose();
  };

  const handleSchedule = () => {
    toast({
      title: "Campaign Scheduled!",
      description: `"${campaign.name}" will be sent at the scheduled time`,
      status: "info",
      duration: 5000,
      isClosable: true,
    });
    onSchedule && onSchedule();
    onClose();
  };

  const handleEdit = () => {
    onEdit && onEdit();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay backdropFilter="blur(8px)" bg="rgba(0,0,0,0.35)" />
      <ModalContent maxW="900px" maxH="90vh" overflowY="auto" borderRadius="20px" border="1.5px solid" borderColor={useColorModeValue("white", "whiteAlpha.300")}> 
        <ModalHeader>
          <HStack justify="space-between" w="full">
            <VStack align="start" spacing={0}>
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                Email Preview
              </Text>
              <Text fontSize="sm" color={cardLabelColor}>
                {campaign.name}
              </Text>
            </VStack>
            <HStack spacing={2}>
              <Badge
                colorScheme={campaign.status === "Sent" ? "green" : campaign.status === "Draft" ? "yellow" : "blue"}
                variant="subtle"
              >
                {campaign.status}
              </Badge>
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} maxH="calc(90vh - 120px)" overflowY="auto">
          <VStack spacing={6} align="stretch">
            {/* Email Header Info */}
            <Box
              p={4}
              bg={useColorModeValue("gray.50", "gray.700")}
              borderRadius="lg"
            >
              <VStack spacing={2} align="start">
                <HStack>
                  <Text fontSize="sm" fontWeight="semibold" color={cardLabelColor}>
                    To:
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    {sampleCustomer.name} &lt;{sampleCustomer.email}&gt;
                  </Text>
                </HStack>
                <HStack>
                  <Text fontSize="sm" fontWeight="semibold" color={cardLabelColor}>
                    From:
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    {sampleCustomer.gymName} &lt;noreply@{sampleCustomer.gymName.toLowerCase().replace(/\s+/g, '')}.com&gt;
                  </Text>
                </HStack>
                <HStack>
                  <Text fontSize="sm" fontWeight="semibold" color={cardLabelColor}>
                    Subject:
                  </Text>
                  <Text fontSize="sm" color={textColor} fontWeight="semibold">
                    {campaign.subject}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontSize="sm" fontWeight="semibold" color={cardLabelColor}>
                    Recipients:
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    {campaign.recipients} people
                  </Text>
                </HStack>
              </VStack>
            </Box>

            {/* Email Content Preview */}
            <Box
              border="1px solid"
              borderColor={borderColor}
              borderRadius="lg"
              overflow="hidden"
              bg={cardBg}
            >
              {/* Email Header */}
              <Box
                bg="brand.500"
                p={4}
                color="white"
              >
                <HStack justify="space-between">
                  <VStack align="start" spacing={0}>
                    <Text fontSize="lg" fontWeight="bold">
                      {sampleCustomer.gymName}
                    </Text>
                    <Text fontSize="xs" opacity={0.9}>
                      Premium Fitness & Wellness
                    </Text>
                  </VStack>
                  <Image
                    src="https://via.placeholder.com/60x60/ffffff/ffffff?text=G"
                    alt="Gym Logo"
                    w="60px"
                    h="60px"
                    borderRadius="full"
                    bg="white"
                    p={2}
                  />
                </HStack>
              </Box>

              {/* Banner Image */}
              {campaign.image && (
                <Box>
                  <Image
                    src={URL.createObjectURL(campaign.image)}
                    alt="Campaign Banner"
                    w="100%"
                    h="200px"
                    objectFit="cover"
                  />
                </Box>
              )}

              {/* Email Body */}
              <Box p={6} maxH="400px" overflowY="auto">
                <VStack spacing={4} align="stretch">
                  {/* Greeting */}
                  <Text fontSize="md" color={textColor}>
                    Hello {sampleCustomer.name},
                  </Text>

                  {/* Main Content */}
                  <Box
                    fontSize="md"
                    color={textColor}
                    lineHeight="1.6"
                    whiteSpace="pre-wrap"
                  >
                    {campaign.content || "Your email content will appear here..."}
                  </Box>

                  {/* Call to Action Button */}
                  <Box textAlign="center" py={4}>
                    <Button
                      colorScheme="teal"
                      size="lg"
                      borderRadius="full"
                      px={8}
                      py={6}
                      fontSize="md"
                      fontWeight="bold"
                    >
                      Learn More
                    </Button>
                  </Box>

                  {/* Additional Info */}
                  <Box
                    p={4}
                    bg={useColorModeValue("gray.50", "gray.700")}
                    borderRadius="md"
                  >
                    <VStack spacing={2} align="start">
                      <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                        📍 Visit Our Gym
                      </Text>
                      <Text fontSize="sm" color={cardLabelColor}>
                        123 Fitness Street, Health City, HC 12345
                      </Text>
                      <Text fontSize="sm" color={cardLabelColor}>
                        Phone: (555) 123-4567 | Email: info@{sampleCustomer.gymName.toLowerCase().replace(/\s+/g, '')}.com
                      </Text>
                    </VStack>
                  </Box>
                </VStack>
              </Box>

              {/* Email Footer */}
              <Box
                bg={useColorModeValue("gray.100", "gray.600")}
                p={4}
                borderTop="1px solid"
                borderColor={borderColor}
              >
                <VStack spacing={2} align="center">
                  <Text fontSize="xs" color={cardLabelColor} textAlign="center">
                    © 2024 {sampleCustomer.gymName}. All rights reserved.
                  </Text>
                  <HStack spacing={4}>
                    <Text fontSize="xs" color={cardLabelColor} cursor="pointer" _hover={{ color: "brand.500" }}>
                      Unsubscribe
                    </Text>
                    <Text fontSize="xs" color={cardLabelColor}>|</Text>
                    <Text fontSize="xs" color={cardLabelColor} cursor="pointer" _hover={{ color: "brand.500" }}>
                      Update Preferences
                    </Text>
                    <Text fontSize="xs" color={cardLabelColor}>|</Text>
                    <Text fontSize="xs" color={cardLabelColor} cursor="pointer" _hover={{ color: "brand.500" }}>
                      Privacy Policy
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </Box>

            {/* Action Buttons */}
            <HStack spacing={4} justify="center">
              <Button
                leftIcon={<EditIcon />}
                variant="outline"
                colorScheme="teal"
                onClick={handleEdit}
              >
                Edit Campaign
              </Button>
              {campaign.status !== "Sent" && (
                <>
                  <Button
                    leftIcon={<CalendarIcon />}
                    variant="outline"
                    colorScheme="blue"
                    onClick={handleSchedule}
                  >
                    Schedule Send
                  </Button>
                  <Button
                    leftIcon={<EmailIcon />}
                    bg="linear-gradient(81.62deg, brand.500 2.25%, brand.600 79.87%)"
                    backgroundImage="linear-gradient(81.62deg, var(--chakra-colors-brand-500) 2.25%, var(--chakra-colors-brand-600) 79.87%)"
                    color="white"
                    _hover={{ bg: "linear-gradient(81.62deg, brand.600 2.25%, #234E52 79.87%)" }}
                    _active={{ bg: "brand.600" }}
                    _focus={{ boxShadow: "0 0 0 2px rgba(49, 151, 149, 0.4)" }}
                    onClick={handleSendNow}
                  >
                    Send Now
                  </Button>
                </>
              )}
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EmailPreview;
