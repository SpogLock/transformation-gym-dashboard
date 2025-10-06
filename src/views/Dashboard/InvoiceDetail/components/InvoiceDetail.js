// Chakra imports
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
  VStack,
  HStack,
  Button,
  Badge,
  Divider,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Image,
} from "@chakra-ui/react";
import { ArrowBackIcon, EditIcon, DeleteIcon, DownloadIcon, EmailIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import whey_dummy from "assets/img/whey_dummy.png";

const InvoiceDetailComponent = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardLabelColor = useColorModeValue("gray.600", "gray.300");
  const history = useHistory();
  const location = useLocation();
  const toast = useToast();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [invoice, setInvoice] = useState(null);

  // Sample invoice data (in real app, this would come from API)
  const sampleInvoices = [
    {
      id: "INV-1704067200000",
      date: "2024-01-01",
      customer: { name: "Alex Martinez", phone: "+92 321 2345678", email: "alex@gmail.com" },
      total: 22500,
      paymentType: "Card",
      status: "Paid",
      items: [
        { 
          id: 1,
          productName: "Optimum Nutrition Gold Standard Whey", 
          quantity: 3, 
          price: 7500, 
          total: 22500,
          image: whey_dummy
        }
      ],
      subtotal: 22500,
      discount: 0,
      tax: 3375,
      notes: "Card payment processed successfully"
    },
    {
      id: "INV-1703980800000",
      date: "2024-01-02",
      customer: { name: "Sarah Johnson", phone: "+92 300 1234567", email: "sarah@gmail.com" },
      total: 17000,
      paymentType: "Cash",
      status: "Paid",
      items: [
        { 
          id: 2,
          productName: "Dymatize ISO100 Whey Protein", 
          quantity: 2, 
          price: 8500, 
          total: 17000,
          image: whey_dummy
        }
      ],
      subtotal: 17000,
      discount: 0,
      tax: 2550,
      notes: "Cash payment received"
    },
    {
      id: "INV-1703894400000",
      date: "2024-01-03",
      customer: { name: "Mike Chen", phone: "+92 333 9876543", email: "mike@gmail.com" },
      total: 9600,
      paymentType: "Card",
      status: "Paid",
      items: [
        { 
          id: 3,
          productName: "MuscleTech Creatine Monohydrate", 
          quantity: 3, 
          price: 3200, 
          total: 9600,
          image: whey_dummy
        }
      ],
      subtotal: 9600,
      discount: 0,
      tax: 1440,
      notes: "Online payment"
    },
    {
      id: "INV-1703808000000",
      date: "2024-01-04",
      customer: { name: "Guest", phone: "", email: "" },
      total: 11000,
      paymentType: "Cash",
      status: "Paid",
      items: [
        { 
          id: 4,
          productName: "BSN N.O.-XPLODE Pre-Workout", 
          quantity: 2, 
          price: 5500, 
          total: 11000,
          image: whey_dummy
        }
      ],
      subtotal: 11000,
      discount: 0,
      tax: 1650,
      notes: "Walk-in customer"
    },
    {
      id: "INV-1703721600000",
      date: "2024-01-05",
      customer: { name: "Emma Davis", phone: "+92 301 4567890", email: "emma@gmail.com" },
      total: 14400,
      paymentType: "Other",
      status: "Pending",
      items: [
        { 
          id: 5,
          productName: "Universal Animal Pak Multivitamin", 
          quantity: 3, 
          price: 4800, 
          total: 14400,
          image: whey_dummy
        }
      ],
      subtotal: 14400,
      discount: 0,
      tax: 2160,
      notes: "Pending bank transfer"
    }
  ];

  useEffect(() => {
    // Get invoice ID from URL params
    const urlParams = new URLSearchParams(location.search);
    const invoiceId = urlParams.get('invoiceId');
    
    if (invoiceId) {
      const foundInvoice = sampleInvoices.find(inv => inv.id === invoiceId);
      if (foundInvoice) {
        setInvoice(foundInvoice);
      } else {
        // Invoice not found, redirect to invoices
        history.push('/admin/invoices');
      }
    } else {
      // No invoice ID, redirect to invoices
      history.push('/admin/invoices');
    }
  }, [location.search, history]);

  const handlePrint = () => {
    toast({
      title: "Print Invoice",
      description: `Printing invoice ${invoice.id}`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleEmail = () => {
    if (invoice.customer.email) {
      toast({
        title: "Email Sent",
        description: `Invoice ${invoice.id} sent to ${invoice.customer.email}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "No Email Address",
        description: "Customer email not available",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = () => {
    toast({
      title: "Invoice Deleted",
      description: `Invoice ${invoice.id} has been deleted`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    onDeleteClose();
    history.push('/admin/invoices');
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

  if (!invoice) {
    return (
      <Box>
        <Text>Loading invoice...</Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <HStack spacing={4}>
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="ghost"
            onClick={() => history.push('/admin/invoices')}
            size="sm"
          >
            Back to Invoices
          </Button>
          <VStack align="start" spacing={0}>
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Invoice Details
            </Text>
            <Text fontSize="sm" color={cardLabelColor}>
              {invoice.id}
            </Text>
          </VStack>
        </HStack>
        
        <HStack spacing={2}>
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
          <Button
            leftIcon={<DownloadIcon />}
            variant="outline"
            colorScheme="teal"
            size="sm"
            onClick={handlePrint}
          >
            Print
          </Button>
          {invoice.customer.email && (
            <Button
              leftIcon={<EmailIcon />}
              variant="outline"
              colorScheme="teal"
              size="sm"
              onClick={handleEmail}
            >
              Email
            </Button>
          )}
          <Button
            leftIcon={<DeleteIcon />}
            variant="outline"
            colorScheme="red"
            size="sm"
            onClick={onDeleteOpen}
          >
            Delete
          </Button>
        </HStack>
      </Flex>

      <Grid 
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }} 
        gap={6}
      >
        {/* Left Column - Invoice Info */}
        <GridItem>
          <VStack spacing={6} align="stretch">
            {/* Customer Info */}
            <Card borderRadius="xl">
              <CardHeader>
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  Customer Information
                </Text>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color={cardLabelColor} mb={1}>
                      Name
                    </Text>
                    <Text fontSize="md" fontWeight="semibold" color={textColor}>
                      {invoice.customer.name}
                    </Text>
                  </Box>
                  
                  {invoice.customer.phone && (
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color={cardLabelColor} mb={1}>
                        Phone
                      </Text>
                      <Text fontSize="md" color={textColor}>
                        {invoice.customer.phone}
                      </Text>
                    </Box>
                  )}
                  
                  {invoice.customer.email && (
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color={cardLabelColor} mb={1}>
                        Email
                      </Text>
                      <Text fontSize="md" color={textColor}>
                        {invoice.customer.email}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Payment Info */}
            <Card borderRadius="xl">
              <CardHeader>
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  Payment Information
                </Text>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color={cardLabelColor} mb={1}>
                      Payment Method
                    </Text>
                    <Text fontSize="md" color={textColor}>
                      {invoice.paymentType}
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color={cardLabelColor} mb={1}>
                      Date
                    </Text>
                    <Text fontSize="md" color={textColor}>
                      {invoice.date}
                    </Text>
                  </Box>
                  
                  {invoice.notes && (
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color={cardLabelColor} mb={1}>
                        Notes
                      </Text>
                      <Text fontSize="md" color={textColor}>
                        {invoice.notes}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </GridItem>

        {/* Right Column - Items and Summary */}
        <GridItem>
          <VStack spacing={6} align="stretch">
            {/* Items Table */}
            <Card borderRadius="xl">
              <CardHeader>
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  Items
                </Text>
              </CardHeader>
              <CardBody pt={0}>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th color={textColor} fontSize="sm" fontWeight="bold" textTransform="none">
                        Product
                      </Th>
                      <Th color={textColor} fontSize="sm" fontWeight="bold" textTransform="none">
                        Qty
                      </Th>
                      <Th color={textColor} fontSize="sm" fontWeight="bold" textTransform="none">
                        Price
                      </Th>
                      <Th color={textColor} fontSize="sm" fontWeight="bold" textTransform="none">
                        Total
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {invoice.items.map((item, index) => (
                      <Tr key={index}>
                        <Td>
                          <HStack spacing={3}>
                            <Box
                              w="40px"
                              h="40px"
                              borderRadius="md"
                              overflow="hidden"
                              bg="gray.100"
                            >
                              <Image
                                src={item.image}
                                alt={item.productName}
                                w="100%"
                                h="100%"
                                objectFit="cover"
                              />
                            </Box>
                            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                              {item.productName}
                            </Text>
                          </HStack>
                        </Td>
                        <Td>
                          <Text fontSize="sm" color={textColor}>
                            {item.quantity}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontSize="sm" color={textColor}>
                            PKR {item.price.toLocaleString()}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontSize="sm" fontWeight="bold" color={textColor}>
                            PKR {item.total.toLocaleString()}
                          </Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>

            {/* Summary */}
            <Card borderRadius="xl">
              <CardHeader>
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  Summary
                </Text>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={3} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={cardLabelColor}>Subtotal:</Text>
                    <Text fontSize="sm" fontWeight="semibold">PKR {invoice.subtotal.toLocaleString()}</Text>
                  </HStack>
                  
                  {invoice.discount > 0 && (
                    <HStack justify="space-between">
                      <Text fontSize="sm" color={cardLabelColor}>Discount:</Text>
                      <Text fontSize="sm" fontWeight="semibold" color="red.500">
                        -PKR {invoice.discount.toLocaleString()}
                      </Text>
                    </HStack>
                  )}
                  
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={cardLabelColor}>Tax (15%):</Text>
                    <Text fontSize="sm" fontWeight="semibold">PKR {invoice.tax.toLocaleString()}</Text>
                  </HStack>
                  
                  <Divider />
                  
                  <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>Total:</Text>
                    <Text fontSize="lg" fontWeight="bold" color="brand.500">
                      PKR {invoice.total.toLocaleString()}
                    </Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </GridItem>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Invoice
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete invoice {invoice.id}? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default InvoiceDetailComponent;
