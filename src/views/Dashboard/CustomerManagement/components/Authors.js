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
  Avatar,
  Input,
} from "@chakra-ui/react";
import { ChevronDownIcon, PhoneIcon, EmailIcon, StarIcon, CloseIcon, SettingsIcon, HamburgerIcon, AttachmentIcon, DownloadIcon, AddIcon, RepeatIcon } from "@chakra-ui/icons";
import { forceMarkOverdueFees } from "services/overdueService";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import StockTableRow from "components/Tables/StockTableRow";
import AddCustomerModal from "components/Modals/AddCustomerModal";
import PlansModal from "components/Modals/PlansModal";
import EditCustomerModal from "components/Modals/EditCustomerModal";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSearch } from "contexts/SearchContext";
import { useCustomers } from "contexts/CustomerContext";
import { API_BASE_URL } from "services/api";
import { useToast } from "@chakra-ui/react";
import EmptyState from "components/EmptyState/EmptyState";
import AppLoader from "components/Loaders/AppLoader";


const Authors = ({ title, captions, data }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardTextColor = useColorModeValue("gray.700", "white");
  const cardLabelColor = useColorModeValue("gray.600", "gray.300");
  const cardIconColor = useColorModeValue("gray.500", "gray.400");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const plansDisclosure = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });
  const [hoveredCustomer, setHoveredCustomer] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const history = useHistory();
  const { searchQuery, filters, updateFilters, clearFilters } = useSearch();
  
  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  // Get filter count for badge
  const getFilterCount = () => {
    return Object.values(filters).filter(filter => filter !== '').length;
  };
  
  // Customer management data from context
  const { customers, loading, fetchCustomers, addCustomer, editCustomer: updateCustomer, removeCustomer } = useCustomers();
  const [stockData, setStockData] = useState([]);
  const toast = useToast();
  const [editCustomer, setEditCustomer] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const mapApiCustomerToRow = (c) => {
    const toTitle = (val) => {
      if (!val || typeof val !== 'string') return '';
      return val.charAt(0).toUpperCase() + val.slice(1);
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      } catch (error) {
        return dateString;
      }
    };
    const normalizeImageUrl = (url) => {
      if (url === null || url === undefined) return undefined;
      if (typeof url !== 'string') return undefined;
      const trimmed = url.trim();
      if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return undefined;
      if (/^https?:\/\//i.test(trimmed)) {
        // Replace localhost with API host for consistency if needed
        try {
          const apiRoot = API_BASE_URL.replace(/\/$/, '').replace(/\/api\/?$/, '');
          return trimmed.replace('http://localhost', apiRoot).replace('https://localhost', apiRoot);
        } catch (_) {
          return trimmed;
        }
      }
      // Relative path from backend (e.g., /storage/..)
      const apiRoot = API_BASE_URL.replace(/\/$/, '').replace(/\/api\/?$/, '');
      return `${apiRoot}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
    };
    const rawStatus = ((c.status_display || c.status || "") + "").trim();
    const statusNormalized = rawStatus.toLowerCase();
    const statusDisplay = rawStatus
      ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase()
      : "";
    return {
      id: c.id,
      picture: normalizeImageUrl(c.profile_picture_url),
      memberName: c.name,
      memberType: c.member_type_display || c.type_display || toTitle(c.member_type) || toTitle(c.type) || "Unknown",
      membershipStatus: statusDisplay,
      mobileNo: c.mobile_number || "",
      email: c.email || "",
      address: c.address || "",
      registrationDate: (c.created_at || '').split('T')[0] || '',
      trainerRequired: c.has_trainer ? (c.trainer_name ? `Yes` : 'Yes') : 'No',
      customerPlan: c.plan_display || c.plan || c.plan_name || '',
      planId: c.plan_id || c.planId || null, // Add planId for edit modal
      customerWeight: c.weight ? `${parseFloat(c.weight).toFixed(0)} kg` : '',
      customerAge: c.age ? `${c.age}` : '',
      monthlyFee: c.monthly_fee ? `₨${(Number(c.monthly_fee) > 10000 ? Number(c.monthly_fee) / 100 : Number(c.monthly_fee)).toLocaleString()}` : '',
      registrationFee: c.registration_fee ? `₨${Number(c.registration_fee).toLocaleString()}` : '', // Add registration fee
      feePaidDate: c.last_payment_date || '',
      nextDueDate: formatDate(c.next_due_date),
    };
  };

  // Fetch customers on mount (only if not already cached)
  useEffect(() => {
    fetchCustomers().catch((error) => {
      toast({
        title: "Failed to load customers",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    });
  }, []);

  // Apply local filtering and searching to cached customer data
  useEffect(() => {
    let filtered = [...customers];

    // Apply filters
    if (filters.membershipStatus) {
      filtered = filtered.filter(c => 
        (c.status_display || c.status || "").toLowerCase() === filters.membershipStatus.toLowerCase()
      );
    }
    if (filters.customerPlan) {
      filtered = filtered.filter(c => 
        (c.plan_display || c.plan || "").toLowerCase() === filters.customerPlan.toLowerCase()
      );
    }
    if (filters.trainerRequired) {
      const requiresTrainer = filters.trainerRequired === 'Yes';
      filtered = filtered.filter(c => c.has_trainer === requiresTrainer);
    }

    // Date-based filters
    const getCreatedAtDate = (c) => {
      const raw = c.created_at || c.registrationDate || c.registration_date || '';
      const str = typeof raw === 'string' ? raw : '';
      // Accept both ISO and YYYY-MM-DD
      const parsed = new Date(str);
      return isNaN(parsed.getTime()) ? null : parsed;
    };

    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      filtered = filtered.filter(c => {
        const d = getCreatedAtDate(c);
        return d ? d >= from : false;
      });
    }

    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      // Include entire day
      to.setHours(23,59,59,999);
      filtered = filtered.filter(c => {
        const d = getCreatedAtDate(c);
        return d ? d <= to : false;
      });
    }

    if (filters.month) {
      const monthNum = parseInt(filters.month, 10) - 1; // 0-based
      if (!isNaN(monthNum)) {
        filtered = filtered.filter(c => {
          const d = getCreatedAtDate(c);
          return d ? d.getMonth() === monthNum : false;
        });
      }
    }

    if (filters.year) {
      const yearNum = parseInt(filters.year, 10);
      if (!isNaN(yearNum)) {
        filtered = filtered.filter(c => {
          const d = getCreatedAtDate(c);
          return d ? d.getFullYear() === yearNum : false;
        });
      }
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        (c.name || "").toLowerCase().includes(query) ||
        (c.email || "").toLowerCase().includes(query) ||
        (c.mobile_number || "").toLowerCase().includes(query)
      );
    }

    // Sort by created date desc (newest first)
    filtered.sort((a, b) => {
      const ad = getCreatedAtDate(a);
      const bd = getCreatedAtDate(b);
      if (ad && bd) return bd - ad;
      if (ad) return -1;
      if (bd) return 1;
      return 0;
    });

    // Map to display format
    const rows = filtered.map(mapApiCustomerToRow);
    setStockData(rows);
  }, [customers, searchQuery, filters.membershipStatus, filters.customerPlan, filters.feeStatus, filters.trainerRequired, filters.dateFrom, filters.dateTo, filters.month, filters.year]);

  const handleAddCustomer = async (newCustomer) => {
    // Map UI fields to API payload where possible
    const payload = {
      name: newCustomer.memberName,
      email: newCustomer.email,
      mobile_number: newCustomer.mobileNo,
      address: newCustomer.address,
      type: (newCustomer.memberType || '').toLowerCase(),
      status: (newCustomer.membershipStatus || '').toLowerCase(),
      plan_id: newCustomer.plan_id ? parseInt(newCustomer.plan_id) : null, // Send plan_id as integer
      // Invoice settings per INVOICE_SETTINGS.mdc
      generate_registration_invoice: true,
      registration_invoice_paid: true,
      registration_payment_method: 'cash',
      registration_payment_date: newCustomer.feePaidDate,
      registration_invoice_notes: 'Registration at signup',
      // keep legacy monetary fields if backend accepts them (harmless)
      monthly_fee: newCustomer.monthlyFee ? parseInt((newCustomer.monthlyFee + '').replace(/[^0-9]/g, '')) : undefined,
      registration_fee: newCustomer.registrationFee ? parseInt((newCustomer.registrationFee + '').replace(/[^0-9]/g, '')) : undefined,
      has_trainer: newCustomer.trainerRequired === 'Yes',
      trainer_name: newCustomer.trainerRequired === 'Yes' ? newCustomer.trainerName : undefined,
      // let backend compute payment dates when invoice is generated
      age: newCustomer.customerAge ? parseInt((newCustomer.customerAge + '').replace(/[^0-9]/g, '')) : undefined,
      weight: newCustomer.customerWeight ? parseFloat((newCustomer.customerWeight + '').replace(/[^0-9.]/g, '')) : undefined,
    };

    try {
      await addCustomer(payload, newCustomer._selectedFile);
      toast({
        title: "Customer added",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Failed to add customer",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleOpenEdit = (customer) => {
    setEditCustomer(customer);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (formData, selectedFile) => {
    if (!editCustomer) return;
    try {
      const updatePayload = {
        name: formData.memberName,
        email: formData.email,
        mobile_number: formData.mobileNo,
        address: formData.address,
        type: (formData.memberType || '').toLowerCase(),
        status: (formData.membershipStatus || '').toLowerCase(),
        plan_id: formData.plan_id ? parseInt(formData.plan_id) : null, // Send plan_id as integer
        plan: formData.customerPlan ? formData.customerPlan.toLowerCase() : null, // Also send plan name as fallback
        monthly_fee: formData.monthlyFee ? parseInt((formData.monthlyFee + '').replace(/[^0-9]/g, '')) : undefined,
        registration_fee: formData.registrationFee ? parseInt((formData.registrationFee + '').replace(/[^0-9]/g, '')) : undefined,
        has_trainer: formData.trainerRequired === 'Yes',
        trainer_name: formData.trainerRequired === 'Yes' ? formData.trainerName : undefined,
        age: formData.customerAge ? parseInt((formData.customerAge + '').replace(/[^0-9]/g, '')) : undefined,
        weight: formData.customerWeight ? parseFloat((formData.customerWeight + '').replace(/[^0-9.]/g, '')) : undefined,
      };
      await updateCustomer(editCustomer.id, updatePayload, selectedFile);
      setIsEditOpen(false);
      setEditCustomer(null);
      toast({ title: 'Customer updated', status: 'success', duration: 2000, isClosable: true, position: 'top-right' });
    } catch (error) {
      toast({ title: 'Update failed', description: error.message, status: 'error', duration: 4000, isClosable: true, position: 'top-right' });
    }
  };

  const handleDelete = async (customer) => {
    try {
      await removeCustomer(customer.id);
      toast({ title: 'Customer deleted', status: 'success', duration: 2000, isClosable: true, position: 'top-right' });
    } catch (error) {
      toast({ title: 'Delete failed', description: error.message, status: 'error', duration: 4000, isClosable: true, position: 'top-right' });
    }
  };

  // Check if customer fee is overdue
  const isFeeOverdue = (nextDueDate) => {
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    return dueDate < today;
  };

  // Get days until due or days overdue
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

  // Filter and search customers
  const getFilteredCustomers = () => {
    let filteredData = [...stockData];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredData = filteredData.filter(customer =>
        customer.memberName.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.mobileNo.toLowerCase().includes(query) ||
        customer.address.toLowerCase().includes(query)
      );
    }

    // Membership status filter
    if (filters.membershipStatus) {
      filteredData = filteredData.filter(customer =>
        customer.membershipStatus === filters.membershipStatus
      );
    }

    // Customer plan filter
    if (filters.customerPlan) {
      filteredData = filteredData.filter(customer =>
        customer.customerPlan === filters.customerPlan
      );
    }

    // Fee status filter
    if (filters.feeStatus) {
      filteredData = filteredData.filter(customer => {
        const feeStatus = getFeeStatus(customer.nextDueDate, customer.id);
        if (filters.feeStatus === 'overdue') {
          return feeStatus.status === 'overdue';
        } else if (filters.feeStatus === 'paid') {
          return feeStatus.status === 'paid';
        }
        return true;
      });
    }

    // Trainer required filter
    if (filters.trainerRequired) {
      filteredData = filteredData.filter(customer =>
        customer.trainerRequired === filters.trainerRequired
      );
    }

    return filteredData;
  };

  const filteredCustomers = getFilteredCustomers();

  const handleRefreshOverdueAll = async () => {
    try {
      const res = await forceMarkOverdueFees();
      toast({ title: 'Overdue refreshed', description: res.message || 'Statuses updated', status: 'success', duration: 2500, isClosable: true, position: 'top-right' });
      await fetchCustomers(true);
    } catch (e) {
      const message = (e && e.message) ? e.message : 'Failed updating overdue';
      toast({ title: 'Overdue update failed', description: message, status: 'error', duration: 3500, isClosable: true, position: 'top-right' });
    }
  };

  // Navigate to customer profile
  const handleCustomerClick = (customer) => {
    history.push(`/admin/customer-profile/${customer.id}`);
  };

  // Hover modal handlers
  const handleMouseEnter = (customer, event) => {
    setHoveredCustomer(customer);
    // Get the profile image element position
    const profileImage = event.currentTarget.querySelector('img');
    if (profileImage) {
      const rect = profileImage.getBoundingClientRect();
      setHoverPosition({
        x: rect.right + 10, // Show to the right of the image
        y: rect.top - 10   // Align with top of the image
      });
    } else {
      // Fallback to mouse position if no image found
      setHoverPosition({
        x: event.clientX + 20,
        y: event.clientY - 20
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCustomer(null);
  };

  // Hover Modal Component
  const HoverModal = () => {
    if (!hoveredCustomer) return null;

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
          _before={{
            content: '""',
            position: "absolute",
            top: "30px",
            left: "-8px",
            width: "0",
            height: "0",
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            borderRight: `8px solid ${borderColor}`,
          }}
          _after={{
            content: '""',
            position: "absolute",
            top: "30px",
            left: "-7px",
            width: "0",
            height: "0",
            borderTop: "7px solid transparent",
            borderBottom: "7px solid transparent",
            borderRight: `7px solid ${cardBg}`,
          }}
        >
          <VStack spacing={4} align="center">
            <Box
              w="120px"
              h="120px"
              borderRadius="full"
              overflow="hidden"
              border="4px solid"
              borderColor="brand.300"
              boxShadow="0 8px 20px rgba(0, 0, 0, 0.2)"
            >
              <Avatar name={hoveredCustomer.memberName} src={hoveredCustomer.picture || undefined} w="100%" h="100%" bg="brand.300" color="white" fontWeight="bold" />
            </Box>
            <VStack spacing={2} align="center">
              <Text fontSize="xl" fontWeight="bold" color={cardTextColor} textAlign="center">
                {hoveredCustomer.memberName}
              </Text>
              <Badge
                colorScheme={(hoveredCustomer.membershipStatus || '').toLowerCase() === "active" ? "green" : "red"}
                variant="subtle"
                px={4}
                py={2}
                borderRadius="full"
                fontSize="sm"
                fontWeight="semibold"
              >
                {(hoveredCustomer.membershipStatus || '').charAt(0).toUpperCase() + (hoveredCustomer.membershipStatus || '').slice(1)}
              </Badge>
              <Text fontSize="md" color={cardLabelColor} textAlign="center" fontWeight="medium">
                {hoveredCustomer.customerPlan} Plan
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Portal>
    );
  };

  // Mobile Customer Card Component
  const CustomerCard = ({ customer, index }) => (
    <Box
      bg={cardBg}
      borderRadius="16px"
      border="1px solid"
      borderColor={borderColor}
      p={4}
      mb={4}
      w="100%"
      boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
      _hover={{
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
        transform: "translateY(-2px)",
      }}
      transition="all 0.2s ease-in-out"
    >
      {/* Header with Picture, Name and Status */}
      <Flex justifyContent="space-between" alignItems="center" mb={3}>
        <HStack spacing={3}>
          <Box
            w="50px"
            h="50px"
            borderRadius="full"
            overflow="hidden"
            border="2px solid"
            borderColor={borderColor}
            onMouseEnter={(e) => handleMouseEnter(customer, e)}
            onMouseLeave={handleMouseLeave}
            cursor="pointer"
            _hover={{
              borderColor: "brand.300",
              transform: "scale(1.1)",
            }}
            transition="all 0.2s ease-in-out"
          >
              <Avatar name={customer.memberName} src={customer.picture || undefined} w="100%" h="100%" bg="brand.300" color="white" fontWeight="bold" />
          </Box>
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="bold" color={cardTextColor}>
              {customer.memberName}
            </Text>
            <Badge
              colorScheme={(customer.membershipStatus || '').toLowerCase() === "active" ? "green" : "red"}
              borderRadius="full"
              px={3}
              py={1}
              fontSize="xs"
            >
              {(customer.membershipStatus || '').charAt(0).toUpperCase() + (customer.membershipStatus || '').slice(1)}
            </Badge>
          </VStack>
        </HStack>
        <Menu placement="bottom-end">
          <MenuButton
            as={IconButton}
            icon={<ChevronDownIcon />}
            variant="ghost"
            size="sm"
            color={textColor}
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
                onClick={() => console.log("Edit customer:", customer.name)}
                borderRadius={0}
                _first={{
                  borderTopRadius: "lg"
                }}
              >
                Edit Customer
              </MenuItem>
              <MenuItem 
                onClick={() => console.log("View details:", customer.name)}
              >
                View Details
              </MenuItem>
              <MenuItem 
                onClick={() => console.log("Delete customer:", customer.name)}
                color="red.500"
              >
                Delete
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Flex>

      <Divider mb={3} />

      {/* Contact Information - Expanded Layout */}
      <VStack align="stretch" spacing={3} mb={4}>
        <HStack spacing={3} align="start">
          <EmailIcon color={cardIconColor} boxSize={4} mt={0.5} />
          <VStack align="start" spacing={0} flex={1}>
            <Text fontSize="xs" color={cardIconColor} fontWeight="medium" textTransform="uppercase">
              Email
            </Text>
            <Text fontSize="sm" color={cardLabelColor} noOfLines={1}>
              {customer.email}
            </Text>
          </VStack>
        </HStack>
        <HStack spacing={3} align="start">
          <PhoneIcon color={cardIconColor} boxSize={4} mt={0.5} />
          <VStack align="start" spacing={0} flex={1}>
            <Text fontSize="xs" color={cardIconColor} fontWeight="medium" textTransform="uppercase">
              Mobile
            </Text>
            <Text fontSize="sm" color={cardLabelColor}>
              {customer.mobileNo}
            </Text>
          </VStack>
        </HStack>
        <HStack spacing={3} align="start">
          <Box color={cardIconColor} fontSize="sm" fontWeight="bold" mt={0.5}>📍</Box>
          <VStack align="start" spacing={1} flex={1}>
            <Text fontSize="xs" color={cardIconColor} fontWeight="medium" textTransform="uppercase">
              Address
            </Text>
            <Text fontSize="xs" color={cardIconColor} noOfLines={2}>
              {customer.address}
            </Text>
          </VStack>
        </HStack>
      </VStack>

      <Divider mb={3} />

      {/* Customer Details - Grid Layout for Better Space Usage */}
      <Box>
        <Text fontSize="xs" color={cardIconColor} fontWeight="bold" textTransform="uppercase" mb={3}>
          Customer Details
        </Text>
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
          <VStack align="start" spacing={1}>
            <Text fontSize="xs" color={cardIconColor} fontWeight="medium" textTransform="uppercase">
              Customer Plan
            </Text>
            <Text fontSize="sm" fontWeight="bold" color={cardTextColor}>
              {customer.customerPlan}
            </Text>
          </VStack>
          <VStack align="start" spacing={1}>
            <Text fontSize="xs" color={cardIconColor} fontWeight="medium" textTransform="uppercase">
              Trainer Required
            </Text>
            <Text fontSize="sm" fontWeight="bold" color={cardTextColor}>
              {customer.trainerRequired}
            </Text>
          </VStack>
        </Box>
      </Box>
    </Box>
  );

  // Customer management captions - Clean key-style headers
  const stockCaptions = [
    { key: "Picture", width: "8%" },
    { key: "Customer Name", width: "18%" },
    { key: "Type", width: "8%" },
    { key: "Mobile No.", width: "14%" },
    { key: "Email", width: "16%" },
    { key: "Address", width: "20%" },
    { key: "Status", width: "8%" },
    { key: "Trainer", width: "8%" },
    { key: "Plan", width: "10%" },
    { key: "Fee Status", width: "10%" },
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
            Customer Management
          </Text>
          <Flex gap="6px" flexShrink={0} ms={{ base: "auto", md: "auto" }}>
            {/* Quick Month/Year filters */}
            <HStack display={{ base: 'none', md: 'flex' }} spacing={2} me={2}>
              <Input
                type="date"
                size="xs"
                value={filters.dateFrom}
                onChange={(e) => updateFilters({ dateFrom: e.target.value })}
                w="140px"
                placeholder="From"
              />
              <Input
                type="date"
                size="xs"
                value={filters.dateTo}
                onChange={(e) => updateFilters({ dateTo: e.target.value })}
                w="140px"
                placeholder="To"
              />
              <Select
                placeholder="Month"
                size="xs"
                value={filters.month}
                onChange={(e) => updateFilters({ month: e.target.value })}
                w="110px"
              >
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </Select>
              <Select
                placeholder="Year"
                size="xs"
                value={filters.year}
                onChange={(e) => updateFilters({ year: e.target.value })}
                w="90px"
              >
                {Array.from(new Set(customers
                  .map(c => (c.created_at ? new Date(c.created_at).getFullYear() : null))
                  .filter(Boolean)
                )).sort((a,b)=>b-a).slice(0,8).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </Select>
              <Button size="xs" variant="ghost" onClick={() => clearFilters()}>Clear</Button>
            </HStack>
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
                  onClick={plansDisclosure.onOpen}
                >
                  Manage Plans
                </MenuItem>
                <MenuItem
                  icon={<SettingsIcon />}
                  position="relative"
                  onClick={() => {
                    // Handle filters in a simpler way or open a modal
                    console.log("Open filters");
                  }}
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
                  icon={<AddIcon />}
                  onClick={onOpen}
                  color="brand.600"
                  fontWeight="semibold"
                >
                  Add Customer
                </MenuItem>
              </MenuList>
            </Menu>
            <Button size="xs" variant="outline" leftIcon={<RepeatIcon />} onClick={handleRefreshOverdueAll}>
              Refresh Overdue
            </Button>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody overflow="visible">
        {loading ? (
          <AppLoader message="Loading customers..." fullHeight />
        ) : stockData.length === 0 ? (
          <EmptyState
            title="No customers found"
            description="Try adjusting filters or add a new customer to get started."
            actionLabel="Add Customer"
            onAction={onOpen}
            fullHeight
          />
        ) : isMobile ? (
           // Mobile List View - Minimal Info
           <VStack spacing={3} align="stretch" w="100%">
             {stockData.map((customer, index) => (
               <Box
                 key={`${customer.id}-${index}`}
                 bg={cardBg}
                 borderRadius="8px"
                 border="1px solid"
                 borderColor={borderColor}
                 p={3}
                 w="100%"
                 boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1)"
                 cursor="pointer"
                 onClick={() => handleCustomerClick(customer)}
                 transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                 position="relative"
                 _before={{
                   content: '""',
                   position: "absolute",
                   top: 0,
                   left: 0,
                   right: 0,
                   bottom: 0,
                   borderRadius: "8px",
                   background: "linear-gradient(135deg, rgba(56, 178, 172, 0.1) 0%, rgba(129, 230, 217, 0.1) 100%)",
                   opacity: 0,
                   transition: "opacity 0.3s ease",
                   zIndex: 0,
                 }}
                 _hover={{
                   boxShadow: "0px 8px 25px rgba(56, 178, 172, 0.25)",
                   transform: "translateY(-4px) scale(1.02)",
                   borderColor: "brand.300",
                   bg: useColorModeValue("brand.50", "brand.900"),
                   _before: {
                     opacity: 1,
                   }
                 }}
                 sx={{
                   "& > *": {
                     position: "relative",
                     zIndex: 1,
                   }
                 }}
               >
                 <Flex justifyContent="space-between" alignItems="center">
                   <HStack spacing={3}>
                     <Box
                       w="40px"
                       h="40px"
                       borderRadius="full"
                       overflow="hidden"
                       border="2px solid"
                       borderColor={borderColor}
                       onMouseEnter={(e) => handleMouseEnter(customer, e)}
                       onMouseLeave={handleMouseLeave}
                       cursor="pointer"
                       _hover={{
                         borderColor: "brand.300",
                         transform: "scale(1.05)",
                       }}
                       transition="all 0.2s ease-in-out"
                     >
                      <Avatar
                        name={customer.memberName}
                        src={customer.picture || undefined}
                        w="100%"
                        h="100%"
                        bg="brand.300"
                        color="white"
                        fontWeight="bold"
                        title={customer.memberName}
                       />
                     </Box>
                     <VStack align="start" spacing={0}>
                       <Text fontSize="md" fontWeight="bold" color={textColor}>
                         {customer.memberName}
                       </Text>
                       <Text fontSize="xs" color={cardLabelColor}>
                         {customer.email}
                       </Text>
                       <Text fontSize="xs" color={cardLabelColor}>
                         {customer.mobileNo}
                       </Text>
                     </VStack>
                   </HStack>
                          <VStack align="end" spacing={1}>
                            <Badge
                              colorScheme={(customer.membershipStatus || '').toLowerCase() === "active" ? "green" : "red"}
                              variant="subtle"
                              px={2}
                              py={1}
                              borderRadius="full"
                              fontSize="xs"
                              fontWeight="semibold"
                            >
                              {(customer.membershipStatus || '').charAt(0).toUpperCase() + (customer.membershipStatus || '').slice(1)}
                            </Badge>
                            <Text fontSize="xs" color={cardLabelColor}>
                              {customer.customerPlan}
                            </Text>
                            {isFeeOverdue(customer.nextDueDate) && (
                              <Box color="red.500" fontSize="xs">⚠️</Box>
                            )}
                          </VStack>
                 </Flex>
               </Box>
             ))}
           </VStack>
         ) : isTablet ? (
           // Tablet Card View - More Details
          <VStack spacing={4} align="stretch" w="100%">
             {filteredCustomers.map((customer, index) => (
               <Box
                 key={`${customer.id}-${index}`}
                 bg={cardBg}
                 borderRadius="12px"
                 border="1px solid"
                 borderColor={borderColor}
                 p={4}
                 w="100%"
                 boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
                 cursor="pointer"
                 onClick={() => handleCustomerClick(customer)}
                 transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                 position="relative"
                 _before={{
                   content: '""',
                   position: "absolute",
                   top: 0,
                   left: 0,
                   right: 0,
                   bottom: 0,
                   borderRadius: "12px",
                   background: "linear-gradient(135deg, rgba(56, 178, 172, 0.1) 0%, rgba(129, 230, 217, 0.1) 100%)",
                   opacity: 0,
                   transition: "opacity 0.3s ease",
                   zIndex: 0,
                 }}
                 _hover={{
                   boxShadow: "0px 12px 30px rgba(56, 178, 172, 0.3)",
                   transform: "translateY(-6px) scale(1.03)",
                   borderColor: "brand.300",
                   bg: useColorModeValue("brand.50", "brand.900"),
                   _before: {
                     opacity: 1,
                   }
                 }}
                 sx={{
                   "& > *": {
                     position: "relative",
                     zIndex: 1,
                   }
                 }}
               >
                 {/* Header with Picture, Name and Status */}
                 <Flex justifyContent="space-between" alignItems="center" mb={3}>
                   <HStack spacing={3}>
                     <Box
                       w="50px"
                       h="50px"
                       borderRadius="full"
                       overflow="hidden"
                       border="2px solid"
                       borderColor={borderColor}
                       onMouseEnter={(e) => handleMouseEnter(customer, e)}
                       onMouseLeave={handleMouseLeave}
                       cursor="pointer"
                       _hover={{
                         borderColor: "brand.300",
                         transform: "scale(1.1)",
                       }}
                       transition="all 0.2s ease-in-out"
                     >
                       <Avatar
                         name={customer.memberName}
                         src={customer.picture}
                         w="100%"
                         h="100%"
                         bg="brand.300"
                         color="white"
                         fontWeight="bold"
                         title={customer.memberName}
                       />
                     </Box>
                     <VStack align="start" spacing={1}>
                       <Text fontSize="lg" fontWeight="bold" color={textColor}>
                         {customer.memberName}
                       </Text>
                       <Text fontSize="sm" color={cardLabelColor}>
                         ID: {customer.id}
                       </Text>
                     </VStack>
                   </HStack>
                   <Badge
                    colorScheme={(customer.membershipStatus || '').toLowerCase() === "active" ? "green" : "red"}
                     variant="subtle"
                     px={3}
                     py={1}
                     borderRadius="full"
                     fontSize="xs"
                     fontWeight="semibold"
                   >
                    {(customer.membershipStatus || '').charAt(0).toUpperCase() + (customer.membershipStatus || '').slice(1)}
                   </Badge>
                 </Flex>

                        <Divider mb={3} />

                        {/* Fee Status */}
                        {isFeeOverdue(customer.nextDueDate) && (
                          <Flex justifyContent="flex-end" alignItems="center" mb={3}>
                            <HStack spacing={1}>
                              <Box color="red.500" fontSize="sm">⚠️</Box>
                              <Text fontSize="xs" color="red.500" fontWeight="semibold">
                                OVERDUE
                              </Text>
                            </HStack>
                          </Flex>
                        )}

                        <Divider mb={3} />

                        {/* Contact Information */}
                        <VStack align="stretch" spacing={3} mb={4}>
                   <HStack spacing={3} align="start">
                     <EmailIcon color={cardIconColor} boxSize={4} mt={0.5} />
                     <VStack align="start" spacing={0} flex={1}>
                       <Text fontSize="xs" color={cardIconColor} fontWeight="medium" textTransform="uppercase">
                         Email
                       </Text>
                       <Text fontSize="sm" color={cardLabelColor} noOfLines={1}>
                         {customer.email}
                       </Text>
                     </VStack>
                   </HStack>
                   <HStack spacing={3} align="start">
                     <PhoneIcon color={cardIconColor} boxSize={4} mt={0.5} />
                     <VStack align="start" spacing={0} flex={1}>
                       <Text fontSize="xs" color={cardIconColor} fontWeight="medium" textTransform="uppercase">
                         Mobile
                       </Text>
                       <Text fontSize="sm" color={cardLabelColor}>
                         {customer.mobileNo}
                       </Text>
                     </VStack>
                   </HStack>
                   <HStack spacing={3} align="start">
                     <Box color={cardIconColor} fontSize="sm" fontWeight="bold" mt={0.5}>📍</Box>
                     <VStack align="start" spacing={1} flex={1}>
                       <Text fontSize="xs" color={cardIconColor} fontWeight="medium" textTransform="uppercase">
                         Address
                       </Text>
                       <Text fontSize="xs" color={cardLabelColor} noOfLines={2}>
                         {customer.address}
                       </Text>
                     </VStack>
                   </HStack>
                 </VStack>

                 <Divider mb={3} />

                 {/* Customer Details Grid */}
                 <Box>
                   <Text fontSize="xs" color={cardIconColor} fontWeight="bold" textTransform="uppercase" mb={3}>
                     Customer Details
                   </Text>
                   <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
                     <VStack align="start" spacing={1}>
                       <Text fontSize="xs" color={cardIconColor} fontWeight="medium" textTransform="uppercase">
                         Customer Plan
                       </Text>
                       <Badge
                         colorScheme={
                           customer.customerPlan === "Premium" ? "purple" : 
                           customer.customerPlan === "Basic" ? "blue" : "orange"
                         }
                         variant="subtle"
                         px={2}
                         py={1}
                         borderRadius="md"
                         fontSize="xs"
                         fontWeight="semibold"
                       >
                         {customer.customerPlan}
                       </Badge>
                     </VStack>
                     <VStack align="start" spacing={1}>
                       <Text fontSize="xs" color={cardIconColor} fontWeight="medium" textTransform="uppercase">
                         Trainer Required
                       </Text>
                       <HStack spacing={1}>
                         {customer.trainerRequired === "Yes" ? (
                           <StarIcon boxSize={3} color="yellow.500" />
                         ) : (
                           <CloseIcon boxSize={3} color="gray.400" />
                         )}
                         <Text fontSize="sm" fontWeight="bold" color={textColor}>
                           {customer.trainerRequired}
                         </Text>
                       </HStack>
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
                 {stockCaptions.map((caption, idx) => {
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
               {filteredCustomers.map((row, index) => {
                return (
                          <StockTableRow
                            key={`${row.memberName}-${index}`}
                            id={row.id}
                            picture={row.picture}
                            memberName={row.memberName}
                            memberType={row.memberType}
                            mobileNo={row.mobileNo}
                            email={row.email}
                            address={row.address}
                            registrationDate={row.registrationDate}
                            membershipStatus={row.membershipStatus}
                            trainerRequired={row.trainerRequired}
                            customerPlan={row.customerPlan}
                            customerWeight={row.customerWeight}
                            customerAge={row.customerAge}
                            monthlyFee={row.monthlyFee}
                            nextDueDate={row.nextDueDate}
                            onMouseEnter={(e) => handleMouseEnter(row, e)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleCustomerClick(row)}
                            onEdit={() => handleOpenEdit(row)}
                            onDelete={() => handleDelete(row)}
                          />
                );
              })}
            </Tbody>
          </Table>
        )}
      </CardBody>
      
      <PlansModal
        isOpen={plansDisclosure.isOpen}
        onClose={plansDisclosure.onClose}
      />
      
      <AddCustomerModal
        isOpen={isOpen}
        onClose={onClose}
        onAddCustomer={handleAddCustomer}
      />
      <EditCustomerModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setEditCustomer(null); }}
        customer={editCustomer}
        onSave={handleSaveEdit}
      />
      
      {/* Hover Modal */}
      <HoverModal />
      
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

export default Authors;
