// Chakra imports
import {
  Box,
  Flex,
  Text,
  Image,
  Badge,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  Divider,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure as useAlertDisclosure,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import { EditIcon, DeleteIcon, ArrowBackIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useProducts } from "contexts/ProductContext";
import whey_dummy from "assets/img/whey_dummy.png";
import EditProductModal from "components/Modals/EditProductModal";
import AppLoader from "components/Loaders/AppLoader";

const ProductProfile = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardLabelColor = useColorModeValue("gray.600", "gray.300");
  const cardIconColor = useColorModeValue("gray.500", "gray.400");
  
  const history = useHistory();
  const location = useLocation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useAlertDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  
  const { getProductById, restock, removeProduct } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restockQuantity, setRestockQuantity] = useState(0);

  // Sample product data (in real app, this would come from API/state)
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
      lastUpdated: "2024-01-15",
      description: "Premium whey protein powder with 24g of protein per serving. Contains essential amino acids and supports muscle recovery and growth.",
      specifications: {
        "Brand": "Optimum Nutrition",
        "Flavor": "Chocolate",
        "Size": "5 lbs",
        "Protein": "24g per serving",
        "Servings": "74 servings",
        "Type": "Whey Isolate"
      },
      recentSales: [
        { date: "2024-01-14", quantity: 2, total: 15000, customer: "Alex Martinez" },
        { date: "2024-01-12", quantity: 1, total: 7500, customer: "Sarah Johnson" },
        { date: "2024-01-10", quantity: 3, total: 22500, customer: "Mike Chen" },
        { date: "2024-01-08", quantity: 1, total: 7500, customer: "Emma Davis" }
      ],
      supplierInfo: {
        name: "Optimum Nutrition",
        contact: "+1 (800) 705-5226",
        email: "orders@optimumnutrition.com",
        address: "575 Underhill Blvd, Syosset, NY 11791"
      }
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
      lastUpdated: "2024-01-20",
      description: "Hydrolyzed whey protein isolate with 25g of protein per serving. Fast-absorbing formula for post-workout recovery.",
      specifications: {
        "Brand": "Dymatize Nutrition",
        "Flavor": "Vanilla",
        "Size": "5 lbs",
        "Protein": "25g per serving",
        "Servings": "71 servings",
        "Type": "Hydrolyzed Whey Isolate"
      },
      recentSales: [
        { date: "2024-01-19", quantity: 3, total: 25500, customer: "John Smith" },
        { date: "2024-01-18", quantity: 1, total: 8500, customer: "Lisa Wang" },
        { date: "2024-01-16", quantity: 2, total: 17000, customer: "David Brown" }
      ],
      supplierInfo: {
        name: "Dymatize Nutrition",
        contact: "+1 (800) 934-8448",
        email: "info@dymatize.com",
        address: "2900 N. Dallas Pkwy, Suite 320, Plano, TX 75093"
      }
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
      lastUpdated: "2024-01-18",
      description: "Pure creatine monohydrate powder for increased strength, power, and muscle mass. 100% pure and unflavored.",
      specifications: {
        "Brand": "MuscleTech",
        "Flavor": "Unflavored",
        "Size": "2.2 lbs",
        "Creatine": "5g per serving",
        "Servings": "200 servings",
        "Type": "Creatine Monohydrate"
      },
      recentSales: [
        { date: "2024-01-17", quantity: 2, total: 6400, customer: "Maria Garcia" },
        { date: "2024-01-16", quantity: 1, total: 3200, customer: "Tom Wilson" },
        { date: "2024-01-14", quantity: 4, total: 12800, customer: "Jennifer Lee" }
      ],
      supplierInfo: {
        name: "MuscleTech",
        contact: "+1 (800) 663-7619",
        email: "customerservice@muscletech.com",
        address: "1500 Weston Rd, Weston, FL 33326"
      }
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
      lastUpdated: "2024-01-16",
      description: "Advanced pre-workout supplement with caffeine, creatine, and beta-alanine for explosive energy and performance.",
      specifications: {
        "Brand": "BSN",
        "Flavor": "Fruit Punch",
        "Size": "60 servings",
        "Caffeine": "175mg per serving",
        "Creatine": "1g per serving",
        "Type": "Pre-Workout"
      },
      recentSales: [
        { date: "2024-01-15", quantity: 4, total: 22000, customer: "Ryan Murphy" },
        { date: "2024-01-13", quantity: 2, total: 11000, customer: "Amanda Taylor" },
        { date: "2024-01-11", quantity: 1, total: 5500, customer: "Kevin Anderson" }
      ],
      supplierInfo: {
        name: "BSN",
        contact: "+1 (800) 542-2376",
        email: "info@bsnsupplements.com",
        address: "2500 Broadway St, Redwood City, CA 94063"
      }
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
      lastUpdated: "2024-01-22",
      description: "Comprehensive multivitamin and mineral supplement with 11 tablets per pack. Complete nutritional foundation for athletes.",
      specifications: {
        "Brand": "Universal Nutrition",
        "Type": "Multivitamin Pack",
        "Size": "44 packs",
        "Tablets": "11 per pack",
        "Vitamins": "22+ essential vitamins",
        "Minerals": "10+ essential minerals"
      },
      recentSales: [
        { date: "2024-01-21", quantity: 1, total: 4800, customer: "Chris Johnson" },
        { date: "2024-01-20", quantity: 3, total: 14400, customer: "Rachel Green" },
        { date: "2024-01-18", quantity: 2, total: 9600, customer: "Mark Thompson" }
      ],
      supplierInfo: {
        name: "Universal Nutrition",
        contact: "+1 (800) 872-0101",
        email: "info@universalnutrition.com",
        address: "200 Connell Dr, Berkeley Heights, NJ 07922"
      }
    }
  ];

  useEffect(() => {
    // Get product ID from URL params
    const urlParams = new URLSearchParams(location.search);
    const productId = urlParams.get('productId');
    
    if (productId) {
      loadProduct(productId);
    } else {
      // No product ID, redirect to inventory
      history.push('/admin/inventory-management');
    }
  }, [location.search, history]);

  const loadProduct = async (productId) => {
    setLoading(true);
    try {
      const productData = await getProductById(parseInt(productId));
      setProduct(productData);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load product',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // Product not found, redirect to inventory
      history.push('/admin/inventory-management');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    history.push('/admin/inventory-management');
  };

  const handleEdit = () => {
    onEditOpen();
  };

  const handleRestock = async () => {
    if (restockQuantity > 0) {
      try {
        const updatedProduct = await restock(product.id, restockQuantity);
        setProduct(updatedProduct);
        setRestockQuantity(0);
        onClose();
        toast({
          title: "Stock Updated",
          description: `Added ${restockQuantity} units to ${product.name}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to restock product',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleDelete = async () => {
    try {
      await removeProduct(product.id);
      toast({
        title: "Product Deleted",
        description: `${product.name} has been deleted from inventory.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      history.push('/admin/inventory-management');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      onDeleteClose();
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity <= 3) {
      return { status: 'Low Stock', color: 'red' };
    } else if (quantity <= 10) {
      return { status: 'Medium Stock', color: 'yellow' };
    } else {
      return { status: 'High Stock', color: 'green' };
    }
  };

  if (loading || !product) {
    return <AppLoader message="Loading product..." fullHeight />;
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <Box w="full" px={{ base: 4, md: 6 }}>
      {/* Header */}
      <Flex 
        justify="space-between" 
        align="center" 
        mb={{ base: 6, md: 8 }} 
        flexWrap="wrap" 
        gap={4}
        direction={{ base: "column", lg: "row" }}
      >
        <HStack spacing={4}>
          <IconButton
            icon={<ArrowBackIcon />}
            variant="ghost"
            onClick={handleBack}
            aria-label="Go back"
            size="lg"
            borderRadius="full"
            bg={useColorModeValue("white", "gray.700")}
            color={textColor}
            _hover={{ 
              bg: useColorModeValue("gray.50", "gray.600"),
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
            transition="all 0.2s ease"
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.600")}
          />
          <VStack align="start" spacing={1}>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color={textColor}>
              {product.name}
            </Text>
            <HStack spacing={4}>
              <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                {product.category}
              </Badge>
              {/* <Text fontSize="md" color={cardLabelColor}>
                Product Details & Management
              </Text> */}
            </HStack>
          </VStack>
        </HStack>
        
        <HStack spacing={{ base: 2, lg: 3 }} flexWrap="wrap" justify={{ base: "center", lg: "flex-end" }}>
          <Button
            leftIcon={<EditIcon />}
            bg="brand.500"
            color="white"
            onClick={handleEdit}
            size={{ base: "xs", md: "sm", lg: "md" }}
            borderRadius="lg"
            _hover={{ 
              bg: "brand.600",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0, 128, 128, 0.2)"
            }}
            _active={{
              transform: "translateY(0px)",
              bg: "brand.700"
            }}
            transition="all 0.2s ease"
            fontWeight="medium"
            px={{ base: 3, md: 4, lg: 6 }}
            py={{ base: 1, md: 2, lg: 3 }}
            fontSize={{ base: "xs", md: "sm", lg: "md" }}
            minW={{ base: "80px", md: "auto" }}
          >
            <Text display={{ base: "none", sm: "inline" }}>Edit Product</Text>
            <Text display={{ base: "inline", sm: "none" }}>Edit</Text>
          </Button>
          <Button
            leftIcon={<DeleteIcon />}
            bg="white"
            color="brand.500"
            border="1px solid"
            borderColor="brand.500"
            onClick={onDeleteOpen}
            size={{ base: "xs", md: "sm", lg: "md" }}
            borderRadius="lg"
            _hover={{ 
              bg: "brand.50", 
              borderColor: "brand.600",
              color: "brand.600",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0, 128, 128, 0.1)"
            }}
            _active={{
              transform: "translateY(0px)",
              bg: "brand.100"
            }}
            transition="all 0.2s ease"
            fontWeight="medium"
            px={{ base: 3, md: 4, lg: 6 }}
            py={{ base: 1, md: 2, lg: 3 }}
            fontSize={{ base: "xs", md: "sm", lg: "md" }}
            minW={{ base: "80px", md: "auto" }}
          >
            <Text display={{ base: "none", sm: "inline" }}>Delete Product</Text>
            <Text display={{ base: "inline", sm: "none" }}>Delete</Text>
          </Button>
        </HStack>
      </Flex>

      <Grid 
        templateColumns={{ 
          base: "1fr", 
          md: "1fr 1fr", 
          lg: "400px 1fr", 
          xl: "450px 1fr" 
        }} 
        gap={{ base: 4, md: 6, lg: 8 }} 
        align="start"
      >
        {/* Left Column */}
        <GridItem>
          {/* Product Image Card */}
          <Card mb={2} borderRadius="lg" overflow="hidden" h="fit-content">
            <CardBody p={0} display="flex" flexDirection="column" h="full">
              <Box position="relative" flex="1" display="flex" alignItems="center" justifyContent="center" h="120px">
                <Image
                  src={product.image_url || '/api/placeholder/120/120'}
                  alt={product.name}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  fallbackSrc="/api/placeholder/120/120"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/120/120";
                  }}
                />
                <Box
                  position="absolute"
                  top={2}
                  right={2}
                  bg="blackAlpha.700"
                  color="white"
                  px={2}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  {product.category}
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* Stock Status Card */}
          <Card mb={2} borderRadius="lg" h="fit-content">
            <CardHeader pb={2}>
              <HStack justify="space-between" align="center">
                <Text fontSize="md" fontWeight="bold">Stock Status</Text>
                <Badge
                  colorScheme={stockStatus.color}
                  variant="solid"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="bold"
                >
                  {stockStatus.status}
                </Badge>
              </HStack>
            </CardHeader>
            <CardBody pt={0} display="flex" flexDirection="column" h="full">
              <VStack spacing={2} align="stretch" flex="1">
                <Box textAlign="center" py={2} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md" h="80px" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                  <Text fontSize="2xl" fontWeight="bold" color={`${stockStatus.color}.500`}>
                    {product.stockQuantity}
                  </Text>
                  <Text fontSize="xs" color={cardLabelColor} fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                    Units in Stock
                  </Text>
                </Box>
                
                <HStack justify="space-between" h="fit-content">
                  <Text fontSize="xs" color={cardLabelColor}>Last Updated:</Text>
                  <Text fontSize="xs" fontWeight="medium">{product.lastUpdated}</Text>
                </HStack>
                
                <Button
                  bg="brand.500"
                  color="white"
                  onClick={onOpen}
                  size="sm"
                  borderRadius="lg"
                  _hover={{ 
                    bg: "brand.600",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(0, 128, 128, 0.2)"
                  }}
                  _active={{
                    transform: "translateY(0px)",
                    bg: "brand.700"
                  }}
                  transition="all 0.2s ease"
                  fontWeight="medium"
                  fontSize="sm"
                  px={4}
                  py={2}
                >
                  Restock Product
                </Button>
              </VStack>
            </CardBody>
          </Card>

        </GridItem>

        {/* Right Column */}
        <GridItem>
          {/* Product Information */}
          <Card mb={{ base: 4, md: 6 }} borderRadius="xl" h="fit-content">
            <CardHeader pb={4}>
              <Text fontSize="lg" fontWeight="bold">Product Information</Text>
            </CardHeader>
            <CardBody pt={0} display="flex" flexDirection="column" h="full">
              <VStack spacing={{ base: 3, md: 4 }} mb={{ base: 4, md: 6 }} flex="1">
                {/* Top Row - Cost Price and Selling Price */}
                <Grid 
                  templateColumns={{ 
                    base: "1fr 1fr", 
                    md: "1fr 1fr" 
                  }} 
                  gap={{ base: 3, md: 4 }}
                  w="full"
                >
                  <Box 
                    p={{ base: 3, md: 6 }} 
                    bg={useColorModeValue("red.50", "red.900")} 
                    borderRadius="md" 
                    h={{ base: "90px", md: "140px" }} 
                    display="flex" 
                    flexDirection="column" 
                    justifyContent="center" 
                    alignItems="center" 
                    textAlign="center"
                  >
                    <Text fontSize={{ base: "xs", md: "sm" }} color={cardLabelColor} mb={{ base: 1, md: 3 }} textTransform="uppercase" letterSpacing="wide" fontWeight="medium">Cost Price</Text>
                    <Text fontSize={{ base: "lg", md: "3xl" }} fontWeight="bold" color="red.500">
                      PKR {parseFloat(product.cost_price || 0).toLocaleString()}
                    </Text>
                  </Box>
                  <Box 
                    p={{ base: 3, md: 6 }} 
                    bg={useColorModeValue("green.50", "green.900")} 
                    borderRadius="md" 
                    h={{ base: "90px", md: "140px" }} 
                    display="flex" 
                    flexDirection="column" 
                    justifyContent="center" 
                    alignItems="center" 
                    textAlign="center"
                  >
                    <Text fontSize={{ base: "xs", md: "sm" }} color={cardLabelColor} mb={{ base: 1, md: 3 }} textTransform="uppercase" letterSpacing="wide" fontWeight="medium">Selling Price</Text>
                    <Text fontSize={{ base: "lg", md: "3xl" }} fontWeight="bold" color="green.500">
                      PKR {parseFloat(product.selling_price || 0).toLocaleString()}
                    </Text>
                  </Box>
                </Grid>

                {/* Bottom Row - Profit Card (Full Width on Mobile) */}
                <Box 
                  p={{ base: 3, md: 6 }} 
                  bg={useColorModeValue("blue.50", "blue.900")} 
                  borderRadius="md" 
                  h={{ base: "90px", md: "140px" }} 
                  display="flex" 
                  flexDirection="column" 
                  justifyContent="center" 
                  alignItems="center" 
                  textAlign="center"
                  w="full"
                >
                  <Text fontSize={{ base: "xs", md: "sm" }} color={cardLabelColor} mb={{ base: 1, md: 3 }} textTransform="uppercase" letterSpacing="wide" fontWeight="medium">Profit</Text>
                  <VStack spacing={{ base: 1, md: 2 }}>
                    <Text fontSize={{ base: "lg", md: "3xl" }} fontWeight="bold" color="blue.500">
                      PKR {(parseFloat(product.selling_price || 0) - parseFloat(product.cost_price || 0)).toLocaleString()}
                    </Text>
                    <Badge colorScheme="blue" variant="solid" px={{ base: 2, md: 3 }} py={{ base: 0.5, md: 1 }} borderRadius="md" fontSize={{ base: "xs", md: "sm" }}>
                      {Math.round(((parseFloat(product.selling_price || 0) - parseFloat(product.cost_price || 0)) / parseFloat(product.cost_price || 1)) * 100)}%
                    </Badge>
                  </VStack>
                </Box>
              </VStack>
              
              <Box flex="1">
                <Text fontWeight="bold" mb={3} fontSize="lg">Description</Text>
                <Text color={cardLabelColor} lineHeight="1.6" fontSize="md">{product.description}</Text>
              </Box>
            </CardBody>
          </Card>

          {/* Specifications & Supplier Info and Recent Sales Side by Side */}
          <Grid 
            templateColumns={{ 
              base: "1fr", 
              md: "1fr 1fr" 
            }} 
            gap={{ base: 4, md: 6 }} 
            align="stretch"
          >
            {/* Specifications & Supplier Information */}
            <Card borderRadius="xl" h="full">
              <CardHeader pb={3}>
                <Text fontSize="md" fontWeight="bold">Specifications & Supplier</Text>
              </CardHeader>
              <CardBody pt={0} display="flex" flexDirection="column" h="full" p={{ base: 4, md: 6 }}>
                <VStack spacing={{ base: 4, md: 0 }} align="stretch" flex="1">
                  {/* Specifications Grid */}
                  <Box>
                    <Text fontSize={{ base: "sm", md: "xs" }} fontWeight="bold" mb={{ base: 3, md: 2 }} color={cardLabelColor} textTransform="uppercase" letterSpacing="wide">PRODUCT SPECS</Text>
                    <Grid 
                      templateColumns={{ 
                        base: "1fr", 
                        sm: "1fr 1fr" 
                      }} 
                      gap={{ base: 2, md: 1 }}
                    >
                      {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                        <Box 
                          key={key} 
                          p={{ base: 3, md: 2 }} 
                          bg={useColorModeValue("gray.50", "gray.700")} 
                          borderRadius={{ base: "lg", md: "md" }} 
                          display="flex" 
                          flexDirection={{ base: "column", md: "row" }} 
                          justifyContent={{ base: "flex-start", md: "space-between" }} 
                          alignItems={{ base: "flex-start", md: "center" }} 
                          _hover={{ 
                            bg: useColorModeValue("gray.100", "gray.600"),
                            transform: "translateY(-1px)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                          }}
                          transition="all 0.2s ease"
                        >
                          <Text 
                            fontSize={{ base: "xs", md: "xs" }} 
                            color={cardLabelColor} 
                            textTransform="uppercase" 
                            fontWeight="medium"
                            mb={{ base: 1, md: 0 }}
                          >
                            {key}:
                          </Text>
                          <Text 
                            fontWeight="bold" 
                            fontSize={{ base: "sm", md: "xs" }} 
                            color={textColor}
                            textAlign={{ base: "left", md: "right" }}
                          >
                            {value}
                          </Text>
                        </Box>
                      ))}
                    </Grid>
                  </Box>
                  
                  {/* Supplier Information */}
                  <Box>
                    <Text fontSize={{ base: "sm", md: "xs" }} fontWeight="bold" mb={{ base: 3, md: 2 }} color={cardLabelColor} textTransform="uppercase" letterSpacing="wide">SUPPLIER INFO</Text>
                    <VStack spacing={{ base: 3, md: 1 }} align="stretch">
                      <Box 
                        p={{ base: 3, md: 2 }} 
                        bg={useColorModeValue("blue.50", "blue.900")} 
                        borderRadius={{ base: "lg", md: "md" }} 
                        display="flex" 
                        flexDirection="column" 
                        justifyContent="center"
                        _hover={{ 
                          bg: useColorModeValue("blue.100", "blue.800"),
                          transform: "translateY(-1px)",
                          boxShadow: "0 2px 8px rgba(59, 130, 246, 0.1)"
                        }}
                        transition="all 0.2s ease"
                      >
                        <Text fontSize={{ base: "xs", md: "xs" }} color={cardLabelColor} mb={{ base: 1, md: 0 }} fontWeight="medium">Company</Text>
                        <Text fontWeight="bold" fontSize={{ base: "sm", md: "xs" }} color="blue.600">{product.supplier || 'N/A'}</Text>
                      </Box>
                      
                      <Box 
                        p={{ base: 3, md: 2 }} 
                        bg={useColorModeValue("gray.50", "gray.700")} 
                        borderRadius={{ base: "lg", md: "md" }} 
                        display="flex" 
                        flexDirection={{ base: "column", md: "row" }} 
                        justifyContent={{ base: "flex-start", md: "space-between" }} 
                        alignItems={{ base: "flex-start", md: "center" }}
                        _hover={{ 
                          bg: useColorModeValue("gray.100", "gray.600"),
                          transform: "translateY(-1px)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}
                        transition="all 0.2s ease"
                      >
                        <Text fontSize={{ base: "xs", md: "xs" }} fontWeight="medium" mb={{ base: 1, md: 0 }} color={cardLabelColor}>Contact:</Text>
                        <Text fontSize={{ base: "sm", md: "xs" }} fontWeight="bold" color={textColor}>{product.supplier_contact || 'N/A'}</Text>
                      </Box>
                      
                      <Box 
                        p={{ base: 3, md: 2 }} 
                        bg={useColorModeValue("gray.50", "gray.700")} 
                        borderRadius={{ base: "lg", md: "md" }} 
                        display="flex" 
                        flexDirection={{ base: "column", md: "row" }} 
                        justifyContent={{ base: "flex-start", md: "space-between" }} 
                        alignItems={{ base: "flex-start", md: "center" }}
                        _hover={{ 
                          bg: useColorModeValue("gray.100", "gray.600"),
                          transform: "translateY(-1px)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}
                        transition="all 0.2s ease"
                      >
                        <Text fontSize={{ base: "xs", md: "xs" }} fontWeight="medium" mb={{ base: 1, md: 0 }} color={cardLabelColor}>Email:</Text>
                        <Text fontSize={{ base: "sm", md: "xs" }} fontWeight="bold" color={textColor} wordBreak="break-all">{product.supplier_email || 'N/A'}</Text>
                      </Box>
                      
                      <Box 
                        p={{ base: 3, md: 2 }} 
                        bg={useColorModeValue("gray.50", "gray.700")} 
                        borderRadius={{ base: "lg", md: "md" }} 
                        display="flex" 
                        flexDirection="column" 
                        justifyContent="center"
                        _hover={{ 
                          bg: useColorModeValue("gray.100", "gray.600"),
                          transform: "translateY(-1px)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}
                        transition="all 0.2s ease"
                      >
                        <Text fontWeight="medium" mb={{ base: 1, md: 0 }} fontSize={{ base: "xs", md: "xs" }} color={cardLabelColor}>Address</Text>
                        <Text fontSize={{ base: "sm", md: "xs" }} color={textColor} lineHeight="1.4">
                          {product.supplier_address || 'N/A'}
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>

            {/* Recent Sales */}
            <Card borderRadius="xl" h="full">
              <CardHeader pb={3}>
                <HStack justify="space-between" align="center">
                  <Text fontSize="md" fontWeight="bold">Recent Sales</Text>
                  {product.recentSales && product.recentSales.length > 0 && (
                    <Badge colorScheme="green" variant="subtle" px={2} py={1} borderRadius="full" fontSize="xs">
                      {product.recentSales.length} transactions
                    </Badge>
                  )}
                </HStack>
              </CardHeader>
              <CardBody pt={0} display="flex" flexDirection="column" h="full">
                <VStack spacing={2} align="stretch" flex="1">
                  {product.recentSales && product.recentSales.length > 0 ? product.recentSales.map((sale, index) => (
                    <Box 
                      key={index} 
                      p={3} 
                      bg={useColorModeValue("gray.50", "gray.700")} 
                      borderRadius="md"
                      _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
                      transition="all 0.2s"
                      flex="1"
                    >
                      <HStack justify="space-between" align="center">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold" fontSize="sm">{sale.date}</Text>
                          <Text fontSize="xs" color={cardLabelColor}>{sale.customer}</Text>
                        </VStack>
                        <HStack spacing={3}>
                          <Box textAlign="center">
                            <Text fontSize="sm" fontWeight="bold" color="blue.500">
                              {sale.quantity}
                            </Text>
                            <Text fontSize="xs" color={cardLabelColor}>qty</Text>
                          </Box>
                          <Box textAlign="center">
                    <Text fontSize="sm" fontWeight="bold" color="green.500">
                      PKR {sale.total.toLocaleString()}
                    </Text>
                            <Text fontSize="xs" color={cardLabelColor}>total</Text>
                          </Box>
                        </HStack>
                      </HStack>
                    </Box>
                  )) : (
                    <Box textAlign="center" py={8}>
                      <Text color={cardLabelColor} fontSize="sm">
                        No recent sales data available
                      </Text>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </Grid>
        </GridItem>
      </Grid>

      {/* Restock Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Restock Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>How many units would you like to add to {product.name}?</Text>
              <NumberInput
                value={restockQuantity}
                onChange={(value) => setRestockQuantity(parseInt(value) || 0)}
                min={0}
                w="200px"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text fontSize="sm" color={cardLabelColor}>
                Current stock: {product.stockQuantity} units
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              bg="white"
              color="brand.500"
              border="1px solid"
              borderColor="brand.500"
              mr={3} 
              onClick={onClose}
              _hover={{ 
                bg: "brand.50", 
                borderColor: "brand.600",
                color: "brand.600"
              }}
              transition="all 0.2s ease"
            >
              Cancel
            </Button>
            <Button
              bg="brand.500"
              color="white"
              onClick={handleRestock}
              isDisabled={restockQuantity <= 0}
              _hover={{ 
                bg: "brand.600",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0, 128, 128, 0.2)"
              }}
              _active={{
                transform: "translateY(0px)",
                bg: "brand.700"
              }}
              transition="all 0.2s ease"
            >
              Add Stock
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete "{product.name}"? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button 
                bg="white"
                color="brand.500"
                border="1px solid"
                borderColor="brand.500"
                onClick={onDeleteClose}
                _hover={{ 
                  bg: "brand.50", 
                  borderColor: "brand.600",
                  color: "brand.600"
                }}
                transition="all 0.2s ease"
              >
                Cancel
              </Button>
              <Button 
                bg="red.500"
                color="white"
                onClick={handleDelete} 
                ml={3}
                _hover={{ 
                  bg: "red.600",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)"
                }}
                _active={{
                  transform: "translateY(0px)",
                  bg: "red.700"
                }}
                transition="all 0.2s ease"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Edit Product Modal */}
      <EditProductModal 
        isOpen={isEditOpen} 
        onClose={() => {
          onEditClose();
          // Reload product after edit
          const urlParams = new URLSearchParams(location.search);
          const productId = urlParams.get('productId');
          if (productId) loadProduct(productId);
        }} 
        product={product} 
      />
    </Box>
  );
};

export default ProductProfile;
