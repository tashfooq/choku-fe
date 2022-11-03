import axios from "axios";
import { apiRoutes } from "../common/constants";

const { progress } = apiRoutes;

const getProgress = async () => {
  const response = await axios.get(`${progress}/`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });
  console.log(response);
  return response.data || [];
};

export const progressService = {
  getProgress,
};
