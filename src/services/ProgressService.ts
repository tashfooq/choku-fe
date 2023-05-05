import { LocalStorageCache } from "@auth0/auth0-react";
import axios from "axios";
import { useContext } from "react";
import { apiRoutes } from "../common/constants";
import AuthContext, { AuthContextType } from "../context/AuthContext";
import { ProgressDto } from "../context/ProgressContext";

const { progress } = apiRoutes;
// const { token } = useContext(AuthContext) as AuthContextType;

const getProgress = async () => {
  const response = await axios.get(`${progress}/`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  return response.data;
};

const updateProgress = async (prog: ProgressDto) => {
  const response = await axios.post(`${progress}/`, prog, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  return response;
};

export const progressService = {
  getProgress,
  updateProgress,
};
