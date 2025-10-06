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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Image,
  Tooltip,
  Portal,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Select,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon, SettingsIcon, CloseIcon, EditIcon, DeleteIcon, StarIcon, WarningIcon, CheckIcon, TimeIcon, HamburgerIcon, DownloadIcon, AttachmentIcon, AddIcon } from "@chakra-ui/icons";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import InventoryTableRow from "./InventoryTableRow";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSearch } from "contexts/SearchContext";
import whey_dummy from "assets/img/whey_dummy.png";

const InventoryTable = ({ title }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardTextColor = useColorModeValue("gray.700", "white");
  const cardLabelColor = useColorModeValue("gray.600", "gray.300");
  const cardIconColor = useColorModeValue("gray.500", "gray.400");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const history = useHistory();
  const { searchQuery, filters, updateFilters, clearFilters } = useSearch();
  const toast = useToast();
  
  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  // Get filter count for badge
  const getFilterCount = () => {
    return Object.values(filters).filter(filter => filter !== '').length;
  };
  
  // Inventory management data
  const [inventoryData, setInventoryData] = useState([
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
      recentSales: [
        { date: "2024-01-14", quantity: 2, total: 15000 },
        { date: "2024-01-12", quantity: 1, total: 7500 }
      ]
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
      recentSales: [
        { date: "2024-01-19", quantity: 3, total: 25500 },
        { date: "2024-01-18", quantity: 1, total: 8500 }
      ]
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
      recentSales: [
        { date: "2024-01-17", quantity: 2, total: 6400 },
        { date: "2024-01-16", quantity: 1, total: 3200 }
      ]
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
      recentSales: [
        { date: "2024-01-15", quantity: 4, total: 22000 },
        { date: "2024-01-13", quantity: 2, total: 11000 }
      ]
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
      recentSales: [
        { date: "2024-01-21", quantity: 1, total: 4800 },
        { date: "2024-01-20", quantity: 3, total: 14400 }
      ]
    }
  ]);

  const handleAddProduct = (newProduct) => {
    setInventoryData(prev => [...prev, newProduct]);
  };

  // Check stock status
  const getStockStatus = (quantity) => {
    if (quantity < 10) {
      return { status: 'low', color: 'red' };
    } else if (quantity <= 30) {
      return { status: 'medium', color: 'yellow' };
    } else {
      return { status: 'high', color: 'green' };
    }
  };

  // Filter and search products
  const getFilteredProducts = () => {
    let filteredData = [...inventoryData];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredData = filteredData.filter(product =>
        product.productName.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.supplier.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category) {
      filteredData = filteredData.filter(product =>
        product.category === filters.category
      );
    }

    // Stock status filter
    if (filters.stockStatus) {
      filteredData = filteredData.filter(product => {
        const stockStatus = getStockStatus(product.stockQuantity);
        return stockStatus.status === filters.stockStatus;
      });
    }

    return filteredData;
  };

  const filteredProducts = getFilteredProducts();

  // Navigate to product details
  const handleProductClick = (product) => {
    history.push(`/admin/product-profile?productId=${product.id}`);
  };


  // Hover modal handlers
  const handleMouseEnter = (product, event) => {
    setHoveredProduct(product);
    const productImage = event.currentTarget.querySelector('img');
    if (productImage) {
      const rect = productImage.getBoundingClientRect();
      setHoverPosition({
        x: rect.right + 10,
        y: rect.top - 10
      });
    } else {
      setHoverPosition({
        x: event.clientX + 20,
        y: event.clientY - 20
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredProduct(null);
  };

  // Hover Modal Component
  const HoverModal = () => {
    if (!hoveredProduct) return null;

    return (
      <Portal>
        <Box
          position="fixed"
          top={`${hoverPosition.y}px`}
          left={`${hoverPosition.x}px`}
          zIndex={9999}
          bg={cardBg}
          borderRadius="xl"
          boxShadow="0 10px 25px rgba(0, 0, 0, 0.15)"
          border="1px solid"
          borderColor={borderColor}
          p={6}
          minW="250px"
          transform="scale(0.9)"
          opacity={0}
          animation="fadeInScale 0.2s ease-out forwards"
        >
          <VStack spacing={4} align="center">
            <Box
              w="120px"
              h="120px"
              borderRadius="lg"
              overflow="hidden"
              border="4px solid"
              borderColor="blue.300"
              boxShadow="0 8px 20px rgba(0, 0, 0, 0.2)"
            >
              <Image
                src={hoveredProduct.image}
                alt={hoveredProduct.productName}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </Box>
            <VStack spacing={2} align="center">
              <Text fontSize="xl" fontWeight="bold" color={cardTextColor} textAlign="center">
                {hoveredProduct.productName}
              </Text>
              <HStack spacing={2} align="center">
                <Text fontSize="sm" color={cardTextColor} fontWeight="semibold">
                  {hoveredProduct.stockQuantity} in stock
                </Text>
                {getStockStatus(hoveredProduct.stockQuantity).status === 'low' && (
                  <WarningIcon color="red.500" boxSize={4} />
                )}
              </HStack>
              <Text fontSize="md" color={cardLabelColor} textAlign="center" fontWeight="medium">
                {hoveredProduct.category}
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Portal>
    );
  };

  // Inventory management captions - Clean key-style headers
  const inventoryCaptions = [
    { key: "Image", width: "8%" },
    { key: "Product Name", width: "18%" },
    { key: "Category", width: "12%" },
    { key: "Stock", width: "10%" },
    { key: "Cost Price", width: "12%" },
    { key: "Selling Price", width: "12%" },
    { key: "Supplier", width: "14%" },
    { key: "Last Updated", width: "12%" },
    { key: "Actions", width: "8%" }
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
            Inventory Management
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
                <MenuItem
                  icon={<SettingsIcon />}
                  position="relative"
                  onClick={() => {
                    // Handle filters in a simpler way or open a modal
                    console.log("Open filters");
                  }}
                >
                  <HStack justify="space-between" w="full">
                    <Text>Filters</Text>
                    {hasActiveFilters && (
                      <Badge
                        colorScheme="red"
                        borderRadius="full"
                        fontSize="8px"
                        minW="12px"
                        h="12px"
                        ml="auto"
                      >
                        {getFilterCount()}
                      </Badge>
                    )}
                  </HStack>
                </MenuItem>
                
                <MenuItem
                  icon={<AttachmentIcon />}
                  onClick={() => console.log("Import CSV clicked")}
                >
                  Import CSV
                </MenuItem>
                
                <MenuItem
                  icon={<DownloadIcon />}
                  onClick={() => console.log("Export clicked")}
                >
                  Export
                </MenuItem>
                
                <MenuItem
                  icon={<AddIcon />}
                  onClick={onOpen}
                  color="brand.600"
                  fontWeight="semibold"
                >
                  Add Product
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </CardHeader>
      
      <CardBody>
        {isMobile ? (
          // Mobile List View - Minimal Info
          <VStack spacing={3} align="stretch" w="100%">
            {filteredProducts.map((product, index) => (
              <Box
                key={`${product.id}-${index}`}
                bg={cardBg}
                borderRadius="8px"
                border="1px solid"
                borderColor={borderColor}
                p={3}
                w="100%"
                boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1)"
                cursor="pointer"
                onClick={() => handleProductClick(product)}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                position="relative"
                _hover={{
                  boxShadow: "0px 8px 25px rgba(56, 178, 172, 0.25)",
                  transform: "translateY(-4px) scale(1.02)",
                  borderColor: "brand.300",
                  bg: useColorModeValue("brand.50", "brand.900"),
                }}
              >
                <Flex justifyContent="space-between" alignItems="center">
                  <HStack spacing={3}>
                    <Box
                      w="40px"
                      h="40px"
                      borderRadius="md"
                      overflow="hidden"
                      border="2px solid"
                      borderColor={borderColor}
                      onMouseEnter={(e) => handleMouseEnter(product, e)}
                      onMouseLeave={handleMouseLeave}
                      cursor="pointer"
                      _hover={{
                        borderColor: "brand.300",
                        transform: "scale(1.05)",
                      }}
                      transition="all 0.2s ease-in-out"
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
                    <VStack align="start" spacing={0}>
                      <Text fontSize="md" fontWeight="bold" color={textColor}>
                        {product.productName}
                      </Text>
                      <Text fontSize="xs" color={cardLabelColor}>
                        {product.category}
                      </Text>
                      <Text fontSize="xs" color={cardLabelColor}>
                        {product.supplier}
                      </Text>
                    </VStack>
                  </HStack>
                  <VStack align="end" spacing={1}>
                    <HStack spacing={1} align="center">
                      <Text fontSize="sm" color={textColor} fontWeight="500">
                        {product.stockQuantity}
                      </Text>
                      {getStockStatus(product.stockQuantity).status === 'low' && (
                        <WarningIcon color="red.500" boxSize={3} />
                      )}
                    </HStack>
                    <Text fontSize="xs" color={cardLabelColor}>
                      PKR {product.sellingPrice.toLocaleString()}
                    </Text>
                  </VStack>
                </Flex>
              </Box>
            ))}
          </VStack>
        ) : isTablet ? (
          // Tablet Card View - More Details
          <VStack spacing={4} align="stretch" w="100%">
            {filteredProducts.map((product, index) => (
              <Box
                key={`${product.id}-${index}`}
                bg={cardBg}
                borderRadius="12px"
                border="1px solid"
                borderColor={borderColor}
                p={4}
                w="100%"
                boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
                cursor="pointer"
                onClick={() => handleProductClick(product)}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                position="relative"
                _hover={{
                  boxShadow: "0px 12px 30px rgba(56, 178, 172, 0.3)",
                  transform: "translateY(-6px) scale(1.03)",
                  borderColor: "brand.300",
                  bg: useColorModeValue("brand.50", "brand.900"),
                }}
              >
                {/* Header with Image, Name and Stock */}
                <Flex justifyContent="space-between" alignItems="center" mb={3}>
                  <HStack spacing={3}>
                    <Box
                      w="50px"
                      h="50px"
                      borderRadius="md"
                      overflow="hidden"
                      border="2px solid"
                      borderColor={borderColor}
                      onMouseEnter={(e) => handleMouseEnter(product, e)}
                      onMouseLeave={handleMouseLeave}
                      cursor="pointer"
                      _hover={{
                        borderColor: "brand.300",
                        transform: "scale(1.1)",
                      }}
                      transition="all 0.2s ease-in-out"
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
                    <VStack align="start" spacing={1}>
                      <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        {product.productName}
                      </Text>
                      <Text fontSize="sm" color={cardLabelColor}>
                        {product.category} • {product.supplier}
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack spacing={2} align="center">
                    <Text fontSize="sm" color={textColor} fontWeight="500">
                      {product.stockQuantity} in stock
                    </Text>
                    {getStockStatus(product.stockQuantity).status === 'low' && (
                      <WarningIcon color="red.500" boxSize={4} />
                    )}
                  </HStack>
                </Flex>

                <Divider mb={3} />

                {/* Product Details Grid */}
                <Box>
                  <Text fontSize="xs" color={cardIconColor} fontWeight="bold" textTransform="uppercase" mb={3}>
                    Product Details
                  </Text>
                  <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color={cardIconColor} fontWeight="medium" textTransform="uppercase">
                        Cost Price
                      </Text>
                      <Text fontSize="sm" fontWeight="bold" color={cardTextColor}>
                        PKR {product.costPrice.toLocaleString()}
                      </Text>
                    </VStack>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color={cardIconColor} fontWeight="medium" textTransform="uppercase">
                        Selling Price
                      </Text>
                      <Text fontSize="sm" fontWeight="bold" color={cardTextColor}>
                        PKR {product.sellingPrice.toLocaleString()}
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
                {inventoryCaptions.map((caption, idx) => {
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
              {filteredProducts.map((row, index) => {
                return (
                  <InventoryTableRow
                    key={`${row.productName}-${index}`}
                    id={row.id}
                    image={row.image}
                    productName={row.productName}
                    category={row.category}
                    stockQuantity={row.stockQuantity}
                    costPrice={row.costPrice}
                    sellingPrice={row.sellingPrice}
                    supplier={row.supplier}
                    lastUpdated={row.lastUpdated}
                    onMouseEnter={(e) => handleMouseEnter(row, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleProductClick(row)}
                  />
                );
              })}
            </Tbody>
          </Table>
        )}
      </CardBody>
      
      
      {/* Hover Modal */}
      <HoverModal />
      
      {/* CSS Animation */}
      <style jsx global>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </Card>
  );
};

export default InventoryTable;
