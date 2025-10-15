// Chakra Icons
import { BellIcon, SettingsIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
// Chakra Imports
import {
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useColorMode,
  Box,
  VStack,
  HStack,
  Select,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Checkbox,
  Divider,
} from "@chakra-ui/react";
// Assets
import avatar1 from "assets/img/avatars/avatar1.png";
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";
// Custom Icons
import { ProfileIcon } from "components/Icons/Icons";
// Custom Components
import { ItemContent } from "components/Menu/ItemContent";
import SidebarResponsive from "components/Sidebar/SidebarResponsive";
import PropTypes from "prop-types";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import routes from "routes.js";
import { useSearch } from "contexts/SearchContext";
import { useAuth } from "contexts/AuthContext";
import { useHistory } from "react-router-dom";

export default function HeaderLinks(props) {
  const { variant, children, fixed, secondary, onOpen, ...rest } = props;
  const location = useLocation();
  const history = useHistory();
  const { searchQuery, filters, updateSearchQuery, updateFilters, clearFilters, resetSearch } = useSearch();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, isAuthenticated, logout } = useAuth();

  // Chakra Color Mode
  let mainTeal = useColorModeValue("brand.500", "brand.500");
  let inputBg = useColorModeValue("white", "gray.800");
  let mainText = useColorModeValue("gray.700", "gray.200");
  let navbarIcon = useColorModeValue("gray.500", "gray.200");
  let searchIcon = useColorModeValue("gray.700", "gray.200");

  if (secondary) {
    navbarIcon = useColorModeValue("gray.700", "gray.100");
    mainText = useColorModeValue("gray.800", "gray.100");
  }
  const settingsRef = React.useRef();

  // Get current page context for search
  const getCurrentPageContext = () => {
    const path = location.pathname;
    if (path.includes('customer-management')) return 'customers';
    if (path.includes('stock-management')) return 'stock';
    if (path.includes('billing')) return 'billing';
    return 'general';
  };

  const currentContext = getCurrentPageContext();

  // Get search placeholder based on context
  const getSearchPlaceholder = () => {
    const isSmallScreen = window.innerWidth < 480; // base breakpoint
    
    switch (currentContext) {
      case 'customers':
        return isSmallScreen ? 'Search customers...' : 'Search customers by name, email, or phone...';
      case 'stock':
        return isSmallScreen ? 'Search products...' : 'Search products by name or SKU...';
      case 'billing':
        return isSmallScreen ? 'Search invoices...' : 'Search invoices or transactions...';
      default:
        return 'Search...';
    }
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  // Get filter count for badge
  const getFilterCount = () => {
    return Object.values(filters).filter(filter => filter !== '').length;
  };
  return (
    <Flex
      pe={{ sm: "0px", md: "0px" }}
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      gap={{ base: "4px", sm: "6px", md: "12px" }}
      minW="0"
      overflow="hidden"
    >
      <HStack spacing={{ base: "2px", sm: "4px", md: "12px" }} me={{ sm: "auto", md: "20px" }} flex="1" minW="0">
        <InputGroup
          cursor="pointer"
          bg={useColorModeValue("rgba(255, 255, 255, 0.15)", "rgba(26, 32, 44, 0.15)")}
          backdropFilter="blur(30px) saturate(180%)"
          borderRadius={{ base: "10px", sm: "12px", md: "16px" }}
          border="1px solid"
          borderColor={useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.2)")}
          boxShadow="none"
          w={{
            base: "100px",
            sm: "140px",
            md: "300px",
          }}
          maxW="100%"
          flex="1"
          _focus={{
            borderColor: mainTeal,
            boxShadow: `0 0 0 1px ${mainTeal}`,
            bg: useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(26, 32, 44, 0.2)"),
          }}
          _active={{
            borderColor: mainTeal,
          }}
          _hover={{
            bg: useColorModeValue("rgba(255, 255, 255, 0.25)", "rgba(26, 32, 44, 0.25)")
          }}
          transition="all 0.3s ease"
          position="relative"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: "inherit",
            background: useColorModeValue(
              "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)",
              "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)"
            ),
            pointerEvents: "none",
            zIndex: -1
          }}
        >
          <Input
            fontSize={{ base: "9px", sm: "10px", md: "xs" }}
            py={{ base: "6px", sm: "8px", md: "11px" }}
            px={{ base: "8px", sm: "12px", md: "16px" }}
            color={mainText}
            placeholder={getSearchPlaceholder()}
            borderRadius="inherit"
            value={searchQuery}
            onChange={(e) => updateSearchQuery(e.target.value)}
          />
        </InputGroup>

      </HStack>
      
      {/* User Menu */}
      {isAuthenticated && user ? (
        <Menu>
          <MenuButton
            as={Button}
            ms="0px"
            px={{ base: "6px", sm: "8px", md: "12px" }}
            me={{ sm: "2px", md: "16px" }}
            color={navbarIcon}
            variant="transparent-with-icon"
            size={{ base: "xs", sm: "sm", md: "md" }}
            rightIcon={
              !document.documentElement.dir && (
                <ProfileIcon color={navbarIcon} w={{ base: "16px", sm: "18px", md: "22px" }} h={{ base: "16px", sm: "18px", md: "22px" }} me="0px" />
              )
            }
            leftIcon={
              document.documentElement.dir && (
                <ProfileIcon color={navbarIcon} w={{ base: "16px", sm: "18px", md: "22px" }} h={{ base: "16px", sm: "18px", md: "22px" }} me="0px" />
              )
            }
          >
            <Text display={{ base: "none", sm: "none", md: "flex" }} fontSize={{ base: "xs", sm: "sm", md: "md" }}>
              {user.name}
            </Text>
          </MenuButton>
          <MenuList p="12px">
            <Flex flexDirection="column">
              <MenuItem 
                borderRadius="8px" 
                mb="8px"
                onClick={() => history.push('/admin/profile')}
              >
                <Flex align="center">
                  <ProfileIcon color={mainText} w="18px" h="18px" me="12px" />
                  <Text fontSize="sm">Profile</Text>
                </Flex>
              </MenuItem>
              <MenuItem 
                borderRadius="8px" 
                mb="8px"
                onClick={() => history.push('/admin/settings')}
              >
                <Flex align="center">
                  <SettingsIcon color={mainText} w="18px" h="18px" me="12px" />
                  <Text fontSize="sm">Settings</Text>
                </Flex>
              </MenuItem>
              <Divider my="8px" />
              <MenuItem 
                borderRadius="8px"
                color="red.500"
                onClick={async () => {
                  await logout();
                  history.push('/auth/signin');
                }}
              >
                <Text fontSize="sm" fontWeight="bold">Logout</Text>
              </MenuItem>
            </Flex>
          </MenuList>
        </Menu>
      ) : (
        <NavLink to="/auth/signin">
          <Button
            ms="0px"
            px={{ base: "4px", sm: "6px", md: "0px" }}
            me={{ sm: "2px", md: "16px" }}
            color={navbarIcon}
            variant="transparent-with-icon"
            size={{ base: "xs", sm: "sm", md: "md" }}
            rightIcon={
              document.documentElement.dir ? (
                ""
              ) : (
                <ProfileIcon color={navbarIcon} w={{ base: "16px", sm: "18px", md: "22px" }} h={{ base: "16px", sm: "18px", md: "22px" }} me="0px" />
              )
            }
            leftIcon={
              document.documentElement.dir ? (
                <ProfileIcon color={navbarIcon} w={{ base: "16px", sm: "18px", md: "22px" }} h={{ base: "16px", sm: "18px", md: "22px" }} me="0px" />
              ) : (
                ""
              )
            }
          >
            <Text display={{ base: "none", sm: "none", md: "flex" }} fontSize={{ base: "xs", sm: "sm", md: "md" }}>Sign In</Text>
          </Button>
        </NavLink>
      )}
       {/* Icons Container - Better Mobile Alignment */}
       <HStack spacing={{ base: "3px", sm: "4px", md: "12px" }} align="center" flexShrink={0}>
         {/* Sidebar Toggle */}
         <Box display={{ base: "block", sm: "block", md: "none" }}>
           <SidebarResponsive
             logoText={props.logoText}
             secondary={props.secondary}
             routes={routes}
             // logo={logo}
             {...rest}
           />
         </Box>
         
         {/* Color Mode Toggle */}
         <IconButton
           aria-label="Toggle color mode"
           icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
           onClick={toggleColorMode}
           variant="ghost"
           color={navbarIcon}
           size={{ base: "xs", sm: "sm", md: "sm" }}
           w={{ base: "24px", sm: "28px", md: "40px" }}
           h={{ base: "24px", sm: "28px", md: "40px" }}
           minW={{ base: "24px", sm: "28px", md: "40px" }}
           borderRadius={{ base: "8px", sm: "10px", md: "16px" }}
        bg={useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(26, 32, 44, 0.2)")}
        backdropFilter="blur(30px) saturate(180%)"
        border="1px solid"
        borderColor={useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.2)")}
        boxShadow="none"
        _hover={{ 
          bg: useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(26, 32, 44, 0.3)"),
          transform: "scale(1.05)"
        }}
        transition="all 0.2s ease"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "inherit",
          background: useColorModeValue(
            "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)",
            "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)"
          ),
          pointerEvents: "none",
          zIndex: -1
        }}
      />
        
        {/* Notifications */}
        <Menu>
          <MenuButton>
             <IconButton
               aria-label="Notifications"
               icon={<BellIcon />}
               variant="ghost"
               color={navbarIcon}
               size={{ base: "xs", sm: "sm", md: "sm" }}
               w={{ base: "24px", sm: "28px", md: "40px" }}
               h={{ base: "24px", sm: "28px", md: "40px" }}
               minW={{ base: "24px", sm: "28px", md: "40px" }}
               borderRadius={{ base: "8px", sm: "10px", md: "16px" }}
            bg={useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(26, 32, 44, 0.2)")}
            backdropFilter="blur(30px) saturate(180%)"
            border="1px solid"
            borderColor={useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.2)")}
            boxShadow="none"
            _hover={{ 
              bg: useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(26, 32, 44, 0.3)"),
              transform: "scale(1.08)"
            }}
            transition="all 0.3s ease"
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "16px",
              background: useColorModeValue(
                "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)",
                "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)"
              ),
              pointerEvents: "none",
              zIndex: -1
            }}
          />
        </MenuButton>
        <MenuList p="16px 8px">
          <Flex flexDirection="column">
            <MenuItem borderRadius="8px" mb="10px">
              <ItemContent
                time="13 minutes ago"
                info="from Alicia"
                boldInfo="New Message"
                aName="Alicia"
                aSrc={avatar1}
              />
            </MenuItem>
            <MenuItem borderRadius="8px" mb="10px">
              <ItemContent
                time="2 days ago"
                info="by Josh Henry"
                boldInfo="New Album"
                aName="Josh Henry"
                aSrc={avatar2}
              />
            </MenuItem>
            <MenuItem borderRadius="8px">
              <ItemContent
                time="3 days ago"
                info="Payment succesfully completed!"
                boldInfo=""
                aName="Kara"
                aSrc={avatar3}
              />
            </MenuItem>
          </Flex>
        </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
