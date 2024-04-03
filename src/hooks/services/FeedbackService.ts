import axios from "axios";
import { apiRoutes } from "../../common/constants";

const { feedback } = apiRoutes;
const sendFeedback = async (feedbackPayload: {
  name: string;
  email: string;
  feedback: string;
}) => {
  const response = await axios.post(`${feedback}/send`, feedbackPayload, {
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
