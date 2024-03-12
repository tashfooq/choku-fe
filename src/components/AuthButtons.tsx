import React from "react";
// import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mantine/core";
import { SignedIn, SignOutButton } from "@clerk/clerk-react";

const AuthButtons = () => {
  // const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  return (

    <SignedIn>
      <SignOutButton></SignOutButton>
      {/* <Button variant="default" onClick={() => loginWithRedirect()}> */}
      {/*   Log in */}
      {/* </Button> */}
      {/* <Button>Sign up</Button> */}
    </SignedIn>
  );
};

export default AuthButtons;
