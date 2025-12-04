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
  ModalHeader,
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
import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useSearch } from "contexts/SearchContext";
import { useProducts } from "contexts/ProductContext";
import AddProductModal from "components/Modals/AddProductModal";
import EditProductModal from "components/Modals/EditProductModal";
import AppLoader from "components/Loaders/AppLoader";
import EmptyState from "components/EmptyState/EmptyState";
import Pagination from "components/Pagination/Pagination";
import { getProducts } from "services/productService";
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
  const {
    searchQuery,
    filters,
    updateFilters,
    clearFilters,
    isFilterOpen,
    setIsFilterOpen,
  } = useSearch();
  const toast = useToast();
  
  // Product context
  const { removeProduct } = useProducts();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 100,
    total: 0,
    from: 0,
    to: 0,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [currentMonthPage, setCurrentMonthPage] = useState(0); // 0 = current month, 1 = previous month, etc.
  
  // Get month range for month-based pagination
  const getMonthRange = useCallback((monthOffset) => {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);
    
    return {
      date_from: startDate.toISOString().split('T')[0],
      date_to: endDate.toISOString().split('T')[0],
    };
  }, []);

  // Load products with pagination
  const loadProducts = useCallback(async (page = 1, perPage = 100) => {
    try {
      setLoading(true);
      
      // Get month range based on currentMonthPage (0 = current month, 1 = previous month, etc.)
      const monthRange = getMonthRange(currentMonthPage);
      
      const apiFilters = {
        search: searchQuery,
        category: filters.category || '',
        stock_status: filters.stockStatus || '',
        sort_by: 'created_at',
        sort_order: 'desc',
        page: page,
        per_page: perPage,
        date_from: monthRange.date_from,
        date_to: monthRange.date_to,
      };
      
      const response = await getProducts(apiFilters);
      
      // Handle paginated response
      if (response && response.products) {
        setProducts(response.products);
        setPagination(response.pagination || pagination);
      } else if (Array.isArray(response)) {
        setProducts(response);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: perPage,
          total: response.length,
          from: 1,
          to: response.length,
        });
      } else {
        setProducts([]);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: perPage,
          total: 0,
          from: 0,
          to: 0,
        });
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters.category, filters.stockStatus, currentMonthPage, getMonthRange]);
  
  // Fetch products on mount and when filters change
  useEffect(() => {
    const perPage = pagination.per_page || 100;
    loadProducts(1, perPage);
  }, [searchQuery, filters.category, filters.stockStatus, currentMonthPage]);

  // Handle page change
  const handlePageChange = (newPage) => {
    loadProducts(newPage, pagination.per_page);
  };

  // Handle per page change
  const handlePerPageChange = (newPerPage) => {
    loadProducts(1, newPerPage);
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  const categoryOptions = React.useMemo(() => {
    const unique = new Set(
      (products || []).map((p) => p.category).filter((value) => Boolean(value))
    );
    return Array.from(unique).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
  }, [products]);

  // Get filter count for badge
  const getFilterCount = () => {
    return Object.values(filters).filter(filter => filter !== '').length;
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    onEditOpen();
  };

  // Handle delete product
  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      try {
        await removeProduct(productId);
        toast({
          title: 'Product Deleted',
          description: `${productName} has been deleted successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete product',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  // Check stock status
  const getStockStatus = (quantity) => {
    if (quantity <= 3) {
      return { status: 'low', color: 'red' };
    } else if (quantity <= 10) {
      return { status: 'medium', color: 'yellow' };
    } else {
      return { status: 'high', color: 'green' };
    }
  };

  // Map API products to display format
  const mapProductToDisplay = (product) => ({
    id: product.id,
    image: product.image_url || whey_dummy,
    productName: product.name,
    category: product.category,
    stockQuantity: product.stock,
    costPrice: parseFloat(product.cost_price),
    sellingPrice: parseFloat(product.selling_price),
    supplier: product.supplier,
    lastUpdated: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : 'N/A',
    description: product.description || '',
    // Store the full product object for editing
    _fullProduct: product,
  });

  // Filter and search products
  const getFilteredProducts = () => {
    let filteredData = products.map(mapProductToDisplay);

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

  // Show loader while fetching
  if (loading && products.length === 0) {
    return <AppLoader message="Loading inventory..." fullHeight />;
  }

  // Show empty state if no products
  if (!loading && products.length === 0) {
    return (
      <Card>
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
            <Button
              size="xs"
              colorScheme="brand"
              leftIcon={<AddIcon />}
              onClick={onOpen}
            >
              Add Product
            </Button>
        </Flex>
      </CardHeader>
      <CardBody overflow="visible">
          <EmptyState
            title="No Products Yet"
            description="Start building your inventory by adding your first product. Track stock, manage pricing, and monitor your product catalog all in one place."
            actionLabel="Add First Product"
            onAction={onOpen}
          />
        </CardBody>
        <AddProductModal isOpen={isOpen} onClose={onClose} />
      </Card>
    );
  }

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
    <Card overflowX={{ sm: "scroll", xl: "hidden" }} position="relative" zIndex={1}>
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
                  onClick={() => setIsFilterOpen(true)}
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
            
            {/* Month Page Indicator */}
            <Text fontSize="xs" color={textColor} fontWeight="medium" px={2}>
              {(() => {
                const now = new Date();
                const targetDate = new Date(now.getFullYear(), now.getMonth() - currentMonthPage, 1);
                return targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
              })()}
            </Text>
          </Flex>
        </Flex>
      </CardHeader>
      <Modal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        size="sm"
        isCentered
      >
        <ModalOverlay backdropFilter="blur(4px)" bg="rgba(0,0,0,0.35)" />
        <ModalContent borderRadius="20px">
          <ModalHeader color={textColor}>Inventory Filters</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="stretch">
              <Select
                placeholder="All categories"
                size="sm"
                value={filters.category || ''}
                onChange={(e) => updateFilters({ category: e.target.value })}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="Stock status"
                size="sm"
                value={filters.stockStatus || ''}
                onChange={(e) => updateFilters({ stockStatus: e.target.value })}
              >
                <option value="low">Low (≤ 3)</option>
                <option value="medium">Medium (4 - 10)</option>
                <option value="high">High (&gt; 10)</option>
              </Select>
            </VStack>
          </ModalBody>
          <Flex justify="space-between" align="center" px={6} pb={4}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearFilters()}
            >
              Clear filters
            </Button>
            <Button
              colorScheme="brand"
              size="sm"
              onClick={() => setIsFilterOpen(false)}
            >
              Apply
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
      
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
                        onError={(e) => {
                          e.target.src = whey_dummy;
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
                        onError={(e) => {
                          e.target.src = whey_dummy;
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
            overflow="visible"
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
                    onEdit={() => handleEditProduct(row)}
                    onDelete={() => handleDeleteProduct(row.id, row.productName)}
                  />
                );
              })}
            </Tbody>
          </Table>
        )}
        
        {/* Pagination - Show if we have data or if pagination info is available */}
        {!loading && (pagination.total > 0 || products.length > 0) && (
          <Box>
            <Pagination
              currentPage={pagination.current_page || 1}
              totalPages={pagination.last_page || 1}
              perPage={pagination.per_page || 100}
              total={pagination.total || products.length}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
            />
            {/* Month Navigation */}
            <Flex justify="space-between" align="center" px={4} py={2} borderTop="1px solid" borderColor={borderColor}>
              <Button
                size="sm"
                onClick={() => setCurrentMonthPage(currentMonthPage + 1)}
                variant="outline"
              >
                Previous Month
              </Button>
              <Text fontSize="sm" color={textColor} fontWeight="medium">
                Month {currentMonthPage + 1}: {(() => {
                  const now = new Date();
                  const targetDate = new Date(now.getFullYear(), now.getMonth() - currentMonthPage, 1);
                  return targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                })()}
              </Text>
              <Button
                size="sm"
                onClick={() => setCurrentMonthPage(Math.max(0, currentMonthPage - 1))}
                isDisabled={currentMonthPage === 0}
                variant="outline"
              >
                Next Month
              </Button>
            </Flex>
          </Box>
        )}
      </CardBody>
      
      
      {/* Hover Modal */}
      <HoverModal />
      
      {/* Add Product Modal */}
      <AddProductModal isOpen={isOpen} onClose={onClose} />
      
      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal 
          isOpen={isEditOpen} 
          onClose={() => {
            onEditClose();
            setEditingProduct(null);
          }} 
          product={editingProduct._fullProduct || editingProduct} 
        />
      )}
      
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
