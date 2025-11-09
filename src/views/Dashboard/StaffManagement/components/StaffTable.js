import React, { useMemo, useState, useEffect, useCallback } from "react";
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
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import { AddIcon, HamburgerIcon, SettingsIcon, AttachmentIcon, ViewIcon, EditIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useSearch } from "contexts/SearchContext";
import StaffTableRow from "./StaffTableRow";
import AddStaffModal from "components/Modals/AddStaffModal";
import AppLoader from "components/Loaders/AppLoader";
import EmptyState from "components/EmptyState/EmptyState";
import { getAllStaff, createStaff, updateStaff, deleteStaff, updateStaffStatus, updateStaffRole } from "services/staffService";
import { useAuth } from "contexts/AuthContext";

const StaffTable = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardBg = useColorModeValue("white", "gray.800");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: filterModalOpen,
    onOpen: openFilterModal,
    onClose: closeFilterModal,
  } = useDisclosure();
  const { searchQuery } = useSearch();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });
  const toast = useToast();
  const { user } = useAuth();

  // State for data and loading
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filters
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const hasActiveFilters = roleFilter !== "all" || statusFilter !== "all";
  const getFilterCount = () => [roleFilter, statusFilter].filter(v => v !== "all").length;

  const handleClearStaffFilters = () => {
    setRoleFilter("all");
    setStatusFilter("all");
  };

  // Load staff from API
  const loadStaff = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        search: searchQuery,
        role: roleFilter !== "all" ? roleFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sort_by: 'created_at',
        sort_order: 'desc'
      };
      
      const data = await getAllStaff(filters);
      setStaffList(data || []);
    } catch (err) {
      console.error('Failed to load staff:', err);
      setError(err.message);
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, roleFilter, statusFilter]);

  // Load staff on component mount and when filters change
  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const filtered = useMemo(() => {
    // Client-side filtering as fallback
    if (!staffList || staffList.length === 0) return [];
    
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

  const handleAddStaff = async (newStaff) => {
    try {
      const createdStaff = await createStaff(newStaff);
      setStaffList((prev) => [createdStaff, ...prev]);
      toast({
        title: "Staff Added",
        description: `${createdStaff.name} has been added successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to Add Staff",
        description: error.message || "Failed to create staff member",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = async (staffId, updateData) => {
    try {
      const updatedStaff = await updateStaff(staffId, updateData);
      setStaffList((prev) => 
        prev.map(s => s.id === staffId ? updatedStaff : s)
      );
      toast({
        title: "Staff Updated",
        description: `${updatedStaff.name} has been updated successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to Update Staff",
        description: error.message || "Failed to update staff member",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (staff) => {
    // Prevent users from deleting their own account
    if (user && (user.id === staff.id || user.email === staff.email)) {
      toast({
        title: "Cannot Delete Account",
        description: "You cannot delete your own account. Please ask another admin to do it.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await deleteStaff(staff.id);
      setStaffList((prev) => prev.filter((s) => s.id !== staff.id));
      toast({
        title: "Staff Deleted",
        description: `${staff.name} has been removed successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to Delete Staff",
        description: error.message || "Failed to delete staff member",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleStatusChange = async (staffId, newStatus) => {
    try {
      await updateStaffStatus(staffId, newStatus);
      setStaffList((prev) => 
        prev.map(s => s.id === staffId ? { ...s, status: newStatus } : s)
      );
      toast({
        title: "Status Updated",
        description: `Staff status has been updated to ${newStatus}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to Update Status",
        description: error.message || "Failed to update staff status",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRoleChange = async (staffId, newRole) => {
    try {
      await updateStaffRole(staffId, newRole);
      setStaffList((prev) => 
        prev.map(s => s.id === staffId ? { ...s, role: newRole } : s)
      );
      toast({
        title: "Role Updated",
        description: `Staff role has been updated to ${newRole}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to Update Role",
        description: error.message || "Failed to update staff role",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Card>
        <CardBody>
          <AppLoader message="Loading staff members..." fullHeight />
        </CardBody>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            title="Failed to Load Staff"
            description={error}
            actionText="Try Again"
            onAction={loadStaff}
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card overflowX={{ sm: "scroll", xl: "hidden" }} position="relative" zIndex={1}>
      <CardHeader p='6px 0px 22px 0px'>
        <Flex 
          justifyContent={{ base: "flex-start", md: "space-between" }} 
          alignItems="center" 
          width="100%" 
          flexWrap="wrap" 
          gap={2}
          flexDirection={{ base: "column", md: "row" }}
        >
          <Text fontSize={{ base: "sm", md: "md" }} color={textColor} fontWeight='bold'>
            Staff Management
          </Text>
          
          {/* Search and Filters */}
          <Flex 
            gap="8px" 
            flexShrink={0} 
            ms={{ base: "auto", md: "auto" }}
            flexDirection={{ base: "column", md: "row" }}
            w={{ base: "100%", md: "auto" }}
          >
            {/* Search Input */}
            <InputGroup size="sm" minW="200px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => {
                  // This will be handled by the SearchContext
                }}
                bg={cardBg}
                borderColor={borderColor}
              />
            </InputGroup>

            {/* Role Filter */}
            <Select
              size="sm"
              placeholder="All Roles"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              minW="120px"
              bg={cardBg}
              borderColor={borderColor}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </Select>

            {/* Status Filter */}
            <Select
              size="sm"
              placeholder="All Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              minW="120px"
              bg={cardBg}
              borderColor={borderColor}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>

            {/* Actions Menu */}
            <Menu>
              <MenuButton 
                as={Button} 
                variant="outline" 
                colorScheme="brand" 
                size="sm" 
                leftIcon={<HamburgerIcon />} 
                px={4} 
                minW="100px"
                fontSize="sm"
                whiteSpace="nowrap"
              >
                Actions
              </MenuButton>
              <MenuList>
                <MenuItem
                  icon={<SettingsIcon />}
                  position="relative"
                  onClick={openFilterModal}
                >
                  <HStack justify="space-between" w="full">
                    <Text>Advanced Filters</Text>
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
        <Modal isOpen={filterModalOpen} onClose={closeFilterModal} isCentered size="sm">
          <ModalOverlay backdropFilter="blur(4px)" bg="rgba(0,0,0,0.35)" />
          <ModalContent borderRadius="20px">
            <ModalHeader color={textColor}>Advanced Filters</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={3} align="stretch">
                <Select
                  size="sm"
                  placeholder="All Roles"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </Select>
                <Select
                  size="sm"
                  placeholder="All Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </Select>
              </VStack>
            </ModalBody>
            <ModalFooter gap={3}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleClearStaffFilters();
                }}
              >
                Clear
              </Button>
              <Button
                colorScheme="brand"
                size="sm"
                onClick={closeFilterModal}
              >
                Apply
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </CardHeader>
      <CardBody overflow="visible">
        {/* Show empty state if no staff */}
        {filtered.length === 0 ? (
          <EmptyState
            title="No Staff Found"
            description={staffList.length === 0 ? "No staff members have been added yet" : "No staff members match your current filters"}
            actionText={staffList.length === 0 ? "Add First Staff Member" : "Clear Filters"}
            onAction={staffList.length === 0 ? onOpen : () => {
              setRoleFilter("all");
              setStatusFilter("all");
            }}
          />
        ) : isMobile || isTablet ? (
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
          overflow="visible"
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
              <StaffTableRow 
                key={s.id} 
                staff={s} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onRoleChange={handleRoleChange}
              />
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


