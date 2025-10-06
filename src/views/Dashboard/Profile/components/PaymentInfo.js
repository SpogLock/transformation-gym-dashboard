// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
  Badge,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";
import { 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaWallet,
  FaClock
} from "react-icons/fa";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React from "react";

const PaymentInfo = ({ customer }) => {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardBg = useColorModeValue("white", "gray.800");

  // Check if payment is overdue
  const isPaymentOverdue = (nextDueDate) => {
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    return dueDate < today;
  };

  // Get days until due or days overdue
  const getPaymentStatus = (nextDueDate) => {
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'overdue', days: Math.abs(diffDays), color: 'red' };
    } else if (diffDays === 0) {
      return { status: 'due_today', days: 0, color: 'orange' };
    } else if (diffDays <= 7) {
      return { status: 'due_soon', days: diffDays, color: 'yellow' };
    } else {
      return { status: 'paid', days: diffDays, color: 'green' };
    }
  };

  const paymentStatus = getPaymentStatus(customer.nextDueDate);

  return (
    <Box p={{ base: 3, sm: 4, md: 6 }}>
      {/* Payment Overview Cards */}
      <Grid templateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={{ base: 2, sm: 3, md: 3 }} mb={6}>
        <Box bg={cardBg} p={3} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Box color="brand.500">
              <Icon as={FaWallet} boxSize={4} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Monthly Fee
              </Text>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {customer.monthlyFee}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <Box bg={cardBg} p={3} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Box color="brand.500">
              <Icon as={FaClock} boxSize={4} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Status
              </Text>
              <Badge
                colorScheme={paymentStatus.color}
                variant="subtle"
                px={2}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="semibold"
              >
                {paymentStatus.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </VStack>
          </HStack>
        </Box>

        <Box bg={cardBg} p={3} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Box color="brand.500">
              <Icon as={FaCalendarAlt} boxSize={4} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Last Payment
              </Text>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {customer.feePaidDate}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <Box bg={cardBg} p={3} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Box color="brand.500">
              <Icon as={FaMoneyBillWave} boxSize={4} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Next Due
              </Text>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {customer.nextDueDate}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </Grid>

      {/* Payment Actions */}
      <Box bg={cardBg} p={4} borderRadius="lg" border="1px solid" borderColor="gray.200" mb={4}>
        <VStack spacing={3} align="stretch">
          <HStack spacing={3} align="center" mb={1}>
            <Box color="brand.500">
              <Icon as={FaCheckCircle} boxSize={4} />
            </Box>
            <Text fontSize="md" color={textColor} fontWeight="bold">
              Payment Actions
            </Text>
          </HStack>
          
          <VStack spacing={3} align="stretch" display={{ base: "flex", md: "none" }}>
            <Button
              leftIcon={<FaCheckCircle />}
              size="md"
              isDisabled={!isPaymentOverdue(customer.nextDueDate)}
              bg="linear-gradient(90deg, #B88A1E 0%, #8A6A0A 100%)"
              backgroundImage="linear-gradient(90deg, #B88A1E 0%, #8A6A0A 100%)"
              color="white"
              _hover={{ bg: "linear-gradient(90deg, #9F7A1A 0%, #775C08 100%)" }}
              _active={{ bg: "#8A6A0A" }}
              _disabled={{ opacity: 0.8, bg: "linear-gradient(90deg, #B88A1E 0%, #8A6A0A 100%)", color: "white" }}
            >
              Mark as Paid
            </Button>
            <Button
              leftIcon={<FaCreditCard />}
              size="md"
              bg="linear-gradient(90deg, #2FB3A3 0%, #2C7A7B 100%)"
              backgroundImage="linear-gradient(90deg, #2FB3A3 0%, #2C7A7B 100%)"
              color="white"
              _hover={{ bg: "linear-gradient(90deg, #2AA396 0%, #276B6C 100%)" }}
              _active={{ bg: "#2C7A7B" }}
            >
              Process Payment
            </Button>
            <Button
              leftIcon={<FaExclamationTriangle />}
              size="md"
              variant="outline"
              borderColor="#DD6B20"
              color="#DD6B20"
              _hover={{ bg: "rgba(221,107,32,0.08)", borderColor: "#DD6B20" }}
            >
              Send Reminder
            </Button>
          </VStack>
          
          <HStack spacing={3} w="100%" display={{ base: "none", md: "flex" }}>
            <Button
              leftIcon={<FaCheckCircle />}
              size="md"
              flex={1}
              minW={0}
              isDisabled={!isPaymentOverdue(customer.nextDueDate)}
              bg="linear-gradient(90deg, #B88A1E 0%, #8A6A0A 100%)"
              backgroundImage="linear-gradient(90deg, #B88A1E 0%, #8A6A0A 100%)"
              color="white"
              _hover={{ bg: "linear-gradient(90deg, #9F7A1A 0%, #775C08 100%)" }}
              _active={{ bg: "#8A6A0A" }}
              _focus={{ boxShadow: "0 0 0 2px rgba(184, 138, 30, 0.4)" }}
              _disabled={{
                opacity: 0.7,
                cursor: "not-allowed",
                bg: "linear-gradient(90deg, #B88A1E 0%, #8A6A0A 100%)",
                backgroundImage: "linear-gradient(90deg, #B88A1E 0%, #8A6A0A 100%)",
                color: "white"
              }}
            >
              Mark as Paid
            </Button>
            <Button
              leftIcon={<FaCreditCard />}
              size="md"
              flex={1}
              minW={0}
              bg="linear-gradient(90deg, #2FB3A3 0%, #2C7A7B 100%)"
              color="white"
              _hover={{ bg: "linear-gradient(90deg, #2AA396 0%, #276B6C 100%)" }}
            >
              Process Payment
            </Button>
            <Button
              leftIcon={<FaExclamationTriangle />}
              size="md"
              variant="outline"
              flex={1}
              minW={0}
              borderColor="#DD6B20"
              color="#DD6B20"
              _hover={{ bg: useColorModeValue("rgba(221,107,32,0.08)", "rgba(221,107,32,0.16)"), borderColor: "#DD6B20" }}
            >
              Send Reminder
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* Payment History */}
      <Box bg={cardBg} p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
        <VStack spacing={3} align="stretch">
          <HStack spacing={3} align="center" mb={1}>
            <Box color="brand.500">
              <Icon as={FaCreditCard} boxSize={4} />
            </Box>
            <Text fontSize="md" color={textColor} fontWeight="bold">
              Payment History
            </Text>
          </HStack>
          
          <VStack spacing={3} align="stretch">
            {customer.paymentHistory.map((payment, index) => (
              <Box key={index} p={3} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md" border="1px solid" borderColor={borderColor}>
                {/* Desktop Layout */}
                <Grid templateColumns="1fr 1fr 1fr auto" gap={4} minH="40px" alignItems="center" display={{ base: "none", md: "grid" }}>
                  <HStack spacing={3} align="center">
                    <Box color="brand.500" flexShrink={0}>
                      <Icon as={FaCalendarAlt} boxSize={3} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">
                        Date
                      </Text>
                      <Text fontSize="sm" color={textColor} fontWeight="semibold">
                        {payment.date}
                      </Text>
                    </VStack>
                  </HStack>
                  
                  <HStack spacing={3} align="center">
                    <Box color="brand.500" flexShrink={0}>
                      <Icon as={FaMoneyBillWave} boxSize={3} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">
                        Amount
                      </Text>
                      <Text fontSize="sm" color={textColor} fontWeight="semibold">
                        {payment.amount}
                      </Text>
                    </VStack>
                  </HStack>
                  
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">
                      Method
                    </Text>
                    <Text fontSize="sm" color={textColor} fontWeight="semibold" noOfLines={1}>
                      {payment.method}
                    </Text>
                  </VStack>
                  
                  <Badge
                    colorScheme={payment.status === "Paid" ? "green" : "red"}
                    variant="subtle"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="semibold"
                    flexShrink={0}
                  >
                    {payment.status}
                  </Badge>
                </Grid>

                {/* Mobile Layout - Compact Stack */}
                <VStack spacing={2} align="stretch" display={{ base: "flex", md: "none" }}>
                  {/* Top Row - Date and Amount */}
                  <HStack justify="space-between" align="center">
                    <HStack spacing={2} align="center" flex={1} minW={0}>
                      <Box color="brand.500" flexShrink={0}>
                        <Icon as={FaCalendarAlt} boxSize={3} />
                      </Box>
                      <VStack align="start" spacing={0} minW={0} flex={1}>
                        <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">
                          Date
                        </Text>
                        <Text fontSize="xs" color={textColor} fontWeight="semibold" noOfLines={1}>
                          {payment.date}
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <HStack spacing={2} align="center" flex={1} minW={0} justify="flex-end">
                      <Box color="brand.500" flexShrink={0}>
                        <Icon as={FaMoneyBillWave} boxSize={3} />
                      </Box>
                      <VStack align="end" spacing={0} minW={0} flex={1}>
                        <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">
                          Amount
                        </Text>
                        <Text fontSize="xs" color={textColor} fontWeight="semibold" noOfLines={1}>
                          {payment.amount}
                        </Text>
                      </VStack>
                    </HStack>
                  </HStack>

                  {/* Bottom Row - Method and Status */}
                  <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={0} flex={1} minW={0}>
                      <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">
                        Method
                      </Text>
                      <Text fontSize="xs" color={textColor} fontWeight="semibold" noOfLines={1}>
                        {payment.method}
                      </Text>
                    </VStack>
                    
                    <Badge
                      colorScheme={payment.status === "Paid" ? "green" : "red"}
                      variant="subtle"
                      px={2}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="semibold"
                      flexShrink={0}
                      ml={2}
                    >
                      {payment.status}
                    </Badge>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default PaymentInfo;
