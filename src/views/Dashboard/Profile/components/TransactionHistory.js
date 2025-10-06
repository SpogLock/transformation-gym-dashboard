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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  SimpleGrid,
} from "@chakra-ui/react";
import { 
  FaShoppingCart, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaBox,
  FaCreditCard,
  FaCashRegister,
  FaUniversity,
  FaReceipt
} from "react-icons/fa";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React from "react";

const TransactionHistory = ({ customer }) => {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardBg = useColorModeValue("white", "gray.800");

  // Get payment method icon
  const getPaymentIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'cash':
        return FaCashRegister;
      case 'card':
        return FaCreditCard;
      case 'bank transfer':
        return FaUniversity;
      default:
        return FaCreditCard;
    }
  };

  // Calculate total spent
  const totalSpent = customer.transactionHistory.reduce((total, transaction) => {
    return total + parseFloat(transaction.totalAmount.replace(/[₨,]/g, ''));
  }, 0);

  // Get most recent transaction
  const mostRecentTransaction = customer.transactionHistory[0];

  // Count total items purchased
  const totalItems = customer.transactionHistory.reduce((total, transaction) => {
    return total + transaction.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0);
  }, 0);

  return (
    <Box p={{ base: 3, sm: 4, md: 6 }}>
      {/* Transaction Overview Cards */}
      <Grid templateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={{ base: 2, sm: 3, md: 3 }} mb={6}>
        <Box bg={cardBg} p={3} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Box color="brand.500">
              <Icon as={FaMoneyBillWave} boxSize={4} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Total Spent
              </Text>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                ₨{totalSpent.toLocaleString()}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <Box bg={cardBg} p={3} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Box color="brand.500">
              <Icon as={FaShoppingCart} boxSize={4} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Total Orders
              </Text>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {customer.transactionHistory.length}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <Box bg={cardBg} p={3} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Box color="brand.500">
              <Icon as={FaBox} boxSize={4} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Items Purchased
              </Text>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {totalItems}
              </Text>
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
                Last Purchase
              </Text>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {mostRecentTransaction?.date || "N/A"}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </Grid>

      {/* Transaction History */}
      <Box bg={cardBg} p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
        <VStack spacing={4} align="stretch">
          <HStack spacing={3} align="center" mb={2}>
            <Box color="brand.500">
              <Icon as={FaReceipt} boxSize={4} />
            </Box>
            <Text fontSize="lg" color={textColor} fontWeight="bold">
              Purchase History
            </Text>
          </HStack>
          
          <VStack spacing={3} align="stretch">
            {customer.transactionHistory.map((transaction, index) => (
              <Box key={transaction.id} p={4} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md" border="1px solid" borderColor={borderColor}>
                {/* Transaction Header */}
                <HStack justify="space-between" align="center" mb={3}>
                  <HStack spacing={3}>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">
                        Transaction ID
                      </Text>
                      <Text fontSize="md" color={textColor} fontWeight="bold">
                        {transaction.id}
                      </Text>
                    </VStack>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">
                        Date
                      </Text>
                      <Text fontSize="md" color={textColor} fontWeight="semibold">
                        {transaction.date}
                      </Text>
                    </VStack>
                  </HStack>
                  
                  <VStack align="end" spacing={1}>
                    <Text fontSize="lg" color="brand.500" fontWeight="bold">
                      {transaction.totalAmount}
                    </Text>
                    <Badge
                      colorScheme="green"
                      variant="subtle"
                      px={2}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="semibold"
                    >
                      {transaction.status}
                    </Badge>
                  </VStack>
                </HStack>

                <Divider mb={3} />

                {/* Items and Payment Method */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {/* Items */}
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">
                      Items Purchased
                    </Text>
                    <VStack align="start" spacing={1} w="full">
                      {transaction.items.map((item, itemIndex) => (
                        <HStack key={itemIndex} justify="space-between" w="full" p={2} bg={useColorModeValue("white", "gray.600")} borderRadius="md">
                          <VStack align="start" spacing={0} flex={1}>
                            <Text fontSize="sm" color={textColor} fontWeight="semibold">
                              {item.name}
                            </Text>
                            <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
                              Qty: {item.quantity}
                            </Text>
                          </VStack>
                          <Text fontSize="sm" color="brand.500" fontWeight="bold">
                            {item.price}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>

                  {/* Payment Method */}
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">
                      Payment Details
                    </Text>
                    <HStack spacing={3} p={3} bg={useColorModeValue("white", "gray.600")} borderRadius="md" w="full">
                      <Box color="brand.500">
                        <Icon as={getPaymentIcon(transaction.paymentMethod)} boxSize={4} />
                      </Box>
                      <VStack align="start" spacing={0} flex={1}>
                        <Text fontSize="sm" color={textColor} fontWeight="semibold">
                          Payment Method
                        </Text>
                        <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
                          {transaction.paymentMethod}
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </SimpleGrid>
              </Box>
            ))}
          </VStack>

          {/* Empty State */}
          {customer.transactionHistory.length === 0 && (
            <Box textAlign="center" py={8}>
              <Icon as={FaShoppingCart} boxSize={12} color="gray.400" mb={4} />
              <Text fontSize="lg" color="gray.500" fontWeight="medium" mb={2}>
                No Transactions Found
              </Text>
              <Text fontSize="sm" color="gray.400">
                This customer hasn't made any purchases yet.
              </Text>
            </Box>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default TransactionHistory;
