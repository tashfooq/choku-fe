import { useQuery } from "@tanstack/react-query";
import { contentService } from "../services/ContentService";
import { progressService } from "../services/ProgressService";
import { Chapter, ProgressDto, SubChapter, SubTopic } from "../types";

export const useProgress = (isAuthenticated: boolean) =>
  useQuery<ProgressDto>({
    queryKey: ["progress"],
    queryFn: progressService.getProgress,
    enabled: isAuthenticated,
  });

export const useChapter = (textbookId: number, isAuthenticated: boolean) =>
  useQuery<Chapter[]>({
    queryKey: ["chapter", textbookId],
    queryFn: () => contentService.getChapters(textbookId),
    enabled: isAuthenticated && !!textbookId,
  });

export const useSubChapter = (chapterId: number, isAuthenticated: boolean) =>
  useQuery<SubChapter[]>({
    queryKey: ["subChapters", chapterId],
    queryFn: () => contentService.getSubChapters(chapterId),
    enabled: isAuthenticated,
  });

export const useSubTopic = (subChapterId: number, isAuthenticated: boolean) =>
  useQuery<SubTopic[]>({
    queryKey: ["subTopics", subChapterId],
    queryFn: () => contentService.getSubtopics(subChapterId),
    enabled: isAuthenticated,
  });
