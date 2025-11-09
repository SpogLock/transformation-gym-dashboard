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

import React, { useEffect, useState } from "react";
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
  Wrap,
  WrapItem,
  useToast,
} from "@chakra-ui/react";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { FaDownload, FaArrowUp, FaArrowDown, FaChevronDown } from "react-icons/fa";
import RevenueChart from "./components/RevenueChart";
import CategoriesChart from "./components/CategoriesChart";
import BestSellingProducts from "./components/BestSellingProducts";
import BestSellingCategories from "./components/BestSellingCategories";
import AppLoader from "components/Loaders/AppLoader";
import { getAnalyticsDashboard } from "services/analyticsService";

// View-specific configuration for UI rendering
const analyticsViewConfig = {
  inventory: {
    label: "Inventory Sales",
    description: "Monitor point-of-sale performance and stock-driven revenue.",
    kpiFields: [
      { key: "gross_revenue", title: "Gross revenue", format: "currency", changeFormat: "percentage" },
      { key: "avg_order_value", title: "Avg. order value", format: "currency", changeFormat: "percentage" },
      { key: "conversion_rate", title: "Conversion rate", format: "percentage", changeFormat: "percentage" },
      { key: "customers", title: "Customers", format: "number", changeFormat: "number" }
    ],
    revenueTitle: "Inventory revenue trend",
    revenueSeriesLabel: "Revenue",
    categoriesChartTitle: "Category performance radar",
    categoriesTableTitle: "Top product categories",
    categoriesSeriesLabel: "Category share",
    productsTitle: "Best selling products",
    productsSearchPlaceholder: "Search products or categories...",
    productsMetricLabel: "sales",
    productsMetricColumnTitle: "Sales",
    categoriesMetricLabel: "sales",
    categoriesMetricColumnTitle: "Sales",
    categoriesSearchPlaceholder: "Search categories..."
  },
  subscriptions: {
    label: "Customer Subscriptions",
    description: "Track recurring membership revenue and retention health.",
    kpiFields: [
      { key: "monthly_recurring_revenue", title: "Monthly recurring revenue", format: "currency", changeFormat: "percentage" },
      { key: "active_subscriptions", title: "Active subscriptions", format: "number", changeFormat: "number" },
      { key: "churn_rate", title: "Churn rate", format: "percentage", changeFormat: "percentage", periodPrefix: "vs" },
      { key: "new_signups", title: "New sign-ups", format: "number", changeFormat: "number" }
    ],
    revenueTitle: "Subscription revenue trend",
    revenueSeriesLabel: "Recurring revenue",
    categoriesChartTitle: "Plan distribution",
    categoriesTableTitle: "Key member segments",
    categoriesSeriesLabel: "Plan share",
    productsTitle: "Top subscription plans",
    productsSearchPlaceholder: "Search plans or tiers...",
    productsMetricLabel: "active subs",
    productsMetricColumnTitle: "Active subs",
    categoriesMetricLabel: "members",
    categoriesMetricColumnTitle: "Members",
    categoriesSearchPlaceholder: "Search segments..."
  }
};

function SalesAnalytics() {
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.700");
  const cardShadow = useColorModeValue("0 4px 20px rgba(0,0,0,0.06)", "0 4px 20px rgba(0,0,0,0.3)");
  const toast = useToast();
  
  // State management
  const [analyticsView, setAnalyticsView] = useState("inventory");
  const [timePeriod, setTimePeriod] = useState("today");
  const [compareMode, setCompareMode] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: "",
    endDate: ""
  });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const currentViewMeta = analyticsViewConfig[analyticsView] || analyticsViewConfig.inventory;
  const viewKeys = Object.keys(analyticsViewConfig);
  const rangeParam = timePeriod === "Custom date" ? "custom" : timePeriod;
  const customRangeKey =
    rangeParam === "custom"
      ? `${customDateRange.startDate || ""}|${customDateRange.endDate || ""}`
      : "";

  // Format helpers
  const formatCurrency = (amount) => {
    return `PKR. ${Number(amount || 0).toLocaleString()}`;
  };

  const parseNumeric = (value) => {
    if (value === undefined || value === null) {
      return 0;
    }
    if (typeof value === "number") {
      return Number.isNaN(value) ? 0 : value;
    }
    const parsed = parseFloat(value.toString().replace(/,/g, ""));
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const countFormatter = (value) => parseNumeric(value).toLocaleString();

  const formatValueByType = (value, type) => {
    const numeric = parseNumeric(value);
    switch (type) {
      case "currency":
        return formatCurrency(numeric);
      case "percentage":
        return `${numeric % 1 === 0 ? numeric : numeric.toFixed(1)}%`;
      case "number":
      default:
        return numeric.toLocaleString();
    }
  };

  const formatChangeValue = (value, type) => {
    if (value === undefined || value === null) {
      return type === "percentage" ? "0%" : "0";
    }
    return formatValueByType(value, type);
  };

  // Get KPI data
  const getKpiData = () => {
    const data = analyticsData || {};
    const kpis = data.kpis || {};
    const periodLabel = getPeriodLabel();
    const kpiFields = currentViewMeta?.kpiFields || [];

    return kpiFields.map((field) => {
      const metric = kpis[field.key] || {};
      const changeFormat = field.changeFormat || "percentage";
      const changeType =
        metric.change_type ||
        (Number(metric.change ?? 0) >= 0 ? "increase" : "decrease");

      return {
        title: field.title,
        value: formatValueByType(metric.value, field.format),
        change: formatChangeValue(metric.change, changeFormat),
        changeType,
        period: `${field.periodPrefix || "From"} ${periodLabel}`
      };
    });
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
  const currentData = analyticsData || { kpis: {}, charts: {}, tables: {} };

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
    setErrorMessage("");
    setTimePeriod(period);
    if (period === "Custom date") {
      setShowCustomDatePicker(true);
    } else {
      setShowCustomDatePicker(false);
    }
  };

  // Fetch analytics data from backend
  useEffect(() => {
    const needsDates =
      rangeParam === "custom" &&
      (!customDateRange.startDate || !customDateRange.endDate);

    if (needsDates) {
      return;
    }

    let cancelled = false;

    const fetchAnalytics = async () => {
      setLoading(true);
      setErrorMessage("");
      setAnalyticsData(null);

      try {
        const data = await getAnalyticsDashboard({
          view: analyticsView,
          range: rangeParam,
          start: rangeParam === "custom" ? customDateRange.startDate : undefined,
          end: rangeParam === "custom" ? customDateRange.endDate : undefined,
        });

        if (!cancelled) {
          setAnalyticsData(data);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error?.message || "Failed to load analytics dashboard data";
          setErrorMessage(message);
          toast({
            title: "Analytics load failed",
            description: message,
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "top-right",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      cancelled = true;
    };
  }, [analyticsView, rangeParam, customRangeKey, toast, reloadKey]);

  const handleRetry = () => {
    setReloadKey((prev) => prev + 1);
  };

  // Export analytics data (static)
  const exportAnalytics = () => {
    if (!analyticsData) {
      toast({
        title: "No data to export",
        description: "Please load analytics data before exporting.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const dataStr = JSON.stringify(currentData, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      const filePrefix = `${analyticsView}_${timePeriod}`.replace(/\s+/g, "_").toLowerCase();
      link.download = `analytics_${filePrefix}_${new Date().toISOString().split('T')[0]}.json`;
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

  if (loading && !analyticsData) {
    return (
      <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
        <AppLoader
          message={`Loading ${currentViewMeta?.label || ""} analytics...`}
          fullHeight
        />
      </Flex>
    );
  }

  if (errorMessage && !analyticsData) {
    return (
      <Flex
        direction='column'
        pt={{ base: "120px", md: "75px" }}
        align='center'
        justify='center'
        minH='400px'
        gap={4}
      >
        <Text color='red.500' fontWeight='semibold' textAlign='center'>
          Unable to load analytics data. Please try again.
        </Text>
        <Button colorScheme='teal' onClick={handleRetry}>
          Retry
        </Button>
      </Flex>
    );
  }

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
            
            {/* Analytics view toggle */}
            <Wrap spacing='8px'>
              {viewKeys.map((viewKey) => {
                const viewMeta = analyticsViewConfig[viewKey];
                const isActive = analyticsView === viewKey;
                return (
                  <WrapItem key={viewKey}>
                    <Button
                      size='md'
                      variant={isActive ? 'solid' : 'outline'}
                      colorScheme='teal'
                      bg={isActive ? 'brand.500' : 'transparent'}
                      color={isActive ? 'white' : 'brand.500'}
                      borderColor='brand.500'
                      fontWeight='semibold'
                      px='20px'
                      _hover={{
                        bg: isActive ? '#2C7A7B' : 'rgba(49, 151, 149, 0.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: 'md'
                      }}
                      transition='all 0.2s'
                      onClick={() => setAnalyticsView(viewKey)}
                    >
                      {viewMeta?.label || viewKey}
                    </Button>
                  </WrapItem>
                );
              })}
            </Wrap>
            <Text fontSize='sm' color='gray.500'>
              {currentViewMeta?.description}
            </Text>
            
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
                isDisabled={loading || !analyticsData}
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
            colorScheme='yellow'
            bg='yellow.500'
            color='white'
            px='12px'
            py='4px'
            borderRadius='full'
            fontSize='sm'
            fontWeight='bold'>
            {currentViewMeta?.label}
          </Badge>
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
          titlePrefix={currentViewMeta?.revenueTitle}
          seriesLabel={currentViewMeta?.revenueSeriesLabel}
        />
        <CategoriesChart 
          categoryData={currentData?.charts?.category_breakdown}
          title={currentViewMeta?.categoriesChartTitle}
          seriesLabel={currentViewMeta?.categoriesSeriesLabel}
          tooltipFormatter={(value) => `${value}% share`}
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
          productsData={currentData?.tables?.products || currentData?.best_selling_products}
          title={currentViewMeta?.productsTitle}
          searchPlaceholder={currentViewMeta?.productsSearchPlaceholder}
          metricLabel={currentViewMeta?.productsMetricLabel}
          metricColumnTitle={currentViewMeta?.productsMetricColumnTitle}
          metricFormatter={countFormatter}
        />
        <BestSellingCategories 
          timePeriod={timePeriod} 
          customDateRange={customDateRange}
          categoryData={currentData?.tables?.segments || currentData?.best_selling_categories}
          title={currentViewMeta?.categoriesTableTitle}
          searchPlaceholder={currentViewMeta?.categoriesSearchPlaceholder}
          metricLabel={currentViewMeta?.categoriesMetricLabel}
          metricColumnTitle={currentViewMeta?.categoriesMetricColumnTitle}
          metricFormatter={countFormatter}
        />
      </Grid>
    </Flex>
  );
}

export default SalesAnalytics;