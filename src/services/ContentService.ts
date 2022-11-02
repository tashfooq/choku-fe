import axios from "axios";
import { apiRoutes } from "../common/constants";

const { content } = apiRoutes;

// this needs to renamed to getTextbooks
const getTextbooksService = async () => {
  const response = await axios.get(`${content}/textbooks`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });
  console.log(response);
  return response.data.textbooks || [];
};

const getChapters = async (textbookId: number) => {
  const response = await axios.get(
    `${content}/textbooks/${textbookId}/chapters`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    }
  );
  return response.data.chapters || [];
};

const getSubChapters = async (chapterId: number) => {
  const response = await axios.get(`${content}/subtopic/${chapterId}`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });
  // should see what happens to this destructuring the response.data does not exist
  return response.data.subtopics || [];
};

export const contentService = {
  getTextbooksService,
  getChapters,
  getSubChapters,
};
