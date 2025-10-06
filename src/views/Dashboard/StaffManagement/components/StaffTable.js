import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useColorModeValue,
  HStack,
  Badge,
  VStack,
  IconButton,
  useBreakpointValue,
  Portal,
  Menu as CMenu,
  MenuButton as CMenuButton,
  MenuList as CMenuList,
  MenuItem as CMenuItem,
} from "@chakra-ui/react";
import { AddIcon, HamburgerIcon, SettingsIcon, AttachmentIcon, ViewIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useSearch } from "contexts/SearchContext";
import StaffTableRow from "./StaffTableRow";
import AddStaffModal from "components/Modals/AddStaffModal";

const initialStaff = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", phone: "+1 555 1010", role: "admin", status: "Active" },
  { id: "2", name: "Bob Lee", email: "bob@example.com", phone: "+1 555 2020", role: "staff", status: "Active" },
  { id: "3", name: "Chris Green", email: "chris@example.com", phone: "+1 555 3030", role: "staff", status: "Inactive" },
];

const StaffTable = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { searchQuery } = useSearch();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });

  const [staffList, setStaffList] = useState(initialStaff);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const hasActiveFilters = roleFilter !== "all" || statusFilter !== "all";
  const getFilterCount = () => [roleFilter, statusFilter].filter(v => v !== "all").length;

  const filtered = useMemo(() => {
    return staffList.filter((s) => {
      const q = (searchQuery || "").toLowerCase();
      const matchesQuery = !q || [s.name, s.email, s.phone].some((v) =>
        (v || "").toLowerCase().includes(q)
      );
      const matchesRole = roleFilter === "all" || s.role === roleFilter;
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [staffList, searchQuery, roleFilter, statusFilter]);

  const handleAddStaff = (newStaff) => {
    setStaffList((prev) => [newStaff, ...prev]);
  };

  const handleEdit = (staff) => {
    // Placeholder: integrate edit modal/flow later
    console.log("Edit staff", staff);
  };

  const handleDelete = (staff) => {
    setStaffList((prev) => prev.filter((s) => s.id !== staff.id));
  };

  return (
    <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
      <CardHeader p='6px 0px 22px 0px'>
        <Flex justifyContent={{ base: "flex-start", md: "space-between" }} alignItems="center" width="100%" flexWrap="wrap" gap={2}>
          <Text fontSize={{ base: "sm", md: "md" }} color={textColor} fontWeight='bold'>
            Staff Management
          </Text>
          <Flex gap="4px" ms={{ base: "auto", md: "auto" }}>
            <Menu>
              <MenuButton as={Button} variant="outline" colorScheme="brand" size="xs" leftIcon={<HamburgerIcon />} px={2} fontSize="xs">
                Actions
              </MenuButton>
              <MenuList>
                <MenuItem icon={<SettingsIcon />} position="relative">
                  <HStack justify="space-between" w="full">
                    <Text>Filters</Text>
                    {hasActiveFilters && (
                      <Badge colorScheme="red" borderRadius="full" fontSize="8px" minW="12px" h="12px" ml="auto">{getFilterCount()}</Badge>
                    )}
                  </HStack>
                </MenuItem>
                <MenuItem icon={<AttachmentIcon />} onClick={() => console.log("Import CSV clicked")}>Import CSV</MenuItem>
                <MenuItem icon={<AddIcon />} onClick={onOpen} color="brand.600" fontWeight="semibold">Add Staff</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        {isMobile || isTablet ? (
          <VStack spacing={isMobile ? 3 : 4} align="stretch" w="100%">
            {filtered.map((s) => (
              <Box
                key={s.id}
                bg={useColorModeValue("white", "gray.800")}
                borderRadius={isMobile ? "8px" : "12px"}
                border="1px solid"
                borderColor={borderColor}
                p={isMobile ? 3 : 4}
                w="100%"
                boxShadow={isMobile ? "0px 1px 3px rgba(0, 0, 0, 0.1)" : "0px 2px 8px rgba(0, 0, 0, 0.1)"}
                transition="all 0.2s ease"
                position="relative"
                _hover={{
                  boxShadow: isMobile ? "0px 8px 25px rgba(56, 178, 172, 0.25)" : "0px 12px 30px rgba(56, 178, 172, 0.3)",
                  transform: isMobile ? "translateY(-2px)" : "translateY(-6px)",
                  borderColor: "brand.300",
                }}
              >
                <Flex justify="space-between" align="center" mb={1}>
                  <VStack align="start" spacing={0}>
                    <Text fontSize={isMobile ? "md" : "lg"} fontWeight="bold" color={textColor}>{s.name}</Text>
                    <Text fontSize="xs" color="gray.500">{s.email}</Text>
                    {isMobile && (<Text fontSize="xs" color="gray.500">{s.phone || "—"}</Text>)}
                  </VStack>
                  <Menu placement="bottom-end">
                    <MenuButton
                      as={IconButton}
                      aria-label="Actions"
                      variant="ghost"
                      size={isMobile ? "sm" : "md"}
                      icon={<Box fontSize="lg" fontWeight="bold">⋮</Box>}
                    />
                    <Portal>
                      <MenuList zIndex={1400} borderRadius="lg" boxShadow="xl">
                        <MenuItem icon={<EditIcon />} onClick={() => handleEdit(s)}>Edit</MenuItem>
                        <MenuItem icon={<DeleteIcon />} color="red.500" onClick={() => handleDelete(s)}>Delete</MenuItem>
                      </MenuList>
                    </Portal>
                  </Menu>
                </Flex>
                <HStack mt={2} spacing={2}>
                  <Badge colorScheme={s.role === "admin" ? "purple" : "blue"}>{s.role}</Badge>
                  <Badge colorScheme={s.status === "Active" ? "green" : "gray"}>{s.status}</Badge>
                  {!isMobile && (<Text fontSize="sm" color="gray.500">{s.phone || "—"}</Text>)}
                </HStack>
              </Box>
            ))}
          </VStack>
        ) : (
        <Table 
          variant='simple' 
          color={textColor}
          size="md"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="12px"
          overflow="hidden"
          boxShadow="0px 8px 24px rgba(0, 0, 0, 0.08)"
          sx={{
            'th, td': {
              px: '16px',
              py: '14px',
            },
            'thead tr': {
              bg: useColorModeValue('gray.50', 'gray.700'),
            },
            'th:not(:first-of-type)': {
              borderLeft: '1px solid',
              borderLeftColor: borderColor,
            },
          }}
        >
          <Thead>
            <Tr bg={useColorModeValue("gray.50", "gray.700")} borderBottom="2px solid" borderColor={borderColor}>
              <Th color='gray.600' px="12px" py="16px" fontWeight="semibold" fontSize="sm" textTransform="none">User</Th>
              <Th color='gray.600' px="12px" py="16px" fontWeight="semibold" fontSize="sm" textTransform="none">Phone</Th>
              <Th color='gray.600' px="12px" py="16px" fontWeight="semibold" fontSize="sm" textTransform="none">Role</Th>
              <Th color='gray.600' px="12px" py="16px" fontWeight="semibold" fontSize="sm" textTransform="none">Status</Th>
              <Th color='gray.600' px="12px" py="16px" fontWeight="semibold" fontSize="sm" textTransform="none">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((s) => (
              <StaffTableRow key={s.id} staff={s} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </Tbody>
        </Table>
        )}
      </CardBody>

      <AddStaffModal isOpen={isOpen} onClose={onClose} onAddStaff={handleAddStaff} />
    </Card>
  );
};

export default StaffTable;


