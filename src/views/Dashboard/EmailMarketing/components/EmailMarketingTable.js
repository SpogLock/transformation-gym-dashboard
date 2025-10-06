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
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useToast,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Checkbox,
  CheckboxGroup,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Image,
  Progress,
} from "@chakra-ui/react";
import { SearchIcon, EditIcon, DeleteIcon, ViewIcon, DownloadIcon, EmailIcon, AddIcon, CalendarIcon, BarChartIcon } from "@chakra-ui/icons";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import EmailMarketingTableRow from "./EmailMarketingTableRow";
import EmailPreview from "./EmailPreview";
import React, { useState } from "react";

const EmailMarketingTable = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardLabelColor = useColorModeValue("gray.600", "gray.300");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();

  // State for search, filters, and modal
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    subject: "",
    recipients: [],
    content: "",
    image: null,
    scheduleDate: "",
    scheduleTime: ""
  });

  // Sample campaigns data
  const sampleCampaigns = [
    {
      id: "CAMP-001",
      name: "New Year Fitness Challenge",
      subject: "Start 2024 Strong! Join Our Fitness Challenge",
      status: "Sent",
      sentDate: "2024-01-15",
      recipients: 150,
      openRate: 68.5,
      clickRate: 12.3,
      unsubscribeRate: 1.2,
      content: `🏋️‍♂️ **NEW YEAR, NEW YOU!** 🏋️‍♀️

Ready to crush your fitness goals in 2024? Join our exclusive **New Year Fitness Challenge** and transform your life!

**What's Included:**
✅ 30-day personalized workout plan
✅ Nutrition guidance from our certified trainers
✅ Weekly progress check-ins
✅ Amazing prizes for top performers
✅ Supportive community of fitness enthusiasts

**Challenge Details:**
📅 Starts: January 22, 2024
⏰ Duration: 30 days
🎯 Goals: Strength, endurance, and overall wellness
🏆 Prizes: Gym merchandise, personal training sessions, and more!

**Special Offer for Participants:**
- 20% off all supplements during the challenge
- Free body composition analysis
- Complimentary nutrition consultation

Don't wait - spots are limited! Sign up today and make 2024 your strongest year yet!

**Ready to get started?** Click the button below to register for the challenge.

Best regards,
The FitZone Team 💪`,
      recipientsList: ["customers", "leads"]
    },
    {
      id: "CAMP-002", 
      name: "Supplement Sale Alert",
      subject: "50% Off Premium Supplements - Limited Time!",
      status: "Sent",
      sentDate: "2024-01-10",
      recipients: 200,
      openRate: 72.1,
      clickRate: 18.7,
      unsubscribeRate: 0.8,
      content: `🔥 **MASSIVE SUPPLEMENT SALE!** 🔥

Don't miss our biggest supplement sale of the year! For a limited time only, get **50% OFF** on all premium supplements.

**Featured Products:**
💪 Optimum Nutrition Gold Standard Whey - Now $37.50 (was $75)
🧠 MuscleTech Creatine Monohydrate - Now $15 (was $30)
⚡ BSN N.O.-XPLODE Pre-Workout - Now $27.50 (was $55)
🌿 Universal Animal Pak Multivitamin - Now $24 (was $48)

**Why Choose Our Supplements?**
✅ Premium quality ingredients
✅ Third-party tested for purity
✅ Fast shipping and delivery
✅ Expert recommendations from our trainers

**Sale Details:**
📅 Valid until: January 31, 2024
🚚 Free shipping on orders over $50
💳 All payment methods accepted
📞 Need help? Call us at (555) 123-4567

**Limited Stock Available!**
These prices won't last long. Shop now before they're gone!

**Questions?** Our supplement experts are here to help you choose the right products for your fitness goals.

Happy Shopping! 🛒`,
      recipientsList: ["customers"]
    },
    {
      id: "CAMP-003",
      name: "Gym Membership Promotion",
      subject: "Special Membership Offer - 3 Months Free!",
      status: "Draft",
      sentDate: "",
      recipients: 0,
      openRate: 0,
      clickRate: 0,
      unsubscribeRate: 0,
      content: `🎉 **EXCLUSIVE MEMBERSHIP OFFER!** 🎉

Get **3 MONTHS FREE** when you sign up for our premium membership!

**What You Get:**
✅ Unlimited access to all gym equipment
✅ Group fitness classes included
✅ Personal training session (1 hour)
✅ Locker and towel service
✅ Nutrition consultation
✅ Access to our mobile app

**Membership Benefits:**
🏋️‍♂️ 24/7 gym access
👥 Unlimited group classes
💪 State-of-the-art equipment
🏊‍♀️ Swimming pool and sauna
🧘‍♀️ Yoga and meditation classes
📱 Fitness tracking app

**Special Offer Details:**
💰 Regular Price: $99/month
🎁 Your Price: $99/month + 3 months FREE
💳 No setup fees
📝 No long-term contracts
🔄 Cancel anytime

**Limited Time Only!**
This offer expires on February 15, 2024. Don't miss out!

**Ready to Start Your Fitness Journey?**
Click below to claim your 3 months free membership!

**Questions?** Visit us at 123 Fitness Street or call (555) 123-4567.

Transform your life today! 💪`,
      recipientsList: ["leads"]
    },
    {
      id: "CAMP-004",
      name: "Weekly Newsletter",
      subject: "This Week's Fitness Tips & Updates",
      status: "Scheduled",
      sentDate: "2024-01-20",
      recipients: 180,
      openRate: 0,
      clickRate: 0,
      unsubscribeRate: 0,
      content: `📰 **FITZONE WEEKLY NEWSLETTER** 📰

Welcome to this week's fitness tips, gym updates, and member spotlights!

**💪 This Week's Fitness Tip:**
"Consistency beats perfection every time. Focus on showing up and doing your best, not on being perfect."

**🏋️‍♂️ New Equipment Arrivals:**
- 5 new Peloton bikes in the cardio section
- Updated weight training area with new dumbbells
- Enhanced stretching zone with yoga mats and blocks

**👥 Member Spotlight:**
This week we're featuring Sarah Johnson, who lost 25 pounds in 3 months! Read her inspiring story on our website.

**📅 Upcoming Events:**
- Saturday: Group HIIT class at 9 AM
- Sunday: Yoga workshop at 2 PM
- Monday: Nutrition seminar at 6 PM

**🍎 Recipe of the Week:**
Try our protein-packed smoothie bowl recipe:
- 1 scoop vanilla protein powder
- 1 banana
- 1 cup frozen berries
- 1/2 cup Greek yogurt
- Top with granola and honey

**📊 Gym Statistics:**
- 1,247 workouts completed this week
- 89 new members joined
- 156 personal training sessions booked

**🎯 Challenge Update:**
New Year Challenge participants are crushing it! Keep up the great work!

Stay motivated and keep pushing towards your goals! 💪

Best regards,
The FitZone Team`,
      recipientsList: ["customers", "members"]
    }
  ];

  // Sample customers for recipient selection
  const sampleCustomers = [
    { id: 1, name: "Alex Martinez", email: "alex@gmail.com", type: "customer" },
    { id: 2, name: "Sarah Johnson", email: "sarah@gmail.com", type: "customer" },
    { id: 3, name: "Mike Chen", email: "mike@gmail.com", type: "customer" },
    { id: 4, name: "Emma Davis", email: "emma@gmail.com", type: "customer" },
    { id: 5, name: "John Smith", email: "john@gmail.com", type: "lead" },
    { id: 6, name: "Lisa Wang", email: "lisa@gmail.com", type: "lead" }
  ];

  // Filter campaigns based on search and filters
  const getFilteredCampaigns = () => {
    return sampleCampaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           campaign.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           campaign.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || campaign.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  // Calculate summary statistics
  const sentCampaigns = sampleCampaigns.filter(c => c.status === "Sent");
  const totalCampaigns = sampleCampaigns.length;
  const avgOpenRate = sentCampaigns.length > 0 
    ? (sentCampaigns.reduce((sum, c) => sum + c.openRate, 0) / sentCampaigns.length).toFixed(1)
    : 0;
  const avgClickRate = sentCampaigns.length > 0 
    ? (sentCampaigns.reduce((sum, c) => sum + c.clickRate, 0) / sentCampaigns.length).toFixed(1)
    : 0;

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.subject || !newCampaign.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in campaign name, subject, and content",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Campaign Created",
      description: `Campaign "${newCampaign.name}" has been created successfully`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Reset form
    setNewCampaign({
      name: "",
      subject: "",
      recipients: [],
      content: "",
      image: null,
      scheduleDate: "",
      scheduleTime: ""
    });
    onClose();
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Campaign saved as draft",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  const handleSchedule = () => {
    if (!newCampaign.scheduleDate || !newCampaign.scheduleTime) {
      toast({
        title: "Schedule Required",
        description: "Please select date and time for scheduling",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Campaign Scheduled",
      description: `Campaign scheduled for ${newCampaign.scheduleDate} at ${newCampaign.scheduleTime}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  const handleViewCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    onPreviewOpen();
  };

  const handleDeleteCampaign = (campaign) => {
    toast({
      title: "Campaign Deleted",
      description: `Campaign "${campaign.name}" has been deleted`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handlePreviewSend = () => {
    if (selectedCampaign) {
      toast({
        title: "Campaign Sent!",
        description: `"${selectedCampaign.name}" has been sent to ${selectedCampaign.recipients} recipients`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePreviewSchedule = () => {
    if (selectedCampaign) {
      toast({
        title: "Campaign Scheduled!",
        description: `"${selectedCampaign.name}" will be sent at the scheduled time`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePreviewEdit = () => {
    // Close preview and open edit modal
    onPreviewClose();
    onOpen();
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Email Marketing
        </Text>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="teal"
          onClick={onOpen}
          size="sm"
        >
          Create Campaign
        </Button>
      </Flex>

      {/* Summary Cards */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} mb={6}>
        <Card borderRadius="xl">
          <CardBody>
            <Stat>
              <StatLabel color={cardLabelColor}>Total Campaigns</StatLabel>
              <StatNumber color={textColor}>{totalCampaigns}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card borderRadius="xl">
          <CardBody>
            <Stat>
              <StatLabel color={cardLabelColor}>Avg Open Rate</StatLabel>
              <StatNumber color={textColor}>{avgOpenRate}%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                5.2%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card borderRadius="xl">
          <CardBody>
            <Stat>
              <StatLabel color={cardLabelColor}>Avg Click Rate</StatLabel>
              <StatNumber color={textColor}>{avgClickRate}%</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                2.1%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Campaigns Table */}
      <Card borderRadius="xl">
        <CardHeader>
          <VStack spacing={4} align="stretch">
            {/* Search and Filters */}
            <Flex direction={{ base: "column", md: "row" }} gap={3}>
              <InputGroup flex="1">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  bg={useColorModeValue("gray.50", "gray.700")}
                  border="none"
                  borderRadius="lg"
                />
              </InputGroup>
              
              <Select
                placeholder="All Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                bg={useColorModeValue("gray.50", "gray.700")}
                border="none"
                borderRadius="lg"
                w={{ base: "full", md: "200px" }}
              >
                <option value="Sent">Sent</option>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
              </Select>
            </Flex>
          </VStack>
        </CardHeader>
        
        <CardBody pt={0}>
          {isMobile ? (
            // Mobile Card View
            <VStack spacing={4} align="stretch">
              {getFilteredCampaigns().map((campaign, index) => (
                <Box
                  key={`${campaign.id}-${index}`}
                  bg={cardBg}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={borderColor}
                  p={4}
                  w="100%"
                  boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1)"
                  cursor="pointer"
                  onClick={() => handleViewCampaign(campaign)}
                  transition="all 0.2s ease"
                  _hover={{
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                    transform: "translateY(-2px)",
                  }}
                >
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" fontWeight="bold" color={textColor}>
                          {campaign.name}
                        </Text>
                        <Text fontSize="xs" color={cardLabelColor}>
                          {campaign.id}
                        </Text>
                      </VStack>
                      <Badge
                        colorScheme={
                          campaign.status === "Sent" ? "green" : 
                          campaign.status === "Draft" ? "yellow" : "blue"
                        }
                        variant="subtle"
                        fontSize="xs"
                      >
                        {campaign.status}
                      </Badge>
                    </HStack>
                    
                    <Text fontSize="sm" color={textColor} noOfLines={2}>
                      {campaign.subject}
                    </Text>
                    
                    {campaign.status === "Sent" && (
                      <VStack spacing={2} align="stretch">
                        <HStack justify="space-between">
                          <Text fontSize="xs" color={cardLabelColor}>Open Rate:</Text>
                          <Text fontSize="xs" fontWeight="semibold">{campaign.openRate}%</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="xs" color={cardLabelColor}>Click Rate:</Text>
                          <Text fontSize="xs" fontWeight="semibold">{campaign.clickRate}%</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="xs" color={cardLabelColor}>Recipients:</Text>
                          <Text fontSize="xs" fontWeight="semibold">{campaign.recipients}</Text>
                        </HStack>
                      </VStack>
                    )}
                    
                    <HStack justify="space-between">
                      <Text fontSize="xs" color={cardLabelColor}>
                        {campaign.sentDate || "Not sent"}
                      </Text>
                      <Menu placement="bottom-end">
                        <MenuButton
                          as={IconButton}
                          icon={<ViewIcon />}
                          variant="ghost"
                          size="xs"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Portal>
                          <MenuList zIndex={1400}>
                            <MenuItem
                              icon={<ViewIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewCampaign(campaign);
                              }}
                            >
                              View Details
                            </MenuItem>
                            <MenuItem
                              icon={<EditIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Edit campaign:", campaign.name);
                              }}
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              icon={<DeleteIcon />}
                              color="red.500"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCampaign(campaign);
                              }}
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Portal>
                      </Menu>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
          ) : (
            // Desktop Table View
            <Table variant="simple" color={textColor}>
              <Thead>
                <Tr>
                  <Th color={textColor} fontSize="sm" fontWeight="bold" textTransform="none" px="16px" py="12px">
                    Campaign
                  </Th>
                  <Th color={textColor} fontSize="sm" fontWeight="bold" textTransform="none" px="16px" py="12px">
                    Status
                  </Th>
                  <Th color={textColor} fontSize="sm" fontWeight="bold" textTransform="none" px="16px" py="12px">
                    Recipients
                  </Th>
                  <Th color={textColor} fontSize="sm" fontWeight="bold" textTransform="none" px="16px" py="12px">
                    Open Rate
                  </Th>
                  <Th color={textColor} fontSize="sm" fontWeight="bold" textTransform="none" px="16px" py="12px">
                    Click Rate
                  </Th>
                  <Th color={textColor} fontSize="sm" fontWeight="bold" textTransform="none" px="16px" py="12px">
                    Sent Date
                  </Th>
                  <Th color={textColor} fontSize="sm" fontWeight="bold" textTransform="none" px="16px" py="12px">
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {getFilteredCampaigns().map((campaign, index) => (
                  <EmailMarketingTableRow
                    key={`${campaign.id}-${index}`}
                    campaign={campaign}
                    onClick={() => handleViewCampaign(campaign)}
                    onEdit={() => console.log("Edit campaign:", campaign.name)}
                    onDelete={() => handleDeleteCampaign(campaign)}
                  />
                ))}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Create Campaign Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(10px)" bg="rgba(0,0,0,0.3)" />
        <ModalContent borderRadius="20px" border="1.5px solid" borderColor={useColorModeValue("white", "whiteAlpha.300")}>
          <ModalHeader color={textColor}>Create New Campaign</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              {/* Campaign Name */}
              <FormControl>
                <FormLabel>Campaign Name</FormLabel>
                <Input
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                  placeholder="Enter campaign name"
                />
              </FormControl>

              {/* Subject */}
              <FormControl>
                <FormLabel>Subject Line</FormLabel>
                <Input
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                  placeholder="Enter email subject"
                />
              </FormControl>

              {/* Recipients */}
              <FormControl>
                <FormLabel>Recipients</FormLabel>
                <CheckboxGroup
                  value={newCampaign.recipients}
                  onChange={(values) => setNewCampaign({...newCampaign, recipients: values})}
                >
                  <Stack direction="column">
                    <Checkbox value="customers">Existing Customers ({sampleCustomers.filter(c => c.type === 'customer').length})</Checkbox>
                    <Checkbox value="leads">Leads ({sampleCustomers.filter(c => c.type === 'lead').length})</Checkbox>
                    <Checkbox value="members">Gym Members (120)</Checkbox>
                  </Stack>
                </CheckboxGroup>
              </FormControl>

              {/* Email Content */}
              <FormControl>
                <FormLabel>Email Content</FormLabel>
                <Textarea
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                  placeholder="Enter your email content here..."
                  rows={6}
                />
              </FormControl>

              {/* Image Upload */}
              <FormControl>
                <FormLabel>Banner Image (Optional)</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewCampaign({...newCampaign, image: e.target.files[0]})}
                />
              </FormControl>

              {/* Schedule */}
              <Grid templateColumns="1fr 1fr" gap={4}>
                <FormControl>
                  <FormLabel>Schedule Date</FormLabel>
                  <Input
                    type="date"
                    value={newCampaign.scheduleDate}
                    onChange={(e) => setNewCampaign({...newCampaign, scheduleDate: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Schedule Time</FormLabel>
                  <Input
                    type="time"
                    value={newCampaign.scheduleTime}
                    onChange={(e) => setNewCampaign({...newCampaign, scheduleTime: e.target.value})}
                  />
                </FormControl>
              </Grid>

              {/* Action Buttons */}
              <HStack spacing={4} justify="flex-end">
                <Button variant="outline" onClick={handleSaveDraft}>
                  Save Draft
                </Button>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  _focus={{ boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.6)" }}
                  onClick={handleSchedule}
                >Schedule</Button>
                <Button
                  onClick={handleCreateCampaign}
                  bg="linear-gradient(81.62deg, brand.500 2.25%, brand.600 79.87%)"
                  backgroundImage="linear-gradient(81.62deg, var(--chakra-colors-brand-500) 2.25%, var(--chakra-colors-brand-600) 79.87%)"
                  color="white"
                  _hover={{ bg: "linear-gradient(81.62deg, brand.600 2.25%, #234E52 79.87%)" }}
                  _active={{ bg: "brand.600" }}
                  _focus={{ boxShadow: "0 0 0 2px rgba(49, 151, 149, 0.4)" }}
                  _disabled={{
                    opacity: 0.7,
                    cursor: "not-allowed",
                    bg: "linear-gradient(81.62deg, brand.500 2.25%, brand.600 79.87%)",
                    backgroundImage: "linear-gradient(81.62deg, var(--chakra-colors-brand-500) 2.25%, var(--chakra-colors-brand-600) 79.87%)",
                    color: "white"
                  }}
                >
                  Send Now
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Email Preview Modal */}
      {selectedCampaign && (
        <EmailPreview
          isOpen={isPreviewOpen}
          onClose={onPreviewClose}
          campaign={selectedCampaign}
          onSend={handlePreviewSend}
          onSchedule={handlePreviewSchedule}
          onEdit={handlePreviewEdit}
        />
      )}
    </Box>
  );
};

export default EmailMarketingTable;
