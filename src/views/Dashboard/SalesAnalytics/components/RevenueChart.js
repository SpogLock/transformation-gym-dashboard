// Chakra imports
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React from "react";
import ReactApexChart from "react-apexcharts";

const RevenueChart = ({ timePeriod, customDateRange, chartData }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const gridColor = useColorModeValue("#E2E8F0", "#4A5568");

  // Process chart data from static mock data
  const getProcessedChartData = () => {
    if (chartData && chartData.labels && chartData.data) {
      // Static data structure with labels and data arrays
      return chartData.labels.map((label, index) => ({
        label: label,
        revenue: chartData.data[index] || 0
      }));
    }

    // Fallback data if no chart data
    return [
      { label: "No Data", revenue: 0 }
    ];
  };

  // Generate time labels based on period and index
  const getTimeLabel = (index, period) => {
    switch (period) {
      case "today":
        const hour = index.toString().padStart(2, '0');
        return `${hour}:00`;
      case "week":
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        return days[index] || `Day ${index + 1}`;
      case "month":
        return `Week ${index + 1}`;
      case "year":
      case "business_season":
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[index] || `Month ${index + 1}`;
      default:
        return `Period ${index + 1}`;
    }
  };

  const processedData = getProcessedChartData();

  const series = [
    {
      name: "Revenue",
      data: processedData.map(item => item.revenue)
    }
  ];

  const options = {
    chart: {
      type: "area",
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        top: 13,
        left: 0,
        blur: 10,
        opacity: 0.1,
        color: "#FFD75E"
      }
    },
    colors: ["#FFD75E"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.1,
        gradientToColors: ["#E0B93B"],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    xaxis: {
      categories: processedData.map(item => item.label),
      labels: {
        style: {
          colors: textColor,
          fontSize: "12px",
          fontWeight: "500"
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: textColor,
          fontSize: "12px",
          fontWeight: "500"
        },
        formatter: function (value) {
          return `${(value / 1000).toFixed(0)}K`;
        }
      }
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    },
    tooltip: {
      theme: useColorModeValue("light", "dark"),
      y: {
        formatter: function (value) {
          return `PKR. ${value.toLocaleString()}`;
        }
      }
    },
    legend: {
      show: false
    }
  };

  // Show empty state if no data
  if (!processedData || processedData.length === 0) {
    return (
      <Card bg={useColorModeValue("white", "gray.700")} boxShadow={useColorModeValue("0 4px 20px rgba(0,0,0,0.06)", "0 4px 20px rgba(0,0,0,0.3)")}>
        <CardHeader>
          <Text fontSize='lg' color={textColor} fontWeight='bold'>
            Revenue trend {timePeriod === "Custom date" && customDateRange?.startDate && customDateRange?.endDate 
              ? `${customDateRange.startDate} to ${customDateRange.endDate}`
              : timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}
          </Text>
        </CardHeader>
        <CardBody>
          <Flex h='400px' w='100%' align='center' justify='center' direction='column'>
            <Text fontSize='md' color='gray.400' textAlign='center'>
              No revenue data available for this period
            </Text>
          </Flex>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card bg={useColorModeValue("white", "gray.700")} boxShadow={useColorModeValue("0 4px 20px rgba(0,0,0,0.06)", "0 4px 20px rgba(0,0,0,0.3)")}>
      <CardHeader>
        <Text fontSize='lg' color={textColor} fontWeight='bold'>
          Revenue trend {timePeriod === "Custom date" && customDateRange?.startDate && customDateRange?.endDate 
            ? `${customDateRange.startDate} to ${customDateRange.endDate}`
            : timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}
        </Text>
      </CardHeader>
      <CardBody>
        <Box h='400px' w='100%'>
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height="100%"
          />
        </Box>
      </CardBody>
    </Card>
  );
};

export default RevenueChart;
