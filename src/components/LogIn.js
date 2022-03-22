import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Flex,
  Box,
  Heading,
} from "@chakra-ui/react";
import ErrorMessage from "./ErrorMessage";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const logIn = async (credentials) => {
    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    };
    const response = await fetch("http://localhost:3001/auth/login", settings);
    if (response.status === 200) {
      navigate(`/tracker`);
    } else {
      setLoginFailed(true);
      const { error } = await response.json();
      setErrorMessage(error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const test = {
      email: e.target[0].value,
      password: e.target[1].value,
    };
    console.log(test);
    logIn(test);
  };
  return (
    <>
      <Flex width="full" align="center" justifyContent="center">
        <Box
          mt={2}
          p={8}
          maxWidth="500px"
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
        >
          <Box textAlign="center">
            <Heading>Login</Heading>
          </Box>
          {loginFailed && <ErrorMessage message={errorMessage} />}
          <Box my={4} textAlign="left">
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="test@test.com" size="lg" />
              </FormControl>
              <FormControl isRequired mt={6}>
                <FormLabel>Password</FormLabel>
                <Input type="password" placeholder="*******" size="lg" />
              </FormControl>
              <Button
                colorScheme="teal"
                variant="outline"
                type="submit"
                width="full"
                mt={4}
              >
                Sign In
              </Button>
            </form>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default LogIn;
