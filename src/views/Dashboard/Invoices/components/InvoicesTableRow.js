import {
  Badge,
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
  Box,
  HStack,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  ViewIcon,
  DownloadIcon,
  EmailIcon,
} from "@chakra-ui/icons";
import React from "react";

function InvoicesTableRow(props) {
  const { 
    invoice,
    onClick,
    onPrint,
    onEmail,
    onDelete
  } = props;
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

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
      {/* Invoice # */}
      <Td width="15%" px="16px" py="12px">
        <Text fontSize="sm" color={textColor} fontWeight="600">
          {invoice.id}
        </Text>
      </Td>

      {/* Date */}
      <Td width="12%" px="16px" py="12px">
        <Text fontSize="sm" color={textColor} fontWeight="500">
          {invoice.date}
        </Text>
      </Td>

      {/* Customer */}
      <Td width="20%" px="16px" py="12px">
        <VStack align="start" spacing={0}>
          <Text fontSize="sm" color={textColor} fontWeight="600">
            {invoice.customer.name}
          </Text>
          {invoice.customer.phone && (
            <Text fontSize="xs" color={useColorModeValue("gray.600", "gray.300")}>
              {invoice.customer.phone}
            </Text>
          )}
        </VStack>
      </Td>

      {/* Total */}
      <Td width="15%" px="16px" py="12px">
        <Text fontSize="sm" color={textColor} fontWeight="bold">
          PKR {invoice.total.toLocaleString()}
        </Text>
      </Td>

      {/* Payment Type */}
      <Td width="12%" px="16px" py="12px">
        <Text fontSize="sm" color={textColor} fontWeight="500">
          {invoice.paymentType}
        </Text>
      </Td>

      {/* Status */}
      <Td width="12%" px="16px" py="12px">
        <Badge
          colorScheme={getStatusColor(invoice.status)}
          variant="subtle"
          fontSize="xs"
          px={2}
          py={1}
          borderRadius="full"
        >
          {invoice.status}
        </Badge>
      </Td>

      {/* Actions */}
      <Td width="14%" px="16px" py="12px" textAlign="center">
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<Box fontSize="lg" fontWeight="bold">⋮</Box>}
            variant="ghost"
            size="md"
            color="gray.600"
            w="40px"
            h="40px"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
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
          <MenuList zIndex={99999} borderRadius="lg" overflow="hidden" data-menu="true">
            <MenuItem
              icon={<ViewIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onClick();
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
              View Details
            </MenuItem>
            <MenuItem
              icon={<DownloadIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onPrint();
              }}
              _hover={{
                bg: "blue.50"
              }}
              borderRadius={0}
            >
              Print
            </MenuItem>
            {invoice.customer.email && (
              <MenuItem
                icon={<EmailIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  onEmail();
                }}
                _hover={{
                  bg: "green.50"
                }}
                borderRadius={0}
              >
                Email
              </MenuItem>
            )}
            <MenuItem
              icon={<DeleteIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
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
        </Menu>
      </Td>
    </Tr>
  );
}

export default InvoicesTableRow;
