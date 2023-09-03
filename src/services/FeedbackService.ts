import axios from "axios";
import { apiRoutes } from "../common/constants";

const { feedback } = apiRoutes;
const sendFeedback = async (feedbackMsg: string) => {
  const feedbackObj = { message: feedbackMsg };
  const response = await axios.post(`${feedback}/send`, feedbackObj, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  console.log(response);
  return response.data;
};

export const feedbackService = {
  sendFeedback,
};
