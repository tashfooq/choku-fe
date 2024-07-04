import React from "react";
import { Button } from "@mantine/core";
import { SignedIn, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const AuthButtons = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const onSignOut = async () => {
    await signOut();
    navigate("/home");
  };

  return (
    <SignedIn>
      <Button variant="default" onClick={onSignOut}>
        Sign Out
      </Button>
    </SignedIn>
  );
};

export default AuthButtons;
