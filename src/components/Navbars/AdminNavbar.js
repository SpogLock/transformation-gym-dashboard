// Chakra Imports
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import React, { useState } from "react";
import AdminNavbarLinks from "./AdminNavbarLinks";

export default function AdminNavbar(props) {
  const [scrolled, setScrolled] = useState(false);
  const {
    variant,
    children,
    fixed,
    secondary,
    brandText,
    onOpen,
    ...rest
  } = props;

  // Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
  let mainText = useColorModeValue("gray.700", "gray.200");
  let secondaryText = useColorModeValue("gray.400", "gray.200");
  let navbarPosition = "fixed";
  let navbarFilter = "none";
  let navbarBackdrop = "blur(40px) saturate(180%)";
  let navbarShadow = useColorModeValue(
    "0px 16px 64px rgba(0, 0, 0, 0.08), 0px 4px 16px rgba(0, 0, 0, 0.04)",
    "0px 16px 64px rgba(0, 0, 0, 0.3), 0px 4px 16px rgba(0, 0, 0, 0.1)"
  );
  let navbarBg = useColorModeValue(
    "rgba(255, 255, 255, 0.25)",
    "rgba(26, 32, 44, 0.25)"
  );
  let navbarBorder = useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.2)");
  let secondaryMargin = "0px";
  let paddingX = "15px";
  if (props.secondary) {
    navbarBackdrop = "blur(40px) saturate(180%)";
    navbarPosition = "fixed";
    mainText = useColorModeValue("gray.800", "gray.100");
    secondaryText = useColorModeValue("gray.600", "gray.300");
    secondaryMargin = "22px";
    paddingX = "30px";
  }
  return (
    <Flex
      position={navbarPosition}
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      borderWidth="1px"
      borderStyle="solid"
      transition="all 0.3s ease"
      alignItems="center"
      borderRadius="16px"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: "16px",
        background: useColorModeValue(
          "linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.2) 100%)",
          "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 100%)"
        ),
        pointerEvents: "none",
        zIndex: -1
      }}
      _after={{
        content: '""',
        position: "absolute",
        top: "1px",
        left: "1px",
        right: "1px",
        bottom: "1px",
        borderRadius: "15px",
        background: useColorModeValue(
          "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)",
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)"
        ),
        pointerEvents: "none",
        zIndex: -1
      }}
      display="flex"
      minH="60px"
      justifyContent="space-between"
      lineHeight="1.5"
      mx="auto"
      mt="16px"
      mb="16px"
      left={{ sm: "16px", md: "280px" }}
      right={{ sm: "16px", md: "16px" }}
      transform="none"
      px="20px"
      py="12px"
      top="0"
      w={{ sm: "calc(100vw - 32px)", md: "calc(100vw - 296px)", xl: "calc(100vw - 296px)" }}
      zIndex="1000"
    >
      <Flex
        w="100%"
        flexDirection={{
          sm: "column",
          md: "row",
        }}
        alignItems={{ xl: "center" }}
      >
        <Box mb={{ sm: "8px", md: "0px" }} display={{ base: "none", md: "block" }}>
          {/* Here we create navbar brand, based on route name */}
          <Link
            color={mainText}
            href="#"
            bg="inherit"
            borderRadius="inherit"
            fontWeight="bold"
            fontSize="lg"
            _hover={{ color: { mainText } }}
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
          >
            {brandText}
          </Link>
        </Box>
        <Box ms="auto" w={{ sm: "100%", md: "unset" }}>
          <AdminNavbarLinks
            onOpen={props.onOpen}
            logoText={props.logoText}
            secondary={props.secondary}
            fixed={props.fixed}
          />
        </Box>
      </Flex>
    </Flex>
  );
}

AdminNavbar.propTypes = {
  brandText: PropTypes.string,
  variant: PropTypes.string,
  secondary: PropTypes.bool,
  fixed: PropTypes.bool,
  onOpen: PropTypes.func,
};
