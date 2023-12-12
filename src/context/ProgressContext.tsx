import { createContext, ReactNode, useState } from "react";
import { progressService } from "../services/ProgressService";
import { Chapter, Progress, ProgressDto, SubChapter, SubTopic } from "../types";
import { useProgress, useProgressSave } from "../common/queries";
import { contentService } from "../services/ContentService";
import { useAuth0 } from "@auth0/auth0-react";

export type ProgressContextType = {
  selectedTextbookIds: number[];
  setSelectedTextbookIds: (materialIds: number[]) => void;
  selectedChapters: Chapter[];
  setSelectedChapters: (chapters: Chapter[]) => void;
  selectedSubChapters: SubChapter[];
  setSelectedSubChapters: (subChapters: SubChapter[]) => void;
  selectedSubTopics: SubTopic[];
  setSelectedSubTopics: (subTopics: SubTopic[]) => void;
  saveProgress: () => void;
  saveProgressFromPicker: (textbookIdsFromPicker?: number[]) => void;
  progress: Progress | undefined;
  progressError: unknown;
};

type ProgressProviderProps = {
  children: ReactNode;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export const ProgressProvider = ({ children }: ProgressProviderProps) => {
  const { isAuthenticated } = useAuth0();

  const [selectedTextbookIds, setSelectedTextbookIds] = useState<number[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<Chapter[]>([]);
  const [selectedSubChapters, setSelectedSubChapters] = useState<SubChapter[]>(
    []
  );
  const [selectedSubTopics, setSelectedSubTopics] = useState<SubTopic[]>([]);

  // maybe we turn all these states into a useMemo that watches progress
  const initializeProgress = async (data: ProgressDto) => {
    const {
      selectedTextbookIds,
      chapterProgress,
      subchapterProgress,
      subtopicProgress,
    } = data;

    const completedChapters = await contentService.getChaptersByIds(
      chapterProgress
    );

    const completedSubChapters = await contentService.getSubChaptersByIds(
      subchapterProgress
    );

    const completedSubTopics = await contentService.getSubTopicsByIds(
      subtopicProgress
    );

    setSelectedTextbookIds(selectedTextbookIds);
    setSelectedChapters(completedChapters);
    setSelectedSubChapters(completedSubChapters);
    setSelectedSubTopics(completedSubTopics);
  };

  const { data: progress, error: progressError } = useProgress(
    isAuthenticated,
    initializeProgress
  );

  const formatProgressForSave = (
    textbookIdsFromPicker?: number[]
  ): Progress => {
    const chapterIds = selectedChapters.map((c) => c.id);
    const subChapterIds = selectedSubChapters.map((c) => c.id);
    const subTopicIds = selectedSubTopics.map((c) => c.id);
    const updatedProgress: Progress = textbookIdsFromPicker
      ? {
          selectedTextbookIds: textbookIdsFromPicker,
          chapterProgress: chapterIds,
          subchapterProgress: subChapterIds,
          subtopicProgress: subTopicIds,
        }
      : {
          selectedTextbookIds,
          chapterProgress: chapterIds,
          subchapterProgress: subChapterIds,
          subtopicProgress: subTopicIds,
        };
    return updatedProgress;
  };

  const saveProgress = () => {
    const updatedProgress = formatProgressForSave();
    progressService.updateProgress(updatedProgress);
  };

  const SaveProgressFromPicker = (textbookIdsFromPicker?: number[]) => {
    const updatedProgress = formatProgressForSave(textbookIdsFromPicker);
    // progressService.updateProgress(updatedProgress);
    useProgressSave().mutate(updatedProgress);
  };

  return (
    <ProgressContext.Provider
      value={{
        selectedTextbookIds,
        setSelectedTextbookIds,
        selectedChapters,
        setSelectedChapters,
        selectedSubChapters,
        setSelectedSubChapters,
        selectedSubTopics,
        setSelectedSubTopics,
        saveProgress,
        saveProgressFromPicker: SaveProgressFromPicker,
        progress,
        progressError,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;
