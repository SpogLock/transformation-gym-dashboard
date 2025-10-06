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
  Progress,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  ViewIcon,
  EmailIcon,
  CalendarIcon,
} from "@chakra-ui/icons";
import React from "react";

function EmailMarketingTableRow(props) {
  const { 
    campaign,
    onClick,
    onEdit,
    onDelete
  } = props;
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardLabelColor = useColorModeValue("gray.600", "gray.300");

  const getStatusColor = (status) => {
    switch (status) {
      case "Sent":
        return "green";
      case "Draft":
        return "yellow";
      case "Scheduled":
        return "blue";
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
    >
      {/* Campaign */}
      <Td width="25%" px="16px" py="12px">
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" color={textColor} fontWeight="600">
            {campaign.name}
          </Text>
          <Text fontSize="xs" color={cardLabelColor} noOfLines={2}>
            {campaign.subject}
          </Text>
          <Text fontSize="xs" color={cardLabelColor}>
            {campaign.id}
          </Text>
        </VStack>
      </Td>

      {/* Status */}
      <Td width="12%" px="16px" py="12px">
        <Badge
          colorScheme={getStatusColor(campaign.status)}
          variant="subtle"
          fontSize="xs"
          px={2}
          py={1}
          borderRadius="full"
        >
          {campaign.status}
        </Badge>
      </Td>

      {/* Recipients */}
      <Td width="10%" px="16px" py="12px">
        <Text fontSize="sm" color={textColor} fontWeight="500">
          {campaign.recipients}
        </Text>
      </Td>

      {/* Open Rate */}
      <Td width="15%" px="16px" py="12px">
        {campaign.status === "Sent" ? (
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color={textColor} fontWeight="bold">
              {campaign.openRate}%
            </Text>
            <Progress 
              value={campaign.openRate} 
              size="sm" 
              colorScheme="green" 
              width="100%"
              borderRadius="full"
            />
          </VStack>
        ) : (
          <Text fontSize="sm" color={cardLabelColor}>
            -
          </Text>
        )}
      </Td>

      {/* Click Rate */}
      <Td width="15%" px="16px" py="12px">
        {campaign.status === "Sent" ? (
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color={textColor} fontWeight="bold">
              {campaign.clickRate}%
            </Text>
            <Progress 
              value={campaign.clickRate} 
              size="sm" 
              colorScheme="blue" 
              width="100%"
              borderRadius="full"
            />
          </VStack>
        ) : (
          <Text fontSize="sm" color={cardLabelColor}>
            -
          </Text>
        )}
      </Td>

      {/* Sent Date */}
      <Td width="13%" px="16px" py="12px">
        <Text fontSize="sm" color={textColor} fontWeight="500">
          {campaign.sentDate || "-"}
        </Text>
      </Td>

      {/* Actions */}
      <Td width="10%" px="16px" py="12px" textAlign="center">
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
              icon={<EditIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              _hover={{
                bg: "blue.50"
              }}
              borderRadius={0}
            >
              Edit
            </MenuItem>
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

export default EmailMarketingTableRow;
