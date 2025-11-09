// Chakra imports
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React from "react";
import ReactApexChart from "react-apexcharts";

const CategoriesChart = ({
  categoryData,
  title = "Best selling categories",
  seriesLabel = "Sales Performance",
  tooltipFormatter = (value) => `${value}% Performance`
}) => {
  const textColor = useColorModeValue("gray.700", "white");
  const gridColor = useColorModeValue("#E2E8F0", "#4A5568");

  // Process category data from static mock data
  const getProcessedCategoryData = () => {
    if (categoryData && Array.isArray(categoryData) && categoryData.length > 0) {
      // Static data structure with name and value
      return categoryData.map(item => ({
        category: item.name || "Unknown",
        sales: item.value || 0
      }));
    }

    // Fallback data if no category data
    return [
      { category: "No Data", sales: 0 }
    ];
  };

  const processedCategories = getProcessedCategoryData();

  const series = [
    {
      name: seriesLabel,
      data: processedCategories.map(item => item.sales)
    }
  ];

  const options = {
    chart: {
      type: "radar",
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        blur: 1,
        left: 1,
        top: 1,
        opacity: 0.2
      }
    },
    colors: ["#FFD75E"],
    fill: {
      opacity: 0.6
    },
    stroke: {
      width: 2,
      colors: ["#FFD75E"]
    },
    markers: {
      show: false
    },
    xaxis: {
      categories: processedCategories.map(item => item.category),
      labels: {
        style: {
          colors: textColor,
          fontSize: "12px",
          fontWeight: "500"
        }
      }
    },
    yaxis: {
      labels: {
        show: false
      },
      min: 0,
      max: 100
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: gridColor,
          strokeWidth: 1,
          fill: {
            colors: ["transparent"]
          }
        }
      }
    },
    tooltip: {
      theme: useColorModeValue("light", "dark"),
      y: {
        formatter: function (value) {
          return tooltipFormatter(value);
        }
      }
    },
    legend: {
      show: false
    }
  };

  // Show empty state if no data
  if (!processedCategories || processedCategories.length === 0) {
    return (
      <Card bg={useColorModeValue("white", "gray.700")} boxShadow={useColorModeValue("0 4px 20px rgba(0,0,0,0.06)", "0 4px 20px rgba(0,0,0,0.3)")}>
        <CardHeader>
          <Text fontSize='lg' color={textColor} fontWeight='bold'>
            {title}
          </Text>
        </CardHeader>
        <CardBody>
          <Flex h='450px' w='100%' align='center' justify='center' direction='column'>
            <Text fontSize='md' color='gray.400' textAlign='center'>
              No category data available
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
          {title}
        </Text>
      </CardHeader>
      <CardBody>
        <Box h='450px' w='100%'>
          <ReactApexChart
            options={options}
            series={series}
            type="radar"
            height="100%"
          />
        </Box>
      </CardBody>
    </Card>
  );
};

export default CategoriesChart;
