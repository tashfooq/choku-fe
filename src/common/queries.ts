import { useQuery } from "@tanstack/react-query";
import useContentService from "../hooks/services/ContentService";
import useProgressService from "../hooks/services/ProgressService";
import { Chapter, ProgressDto, SubChapter, SubTopic, Textbook } from "../types";

const useCustomQueries = () => {
  const {
    getTextbooks,
    getTextbooksByIds,
    getChapters,
    getChaptersByIds,
    getSubchapters,
    getSubchaptersByIds,
    getSubtopics,
    getSubtopicsByIds,
  } = useContentService();

  const { getProgress, getTotalProgressPercentage } = useProgressService();

  const useProgress = (
    onSuccessHandler?: (data: ProgressDto) => void,
    onErrorHandler?: (error: any) => void,
  ) =>
    useQuery<ProgressDto>({
      queryKey: ["progress"],
      queryFn: getProgress,
      ...(onSuccessHandler && { onSuccess: onSuccessHandler }),
      ...(onErrorHandler && { onError: onErrorHandler }),
    });

  const useTotalProgressPercentage = (isEnabled: boolean) =>
    useQuery({
      queryKey: ["totalProgressPercentage"],
      queryFn: getTotalProgressPercentage,
      enabled: isEnabled,
    });

  const useTextbooks = (isEnabled: boolean = true) =>
    useQuery({
      queryKey: ["textbooks"],
      queryFn: getTextbooks,
      enabled: isEnabled,
    });

  const useTextbooksByIds = (textbookIds: number[]) =>
    useQuery<Textbook[]>({
      queryKey: ["textbooks", textbookIds],
      queryFn: () => getTextbooksByIds(textbookIds),
    });

  const useChapter = (textbookId: number, isEnabled: boolean) =>
    useQuery<Chapter[]>({
      queryKey: ["chapter", textbookId],
      queryFn: () => getChapters(textbookId),
      enabled: isEnabled,
    });

  const useChapterByIds = (textbookIds: number[], isEnabled: boolean) =>
    useQuery<Chapter[]>({
      queryKey: ["chapter", textbookIds],
      queryFn: () => getChaptersByIds(textbookIds),
      enabled: isEnabled,
    });

  const useSubChapter = (chapterId: number, isEnabled: boolean) =>
    useQuery<SubChapter[]>({
      queryKey: ["subChapters", chapterId],
      queryFn: () => getSubchapters(chapterId),
      enabled: isEnabled,
    });

  const useSubChapterByIds = (chapterIds: number[], isEnabled: boolean) =>
    useQuery<SubChapter[]>({
      queryKey: ["subChapters", chapterIds],
      queryFn: () => getSubchaptersByIds(chapterIds),
      enabled: isEnabled,
    });

  const useSubTopic = (subChapterId: number, isEnabled: boolean) =>
    useQuery<SubTopic[]>({
      queryKey: ["subTopics", subChapterId],
      queryFn: () => getSubtopics(subChapterId),
      enabled: isEnabled,
    });

  const useSubTopicByIds = (subChapterIds: number[], isEnabled: boolean) =>
    useQuery<SubTopic[]>({
      queryKey: ["subTopics", subChapterIds],
      queryFn: () => getSubtopicsByIds(subChapterIds),
      enabled: isEnabled,
    });

  return {
    useTextbooks,
    useTextbooksByIds,
    useChapter,
    useChapterByIds,
    useSubChapter,
    useSubChapterByIds,
    useSubTopic,
    useSubTopicByIds,
    useProgress,
    useTotalProgressPercentage,
  };
};

export default useCustomQueries;
