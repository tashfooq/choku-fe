import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mantine/core";

const AuthButtons = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  return (
    <>
      {!isAuthenticated ? (
        <>
          <Button variant="default" onClick={() => loginWithRedirect()}>
            Log in
          </Button>
          <Button>Sign up</Button>
        </>
      ) : (
        <Button
          variant="default"
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Log out
        </Button>
      )}
    </>
  );
};

export default AuthButtons;
