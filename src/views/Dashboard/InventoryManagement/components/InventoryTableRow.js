import {
  Badge,
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
  Image,
  Box,
  HStack,
  VStack,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Portal,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  StarIcon,
  CloseIcon,
  CheckIcon,
  WarningIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import React from "react";
import whey_dummy from "assets/img/whey_dummy.png";

function InventoryTableRow(props) {
  const { 
    id,
    image, 
    productName,
    category,
    stockQuantity, 
    costPrice, 
    sellingPrice, 
    supplier, 
    lastUpdated,
    onMouseEnter,
    onMouseLeave,
    onClick,
    onEdit,
    onDelete
  } = props;
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

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

  const stockStatus = getStockStatus(stockQuantity);

  return (
    <Tr 
      py="12px" 
      cursor="pointer"
      onClick={onClick}
      borderBottom="1px solid"
      borderBottomColor={borderColor}
      _hover={{ 
        bg: useColorModeValue("brand.50", "brand.900"),
        transform: "translateX(2px)",
        boxShadow: "0 2px 8px rgba(56, 178, 172, 0.15)",
      }}
      transition="all 0.2s ease-in-out"
      _even={{
        bg: useColorModeValue("gray.25", "gray.750")
      }}
      position="relative"
    >
      {/* Image */}
      <Td width="8%" px="16px" textAlign="center">
        <Box
          w="44px"
          h="44px"
          borderRadius="md"
          overflow="hidden"
          border="2px solid"
          borderColor={useColorModeValue("gray.200", "gray.600")}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          cursor="pointer"
          _hover={{
            borderColor: "brand.300",
            transform: "scale(1.05)",
            boxShadow: "0 4px 12px rgba(56, 178, 172, 0.3)"
          }}
          transition="all 0.2s ease-in-out"
          mx="auto"
        >
          <Image
            src={image}
            alt={productName}
            w="100%"
            h="100%"
            objectFit="cover"
            fallbackSrc={whey_dummy}
            onError={(e) => {
              e.target.src = whey_dummy;
            }}
          />
        </Box>
      </Td>

      {/* Product Name */}
      <Td width="18%" px="16px" py="12px">
        <Text fontSize="sm" color={textColor} fontWeight="600">
          {productName}
        </Text>
      </Td>

      {/* Category */}
      <Td width="12%" px="16px" py="12px" textAlign="left">
        <Text fontSize="sm" color={textColor} fontWeight="500">
          {category}
        </Text>
      </Td>

      {/* Stock Quantity */}
      <Td width="10%" px="16px" py="12px" textAlign="left">
        <HStack spacing={1} align="center">
          <Text fontSize="sm" color={textColor} fontWeight="500">
            {stockQuantity}
          </Text>
          {stockStatus.status === 'low' && (
            <WarningIcon color="red.500" boxSize={3} />
          )}
        </HStack>
      </Td>

      {/* Cost Price */}
      <Td width="12%" px="16px" py="12px">
        <Text fontSize="sm" color={textColor} fontWeight="500">
          PKR {costPrice.toLocaleString()}
        </Text>
      </Td>

      {/* Selling Price */}
      <Td width="12%" px="16px" py="12px">
        <Text fontSize="sm" color={textColor} fontWeight="500">
          PKR {sellingPrice.toLocaleString()}
        </Text>
      </Td>

      {/* Supplier */}
      <Td width="14%" px="16px" py="12px">
        <Text fontSize="sm" color={textColor} fontWeight="500">
          {supplier}
        </Text>
      </Td>

      {/* Last Updated */}
      <Td width="12%" px="16px" py="12px">
        <Text fontSize="sm" color={textColor} fontWeight="500">
          {lastUpdated}
        </Text>
      </Td>

      {/* Actions */}
      <Td width="8%" px="16px" py="12px" textAlign="center">
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<Box fontSize="lg" fontWeight="bold">⋮</Box>}
            variant="ghost"
            size="md"
            color="gray.600"
            w="40px"
            h="40px"
            _hover={{
              bg: "gray.100",
              color: "gray.800"
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={(e) => e.stopPropagation()}
            onMouseLeave={(e) => e.stopPropagation()}
            zIndex={1}
            position="relative"
            _expanded={{
              zIndex: 1000
            }}
          />
          <Portal>
            <MenuList zIndex={9999} borderRadius="lg" overflow="hidden" data-menu="true" boxShadow="0 10px 25px rgba(0, 0, 0, 0.15)">
            <MenuItem
              icon={<EditIcon />}
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit) onEdit();
              }}
              _hover={{
                bg: "brand.50"
              }}
              borderRadius={0}
              _first={{
                borderTopRadius: "lg"
              }}
              _last={{
                borderBottomRadius: "lg"
              }}
            >
              Edit
            </MenuItem>
            <MenuItem
              icon={<DeleteIcon />}
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete();
              }}
              _hover={{
                bg: "red.50"
              }}
              color="red.500"
              borderRadius={0}
              _last={{
                borderBottomRadius: "lg"
              }}
            >
              Delete
            </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Td>
    </Tr>
  );
}

export default InventoryTableRow;
