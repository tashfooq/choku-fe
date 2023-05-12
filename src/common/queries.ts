import { useQuery } from "@tanstack/react-query";
import { contentService } from "../services/ContentService";
import { progressService } from "../services/ProgressService";
import { Chapter, ProgressDto, SubChapter, SubTopic } from "../types";

export const useProgress = () =>
  useQuery<ProgressDto>({
    queryKey: ["progress"],
    queryFn: progressService.getProgress,
  });

export const useChapter = (textbookId: number) =>
  useQuery<Chapter[]>({
    queryKey: ["chapter", textbookId],
    queryFn: () => contentService.getChapters(textbookId),
  });

export const useSubChapter = (chapterId: number) =>
  useQuery<SubChapter[]>({
    queryKey: ["subChapters", chapterId],
    queryFn: () => contentService.getSubChapters(chapterId),
  });

export const useSubTopic = (subChapterId: number) =>
  useQuery<SubTopic[]>({
    queryKey: ["subTopics", subChapterId],
    queryFn: () => contentService.getSubtopics(subChapterId),
  });
