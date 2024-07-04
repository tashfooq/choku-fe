import { useContext, useEffect } from "react";
import useCustomQueries from "../common/queries";
import ProgressContext, {
  ProgressContextType,
} from "../context/ProgressContext";
import { ProgressDto } from "../types";

const useProgressSet = (progress?: ProgressDto) => {
  const {
    setSelectedTextbookIds,
    setSelectedChapters,
    setSelectedSubChapters,
    setSelectedSubTopics,
  } = useContext(ProgressContext) as ProgressContextType;
  const { useChapterByIds, useSubChapterByIds, useSubTopicByIds } =
    useCustomQueries();

  const { data: chapters } = useChapterByIds(
    progress?.chapterProgress || [],
    !!progress && progress.chapterProgress.length > 0,
  );
  const { data: subChapters } = useSubChapterByIds(
    progress?.subchapterProgress || [],
    !!progress && progress.subchapterProgress.length > 0,
  );
  const { data: subTopics } = useSubTopicByIds(
    progress?.subtopicProgress || [],
    !!progress && progress.subtopicProgress.length > 0,
  );
  useEffect(() => {
    if (!progress) return;
    const { selectedTextbookIds } = progress;

    setSelectedTextbookIds(selectedTextbookIds);
    setSelectedChapters(chapters || []);
    setSelectedSubChapters(subChapters || []);
    setSelectedSubTopics(subTopics || []);
  }, [progress]);
};

export default useProgressSet;
