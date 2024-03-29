import axios from "axios";
import { apiRoutes } from "../common/constants";

const { content } = apiRoutes;

// this needs to renamed to getTextbooks
const getAllTextbooks = async () => {
  const response = await axios.get(`${content}/textbooks`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  return response.data || [];
};

const getTextbooksByIds = async (textbookIds: number[]) => {
  const response = await axios.get(`${content}/textbooks`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    params: {
      ids: textbookIds,
    },
  });
  return response.data.textbooks || [];
};

const getChapters = async (textbookId: number) => {
  const response = await axios.get(
    `${content}/textbooks/${textbookId}/chapters`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );
  return response.data.chapters || [];
};

const getSubChapters = async (chapterId: number) => {
  const response = await axios.get(`${content}/subchapter/${chapterId}`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  // should see what happens to this destructuring the response.data does not exist
  return response.data.subchapters || [];
};

const getSubTopics = async (subchapterId: number) => {
  const response = await axios.get(`${content}/subtopic/${subchapterId}`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  return response.data.subtopics || [];
};

const getChaptersByIds = async (chapterIds: number[]) => {
  const response = await axios.get(`${content}/chapters`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    params: {
      ids: chapterIds,
    },
  });
  return response.data.chapters || [];
};

const getSubChaptersByIds = async (subchapterIds: number[]) => {
  const response = await axios.get(`${content}/subchapters`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    params: {
      ids: subchapterIds,
    },
  });
  return response.data.subchapters || [];
};

const getSubTopicsByIds = async (subtopicIds: number[]) => {
  const response = await axios.get(`${content}/subtopics`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    params: {
      ids: subtopicIds,
    },
  });
  return response.data.subtopics || [];
};

export const contentService = {
  getAllTextbooks,
  getTextbooksByIds,
  getChapters,
  getSubChapters,
  getSubtopics: getSubTopics,
  getChaptersByIds,
  getSubChaptersByIds,
  getSubTopicsByIds,
};
