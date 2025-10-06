// Chakra imports
import {
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Image,
  Flex,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Box,
  HStack,
  Grid,
  Icon,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React from "react";
import logo from "assets/img/avatars/placeholder.png";

const BestSellingProducts = ({ timePeriod, customDateRange, productsData }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const [searchTerm, setSearchTerm] = React.useState("");

  // Format currency helper
  const formatCurrency = (amount) => {
    return `PKR. ${Number(amount || 0).toLocaleString()}`;
  };

  // Process products data from static mock data
  const getProcessedProductsData = () => {
    if (productsData && Array.isArray(productsData) && productsData.length > 0) {
      return productsData.map((item, index) => ({
        id: item.id || index,
        name: item.name || "Unknown Product",
        image: item.image || "🔧",
        revenue: formatCurrency(item.revenue || 0),
        sales: item.sales || 0,
        category: item.category || "Uncategorized",
        rank: index + 1
      }));
    }

    // Fallback data if no products data
    return [
      { id: 1, name: "No Data", image: "❌", revenue: formatCurrency(0), sales: 0, category: "N/A", rank: 1 }
    ];
  };

  const processedData = getProcessedProductsData();

  // Filter products based on search term
  const filteredProducts = React.useMemo(() => {
    if (!searchTerm.trim()) return processedData;
    
    return processedData.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [processedData, searchTerm]);

  // Show empty state if no data
  if (!processedData || processedData.length === 0) {
    return (
      <Card bg={useColorModeValue("white", "gray.700")} boxShadow={useColorModeValue("0 4px 20px rgba(0,0,0,0.06)", "0 4px 20px rgba(0,0,0,0.3)")}>
        <CardHeader>
          <Text fontSize='lg' color={textColor} fontWeight='bold'>
            Best selling products list
          </Text>
        </CardHeader>
        <CardBody>
          <Flex h='200px' w='100%' align='center' justify='center' direction='column'>
            <Text fontSize='md' color='gray.400' textAlign='center'>
              No product data available
            </Text>
          </Flex>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card bg={useColorModeValue("white", "gray.700")} boxShadow={useColorModeValue("0 4px 20px rgba(0,0,0,0.06)", "0 4px 20px rgba(0,0,0,0.3)")}>
      <CardHeader>
        <VStack align='stretch' spacing='16px'>
          <Text fontSize='lg' color={textColor} fontWeight='bold'>
            Best selling products list
          </Text>
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <FaSearch color='gray.400' />
            </InputLeftElement>
            <Input
              placeholder='Search products or categories...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={useColorModeValue("gray.50", "gray.600")}
              border='1px solid'
              borderColor={useColorModeValue("gray.200", "gray.600")}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px brand.500"
              }}
            />
          </InputGroup>
        </VStack>
      </CardHeader>
      <CardBody pt={0} pb={4}>
        {/* Desktop Table View */}
        <Table variant='simple' color={textColor} display={{ base: "none", md: "table" }}>
          <Thead>
            <Tr>
              <Th color='gray.400' fontSize='sm' fontWeight='semibold'>#</Th>
              <Th color='gray.400' fontSize='sm' fontWeight='semibold'>Products</Th>
              <Th color='gray.400' fontSize='sm' fontWeight='semibold'>Revenue</Th>
              <Th color='gray.400' fontSize='sm' fontWeight='semibold'>Sales</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredProducts.length === 0 && searchTerm.trim() ? (
              <Tr>
                <Td colSpan={4}>
                  <Flex h='100px' w='100%' align='center' justify='center'>
                    <Text fontSize='md' color='gray.400' textAlign='center'>
                      No products found matching "{searchTerm}"
                    </Text>
                  </Flex>
                </Td>
              </Tr>
            ) : (
              filteredProducts.map((product, index) => (
              <Tr key={product.id}>
                <Td>
                  <Text fontSize='sm' color={textColor} fontWeight='bold'>
                    {product.rank || index + 1}
                  </Text>
                </Td>
                <Td>
                  <Flex align='center' py='.8rem' minWidth='100%' flexWrap='nowrap'>
                    <Image src={product.image} w='30px' h='30px' me='12px' objectFit='cover' />
                    <Flex direction='column'>
                      <Text fontSize='sm' color={textColor} fontWeight='bold' minWidth='100%'>
                        {product.name}
                      </Text>
                      <Text fontSize='xs' color='gray.400' fontWeight='medium'>
                        {product.category}
                      </Text>
                    </Flex>
                  </Flex>
                </Td>
                <Td>
                  <Text fontSize='sm' color={textColor} fontWeight='bold'>
                    {product.revenue}
                  </Text>
                </Td>
                <Td>
                  <Badge colorScheme='teal' fontSize='12px' p='2px 8px' borderRadius='12px'>
                    {product.sales} sales
                  </Badge>
                </Td>
              </Tr>
              ))
            )}
          </Tbody>
        </Table>

        {/* Mobile List View */}
        <VStack spacing={3} align="stretch" display={{ base: "flex", md: "none" }} mt={4}>
          {filteredProducts.length === 0 && searchTerm.trim() ? (
            <Flex h='100px' w='100%' align='center' justify='center'>
              <Text fontSize='md' color='gray.400' textAlign='center'>
                No products found matching "{searchTerm}"
              </Text>
            </Flex>
          ) : (
            filteredProducts.map((product, index) => (
              <Box key={product.id} p={3} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md" border="1px solid" borderColor={useColorModeValue("gray.200", "gray.600")} w="100%">
                <Grid templateColumns="40px 1fr 120px" gap={3} alignItems="center">
                  <Box color="brand.500" flexShrink={0} textAlign="center">
                    <Text fontSize="lg" fontWeight="bold">
                      {product.rank || index + 1}
                    </Text>
                  </Box>
                  
                  <VStack align="start" spacing={1} minW="0">
                    <HStack spacing={2} align="center">
                      <Image src={product.image} w='20px' h='20px' objectFit='cover' />
                      <Text fontSize="sm" color={textColor} fontWeight="bold" noOfLines={1}>
                        {product.name}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium" noOfLines={1}>
                      {product.category}
                    </Text>
                  </VStack>
                  
                  <VStack align="end" spacing={1} minW="120px">
                    <Text fontSize="sm" color={textColor} fontWeight="bold">
                      {product.revenue}
                    </Text>
                    <Badge colorScheme='teal' fontSize="10px" px={2} py={1} borderRadius="full">
                      {product.sales} sales
                    </Badge>
                  </VStack>
                </Grid>
              </Box>
            ))
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

export default BestSellingProducts;
