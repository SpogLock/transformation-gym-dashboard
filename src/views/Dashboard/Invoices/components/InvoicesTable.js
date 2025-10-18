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
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { SearchIcon, EditIcon, DeleteIcon, ViewIcon, DownloadIcon, EmailIcon, HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import InvoicesTableRow from "./InvoicesTableRow";
import AppLoader from "components/Loaders/AppLoader";
import EmptyState from "components/EmptyState/EmptyState";
import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { getAllInvoices, getGuestInvoices, linkInvoiceToCustomer, bulkLinkInvoicesToCustomer, printInvoice, downloadInvoice } from "services/invoiceService";

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

  // State for data and loading
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showGuestOnly, setShowGuestOnly] = useState(false);

  // Load invoices from API
  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        search: searchQuery,
        payment_status: statusFilter,
        payment_method: paymentFilter,
        date_from: dateFilter,
        sort_by: 'created_at',
        sort_order: 'desc'
      };
      
      const data = showGuestOnly ? await getGuestInvoices(filters) : await getAllInvoices(filters);
      
      // Debug: Log the API response structure
      console.log('Invoices API Response:', data);
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      if (data && data.length > 0) {
        console.log('First invoice structure:', data[0]);
        console.log('Customer data:', data[0].customer);
      }
      
      // Handle different possible response structures
      let invoicesArray = [];
      if (Array.isArray(data)) {
        invoicesArray = data;
      } else if (data && Array.isArray(data.invoices)) {
        invoicesArray = data.invoices;
      } else if (data && Array.isArray(data.data)) {
        invoicesArray = data.data;
      } else if (data && data.invoices && Array.isArray(data.invoices.data)) {
        invoicesArray = data.invoices.data;
      } else {
        console.warn('Unexpected API response structure:', data);
        invoicesArray = [];
      }
      
      console.log('Processed invoices array:', invoicesArray);
      setInvoices(invoicesArray);
    } catch (err) {
      console.error('Failed to load invoices:', err);
      setError(err.message);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, paymentFilter, dateFilter, showGuestOnly]);

  // Load invoices on component mount and when filters change
  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  // Filter invoices based on search and filters (client-side filtering as fallback)
  const getFilteredInvoices = () => {
    // Ensure invoices is an array
    if (!invoices || !Array.isArray(invoices) || invoices.length === 0) return [];
    
    return invoices.filter(invoice => {
      const matchesSearch = 
        invoice.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (invoice.customer_id && `customer #${invoice.customer_id}`.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter ? invoice.payment_status === statusFilter : true;
      const matchesPaymentType = paymentFilter ? invoice.payment_method === paymentFilter : true;
      const matchesDate = dateFilter ? invoice.created_at?.startsWith(dateFilter) : true;

      return matchesSearch && matchesStatus && matchesPaymentType && matchesDate;
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "green";
      case "pending":
        return "yellow";
      case "overdue":
        return "red";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const handleInvoiceClick = (invoice) => {
    history.push(`/admin/invoice-detail?invoiceId=${invoice.id}`);
  };

  const handlePrintInvoice = async (invoice) => {
    try {
      await printInvoice(invoice.id);
      toast({
        title: "Invoice Printed",
        description: `Invoice ${invoice.invoice_number} has been sent to printer`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Print Failed",
        description: error.message || "Failed to print invoice",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDownloadInvoice = async (invoice) => {
    try {
      await downloadInvoice(invoice.id, invoice.invoice_number);
      toast({
        title: "Invoice Downloaded",
        description: `Invoice ${invoice.invoice_number} has been downloaded`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download invoice",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEmailInvoice = (invoice) => {
    toast({
      title: "Email Feature",
      description: "Email functionality will be implemented soon",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeleteInvoice = (invoice) => {
    toast({
      title: "Delete Feature",
      description: "Delete functionality will be implemented soon",
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

  // Show loading state
  if (loading) {
    return (
      <Card>
        <CardBody>
          <AppLoader message="Loading invoices..." fullHeight />
        </CardBody>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            title="Failed to Load Invoices"
            description={error}
            actionText="Try Again"
            onAction={loadInvoices}
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
      <CardHeader p='6px 0px 22px 0px'>
        <Flex 
          justifyContent={{ base: "flex-start", md: "space-between" }} 
          alignItems="center" 
          width="100%" 
          flexWrap="wrap" 
          gap={2}
          flexDirection={{ base: "column", md: "row" }}
        >
          <Text 
            fontSize={{ base: "sm", md: "md" }} 
            color={textColor} 
            fontWeight='bold' 
            flexShrink={0}
          >
            Invoices & Orders
          </Text>
          
          {/* Search and Filters */}
          <Flex 
            gap="8px" 
            flexShrink={0} 
            ms={{ base: "auto", md: "auto" }}
            flexDirection={{ base: "column", md: "row" }}
            w={{ base: "100%", md: "auto" }}
          >
            {/* Search Input */}
            <InputGroup size="sm" minW="200px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg={cardBg}
                borderColor={borderColor}
              />
            </InputGroup>

            {/* Status Filter */}
            <Select
              size="sm"
              placeholder="All Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              minW="120px"
              bg={cardBg}
              borderColor={borderColor}
            >
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </Select>

            {/* Payment Method Filter */}
            <Select
              size="sm"
              placeholder="All Payment"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              minW="120px"
              bg={cardBg}
              borderColor={borderColor}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="digital_wallet">Digital Wallet</option>
            </Select>

            {/* Guest Invoices Toggle */}
            <Button
              size="sm"
              variant={showGuestOnly ? "solid" : "outline"}
              colorScheme={showGuestOnly ? "orange" : "gray"}
              onClick={() => setShowGuestOnly(!showGuestOnly)}
              px={3}
              fontSize="sm"
            >
              {showGuestOnly ? "Show All" : "Guest Only"}
            </Button>

            {/* Actions Menu */}
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                colorScheme="brand"
                size="sm"
                leftIcon={<HamburgerIcon />}
                px={3}
                fontSize="sm"
              >
                Actions
              </MenuButton>
              <MenuList>
                <MenuItem icon={<SettingsIcon />}>
                  <HStack justify="space-between" w="full">
                    <Text>Advanced Filters</Text>
                  </HStack>
                </MenuItem>
                <MenuItem icon={<DownloadIcon />}>Export CSV</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </CardHeader>
      
      <CardBody>
        {/* Show empty state if no invoices */}
        {getFilteredInvoices().length === 0 ? (
          <EmptyState
            title="No Invoices Found"
            description={invoices.length === 0 ? "No invoices have been created yet" : "No invoices match your current filters"}
            actionText={invoices.length === 0 ? "Create First Invoice" : "Clear Filters"}
            onAction={invoices.length === 0 ? () => history.push('/admin/pos') : () => {
              setSearchQuery("");
              setStatusFilter("");
              setPaymentFilter("");
              setDateFilter("");
            }}
          />
        ) : isMobile ? (
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
                        {invoice.invoice_number}
                      </Text>
                      <Text fontSize="xs" color={cardLabelColor}>
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </Text>
                      <Text fontSize="xs" color={cardLabelColor}>
                        {invoice.customer?.name || (invoice.customer_id ? `Customer #${invoice.customer_id}` : 'Guest')}
                      </Text>
                    </VStack>
                  </HStack>
                  <VStack align="end" spacing={1}>
                    <Text fontSize="sm" color={textColor} fontWeight="500">
                      PKR {parseFloat(invoice.total_amount || 0).toLocaleString()}
                    </Text>
                    <Badge
                      colorScheme={getStatusColor(invoice.payment_status)}
                      variant="subtle"
                      fontSize="xs"
                    >
                      {invoice.payment_status_display || invoice.payment_status}
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
                      {invoice.invoice_number}
                    </Text>
                    <Text fontSize="sm" color={cardLabelColor}>
                      {new Date(invoice.created_at).toLocaleDateString()} • {invoice.customer?.name || (invoice.customer_id ? `Customer #${invoice.customer_id}` : 'Guest')}
                    </Text>
                  </VStack>
                  <Badge
                    colorScheme={getStatusColor(invoice.payment_status)}
                    variant="subtle"
                    fontSize="sm"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {invoice.payment_status_display || invoice.payment_status}
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
                        PKR {parseFloat(invoice.total_amount || 0).toLocaleString()}
                      </Text>
                    </VStack>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color={cardIconColor} fontWeight="medium" textTransform="uppercase">
                        Payment Method
                      </Text>
                      <Text fontSize="sm" fontWeight="bold" color={textColor}>
                        {invoice.payment_method_display || invoice.payment_method}
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
                    onDownload={() => handleDownloadInvoice(invoice)}
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