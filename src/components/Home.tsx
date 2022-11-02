import React from "react";
import { Title, Center, Button, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    // <div>Home</div>
    <div style={{ marginTop: 200 }}>
      <Center>
        <Title>A comprehensive Medical School Progress Tracker</Title>
      </Center>
      <Box>
        <Button onClick={() => navigate("/login")}>Login</Button>
        <Button>Sign Up</Button>
      </Box>
    </div>
  );
};

export default Home;
