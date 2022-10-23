import React from "react";
import { Button, Center, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

type LoginInput = {
  email: string;
  password: string;
};

const LogIn = () => {
  // const login = (val: LoginInput) => {
  //   console.log(val);
  // };
  const navigate = useNavigate();

  const form = useForm<LoginInput>({
    initialValues: { email: "", password: "" },
  });

  const login = async (loginValues: LoginInput) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/auth/login",
        loginValues
      );
      console.log(res);
      if (res.status === 200) {
        localStorage.setItem("accessToken", res.data.accessToken);
        navigate("/tracker");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Center data-test-element="testing-double-quotes">
      <div style={styles.formWrapper}>
        <form onSubmit={form.onSubmit((values) => login(values))}>
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
