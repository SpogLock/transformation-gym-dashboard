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
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Badge,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useBreakpointValue,
} from "@chakra-ui/react";
import { SearchIcon, AddIcon, MinusIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import whey_dummy from "assets/img/whey_dummy.png";

const SalesTable = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardLabelColor = useColorModeValue("gray.600", "gray.300");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const history = useHistory();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  // State for products, cart, search, and filters
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [discount, setDiscount] = useState(0);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // Sample product data (same as inventory)
  const sampleProducts = [
    {
      id: 1,
      image: whey_dummy,
      productName: "Optimum Nutrition Gold Standard Whey",
      category: "Protein Powder",
      stockQuantity: 15,
      costPrice: 4500,
      sellingPrice: 7500,
      supplier: "Optimum Nutrition",
    },
    {
      id: 2,
      image: whey_dummy,
      productName: "Dymatize ISO100 Whey Protein",
      category: "Protein Powder",
      stockQuantity: 22,
      costPrice: 5200,
      sellingPrice: 8500,
      supplier: "Dymatize Nutrition",
    },
    {
      id: 3,
      image: whey_dummy,
      productName: "MuscleTech Creatine Monohydrate",
      category: "Creatine",
      stockQuantity: 45,
      costPrice: 1800,
      sellingPrice: 3200,
      supplier: "MuscleTech",
    },
    {
      id: 4,
      image: whey_dummy,
      productName: "BSN N.O.-XPLODE Pre-Workout",
      category: "Pre-Workout",
      stockQuantity: 8,
      costPrice: 3200,
      sellingPrice: 5500,
      supplier: "BSN",
    },
    {
      id: 5,
      image: whey_dummy,
      productName: "Universal Animal Pak Multivitamin",
      category: "Multivitamin",
      stockQuantity: 35,
      costPrice: 2800,
      sellingPrice: 4800,
      supplier: "Universal Nutrition",
    }
  ];

  // Sample customers data
  const sampleCustomers = [
    { id: 1, name: "Alex Martinez", phone: "+92 321 2345678", email: "alex@gmail.com" },
    { id: 2, name: "Sarah Johnson", phone: "+92 300 1234567", email: "sarah@gmail.com" },
    { id: 3, name: "Mike Chen", phone: "+92 333 9876543", email: "mike@gmail.com" },
    { id: 4, name: "Emma Davis", phone: "+92 301 4567890", email: "emma@gmail.com" },
    { id: 5, name: "John Smith", phone: "+92 302 7890123", email: "john@gmail.com" }
  ];

  useEffect(() => {
    setProducts(sampleProducts);
  }, []);

  // Filter products based on search and filters
  const getFilteredProducts = () => {
    return products.filter(product => {
      const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesSupplier = !supplierFilter || product.supplier === supplierFilter;
      
      return matchesSearch && matchesCategory && matchesSupplier;
    });
  };

  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stockQuantity) {
        setCart(cart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast({
          title: "Out of Stock",
          description: `Only ${product.stockQuantity} units available`,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Update cart item quantity
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      const product = products.find(p => p.id === productId);
      if (newQuantity <= product.stockQuantity) {
        setCart(cart.map(item => 
          item.id === productId 
            ? { ...item, quantity: newQuantity }
            : item
        ));
      } else {
        toast({
          title: "Insufficient Stock",
          description: `Only ${product.stockQuantity} units available`,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setSelectedCustomer("");
    setPaymentMethod("");
    setDiscount(0);
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const tax = (subtotal - discountAmount) * 0.15; // 15% tax
  const total = subtotal - discountAmount + tax;

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before checkout",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Generate invoice ID
    const invoiceId = `INV-${Date.now()}`;
    
    // Update stock quantities
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          stockQuantity: product.stockQuantity - cartItem.quantity
        };
      }
      return product;
    });
    setProducts(updatedProducts);

    // Show success message
    toast({
      title: "Sale Completed!",
      description: `Invoice ${invoiceId} generated successfully`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    // Clear cart and reset form
    clearCart();
    
    // Navigate to invoice detail page
    history.push(`/admin/invoice-detail?invoiceId=${invoiceId}`);
  };

  // Get unique categories and suppliers for filters
  const categories = [...new Set(products.map(p => p.category))];
  const suppliers = [...new Set(products.map(p => p.supplier))];

  // Filter customers based on search
  const filteredCustomers = sampleCustomers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone.includes(customerSearch) ||
    customer.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Point of Sale
        </Text>
      </Flex>

      <Grid 
        templateColumns={{ base: "1fr", lg: "3fr 2fr" }} 
        templateRows={{ base: "auto auto", lg: "1fr" }}
        gap={6} 
        h={{ base: "auto", lg: "calc(100vh - 200px)" }}
      >
        {/* Left Section - Product Browser */}
        <GridItem>
          <Card borderRadius="xl" h="full">
            <CardHeader>
              <VStack spacing={4} align="stretch">
                {/* Search and Filters */}
                <Flex direction={{ base: "column", md: "row" }} gap={3}>
                  <InputGroup flex="1">
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      bg={useColorModeValue("gray.50", "gray.700")}
                      border="none"
                      borderRadius="lg"
                    />
                  </InputGroup>
                  
                  <Select
                    placeholder="All Categories"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    bg={useColorModeValue("gray.50", "gray.700")}
                    border="none"
                    borderRadius="lg"
                    w={{ base: "full", md: "200px" }}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Select>
                  
                  <Select
                    placeholder="All Suppliers"
                    value={supplierFilter}
                    onChange={(e) => setSupplierFilter(e.target.value)}
                    bg={useColorModeValue("gray.50", "gray.700")}
                    border="none"
                    borderRadius="lg"
                    w={{ base: "full", md: "200px" }}
                  >
                    {suppliers.map(supplier => (
                      <option key={supplier} value={supplier}>{supplier}</option>
                    ))}
                  </Select>
                </Flex>
              </VStack>
            </CardHeader>
            
            <CardBody pt={8}>
              {/* Products Grid */}
              <Grid 
                templateColumns={{ 
                  base: "repeat(2, 1fr)", 
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)", 
                  lg: "repeat(3, 1fr)",
                  xl: "repeat(4, 1fr)"
                }} 
                gap={4}
                maxH={{ lg: "calc(100vh - 400px)" }}
                overflowY="auto"
                w="full"
                p={2}
              >
                {getFilteredProducts().map((product) => (
                  <Box
                    key={product.id}
                    bg={cardBg}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={borderColor}
                    p={{ base: 3, md: 4 }}
                    cursor="pointer"
                    onClick={() => addToCart(product)}
                    transition="all 0.2s ease"
                    w="full"
                    minH="200px"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      borderColor: "brand.300"
                    }}
                  >
                    <VStack spacing={3} align="stretch">
                      <Box
                        w="100%"
                        h={{ base: "100px", md: "120px" }}
                        borderRadius="md"
                        overflow="hidden"
                        bg="gray.100"
                      >
                        <img
                          src={product.image}
                          alt={product.productName}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                        />
                      </Box>
                      
                      <VStack spacing={1} align="start">
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color={textColor} noOfLines={2}>
                          {product.productName}
                        </Text>
                        
                        <VStack spacing={1} align="stretch">
                          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="brand.500">
                            PKR {product.sellingPrice.toLocaleString()}
                          </Text>
                          <Badge
                            colorScheme={product.stockQuantity < 10 ? "red" : product.stockQuantity < 30 ? "yellow" : "green"}
                            variant="subtle"
                            fontSize="xs"
                            w="fit-content"
                          >
                            {product.stockQuantity} in stock
                          </Badge>
                        </VStack>
                        
                        <Text fontSize="xs" color={cardLabelColor} noOfLines={1}>
                          {product.category} • {product.supplier}
                        </Text>
                      </VStack>
                    </VStack>
                  </Box>
                ))}
              </Grid>
            </CardBody>
          </Card>
        </GridItem>

        {/* Right Section - Cart Panel */}
        <GridItem order={{ base: -1, lg: 0 }}>
          <Card borderRadius="xl" h={{ base: "auto", lg: "full" }} maxH={{ base: "400px", lg: "none" }}>
            <CardHeader>
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  Cart ({cart.length} items)
                </Text>
                {cart.length > 0 && (
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={onDeleteOpen}
                    leftIcon={<DeleteIcon />}
                  >
                    Clear
                  </Button>
                )}
              </HStack>
            </CardHeader>
            
            <CardBody pt={0} display="flex" flexDirection="column" h="full">
              {cart.length === 0 ? (
                <Flex flex="1" align="center" justify="center">
                  <VStack spacing={3}>
                    <Text color={cardLabelColor} textAlign="center">
                      Your cart is empty
                    </Text>
                    <Text fontSize="sm" color={cardLabelColor} textAlign="center">
                      Click on products to add them to your cart
                    </Text>
                  </VStack>
                </Flex>
              ) : (
                <VStack spacing={4} align="stretch" flex="1">
                  {/* Cart Items */}
                  <Box flex="1" overflowY="auto">
                    <VStack spacing={3} align="stretch">
                      {cart.map((item) => (
                        <Box
                          key={item.id}
                          p={3}
                          bg={useColorModeValue("gray.50", "gray.700")}
                          borderRadius="md"
                        >
                          <VStack spacing={2} align="stretch">
                            <HStack justify="space-between">
                              <Text fontSize="sm" fontWeight="semibold" color={textColor} noOfLines={2}>
                                {item.productName}
                              </Text>
                              <IconButton
                                size="xs"
                                variant="ghost"
                                colorScheme="red"
                                icon={<DeleteIcon />}
                                onClick={() => removeFromCart(item.id)}
                              />
                            </HStack>
                            
                            <HStack justify="space-between">
                              <HStack spacing={2}>
                                <IconButton
                                  size="xs"
                                  icon={<MinusIcon />}
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                />
                                <Text fontSize="sm" fontWeight="semibold" minW="20px" textAlign="center">
                                  {item.quantity}
                                </Text>
                                <IconButton
                                  size="xs"
                                  icon={<AddIcon />}
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                />
                              </HStack>
                              
                              <Text fontSize="sm" fontWeight="bold" color="brand.500">
                                PKR {(item.sellingPrice * item.quantity).toLocaleString()}
                              </Text>
                            </HStack>
                          </VStack>
                        </Box>
                      ))}
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Customer Selection */}
                  <VStack spacing={2} align="stretch">
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                      Customer
                    </Text>
                    <Box position="relative">
                      <Input
                        placeholder="Search customer..."
                        value={customerSearch}
                        onChange={(e) => {
                          setCustomerSearch(e.target.value);
                          setShowCustomerDropdown(true);
                        }}
                        onFocus={() => setShowCustomerDropdown(true)}
                        bg={useColorModeValue("gray.50", "gray.700")}
                        border="none"
                        borderRadius="md"
                      />
                      
                      {showCustomerDropdown && (
                        <Box
                          position="absolute"
                          top="100%"
                          left={0}
                          right={0}
                          bg={cardBg}
                          border="1px solid"
                          borderColor={borderColor}
                          borderRadius="md"
                          mt={1}
                          maxH="200px"
                          overflowY="auto"
                          zIndex={10}
                        >
                          <Button
                            w="full"
                            variant="ghost"
                            justifyContent="flex-start"
                            onClick={() => {
                              setSelectedCustomer("Guest");
                              setCustomerSearch("Guest Sale");
                              setShowCustomerDropdown(false);
                            }}
                          >
                            Guest Sale
                          </Button>
                          {filteredCustomers.map(customer => (
                            <Button
                              key={customer.id}
                              w="full"
                              variant="ghost"
                              justifyContent="flex-start"
                              onClick={() => {
                                setSelectedCustomer(customer.name);
                                setCustomerSearch(customer.name);
                                setShowCustomerDropdown(false);
                              }}
                            >
                              <VStack align="start" spacing={0}>
                                <Text fontSize="sm" fontWeight="semibold">{customer.name}</Text>
                                <Text fontSize="xs" color={cardLabelColor}>{customer.phone}</Text>
                              </VStack>
                            </Button>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </VStack>

                  {/* Discount Input */}
                  <VStack spacing={2} align="stretch">
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                      Discount (%)
                    </Text>
                    <NumberInput
                      value={discount}
                      onChange={(value) => setDiscount(parseFloat(value) || 0)}
                      min={0}
                      max={100}
                    >
                      <NumberInputField
                        bg={useColorModeValue("gray.50", "gray.700")}
                        border="none"
                        borderRadius="md"
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </VStack>

                  {/* Payment Method */}
                  <VStack spacing={2} align="stretch">
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                      Payment Method
                    </Text>
                    <HStack spacing={2}>
                      {["Cash", "Card", "Other"].map(method => (
                        <Button
                          key={method}
                          size="sm"
                          variant={paymentMethod === method ? "solid" : "outline"}
                          onClick={() => setPaymentMethod(method)}
                          flex="1"
                          borderColor={paymentMethod === method ? "transparent" : "brand.500"}
                          color={paymentMethod === method ? "white" : "brand.500"}
                          bg={paymentMethod === method ? "linear-gradient(81.62deg, brand.500 2.25%, brand.600 79.87%)" : "transparent"}
                          backgroundImage={paymentMethod === method ? "linear-gradient(81.62deg, var(--chakra-colors-brand-500) 2.25%, var(--chakra-colors-brand-600) 79.87%)" : undefined}
                          _hover={paymentMethod === method ? { bg: "linear-gradient(81.62deg, brand.600 2.25%, #234E52 79.87%)", color: "white" } : { bg: "rgba(49, 151, 149, 0.08)", borderColor: "brand.500" }}
                          _active={paymentMethod === method ? { bg: "brand.600" } : undefined}
                          _focus={{ boxShadow: "0 0 0 2px rgba(49, 151, 149, 0.4)" }}
                        >
                          {method}
                        </Button>
                      ))}
                    </HStack>
                  </VStack>

                  <Divider />

                  {/* Summary */}
                  <VStack spacing={2} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="sm" color={cardLabelColor}>Subtotal:</Text>
                      <Text fontSize="sm" fontWeight="semibold">PKR {subtotal.toLocaleString()}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color={cardLabelColor}>Discount:</Text>
                      <Text fontSize="sm" fontWeight="semibold" color="red.500">
                        -PKR {discountAmount.toLocaleString()}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color={cardLabelColor}>Tax (15%):</Text>
                      <Text fontSize="sm" fontWeight="semibold">PKR {tax.toLocaleString()}</Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between">
                      <Text fontSize="lg" fontWeight="bold" color={textColor}>Total:</Text>
                      <Text fontSize="lg" fontWeight="bold" color="brand.500">
                        PKR {total.toLocaleString()}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* Checkout Button */}
                  <Button
                    size="lg"
                    onClick={handleCheckout}
                    isDisabled={cart.length === 0 || !paymentMethod}
                    bg="linear-gradient(81.62deg, brand.500 2.25%, brand.600 79.87%)"
                    backgroundImage="linear-gradient(81.62deg, var(--chakra-colors-brand-500) 2.25%, var(--chakra-colors-brand-600) 79.87%)"
                    color="white"
                    _hover={{ bg: "linear-gradient(81.62deg, brand.600 2.25%, #234E52 79.87%)" }}
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
                    Checkout - PKR {total.toLocaleString()}
                  </Button>
                </VStack>
              )}
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Clear Cart Confirmation Dialog */}
      <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Clear Cart
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to clear all items from the cart? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => {
                clearCart();
                onDeleteClose();
              }} ml={3}>
                Clear Cart
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default SalesTable;
