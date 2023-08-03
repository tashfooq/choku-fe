import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mantine/core";
import React from "react";

const AuthButtons = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  return (
    <>
      {!isAuthenticated && (
        <>
          <Button variant="default" onClick={() => loginWithRedirect()}>
            Log in
          </Button>
          <Button>Sign up</Button>
        </>
      )}
      {isAuthenticated && <Button variant="default">Log out</Button>}
    </>
  );
};

export default AuthButtons;
