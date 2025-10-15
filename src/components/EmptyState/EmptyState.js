import React from "react";
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import NotFoundIllustration from "assets/svg/not_found.svg";

const EmptyState = ({
  title = "Nothing here yet",
  description = "Once there is data, you'll see it here.",
  actionLabel,
  onAction,
  illustrationSrc,
  fullHeight = false,
}) => {
  const resolvedSrc = illustrationSrc || NotFoundIllustration;
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const titleColor = useColorModeValue("gray.700", "white");
  const descColor = useColorModeValue("gray.500", "gray.300");

  return (
    <Flex
      align="center"
      justify="center"
      w="100%"
      minH={fullHeight ? "40vh" : "260px"}
      bg={useColorModeValue("gray.50", "gray.700")}
      border="1px dashed"
      borderColor={borderColor}
      borderRadius="16px"
      p={{ base: 6, md: 10 }}
    >
      <VStack spacing={5} textAlign="center">
        <Box
          bg={cardBg}
          borderRadius="full"
          border="1px solid"
          borderColor={borderColor}
          p={4}
          boxShadow="0 10px 25px rgba(0,0,0,0.08)"
        >
          <Image
            src={resolvedSrc}
            alt="Empty"
            maxW={{ base: "120px", md: "160px" }}
            borderRadius="full"
            objectFit="cover"
          />
        </Box>
        <Heading size="md" color={titleColor}>
          {title}
        </Heading>
        <Text maxW="520px" color={descColor}>
          {description}
        </Text>
        {actionLabel && onAction && (
          <Button
            size="sm"
            onClick={onAction}
            bg="brand.300"
            color="white"
            _hover={{ bg: "brand.200" }}
            _active={{ bg: "brand.400" }}
            borderRadius="12px"
          >
            {actionLabel}
          </Button>
        )}
      </VStack>
    </Flex>
  );
};

export default EmptyState;


