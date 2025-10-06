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
} from "@chakra-ui/react";
import { ChevronDownIcon, PhoneIcon, EmailIcon, StarIcon, CloseIcon, SettingsIcon, HamburgerIcon, AttachmentIcon, DownloadIcon, AddIcon } from "@chakra-ui/icons";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import StockTableRow from "components/Tables/StockTableRow";
import AddCustomerModal from "components/Modals/AddCustomerModal";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSearch } from "contexts/SearchContext";


const Authors = ({ title, captions, data }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardTextColor = useColorModeValue("gray.700", "white");
  const cardLabelColor = useColorModeValue("gray.600", "gray.300");
  const cardIconColor = useColorModeValue("gray.500", "gray.400");
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  
  // Customer management data
  const [stockData, setStockData] = useState([
    {
      id: 1,
      picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      memberName: "Asim Khan",
      memberType: "New",
      mobileNo: "+92 321 2345678",
      email: "asim@gmail.com",
      address: "House no. 123, Street no. 123, Lahore",
      registrationDate: "2024-01-15",
      membershipStatus: "Active",
      trainerRequired: "Yes",
      customerPlan: "Premium",
      customerWeight: "75 kg",
      customerAge: "28",
      monthlyFee: "₨4,500",
      feePaidDate: "2024-01-15",
      nextDueDate: "2024-02-15"
    },
    {
      id: 2,
      picture: "https://images.unsplash.com/photo-1552699611-e2c208d5d9cf?q=80&w=1616&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      memberName: "Fatima Ali",
      memberType: "Old",
      mobileNo: "+92 300 1234567",
      email: "fatima@yahoo.com",
      address: "Apartment 45, Block 7, Karachi",
      registrationDate: "2024-01-20",
      membershipStatus: "Active",
      trainerRequired: "No",
      customerPlan: "Basic",
      customerWeight: "65 kg",
      customerAge: "25",
      monthlyFee: "₨3,000",
      feePaidDate: "2023-12-20",
      nextDueDate: "2024-01-20"
    },
    {
      id: 3,
      picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      memberName: "Ahmed Hassan",
      memberType: "Old",
      mobileNo: "+92 333 9876543",
      email: "ahmed@hotmail.com",
      address: "Villa 12, Phase 5, Islamabad",
      registrationDate: "2024-01-18",
      membershipStatus: "Inactive",
      trainerRequired: "Yes",
      customerPlan: "Standard",
      customerWeight: "80 kg",
      customerAge: "32",
      monthlyFee: "₨3,500",
      feePaidDate: "2023-11-18",
      nextDueDate: "2023-12-18"
    },
    {
      id: 4,
      picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      memberName: "Sara Ahmed",
      memberType: "New",
      mobileNo: "+92 301 4567890",
      email: "sara@gmail.com",
      address: "Flat 8, Building 3, Peshawar",
      registrationDate: "2024-01-22",
      membershipStatus: "Active",
      trainerRequired: "Yes",
      customerPlan: "Premium",
      customerWeight: "60 kg",
      customerAge: "26",
      monthlyFee: "₨4,500",
      feePaidDate: "2024-01-22",
      nextDueDate: "2024-02-22"
    },
    {
      id: 5,
      picture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      memberName: "Usman Sheikh",
      memberType: "Old",
      mobileNo: "+92 302 7890123",
      email: "usman@outlook.com",
      address: "House 67, Street 15, Faisalabad",
      registrationDate: "2024-01-12",
      membershipStatus: "Active",
      trainerRequired: "No",
      customerPlan: "Basic",
      customerWeight: "85 kg",
      customerAge: "35",
      monthlyFee: "₨3,000",
      feePaidDate: "2024-01-12",
      nextDueDate: "2024-02-12"
    },
    {
      id: 6,
      picture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      memberName: "Ayesha Malik",
      memberType: "New",
      mobileNo: "+92 304 3210987",
      email: "ayesha@gmail.com",
      address: "Apartment 23, Block 2, Multan",
      registrationDate: "2024-01-25",
      membershipStatus: "Active",
      trainerRequired: "Yes",
      customerPlan: "Standard",
      customerWeight: "55 kg",
      customerAge: "23",
      monthlyFee: "₨4,500",
      feePaidDate: "2024-01-25",
      nextDueDate: "2024-02-25"
    }
  ]);

  const handleAddCustomer = (newCustomer) => {
    setStockData(prev => [...prev, newCustomer]);
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

  // Navigate to customer profile
  const handleCustomerClick = (customer) => {
    history.push(`/admin/profile?customerId=${customer.id}`);
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
              <Image
                src={hoveredCustomer.picture}
                alt={hoveredCustomer.memberName}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </Box>
            <VStack spacing={2} align="center">
              <Text fontSize="xl" fontWeight="bold" color={cardTextColor} textAlign="center">
                {hoveredCustomer.memberName}
              </Text>
              <Badge
                colorScheme={hoveredCustomer.membershipStatus === "Active" ? "green" : "red"}
                variant="subtle"
                px={4}
                py={2}
                borderRadius="full"
                fontSize="sm"
                fontWeight="semibold"
              >
                {hoveredCustomer.membershipStatus}
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
            <img
              src={customer.picture}
              alt={customer.memberName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          </Box>
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="bold" color={cardTextColor}>
              {customer.memberName}
            </Text>
            <Badge
              colorScheme={customer.membershipStatus === "Active" ? "green" : "red"}
              borderRadius="full"
              px={3}
              py={1}
              fontSize="xs"
            >
              {customer.membershipStatus}
            </Badge>
          </VStack>
        </HStack>
        <Menu>
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
          <MenuList zIndex={99999} borderRadius="lg" overflow="hidden" data-menu="true">
            <MenuItem 
              onClick={() => console.log("Edit customer:", customer.name)}
              borderRadius={0}
              _first={{
                borderTopRadius: "lg"
              }}
              _last={{
                borderBottomRadius: "lg"
              }}
            >
              Edit Customer
            </MenuItem>
            <MenuItem 
              onClick={() => console.log("View details:", customer.name)}
              borderRadius={0}
              _last={{
                borderBottomRadius: "lg"
              }}
            >
              View Details
            </MenuItem>
          </MenuList>
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
    <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
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
          <Flex gap="4px" flexShrink={0} ms={{ base: "auto", md: "auto" }}>
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
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        {isMobile ? (
           // Mobile List View - Minimal Info
           <VStack spacing={3} align="stretch" w="100%">
             {filteredCustomers.map((customer, index) => (
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
                       <img
                         src={customer.picture}
                         alt={customer.memberName}
                         style={{
                           width: "100%",
                           height: "100%",
                           objectFit: "cover"
                         }}
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
                              colorScheme={customer.membershipStatus === "Active" ? "green" : "red"}
                              variant="subtle"
                              px={2}
                              py={1}
                              borderRadius="full"
                              fontSize="xs"
                              fontWeight="semibold"
                            >
                              {customer.membershipStatus}
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
                       <img
                         src={customer.picture}
                         alt={customer.memberName}
                         style={{
                           width: "100%",
                           height: "100%",
                           objectFit: "cover"
                         }}
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
                     colorScheme={customer.membershipStatus === "Active" ? "green" : "red"}
                     variant="subtle"
                     px={3}
                     py={1}
                     borderRadius="full"
                     fontSize="xs"
                     fontWeight="semibold"
                   >
                     {customer.membershipStatus}
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
             overflow="hidden"
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
                          />
                );
              })}
            </Tbody>
          </Table>
        )}
      </CardBody>
      
      <AddCustomerModal
        isOpen={isOpen}
        onClose={onClose}
        onAddCustomer={handleAddCustomer}
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
