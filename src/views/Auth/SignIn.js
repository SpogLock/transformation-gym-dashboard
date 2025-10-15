import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
// Assets
import signInImage from "assets/img/signInImage.png";
// Auth context
import { useAuth } from "contexts/AuthContext";

function SignIn() {
  const history = useHistory();
  const toast = useToast();
  const { login } = useAuth();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Chakra color mode
  const titleColor = useColorModeValue("brand.500", "brand.200");
  const textColor = useColorModeValue("gray.400", "white");

  // Form validation
  const validateForm = () => {
    const newErrors = {};

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
      const result = await login(email, password, rememberMe);

      if (result.success) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${result.data.user.name}!`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

        // Redirect to dashboard
        history.push("/admin/dashboard");
      } else {
        toast({
          title: "Login failed",
          description: result.error || "Invalid credentials. Please try again.",
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
    <Flex position='relative' mb='40px'>
      <Flex
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w='100%'
        maxW='1044px'
        mx='auto'
        justifyContent='space-between'
        mb='30px'
        pt={{ sm: "100px", md: "0px" }}>
        <Flex
          alignItems='center'
          justifyContent='start'
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%", lg: "42%" }}>
          <Flex
            direction='column'
            w='100%'
            background='transparent'
            p='48px'
            mt={{ md: "150px", lg: "80px" }}>
            <Heading color={titleColor} fontSize='32px' mb='10px'>
              Welcome Back
            </Heading>
            <Text
              mb='36px'
              ms='4px'
              color={textColor}
              fontWeight='bold'
              fontSize='14px'>
              Enter your email and password to sign in
            </Text>
            <form onSubmit={handleSubmit}>
              <FormControl isInvalid={errors.email} mb='24px'>
                <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                  Email
                </FormLabel>
                <Input
                  borderRadius='15px'
                  fontSize='sm'
                  type='email'
                  placeholder='Your email address'
                  size='lg'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.password} mb='36px'>
                <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                  Password
                </FormLabel>
                <Input
                  borderRadius='15px'
                  fontSize='sm'
                  type='password'
                  placeholder='Your password'
                  size='lg'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl display='flex' alignItems='center'>
                <Switch
                  id='remember-login'
                  colorScheme='brand'
                  me='10px'
                  isChecked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <FormLabel
                  htmlFor='remember-login'
                  mb='0'
                  ms='1'
                  fontWeight='normal'>
                  Remember me
                </FormLabel>
              </FormControl>

              <Button
                fontSize='10px'
                type='submit'
                bg='brand.300'
                w='100%'
                h='45'
                mb='20px'
                color='white'
                mt='20px'
                isLoading={loading}
                loadingText='Signing in...'
                _hover={{
                  bg: "brand.200",
                }}
                _active={{
                  bg: "brand.400",
                }}>
                SIGN IN
              </Button>
            </form>
            <Flex
              flexDirection='column'
              justifyContent='center'
              alignItems='center'
              maxW='100%'
              mt='0px'>
              <Text color={textColor} fontWeight='medium'>
                Don't have an account?
                <Link
                  color={titleColor}
                  as='span'
                  ms='5px'
                  fontWeight='bold'
                  onClick={() => history.push("/auth/signup")}
                  cursor='pointer'>
                  Sign Up
                </Link>
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box
          display={{ base: "none", md: "block" }}
          overflowX='hidden'
          h='100%'
          w='40vw'
          position='absolute'
          right='0px'>
          <Box
            bgImage={signInImage}
            w='100%'
            h='100%'
            bgSize='cover'
            bgPosition='50%'
            position='absolute'
            borderBottomLeftRadius='20px'></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
