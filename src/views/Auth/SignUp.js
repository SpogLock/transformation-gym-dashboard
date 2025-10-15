// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
// Assets
import BgSignUp from "assets/img/BgSignUp.png";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
// Auth context
import { useAuth } from "contexts/AuthContext";

function SignUp() {
  const history = useHistory();
  const toast = useToast();
  const { register } = useAuth();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const titleColor = useColorModeValue("brand.300", "brand.200");
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("white", "gray.700");
  const bgIcons = useColorModeValue("brand.200", "rgba(255, 255, 255, 0.5)");

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register(name, email, password, password, "staff");

      if (result.success) {
        toast({
          title: "Registration successful",
          description: `Welcome, ${result.data.user.name}! Your account has been created.`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

        // Redirect to dashboard
        history.push("/admin/dashboard");
      } else {
        toast({
          title: "Registration failed",
          description: result.error || "Unable to create account. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      direction='column'
      alignSelf='center'
      justifySelf='center'
      overflow='hidden'>
      <Box
        position='absolute'
        minH={{ base: "70vh", md: "50vh" }}
        w={{ md: "calc(100vw - 50px)" }}
        borderRadius={{ md: "15px" }}
        left='0'
        right='0'
        bgRepeat='no-repeat'
        overflow='hidden'
        zIndex='-1'
        top='0'
        bgImage={BgSignUp}
        bgSize='cover'
        mx={{ md: "auto" }}
        mt={{ md: "14px" }}></Box>
      <Flex
        direction='column'
        textAlign='center'
        justifyContent='center'
        align='center'
        mt='6.5rem'
        mb='30px'>
        <Text fontSize='4xl' color='white' fontWeight='bold'>
          Welcome!
        </Text>
        <Text
          fontSize='md'
          color='white'
          fontWeight='normal'
          mt='10px'
          mb='26px'
          w={{ base: "90%", sm: "60%", lg: "40%", xl: "30%" }}>
          Use these awesome forms to login or create new account in your project
          for free.
        </Text>
      </Flex>
      <Flex alignItems='center' justifyContent='center' mb='60px' mt='20px'>
        <Flex
          direction='column'
          w='445px'
          background='transparent'
          borderRadius='15px'
          p='40px'
          mx={{ base: "100px" }}
          bg={bgColor}
          boxShadow='0 20px 27px 0 rgb(0 0 0 / 5%)'>
          <Text
            fontSize='xl'
            color={textColor}
            fontWeight='bold'
            textAlign='center'
            mb='22px'>
            Register With
          </Text>
          <HStack spacing='15px' justify='center' mb='22px'>
            <Flex
              justify='center'
              align='center'
              w='75px'
              h='75px'
              borderRadius='15px'
              border='1px solid lightgray'
              cursor='pointer'
              transition='all .25s ease'
              _hover={{ filter: "brightness(120%)", bg: bgIcons }}>
              <Link href='#'>
                <Icon
                  as={FaFacebook}
                  w='30px'
                  h='30px'
                  _hover={{ filter: "brightness(120%)" }}
                />
              </Link>
            </Flex>
            <Flex
              justify='center'
              align='center'
              w='75px'
              h='75px'
              borderRadius='15px'
              border='1px solid lightgray'
              cursor='pointer'
              transition='all .25s ease'
              _hover={{ filter: "brightness(120%)", bg: bgIcons }}>
              <Link href='#'>
                <Icon
                  as={FaApple}
                  w='30px'
                  h='30px'
                  _hover={{ filter: "brightness(120%)" }}
                />
              </Link>
            </Flex>
            <Flex
              justify='center'
              align='center'
              w='75px'
              h='75px'
              borderRadius='15px'
              border='1px solid lightgray'
              cursor='pointer'
              transition='all .25s ease'
              _hover={{ filter: "brightness(120%)", bg: bgIcons }}>
              <Link href='#'>
                <Icon
                  as={FaGoogle}
                  w='30px'
                  h='30px'
                  _hover={{ filter: "brightness(120%)" }}
                />
              </Link>
            </Flex>
          </HStack>
          <Text
            fontSize='lg'
            color='gray.400'
            fontWeight='bold'
            textAlign='center'
            mb='22px'>
            or
          </Text>
          <form onSubmit={handleSubmit}>
            <FormControl isInvalid={errors.name} mb='24px'>
              <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                Name
              </FormLabel>
              <Input
                fontSize='sm'
                ms='4px'
                borderRadius='15px'
                type='text'
                placeholder='Your full name'
                size='lg'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.email} mb='24px'>
              <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                Email
              </FormLabel>
              <Input
                fontSize='sm'
                ms='4px'
                borderRadius='15px'
                type='email'
                placeholder='Your email address'
                size='lg'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password} mb='24px'>
              <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                Password
              </FormLabel>
              <Input
                fontSize='sm'
                ms='4px'
                borderRadius='15px'
                type='password'
                placeholder='Your password'
                size='lg'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl display='flex' alignItems='center' mb='24px'>
              <Switch
                id='remember-login'
                colorScheme='brand'
                me='10px'
                isChecked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <FormLabel htmlFor='remember-login' mb='0' fontWeight='normal'>
                Remember me
              </FormLabel>
            </FormControl>

            <Button
              type='submit'
              bg='brand.300'
              fontSize='10px'
              color='white'
              fontWeight='bold'
              w='100%'
              h='45'
              mb='24px'
              isLoading={loading}
              loadingText='Creating account...'
              _hover={{
                bg: "brand.200",
              }}
              _active={{
                bg: "brand.400",
              }}>
              SIGN UP
            </Button>
          </form>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            maxW='100%'
            mt='0px'>
            <Text color={textColor} fontWeight='medium'>
              Already have an account?
              <Link
                color={titleColor}
                as='span'
                ms='5px'
                fontWeight='bold'
                onClick={() => history.push("/auth/signin")}
                cursor='pointer'>
                Sign In
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SignUp;
