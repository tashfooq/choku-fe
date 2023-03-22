import React from "react";
import { Title, Center, Button, Box } from "@mantine/core";
import { useAuth0 } from "@auth0/auth0-react";

const Home = () => {
  const { loginWithRedirect, logout } = useAuth0();
  return (
    <div style={{ marginTop: 200 }}>
      <Center>
        <Title>A comprehensive Medical School Progress Tracker</Title>
      </Center>
      <Box>
        <Button onClick={() => loginWithRedirect()}>Login</Button>
        <Button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Logout
        </Button>
      </Box>
    </div>
  );
};

export default Home;
