import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const SignUp = () => {
  const [userCreated, setUserCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const createUser = async (user) => {
    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    };
    const response = await fetch(
      "http://localhost:3001/auth/register",
      settings
    );
    if (response.status === 201) {
      setUserCreated(true);
      navigate(`/login`);
    } else {
      setUserCreated(false);
      const { error } = await response.json();
      setErrorMessage(error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const test = {
      name: e.target[0].value,
      username: e.target[1].value,
      email: e.target[2].value,
      password: e.target[3].value,
    };
    createUser(test);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
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
              <Heading>SignUp</Heading>
            </Box>
            {!!errorMessage && <ErrorMessage message={errorMessage} />}
            <Box my={4} textAlign="left">
              <FormControl isRequired>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input id="name" type="text" size="lg" />
              </FormControl>
              <FormControl isRequired mt={6}>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input id="username" type="text" size="lg" />
              </FormControl>
              <FormControl isRequired mt={6}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input id="username" type="email" size="lg" />
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
            </Box>
          </Box>
        </Flex>
      </form>
    </>
  );
};

export default SignUp;
