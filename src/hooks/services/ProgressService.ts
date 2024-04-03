// import { LocalStorageCache } from "@auth0/auth0-react";
import axios from "axios";
import { apiRoutes } from "../../common/constants";
import { Progress } from "../../types";
import { useAuth } from "@clerk/clerk-react";

const { progress } = apiRoutes;

const useProgressService = () => {
  const { getToken } = useAuth();

  const getProgress = async () => {
    const response = await axios.get(`${progress}/`, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });
    return response.data;
  };

  const updateProgress = async (prog: Progress) => {
    const response = await axios.post(`${progress}/`, prog, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });
    return response;
  };

  const getTotalProgressPercentage = async () => {
    const response = await axios.get(`${progress}/percentage`, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });
    return response.data.totalProgress;
  };

  return {
    getProgress,
    updateProgress,
    getTotalProgressPercentage,
  };
};

export default useProgressService;
