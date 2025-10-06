// Chakra imports
import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  HStack,
  Icon,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Header = ({
  backgroundHeader,
  backgroundProfile,
  avatarImage,
  name,
  email,
  tabs,
  activeTab,
  onTabChange,
}) => {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const borderProfileColor = useColorModeValue(
    "white",
    "rgba(255, 255, 255, 0.31)"
  );
  const emailColor = useColorModeValue("gray.400", "gray.300");
  return (
    <Box
      mb={{ sm: "205px", md: "75px", xl: "70px" }}
      borderRadius='15px'
      px='0px'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      align='center'>
      <Box
        bgImage={backgroundHeader}
        w='100%'
        h='300px'
        borderRadius='25px'
        bgPosition='50%'
        bgRepeat='no-repeat'
        position='relative'
        display='flex'
        justifyContent='center'>
        <Flex
          direction={{ sm: "column", md: "row" }}
          mx='1.5rem'
          maxH='330px'
          w={{ sm: "90%", xl: "95%" }}
          justifyContent={{ sm: "center", md: "space-between" }}
          align='center'
          backdropFilter='saturate(200%) blur(50px)'
          position='absolute'
          boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.02)'
          border='2px solid'
          borderColor={borderProfileColor}
          bg={backgroundProfile}
          p='24px'
          borderRadius='20px'
          transform={{
            sm: "translateY(45%)",
            md: "translateY(110%)",
            lg: "translateY(160%)",
          }}>
          <Flex
            align='center'
            mb={{ sm: "10px", md: "0px" }}
            direction={{ sm: "column", md: "row" }}
            w={{ sm: "100%" }}
            textAlign={{ sm: "center", md: "start" }}>
            <Avatar
              me={{ md: "22px" }}
              src={avatarImage}
              w='80px'
              h='80px'
              borderRadius='15px'
            />
            <Flex direction='column' maxWidth='100%' my={{ sm: "14px" }}>
              <Text
                fontSize={{ sm: "lg", lg: "xl" }}
                color={textColor}
                fontWeight='bold'
                ms={{ sm: "8px", md: "0px" }}>
                {name}
              </Text>
              <Text
                fontSize={{ sm: "sm", md: "md" }}
                color={emailColor}
                fontWeight='semibold'>
                {email}
              </Text>
              
              {/* Mobile Action Buttons - Only visible on mobile */}
              <HStack spacing={2} mt={3} display={{ sm: "flex", md: "none" }} justify="center">
                <Button
                  size="sm"
                  colorScheme="teal"
                  variant="outline"
                  leftIcon={<FaEdit />}
                  onClick={() => console.log("Edit profile")}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<FaTrash />}
                  onClick={() => console.log("Delete customer")}
                >
                  Delete
                </Button>
              </HStack>
            </Flex>
          </Flex>
          <Flex
            direction={{ sm: "column", lg: "row" }}
            w={{ sm: "100%", md: "50%", lg: "auto" }}
            gap={4}
          >
            {/* Desktop Quick Action Buttons - Hidden on mobile */}
            <HStack spacing={2} mr={4} display={{ sm: "none", md: "flex" }}>
              <Button
                size="sm"
                colorScheme="teal"
                variant="outline"
                leftIcon={<FaEdit />}
                onClick={() => console.log("Edit profile")}
              >
                Edit
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                leftIcon={<FaTrash />}
                onClick={() => console.log("Delete customer")}
              >
                Delete
              </Button>
            </HStack>

            {/* Tab Buttons */}
            <Flex display={{ base: "grid", md: "flex" }} gridTemplateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(2, 1fr)" }} gap={{ base: 3, sm: 3 }} w={{ base: "100%", md: "auto" }}>
              {tabs.map((tab, index) => (
                <Button 
                  key={index}
                  p='0px' 
                  bg='transparent' 
                  _hover={{ bg: "none" }}
                  onClick={() => onTabChange(tab.name)}
                  w={{ base: "100%", md: "auto" }}
                  sx={{ gridColumn: { base: index === 2 ? '1 / span 2' : 'auto' } }}
                >
                  <Flex
                    align='center'
                    w={{ base: "100%", lg: "135px" }}
                    bg={activeTab === tab.name ? 'hsla(0,0%,100%,.5)' : 'hsla(0,0%,100%,.3)'}
                    borderRadius={{ base: '10px', md: '15px' }}
                    justifyContent='center'
                    py={{ base: '10px', md: '10px' }}
                    mx={{ lg: index > 0 ? "1rem" : "0" }}
                    boxShadow={activeTab === tab.name ? 'inset 0 0 1px 1px hsl(0deg 0% 100% / 90%), 0 20px 27px 0 rgb(0 0 0 / 5%)' : 'none'}
                    border={activeTab === tab.name ? '1px solid gray.200' : 'none'}
                    cursor='pointer'
                    transition='all 0.2s ease-in-out'
                    _hover={{
                      bg: 'hsla(0,0%,100%,.4)',
                      transform: 'translateY(-2px)'
                    }}>
                    {tab.icon}
                    <Text
                      fontSize={{ base: '10px', md: 'xs' }}
                      color={textColor}
                      fontWeight='bold'
                      ms='6px'
                      whiteSpace='nowrap'
                    >
                      {tab.name}
                    </Text>
                  </Flex>
                </Button>
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Header;
