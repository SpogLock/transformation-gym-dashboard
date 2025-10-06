// Chakra imports
import { BsArrowRight } from "react-icons/bs";
import { Button } from "@chakra-ui/react";

import {
  Flex,
  Icon,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack,
  Box,
  HStack,
  Grid,
  Badge,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import DashboardTableRow from "components/Tables/DashboardTableRow";
import React from "react";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";

const Projects = ({ title, amount, captions, data }) => {
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Card p='16px' overflowX={{ sm: "scroll", xl: "hidden" }}>
      <CardHeader p='12px 0px 28px 0px'>
        <Flex direction='column'>
          <Text fontSize='lg' color={textColor} fontWeight='bold' pb='.5rem'>
            {title}
          </Text>
          <Flex align='center'>
            <Icon
              as={IoCheckmarkDoneCircleSharp}
              color='brand.300'
              w={4}
              h={4}
              pe='3px'
            />
            <Text fontSize='sm' color='gray.400' fontWeight='normal'>
              <Text fontWeight='bold' as='span'>
                {amount} Products
              </Text>{" "}
              Stocked this month.
            </Text>
          </Flex>
        </Flex>
      </CardHeader>
      {/* Desktop Table View */}
      <Table variant='simple' color={textColor} display={{ base: "none", md: "table" }}>
        <Thead>
          <Tr my='.8rem' ps='0px'>
            {captions.map((caption, idx) => {
              return (
                <Th color='gray.400' key={idx} ps={idx === 0 ? "0px" : null}>
                  {caption}
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row) => {
            return (
              <DashboardTableRow
                key={row.name}
                name={row.name}
                logo={row.logo}
                members={row.members}
                budget={row.budget}
                progression={row.progression}
              />
            );
          })}
        </Tbody>
      </Table>

      {/* Mobile List View */}
      <VStack spacing={3} align="stretch" display={{ base: "flex", md: "none" }}>
        {data.map((row, index) => (
          <Box key={row.name} p={3} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md" border="1px solid" borderColor={useColorModeValue("gray.200", "gray.600")}>
            <Grid templateColumns="auto 1fr auto" gap={3} alignItems="center">
              <Box color="brand.500" flexShrink={0}>
                <Text fontSize="lg" fontWeight="bold">
                  {index + 1}
                </Text>
              </Box>
              
              <VStack align="start" spacing={1}>
                <HStack spacing={2} align="center">
                  <Box w="20px" h="20px" borderRadius="md" bg={useColorModeValue("gray.200", "gray.600")} display="flex" alignItems="center" justifyContent="center">
                    <Text fontSize="xs">📦</Text>
                  </Box>
                  <Text fontSize="sm" color={textColor} fontWeight="bold">
                    {row.name}
                  </Text>
                </HStack>
                <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")} fontWeight="medium">
                  Stock: {row.members}
                </Text>
              </VStack>
              
              <VStack align="end" spacing={1}>
                <Text fontSize="sm" color={textColor} fontWeight="bold">
                  {row.budget}
                </Text>
                <Badge colorScheme='teal' fontSize="10px" px={2} py={1} borderRadius="full">
                  {row.progression}%
                </Badge>
              </VStack>
            </Grid>
          </Box>
        ))}
      </VStack>
      <Flex align='center'>
              <Button
                p='0px'
                variant='no-hover'
                bg='transparent'
                my={{ sm: "1.5rem", lg: "0px" }}>
                <Text
                  fontSize='sm'
                  color={textColor}
                  fontWeight='bold'
                  cursor='pointer'
                  transition='all .5s ease'
                  my={{ sm: "1.5rem", lg: "0px" }}
                  _hover={{ me: "4px" }}>
                  Manage Stock
                </Text>
                <Icon
                  as={BsArrowRight}
                  w='20px'
                  h='20px'
                  fontSize='2xl'
                  transition='all .5s ease'
                  ms='8px'
                  cursor='pointer'
                  pt='2px'
                  _hover={{ transform: "translateX(20%)" }}
                />
              </Button>
            </Flex>
    </Card>
  );
};

export default Projects;
