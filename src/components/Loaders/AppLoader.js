import React from "react";
import { Flex, Spinner, Text, useColorModeValue } from "@chakra-ui/react";

const AppLoader = ({ message = "Loading...", fullHeight = true }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const spinnerColor = useColorModeValue("brand.300", "brand.200");

  return (
    <Flex
      align="center"
      justify="center"
      direction="column"
      w="100%"
      minH={fullHeight ? "40vh" : "auto"}
      py={fullHeight ? 10 : 4}
    >
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color={spinnerColor} size="xl" />
      {message ? (
        <Text mt={4} color={textColor} fontWeight="medium" fontSize="sm">
          {message}
        </Text>
      ) : null}
    </Flex>
  );
};

export default AppLoader;


