// Chakra imports
import {
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Flex,
  Button,
  useDisclosure,
  Box,
  VStack,
  HStack,
  Badge,
  Divider,
  useBreakpointValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon, EditIcon, DeleteIcon, ViewIcon, DownloadIcon, EmailIcon, HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import InvoicesTableRow from "./InvoicesTableRow";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const InvoicesTable = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardLabelColor = useColorModeValue("gray.600", "gray.300");
  const cardIconColor = useColorModeValue("gray.500", "gray.400");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });
  const history = useHistory();
  const toast = useToast();

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Sample invoices data
  const sampleInvoices = [
    {
      id: "INV001",
      date: "2024-01-25",
      customer: { id: 1, name: "Asim Khan", phone: "+92 321 2345678" },
      total: 15000,
      paymentType: "Card",
      status: "Paid",
      products: [
        { id: 1, name: "Optimum Nutrition Gold Standard Whey", quantity: 2, price: 7500, thumbnail: "whey_dummy" },
      ],
      discount: 0,
      tax: 2250,
      subtotal: 12750,
      notes: "Online payment via credit card."
    },
    {
      id: "INV002",
      date: "2024-01-24",
      customer: { id: 2, name: "Fatima Ali", phone: "+92 300 1234567" },
      total: 8500,
      paymentType: "Cash",
      status: "Paid",
      products: [
        { id: 2, name: "Dymatize ISO100 Whey Protein", quantity: 1, price: 8500, thumbnail: "whey_dummy" },
      ],
      discount: 0,
      tax: 1275,
      subtotal: 7225,
      notes: "Cash payment at counter."
    },
    {
      id: "INV003",
      date: "2024-01-23",
      customer: { id: 3, name: "Ahmed Hassan", phone: "+92 333 9876543" },
      total: 6400,
      paymentType: "Card",
      status: "Pending",
      products: [
        { id: 3, name: "MuscleTech Creatine Monohydrate", quantity: 2, price: 3200, thumbnail: "whey_dummy" },
      ],
      discount: 0,
      tax: 960,
      subtotal: 5440,
      notes: "Payment pending due to card issue."
    },
    {
      id: "INV004",
      date: "2024-01-22",
      customer: { id: 4, name: "Sara Ahmed", phone: "+92 301 4567890" },
      total: 22000,
      paymentType: "Other",
      status: "Refunded",
      products: [
        { id: 4, name: "BSN N.O.-XPLODE Pre-Workout", quantity: 4, price: 5500, thumbnail: "whey_dummy" },
      ],
      discount: 0,
      tax: 3300,
      subtotal: 18700,
      notes: "Product returned, full refund issued."
    },
    {
      id: "INV005",
      date: "2024-01-21",
      customer: { id: 5, name: "Usman Sheikh", phone: "+92 302 7890123" },
      total: 4800,
      paymentType: "Cash",
      status: "Paid",
      products: [
        { id: 5, name: "Universal Animal Pak Multivitamin", quantity: 1, price: 4800, thumbnail: "whey_dummy" },
      ],
      discount: 0,
      tax: 720,
      subtotal: 4080,
      notes: "Cash payment."
    },
    {
      id: "INV006",
      date: "2024-01-20",
      customer: { name: "Guest" },
      total: 10000,
      paymentType: "Cash",
      status: "Paid",
      products: [
        { id: 1, name: "Optimum Nutrition Gold Standard Whey", quantity: 1, price: 7500, thumbnail: "whey_dummy" },
        { id: 3, name: "MuscleTech Creatine Monohydrate", quantity: 1, price: 3200, thumbnail: "whey_dummy" },
      ],
      discount: 700,
      tax: 1500,
      subtotal: 10700,
      notes: "Guest sale, cash payment."
    }
  ];

  // Filter invoices based on search and filters
  const getFilteredInvoices = () => {
    return sampleInvoices.filter(invoice => {
      const matchesSearch = 
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter ? invoice.status === statusFilter : true;
      const matchesPaymentType = paymentFilter ? invoice.paymentType === paymentFilter : true;
      const matchesDate = dateFilter ? invoice.date === dateFilter : true;

      return matchesSearch && matchesStatus && matchesPaymentType && matchesDate;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "green";
      case "Pending":
        return "yellow";
      case "Refunded":
        return "red";
      default:
        return "gray";
    }
  };

  const handleInvoiceClick = (invoice) => {
    history.push(`/admin/invoice-detail?invoiceId=${invoice.id}`);
  };

  const handlePrintInvoice = (invoice) => {
    toast({
      title: "Invoice Printed",
      description: `Invoice ${invoice.id} has been printed`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleEmailInvoice = (invoice) => {
    toast({
      title: "Invoice Emailed",
      description: `Invoice ${invoice.id} has been emailed to customer`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeleteInvoice = (invoice) => {
    toast({
      title: "Invoice Deleted",
      description: `Invoice ${invoice.id} has been deleted`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Invoice table captions - Clean key-style headers
  const invoiceCaptions = [
    { key: "Invoice #", width: "15%" },
    { key: "Date", width: "12%" },
    { key: "Customer", width: "20%" },
    { key: "Total", width: "15%" },
    { key: "Payment", width: "12%" },
    { key: "Status", width: "12%" },
    { key: "Actions", width: "14%" }
  ];

  return (
    <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
      <CardHeader p='6px 0px 22px 0px'>
        <Flex 
          justifyContent={{ base: "flex-start", md: "space-between" }} 
          alignItems="center" 
          width="100%" 
          flexWrap="wrap" 
          gap={2}
          flexDirection={{ base: "row", md: "row" }}
        >
          <Text 
            fontSize={{ base: "sm", md: "md" }} 
            color={textColor} 
            fontWeight='bold' 
            flexShrink={0}
          >
            Invoices & Orders
          </Text>
          <Flex gap="4px" flexShrink={0} ms={{ base: "auto", md: "auto" }}>
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                colorScheme="brand"
                size="xs"
                leftIcon={<HamburgerIcon />}
                px={2}
                fontSize="xs"
              >
                Actions
              </MenuButton>
              <MenuList>
                <MenuItem icon={<SettingsIcon />}>
                  <HStack justify="space-between" w="full">
                    <Text>Filters</Text>
                  </HStack>
                </MenuItem>
                <MenuItem icon={<DownloadIcon />}>Export CSV</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </CardHeader>
      
      <CardBody>
        {isMobile ? (
          // Mobile List View - Minimal Info
          <VStack spacing={3} align="stretch" w="100%">
            {getFilteredInvoices().map((invoice, index) => (
                <Box
                  key={`${invoice.id}-${index}`}
                  bg={cardBg}
                  borderRadius="8px"
                  border="1px solid"
                  borderColor={borderColor}
                  p={3}
                  w="100%"
                  boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1)"
                  cursor="pointer"
                  onClick={() => handleInvoiceClick(invoice)}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  position="relative"
                  _hover={{
                    boxShadow: "0px 8px 25px rgba(56, 178, 172, 0.25)",
                    transform: "translateY(-4px) scale(1.02)",
                    borderColor: "brand.300",
                    bg: useColorModeValue("brand.50", "brand.900"),
                  }}
                  _groupHover={{
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                    transform: "none",
                    borderColor: borderColor,
                    bg: cardBg,
                  }}
                >
                <Flex justifyContent="space-between" alignItems="center">
                  <HStack spacing={3}>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="md" fontWeight="bold" color={textColor}>
                        {invoice.id}
                      </Text>
                      <Text fontSize="xs" color={cardLabelColor}>
                        {invoice.date}
                      </Text>
                      <Text fontSize="xs" color={cardLabelColor}>
                        {invoice.customer.name}
                      </Text>
                    </VStack>
                  </HStack>
                  <VStack align="end" spacing={1}>
                    <Text fontSize="sm" color={textColor} fontWeight="500">
                      PKR {invoice.total.toLocaleString()}
                    </Text>
                    <Badge
                      colorScheme={getStatusColor(invoice.status)}
                      variant="subtle"
                      fontSize="xs"
                    >
                      {invoice.status}
                    </Badge>
                  </VStack>
                </Flex>
              </Box>
            ))}
          </VStack>
        ) : isTablet ? (
          // Tablet Card View - More Details
          <VStack spacing={4} align="stretch" w="100%">
            {getFilteredInvoices().map((invoice, index) => (
              <Box
                key={`${invoice.id}-${index}`}
                bg={cardBg}
                borderRadius="12px"
                border="1px solid"
                borderColor={borderColor}
                p={4}
                w="100%"
                boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
                cursor="pointer"
                onClick={() => handleInvoiceClick(invoice)}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                position="relative"
                _hover={{
                  boxShadow: "0px 12px 30px rgba(56, 178, 172, 0.3)",
                  transform: "translateY(-6px) scale(1.03)",
                  borderColor: "brand.300",
                  bg: useColorModeValue("brand.50", "brand.900"),
                }}
                _groupHover={{
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                  transform: "none",
                  borderColor: borderColor,
                  bg: cardBg,
                }}
              >
                {/* Header with Invoice ID and Status */}
                <Flex justifyContent="space-between" alignItems="center" mb={3}>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                      {invoice.id}
                    </Text>
                    <Text fontSize="sm" color={cardLabelColor}>
                      {invoice.date} • {invoice.customer.name}
                    </Text>
                  </VStack>
                  <Badge
                    colorScheme={getStatusColor(invoice.status)}
                    variant="subtle"
                    fontSize="sm"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {invoice.status}
                  </Badge>
                </Flex>

                <Divider mb={3} />

                {/* Invoice Details Grid */}
                <Box>
                  <Text fontSize="xs" color={cardIconColor} fontWeight="bold" textTransform="uppercase" mb={3}>
                    Invoice Details
                  </Text>
                  <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color={cardIconColor} fontWeight="medium" textTransform="uppercase">
                        Total Amount
                      </Text>
                      <Text fontSize="sm" fontWeight="bold" color={textColor}>
                        PKR {invoice.total.toLocaleString()}
                      </Text>
                    </VStack>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color={cardIconColor} fontWeight="medium" textTransform="uppercase">
                        Payment Method
                      </Text>
                      <Text fontSize="sm" fontWeight="bold" color={textColor}>
                        {invoice.paymentType}
                      </Text>
                    </VStack>
                  </Box>
                </Box>
              </Box>
            ))}
          </VStack>
        ) : (
          // Desktop Table View
          <Table 
            variant='simple' 
            color={textColor} 
            size="md"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="12px"
            overflow="hidden"
            boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
          >
            <Thead>
              <Tr bg={useColorModeValue("gray.50", "gray.700")} borderBottom="2px solid" borderColor={borderColor}>
                {invoiceCaptions.map((caption, idx) => {
                  return (
                    <Th 
                      color='gray.600' 
                      key={idx} 
                      width={caption.width} 
                      px="12px"
                      py="16px"
                      fontWeight="semibold"
                      fontSize="sm"
                      textTransform="none"
                      letterSpacing="normal"
                      textAlign={idx === 0 ? "center" : "left"}
                      borderLeft={idx === 0 ? "none" : "1px solid"}
                      borderLeftColor={borderColor}
                    >
                      {caption.key}
                    </Th>
                  );
                })}
              </Tr>
            </Thead>
            <Tbody>
              {getFilteredInvoices().map((invoice, index) => {
                return (
                  <InvoicesTableRow
                    key={`${invoice.id}-${index}`}
                    invoice={invoice}
                    onClick={() => handleInvoiceClick(invoice)}
                    onPrint={() => handlePrintInvoice(invoice)}
                    onEmail={() => handleEmailInvoice(invoice)}
                    onDelete={() => handleDeleteInvoice(invoice)}
                  />
                );
              })}
            </Tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default InvoicesTable;