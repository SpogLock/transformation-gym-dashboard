/*!
=========================================================
* Spoglock Orbit - v1.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/spoglock-orbit
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/spoglock-orbit/blob/master/LICENSE.md)

* Design by Creative Tim & Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { useState } from "react";
import {
  Box,
  Flex,
  Grid,
  Text,
  useColorModeValue,
  Button,
  HStack,
  VStack,
  Switch,
  FormControl,
  FormLabel,
  Select,
  Badge,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Wrap,
  WrapItem,
  useToast,
} from "@chakra-ui/react";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { FaDownload, FaArrowUp, FaArrowDown, FaCalendar, FaChevronDown } from "react-icons/fa";
import RevenueChart from "./components/RevenueChart";
import CategoriesChart from "./components/CategoriesChart";
import BestSellingProducts from "./components/BestSellingProducts";
import BestSellingCategories from "./components/BestSellingCategories";

// Mock data for different time periods
const mockData = {
  today: {
    kpis: {
      gross_revenue: { value: 120000, change: 11, change_type: "increase" },
      avg_order_value: { value: 20000, change: 2, change_type: "increase" },
      conversion_rate: { value: 3, change: 4, change_type: "increase" },
      customers: { value: 80, change: -2, change_type: "decrease" }
    },
    charts: {
      revenue_trend: {
        labels: ['Sat 20', 'Sun 21', 'Mon 22', 'Tue 23', 'Wed 24', 'Thu 25', 'Fri 26'],
        data: [2000, 3000, 4000, 5000, 6000, 7000, 8500]
      },
      category_breakdown: [
        { name: "Others", value: 20 },
        { name: "Misc", value: 30 },
        { name: "Construction Materials", value: 40 },
        { name: "Electrical Accessories", value: 50 },
        { name: "Sanitary Materials", value: 60 },
        { name: "Tools & Hardware", value: 70 },
        { name: "PVC & Pipes", value: 80 }
      ]
    },
    best_selling_products: [
      { id: 1, name: "Electric Drill", revenue: 20000, sales: 195, image: "🔧" },
      { id: 2, name: "Electric Ranch", revenue: 20000, sales: 90, image: "🔧" },
      { id: 3, name: "Rubber Hammer", revenue: 20000, sales: 330, image: "🔨" },
      { id: 4, name: "Electric Multi Tool", revenue: 20000, sales: 56, image: "🔧" },
      { id: 5, name: "Steel Hammer", revenue: 20000, sales: 35, image: "🔨" }
    ]
  },
  week: {
    kpis: {
      gross_revenue: { value: 850000, change: 8, change_type: "increase" },
      avg_order_value: { value: 25000, change: 5, change_type: "increase" },
      conversion_rate: { value: 4, change: 2, change_type: "increase" },
      customers: { value: 340, change: 12, change_type: "increase" }
    },
    charts: {
      revenue_trend: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [180000, 220000, 200000, 250000]
      },
      category_breakdown: [
        { name: "Others", value: 25 },
        { name: "Misc", value: 35 },
        { name: "Construction Materials", value: 45 },
        { name: "Electrical Accessories", value: 55 },
        { name: "Sanitary Materials", value: 65 },
        { name: "Tools & Hardware", value: 75 },
        { name: "PVC & Pipes", value: 85 }
      ]
    },
    best_selling_products: [
      { id: 1, name: "Electric Drill", revenue: 50000, sales: 450, image: "🔧" },
      { id: 2, name: "Electric Ranch", revenue: 45000, sales: 200, image: "🔧" },
      { id: 3, name: "Rubber Hammer", revenue: 60000, sales: 800, image: "🔨" },
      { id: 4, name: "Electric Multi Tool", revenue: 40000, sales: 150, image: "🔧" },
      { id: 5, name: "Steel Hammer", revenue: 35000, sales: 100, image: "🔨" }
    ]
  },
  month: {
    kpis: {
      gross_revenue: { value: 3200000, change: 15, change_type: "increase" },
      avg_order_value: { value: 28000, change: 8, change_type: "increase" },
      conversion_rate: { value: 5, change: 3, change_type: "increase" },
      customers: { value: 1200, change: 18, change_type: "increase" }
    },
    charts: {
      revenue_trend: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [700000, 800000, 750000, 950000]
      },
      category_breakdown: [
        { name: "Others", value: 30 },
        { name: "Misc", value: 40 },
        { name: "Construction Materials", value: 50 },
        { name: "Electrical Accessories", value: 60 },
        { name: "Sanitary Materials", value: 70 },
        { name: "Tools & Hardware", value: 80 },
        { name: "PVC & Pipes", value: 90 }
      ]
    },
    best_selling_products: [
      { id: 1, name: "Electric Drill", revenue: 200000, sales: 1800, image: "🔧" },
      { id: 2, name: "Electric Ranch", revenue: 180000, sales: 800, image: "🔧" },
      { id: 3, name: "Rubber Hammer", revenue: 250000, sales: 3200, image: "🔨" },
      { id: 4, name: "Electric Multi Tool", revenue: 160000, sales: 600, image: "🔧" },
      { id: 5, name: "Steel Hammer", revenue: 140000, sales: 400, image: "🔨" }
    ]
  }
};

function SalesAnalytics() {
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.700");
  const cardShadow = useColorModeValue("0 4px 20px rgba(0,0,0,0.06)", "0 4px 20px rgba(0,0,0,0.3)");
  const toast = useToast();
  
  // State management
  const [timePeriod, setTimePeriod] = useState("today");
  const [compareMode, setCompareMode] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: "",
    endDate: ""
  });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  // Get current data based on time period
  const getCurrentData = () => {
    return mockData[timePeriod] || mockData.today;
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return `PKR. ${Number(amount || 0).toLocaleString()}`;
  };

  // Get KPI data
  const getKpiData = () => {
    const data = getCurrentData();
    const kpis = data.kpis;
    const periodLabel = getPeriodLabel();

    return [
      {
        title: "Gross revenue",
        value: formatCurrency(kpis.gross_revenue?.value || 0),
        change: `${kpis.gross_revenue?.change || 0}%`,
        changeType: kpis.gross_revenue?.change_type || "increase",
        period: `From ${periodLabel}`
      },
      {
        title: "Avg. order value",
        value: formatCurrency(kpis.avg_order_value?.value || 0),
        change: `${kpis.avg_order_value?.change || 0}%`,
        changeType: kpis.avg_order_value?.change_type || "increase",
        period: `From ${periodLabel}`
      },
      {
        title: "Conversion rate",
        value: `${kpis.conversion_rate?.value || 0}%`,
        change: `${kpis.conversion_rate?.change || 0}%`,
        changeType: kpis.conversion_rate?.change_type || "increase",
        period: `From ${periodLabel}`
      },
      {
        title: "Customers",
        value: `${kpis.customers?.value || 0}`,
        change: `${kpis.customers?.change || 0}`,
        changeType: kpis.customers?.change_type || "increase",
        period: `From ${periodLabel}`
      }
    ];
  };

  // Get period label for comparison text
  const getPeriodLabel = () => {
    switch(timePeriod) {
      case "today": return "yesterday";
      case "week": return "last week";
      case "month": return "last month";
      case "year": return "last year";
      case "business_season": return "last business season";
      case "Custom date": return "previous period";
      default: return "previous period";
    }
  };

  const kpiData = getKpiData();
  const currentData = getCurrentData();

  const timePeriods = ["today", "week", "month", "business_season", "year", "Custom date"];

  // Map display names to API values
  const getDisplayTimePeriod = (period) => {
    const displayMap = {
      "today": "Today",
      "week": "Week", 
      "month": "Month",
      "business_season": "Business Season",
      "year": "Year",
      "Custom date": "Custom date"
    };
    return displayMap[period] || period;
  };

  // Handle custom date selection
  const handleCustomDateSelect = () => {
    if (customDateRange.startDate && customDateRange.endDate) {
      setTimePeriod("Custom date");
      setShowCustomDatePicker(false);
    }
  };

  // Handle time period change
  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
    if (period === "Custom date") {
      setShowCustomDatePicker(true);
    } else {
      setShowCustomDatePicker(false);
    }
  };

  // Export analytics data (static)
  const exportAnalytics = () => {
    try {
      const dataStr = JSON.stringify(currentData, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics_${timePeriod}_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Analytics data exported successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast({
        title: "Error",
        description: "Failed to export analytics data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
      {/* Header Section */}
      <Box mb='24px'>
        <Flex direction='column' w='100%'>
          <Text fontSize='2xl' color={textColor} fontWeight='bold' mb='8px'>
            Welcome, Admin
          </Text>
          <Text fontSize='md' color='gray.400' mb='24px'>
            Have a look at your recent status
          </Text>
          
          {/* Date Filters and Controls */}
          <Flex
            direction='column'
            w='100%'
            gap='16px'>
            
            {/* Desktop: Time Period Buttons */}
            <Wrap spacing='8px' display={{ base: "none", md: "flex" }}>
              {timePeriods.map((period) => (
                <WrapItem key={period}>
                  <Button
                    size='md'
                    variant={timePeriod === period ? 'solid' : 'outline'}
                    colorScheme='teal'
                    bg={timePeriod === period ? 'brand.500' : 'transparent'}
                    color={timePeriod === period ? 'white' : 'brand.500'}
                    borderColor='brand.500'
                    fontWeight='semibold'
                    px='20px'
                    _hover={{
                      bg: timePeriod === period ? '#2C7A7B' : 'rgba(49, 151, 149, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: 'md'
                    }}
                    transition='all 0.2s'
                    onClick={() => handleTimePeriodChange(period)}>
                    {getDisplayTimePeriod(period)}
                  </Button>
                </WrapItem>
              ))}
            </Wrap>

            {/* Mobile/Tablet: Dropdown Select */}
            <Box display={{ base: "block", md: "none" }}>
              <Select
                value={timePeriod}
                onChange={(e) => handleTimePeriodChange(e.target.value)}
                size="md"
                bg={cardBg}
                borderColor='brand.500'
                color='brand.500'
                fontWeight='semibold'
                icon={<FaChevronDown />}
                _hover={{ borderColor: '#2C7A7B' }}
              >
                {timePeriods.map((period) => (
                  <option key={period} value={period}>
                    {getDisplayTimePeriod(period)}
                  </option>
                ))}
              </Select>
            </Box>

            {/* Custom Date Picker Modal */}
            <Modal isOpen={showCustomDatePicker} onClose={() => setShowCustomDatePicker(false)}>
              <ModalOverlay backdropFilter="blur(8px)" bg="rgba(0,0,0,0.35)" />
              <ModalContent borderRadius="20px" border="1.5px solid" borderColor={useColorModeValue("white", "whiteAlpha.300")}>
                <ModalHeader color={textColor}>Select Custom Date Range</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing="16px" align="stretch">
                    <FormControl>
                      <FormLabel fontSize="sm" color="gray.500">
                        Start Date
                      </FormLabel>
                      <Input
                        type="date"
                        value={customDateRange.startDate}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCustomDateRange(prev => ({
                            ...prev,
                            startDate: value
                          }));
                        }}
                        size="md"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" color="gray.500">
                        End Date
                      </FormLabel>
                      <Input
                        type="date"
                        value={customDateRange.endDate}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCustomDateRange(prev => ({
                            ...prev,
                            endDate: value
                          }));
                        }}
                        size="md"
                        min={customDateRange.startDate}
                      />
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <HStack spacing="12px">
                    <Button
                      variant="outline"
                      onClick={() => setShowCustomDatePicker(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      bg="linear-gradient(81.62deg, brand.500 2.25%, brand.600 79.87%)"
                      color="white"
                      _hover={{ bg: "linear-gradient(81.62deg, brand.600 2.25%, #234E52 79.87%)" }}
                      _active={{ bg: "brand.600" }}
                      _focus={{ boxShadow: "0 0 0 2px rgba(49, 151, 149, 0.4)" }}
                      onClick={handleCustomDateSelect}
                      isDisabled={!customDateRange.startDate || !customDateRange.endDate}
                    >
                      Apply
                    </Button>
                  </HStack>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Comparison Toggle and Export */}
            <Flex
              direction={{ base: "column", sm: "row" }}
              justify='space-between'
              align={{ base: "start", sm: "center" }}
              gap='16px'
              mt='8px'>
              
              <HStack spacing='12px'>
                <Switch
                  id='compare-mode'
                  colorScheme='teal'
                  size='lg'
                  isChecked={compareMode}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setCompareMode(checked);
                  }}
                />
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color={textColor}
                  fontWeight='medium'
                  cursor='pointer'
                  onClick={() => setCompareMode(!compareMode)}
                >
                  Do not compare
                </Text>
              </HStack>
              
              <Button
                leftIcon={<FaDownload />}
                colorScheme='teal'
                variant='outline'
                borderColor='brand.500'
                color='brand.500'
                size='sm'
                fontWeight='semibold'
                px='24px'
                _hover={{
                  bg: 'brand.500',
                  color: 'white',
                  borderColor: 'brand.500'
                }}
                transition='all 0.2s'
                onClick={exportAnalytics}>
                Export
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      {/* Active Filter Indicator */}
      <Box mb='16px'>
        <Flex align='center' gap='12px'>
          <Text fontSize='sm' color='gray.500' fontWeight='medium'>
            Showing data for:
          </Text>
          <Badge
            colorScheme='teal'
            bg='brand.500'
            color='white'
            px='12px'
            py='4px'
            borderRadius='full'
            fontSize='sm'
            fontWeight='bold'>
            {getDisplayTimePeriod(timePeriod)}
          </Badge>
        </Flex>
      </Box>

      {/* KPI Summary Cards */}
      <Grid
        templateColumns={{
          sm: "1fr",
          md: "1fr 1fr",
          xl: "1fr 1fr 1fr 1fr",
        }}
        gap='24px'
        mb='24px'>
        {kpiData.map((kpi, index) => (
          <Card key={index} bg={cardBg} boxShadow={cardShadow}>
            <CardBody p='20px'>
              <VStack align='start' spacing='12px'>
                <Text fontSize='sm' color='gray.500' fontWeight='medium'>
                  {kpi.title}
                </Text>
                <Text fontSize='2xl' color={textColor} fontWeight='bold'>
                  {kpi.value}
                </Text>
                <HStack spacing='8px'>
                  <Flex
                    align='center'
                    color={kpi.changeType === 'increase' ? 'green.500' : 'red.500'}
                    fontSize='sm'>
                    {kpi.changeType === 'increase' ? (
                      <FaArrowUp size='12px' />
                    ) : (
                      <FaArrowDown size='12px' />
                    )}
                    <Text ml='4px' fontWeight='semibold'>
                      {kpi.change}
                    </Text>
                  </Flex>
                  <Text fontSize='sm' color='gray.500'>
                    {kpi.period}
                  </Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid
        templateColumns={{
          sm: "1fr",
          lg: "2fr 1fr",
        }}
        gap='24px'
        mb='24px'>
        <RevenueChart 
          timePeriod={timePeriod} 
          customDateRange={customDateRange}
          chartData={currentData?.charts?.revenue_trend}
        />
        <CategoriesChart 
          categoryData={currentData?.charts?.category_breakdown}
        />
      </Grid>

      {/* Data Tables Section */}
      <Grid
        templateColumns={{
          sm: "1fr",
          lg: "1fr 1fr",
        }}
        gap='24px'>
        <BestSellingProducts 
          timePeriod={timePeriod} 
          customDateRange={customDateRange}
          productsData={currentData?.best_selling_products}
        />
        <BestSellingCategories 
          timePeriod={timePeriod} 
          customDateRange={customDateRange}
          categoryData={currentData?.charts?.category_breakdown}
        />
      </Grid>
    </Flex>
  );
}

export default SalesAnalytics;