import axios from "axios";

// this needs to renamed to getTextbooks
const getTextbooksService = async () => {
  const response = await axios.get("http://localhost:3001/course/textbooks", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });
  console.log(response);
  return response.data.textbooks || [];
};

const getChapters = async (textbookId: number) => {
  const response = await axios.get(
    `http://localhost:3001/course/textbooks/${textbookId}/chapters`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    }
  );
  return response.data.chapters || [];
};

const getSubChapters = async (chapterId: number) => {
  const response = await axios.get(
    `http://localhost:3001/course/subtopic/${chapterId}`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    }
  );
  // should see what happens to this destructuring the response.data does not exist
  return response.data.subtopics || [];
};

export const contentService = {
  getTextbooksService,
  getChapters,
  getSubChapters,
};
