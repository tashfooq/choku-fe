import axios from "axios";
import { apiRoutes } from "../common/constants";
import { ProgressDto } from "../context/ProgressContext";

const { progress } = apiRoutes;

const getProgress = async () => {
  try {
    const response = await axios.get(`${progress}/`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
    return response.data || [];
  } catch (err) {
    console.log(err);
  }
};

const updateProgress = async (prog: ProgressDto) => {
  const response = await axios.post(`${progress}/`, prog, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });
  return response;
};

export const progressService = {
  getProgress,
  updateProgress,
};
