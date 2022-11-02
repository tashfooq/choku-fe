import axios from "axios";
import { LoginInput } from "../components/LogIn";
import { SignUpInput } from "../components/SignUp";

const getUser = async () => {
  const { data } = await axios.get("http://localhost:3001/auth/user", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });
  return data;
};

const login = async (loginValues: LoginInput) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/auth/login",
      loginValues
    );
    return response.data || [];
  } catch (err) {
    console.log(err);
  }
};

const register = async (formValues: SignUpInput) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/auth/register",
      formValues
    );
    return response || [];
  } catch (err) {
    console.log(err);
  }
};

export const authService = { getUser, login, register };
