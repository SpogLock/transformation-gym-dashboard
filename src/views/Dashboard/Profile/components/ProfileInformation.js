// Chakra imports
import { 
  Flex, 
  Icon, 
  Link, 
  Text, 
  useColorModeValue, 
  Badge, 
  VStack, 
  HStack, 
  Divider, 
  Grid,
  Box,
  Avatar,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import IconBox from "components/Icons/IconBox";
import { 
  PersonIcon,
  StatsIcon,
  CreditIcon
} from "components/Icons/Icons";
import React from "react";
import { 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEnvelope,
  FaWeight,
  FaBirthdayCake,
  FaShieldAlt
} from "react-icons/fa";

const ProfileInformation = ({
  title,
  description,
  name,
  mobile,
  email,
  location,
  memberType,
  membershipStatus,
  customerPlan,
  trainerRequired,
  emergencyContact,
  bloodGroup,
  medicalConditions,
  fitnessGoals,
  trainerName,
  customerWeight,
  customerAge,
}) => {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgCard = useColorModeValue("white", "gray.800");

  return (
    <Box p={6}>
      {/* Key Stats Row */}
      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={3} mb={6}>
        <Box bg={bgCard} p={3} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Box color="brand.500">
              <Icon as={FaWeight} boxSize={4} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Weight
              </Text>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {customerWeight}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <Box bg={bgCard} p={3} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Box color="brand.500">
              <Icon as={FaBirthdayCake} boxSize={4} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Age
              </Text>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {customerAge} years
              </Text>
            </VStack>
          </HStack>
        </Box>

        <Box bg={bgCard} p={3} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Box color="brand.500">
              <Icon as={FaShieldAlt} boxSize={4} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Status
              </Text>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {membershipStatus}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <Box bg={bgCard} p={3} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Box color="brand.500">
              <CreditIcon />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Plan
              </Text>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                {customerPlan}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </Grid>

      {/* Main Content */}
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={4}>
        {/* Contact Information */}
        <Box bg={bgCard} p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <VStack spacing={3} align="stretch">
            <HStack spacing={3} align="center" mb={1}>
              <Box color="brand.500">
                <Icon as={FaPhone} boxSize={4} />
              </Box>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                Contact Information
              </Text>
            </HStack>
            
            <VStack spacing={3} align="stretch">
              <HStack spacing={3} align="center">
                <Box color="brand.500">
                  <Icon as={FaPhone} boxSize={3} />
                </Box>
                <VStack align="start" spacing={0} flex={1}>
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">
                    Mobile
                  </Text>
                  <Text fontSize="sm" color={textColor} fontWeight="semibold">
                    {mobile}
                  </Text>
                </VStack>
              </HStack>
              
              <HStack spacing={3} align="center">
                <Box color="brand.500">
                  <Icon as={FaEnvelope} boxSize={3} />
                </Box>
                <VStack align="start" spacing={0} flex={1}>
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">
                    Email
                  </Text>
                  <Text fontSize="sm" color={textColor} fontWeight="semibold">
                    {email}
                  </Text>
                </VStack>
              </HStack>
              
              <HStack spacing={3} align="center">
                <Box color="brand.500">
                  <Icon as={FaMapMarkerAlt} boxSize={3} />
                </Box>
                <VStack align="start" spacing={0} flex={1}>
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">
                    Address
                  </Text>
                  <Text fontSize="sm" color={textColor} fontWeight="semibold">
                    {location}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </VStack>
        </Box>

        {/* Membership Details */}
        <Box bg={bgCard} p={4} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <VStack spacing={3} align="stretch">
            <HStack spacing={3} align="center" mb={1}>
              <Box color="brand.500">
                <PersonIcon />
              </Box>
              <Text fontSize="md" color={textColor} fontWeight="bold">
                Membership Details
              </Text>
            </HStack>
            
            <VStack spacing={3} align="stretch">
              <HStack justify="space-between" align="center">
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  Member Type
                </Text>
                <Badge
                  colorScheme={memberType === "New" ? "blue" : "purple"}
                  variant="subtle"
                  px={2}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="semibold"
                >
                  {memberType}
                </Badge>
              </HStack>
              
              <HStack justify="space-between" align="center">
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  Trainer
                </Text>
                <Text fontSize="xs" color={textColor} fontWeight="semibold">
                  {trainerRequired === "Yes" ? `Yes (${trainerName})` : "No"}
                </Text>
              </HStack>
              
              <HStack justify="space-between" align="center">
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  Emergency Contact
                </Text>
                <Text fontSize="xs" color={textColor} fontWeight="semibold">
                  {emergencyContact}
                </Text>
              </HStack>
              
              <HStack justify="space-between" align="center">
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  Fitness Goals
                </Text>
                <Text fontSize="xs" color={textColor} fontWeight="semibold">
                  {fitnessGoals}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </Box>
      </Grid>
    </Box>
  );
};

export default ProfileInformation;
