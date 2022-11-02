import axios from "axios";
import { apiRoutes } from "../common/constants";
import { LoginInput } from "../components/LogIn";
import { SignUpInput } from "../components/SignUp";

const { auth } = apiRoutes;

const getUser = async () => {
  const { data } = await axios.get(`${auth}/user`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });
  return data;
};

const login = async (loginValues: LoginInput) => {
  try {
    const response = await axios.post(`${auth}/login`, loginValues);
    return response.data || [];
  } catch (err) {
    console.log(err);
  }
};

const register = async (formValues: SignUpInput) => {
  try {
    const response = await axios.post(`${auth}/register`, formValues);
    return response || [];
  } catch (err) {
    console.log(err);
  }
};

export const authService = { getUser, login, register };
