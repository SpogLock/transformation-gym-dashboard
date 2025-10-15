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
  Avatar,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  PhoneIcon,
  EmailIcon,
  StarIcon,
  CloseIcon,
  CheckIcon,
  WarningIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import React from "react";

function StockTableRow(props) {
  const { 
    id,
    picture, 
    memberName,
    memberType,
    mobileNo, 
    email, 
    address, 
    registrationDate, 
    membershipStatus, 
    trainerRequired, 
    customerPlan, 
    customerWeight, 
    customerAge,
    monthlyFee,
    nextDueDate,
    onMouseEnter,
    onMouseLeave,
    onClick,
    onEdit,
    onDelete
  } = props;
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("brand.50", "brand.900");

  // Check if customer fee is overdue
  const isFeeOverdue = (nextDueDate) => {
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    return dueDate < today;
  };

  // Get fee status with days
  const getFeeStatus = (nextDueDate, customerId) => {
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Use customer ID to determine if they should be paid (consistent random assignment)
    const isPaid = (customerId % 3 === 0); // Every 3rd customer is paid
    
    if (isPaid) {
      // For paid customers, show days since last payment (random between 1-30 days ago)
      const daysAgo = (customerId % 30) + 1; // Consistent based on customer ID
      return { status: 'paid', days: daysAgo, color: 'green' };
    } else if (diffDays < 0) {
      return { status: 'overdue', days: Math.abs(diffDays), color: 'red' };
    } else if (diffDays === 0) {
      return { status: 'due_today', days: 0, color: 'orange' };
    } else if (diffDays <= 7) {
      return { status: 'due_soon', days: diffDays, color: 'yellow' };
    } else {
      return { status: 'paid', days: diffDays, color: 'green' };
    }
  };

  const feeStatus = getFeeStatus(nextDueDate, id);



  return (
    <Tr 
      py="8px" 
      cursor="pointer"
      onClick={onClick}
      borderBottom="1px solid"
      borderBottomColor={borderColor}
      _hover={{ 
        bg: useColorModeValue("brand.50", "brand.900"),
        transform: "translateX(4px)",
        boxShadow: "0 4px 12px rgba(56, 178, 172, 0.2)",
      }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _even={{
        bg: useColorModeValue("gray.25", "gray.750")
      }}
    >
      {/* Picture */}
      <Td width="8%" px="12px" textAlign="center">
        <Box
          w="40px"
          h="40px"
          borderRadius="full"
          overflow="hidden"
          border="2px solid"
          borderColor="gray.200"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          cursor="pointer"
          _hover={{
            borderColor: "brand.300",
            transform: "scale(1.1)",
          }}
          transition="all 0.2s ease-in-out"
          mx="auto"
        >
          <Avatar name={memberName} src={picture || undefined} w="100%" h="100%" bg="brand.300" color="white" fontWeight="bold" />
        </Box>
      </Td>

      {/* Member Name */}
      <Td width="18%" px="12px" py="12px">
        <Text fontSize="sm" color={textColor} fontWeight="bold">
          {memberName}
        </Text>
      </Td>

      {/* Member Type */}
      <Td width="8%" px="16px" py="12px" textAlign="left">
        <Badge
          colorScheme={memberType === "New" ? "blue" : "purple"}
          variant="subtle"
          px={3}
          py={1}
          borderRadius="6px"
          fontSize="xs"
          fontWeight="600"
          minW="45px"
          h="24px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {memberType}
        </Badge>
      </Td>

      {/* Mobile No */}
      <Td width="14%" px="16px" py="12px" textAlign="left">
        <Text fontSize="sm" color={textColor} fontWeight="500">
          {mobileNo}
        </Text>
      </Td>

      {/* Email */}
      <Td width="16%" px="16px" py="12px" textAlign="left">
        <Text fontSize="sm" color={textColor} fontWeight="500">
          {email}
        </Text>
      </Td>

      {/* Address */}
      <Td width="20%" px="16px" py="12px" textAlign="left">
        <Text fontSize="sm" color={textColor} fontWeight="500">
          {address}
        </Text>
      </Td>


      {/* Membership Status */}
      <Td width="8%" px="16px" py="12px" textAlign="left">
        <Badge
          colorScheme={(membershipStatus || '').toLowerCase().trim() === 'active' ? "green" : "red"}
          variant="subtle"
          px={3}
          py={1}
          borderRadius="6px"
          fontSize="xs"
          fontWeight="600"
          minW="45px"
          h="24px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {membershipStatus ? (membershipStatus.charAt(0).toUpperCase() + membershipStatus.slice(1).toLowerCase()) : ''}
        </Badge>
      </Td>

      {/* Trainer Required */}
      <Td width="8%" px="16px" py="12px" textAlign="left">
        <Text fontSize="sm" color={textColor} fontWeight="500">
          {trainerRequired}
        </Text>
      </Td>

      {/* Customer Plan */}
      <Td width="10%" px="16px" py="12px" textAlign="left">
        <Badge
          colorScheme={
            customerPlan === "Premium" ? "purple" : 
            customerPlan === "Basic" ? "blue" : "orange"
          }
          variant="subtle"
          px={3}
          py={1}
          borderRadius="6px"
          fontSize="xs"
          fontWeight="600"
          minW="55px"
          h="24px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {customerPlan}
        </Badge>
      </Td>

      {/* Fee Status */}
      <Td width="10%" px="16px" py="12px" textAlign="left">
        <Text fontSize="xs" color={textColor} fontWeight="500" whiteSpace="nowrap">
          <Text as="span" color={`${feeStatus.color}.600`} fontWeight="600" textTransform="uppercase">
            {feeStatus.status.replace('_', ' ')}
          </Text>
          {' '}
          <Text as="span" color="gray.500">
            {feeStatus.status === 'paid' 
              ? `${feeStatus.days} ${feeStatus.days === 1 ? 'day' : 'days'} ago`
              : feeStatus.days === 0 
                ? 'Today' 
                : feeStatus.days === 1 
                  ? '1 day' 
                  : `${feeStatus.days} days`
            }
          </Text>
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
          />
          <MenuList>
            <MenuItem
              icon={<EditIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit();
              }}
              _hover={{
                bg: "blue.50"
              }}
            >
              Edit
            </MenuItem>
            <MenuItem
              icon={<DeleteIcon />}
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete();
              }}
              _hover={{
                bg: "red.50"
              }}
              color="red.500"
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
}

export default StockTableRow;
