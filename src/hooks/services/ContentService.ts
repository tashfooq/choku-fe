import axios from "axios";
import { apiRoutes } from "../../common/constants";
import { useAuth } from "@clerk/clerk-react";

const { content } = apiRoutes;

const useContentService = () => {
  const { getToken } = useAuth();

  const getTextbooks = async () => {
    const response = await axios.get(`${content}/textbook`, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });
    return response.data;
  };

  const getTextbooksByIds = async (textbookIds: number[]) => {
    const response = await axios.get(`${content}/textbook`, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
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
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );
    return response.data.chapters || [];
  };

  const getChaptersByIds = async (chapterIds: number[]) => {
    const response = await axios.get(`${content}/chapters`, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
      params: {
        ids: chapterIds,
      },
    });
    return response.data.chapters || [];
  };

  const getSubchapters = async (chapterId: number) => {
    const response = await axios.get(`${content}/subchapter/${chapterId}`, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });
    // should see what happens to this destructuring the response.data does not exist
    return response.data.Subchapters || [];
  };

  const getSubchaptersByIds = async (subchapterIds: number[]) => {
    const response = await axios.get(`${content}/Subchapters`, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
      params: {
        ids: subchapterIds,
      },
    });
    return response.data.Subchapters || [];
  };

  const getSubtopics = async (subchapterId: number) => {
    const response = await axios.get(`${content}/subtopic/${subchapterId}`, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });
    return response.data.Subtopics || [];
  };

  const getSubtopicsByIds = async (subtopicIds: number[]) => {
    const response = await axios.get(`${content}/Subtopics`, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
      params: {
        ids: subtopicIds,
      },
    });
    return response.data.Subtopics || [];
  };

  return {
    getTextbooks,
    getTextbooksByIds,
    getChapters,
    getChaptersByIds,
    getSubchapters,
    getSubchaptersByIds,
    getSubtopics,
    getSubtopicsByIds,
  };
};

export default useContentService;
