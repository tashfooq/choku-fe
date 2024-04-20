import { ProgressDto } from "../types";
import { useNavigate } from "react-router-dom";
import useCustomQueries from "../common/queries";
import useTextbookSelect from "./useTextbookSelect";
import { useContext } from "react";
import ProgressContext, {
  ProgressContextType,
} from "../context/ProgressContext";

const useProgressFetch = (): {
  fetchProgressInitial: () => ProgressDto | undefined;
} => {
  const navigate = useNavigate();
  // think about whether this needs be its own hook
  const { setSelectedTextbooks } = useTextbookSelect();
  const {
    setSelectedTextbookIds,
    setSelectedChapters,
    setSelectedSubChapters,
    setSelectedSubTopics,
  } = useContext(ProgressContext) as ProgressContextType;
  const {
    useTextbooksByIds,
    useChapterByIds,
    useSubChapterByIds,
    useSubTopicByIds,
    useProgress,
  } = useCustomQueries();

  const onProgressError = (error: any) => {
    console.log(error);
    navigate("/picker");
    throw error;
  };

  // this needs to be fleshed out to hold more progress information
  const onProgressSuccess = (data: ProgressDto) => {
    const {
      selectedTextbookIds,
      chapterProgress,
      subchapterProgress,
      subtopicProgress,
    } = data;
    const { data: textbooks } = useTextbooksByIds(selectedTextbookIds);
    const { data: chapters } = useChapterByIds(chapterProgress);
    const { data: subChapters } = useSubChapterByIds(subchapterProgress);
    const { data: subTopics } = useSubTopicByIds(subtopicProgress);

    setSelectedTextbooks(textbooks || []);
    setSelectedTextbookIds(selectedTextbookIds);
    setSelectedChapters(chapters || []);
    setSelectedSubChapters(subChapters || []);
    setSelectedSubTopics(subTopics || []);
  };

  const { data: progress } = useProgress(onProgressSuccess, onProgressError);

  const fetchProgressInitial = () => {
    return progress;
  };
  return { fetchProgressInitial };
};

export default useProgressFetch;
