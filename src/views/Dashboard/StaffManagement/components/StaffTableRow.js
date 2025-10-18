import React from "react";
import {
  Tr,
  Td,
  Text,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Box,
  Portal,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useAuth } from "contexts/AuthContext";

function StaffTableRow(props) {
  const { staff, onEdit, onDelete } = props;
  const { user } = useAuth();
  
  // Check if this is the current user's account
  const isCurrentUser = user && (user.id === staff.id || user.email === staff.email);

  return (
    <Tr
      cursor="pointer"
      _hover={{
        bg: "brand.50",
        transform: "translateX(4px)",
        boxShadow: "0 4px 12px rgba(56, 178, 172, 0.2)",
      }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <Td px="16px" py="12px" textAlign="left">
        <Text fontSize="sm" fontWeight="600">{staff.name}</Text>
        <Text fontSize="xs" color="gray.500">{staff.email}</Text>
      </Td>
      <Td px="16px" py="12px" textAlign="left">
        <Text fontSize="sm">{staff.phone || "—"}</Text>
      </Td>
      <Td px="16px" py="12px" textAlign="left">
        <Badge colorScheme={staff.role === "admin" ? "purple" : "blue"} borderRadius="md">
          {staff.role}
        </Badge>
      </Td>
      <Td px="16px" py="12px" textAlign="left">
        <Badge colorScheme={staff.status === "Active" ? "green" : "gray"} borderRadius="md">
          {staff.status}
        </Badge>
      </Td>
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
            _hover={{ bg: "gray.100", color: "gray.800" }}
          />
          <Portal>
            <MenuList zIndex={9999} boxShadow="0 10px 25px rgba(0, 0, 0, 0.15)">
              <MenuItem icon={<EditIcon />} onClick={() => onEdit(staff)}>
                Edit
              </MenuItem>
              <MenuItem 
                icon={<DeleteIcon />} 
                onClick={() => onDelete(staff)} 
                color="red.500" 
                _hover={{ bg: "red.50" }}
                isDisabled={isCurrentUser}
                opacity={isCurrentUser ? 0.5 : 1}
                cursor={isCurrentUser ? "not-allowed" : "pointer"}
              >
                {isCurrentUser ? "Cannot delete your own account" : "Delete"}
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Td>
    </Tr>
  );
}

export default StaffTableRow;


