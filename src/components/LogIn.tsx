import React from "react";
import { Button, Center, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authService } from "../services/AuthService";

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

export type LoginInput = {
  email: string;
  password: string;
};

const LogIn = () => {
  const navigate = useNavigate();

  const form = useForm<LoginInput>({
    initialValues: { email: "", password: "" },
  });

  const submitLogin = async (loginValues: LoginInput) => {
    const user = await authService.login(loginValues);
    localStorage.setItem("accessToken", user?.accessToken);
    navigate("/tracker");
  };

  return (
    <Center data-test-element="testing-double-quotes">
      <div style={styles.formWrapper}>
        <form onSubmit={form.onSubmit((values) => submitLogin(values))}>
          <TextInput label="Email" required {...form.getInputProps("email")} />
          <PasswordInput
            label="Password"
            required
            {...form.getInputProps("password")}
          />
          <div style={styles.buttonStyle}>
            <Button type="submit">Log In</Button>
          </div>
        </form>
      </div>
    </Center>
  );
};

export default LogIn;
