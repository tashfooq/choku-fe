// import { LocalStorageCache } from "@auth0/auth0-react";
import axios from "axios";
import { apiRoutes } from "../common/constants";
import { Progress } from "../types";

const { progress } = apiRoutes;

const getProgress = async () => {
  const response = await axios.get(`${progress}/`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  return response.data;
};

const updateProgress = async (prog: Progress) => {
  const response = await axios.post(`${progress}/`, prog, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  return response;
};

const getTotalProgressPercentage = async () => {
  const response = await axios.get(`${progress}/percentage`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  return response.data.totalProgress;
};

export const progressService = {
  getProgress,
  updateProgress,
  getTotalProgressPercentage,
};
