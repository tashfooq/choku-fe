import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Heading, Center, Stack } from "@chakra-ui/react";

const Home = () => {
  let navigate = useNavigate();
  return (
    <>
      <Center>
        <Stack>
          <Heading>PocDoc</Heading>
          <Button type="button" onClick={() => navigate(`/signup`)}>
            Sign Up
          </Button>
          <Button type="button" onClick={() => navigate(`/login`)}>
            Log In
          </Button>
        </Stack>
      </Center>
    </>
  );
};

export default Home;
