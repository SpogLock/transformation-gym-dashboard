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
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

function StaffTableRow(props) {
  const { staff, onEdit, onDelete } = props;

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
          <MenuList>
            <MenuItem icon={<EditIcon />} onClick={() => onEdit(staff)}>
              Edit
            </MenuItem>
            <MenuItem icon={<DeleteIcon />} onClick={() => onDelete(staff)} color="red.500" _hover={{ bg: "red.50" }}>
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
}

export default StaffTableRow;


