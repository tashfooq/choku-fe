import React from "react";
import { Title, Center, Button, Box } from "@mantine/core";

const Home = () => {
  return (
    // <div>Home</div>
    <div style={{ marginTop: 200 }}>
      <Center>
        <Title>A comprehensive Medical School Progress Tracker</Title>
      </Center>
      <Box>
        <Button>Login</Button>
        <Button>Sign Up</Button>
      </Box>
    </div>
  );
};

export default Home;
