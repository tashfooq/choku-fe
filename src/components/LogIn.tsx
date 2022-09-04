import { Button, Center, PasswordInput, TextInput } from "@mantine/core";
import React from "react";

const styles = {
  formWrapper: {
    height: 400,
    width: 400,
  },
  buttonStyle: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 10,
  },
};

const LogIn = () => {
  return (
    <Center>
      <div style={styles.formWrapper}>
        <TextInput label="Email" required />
        <PasswordInput label="Password" required />
        <div style={styles.buttonStyle}>
          <Button>Log In</Button>
        </div>
      </div>
    </Center>
  );
};

export default LogIn;
