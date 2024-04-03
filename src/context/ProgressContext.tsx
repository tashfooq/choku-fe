import { createContext, ReactNode, useState } from "react";
import { Chapter, Progress, ProgressDto, SubChapter, SubTopic } from "../types";
import { contentService } from "../hooks/services/ContentService";
import { useAuth0 } from "@auth0/auth0-react";
import { useProgressUpdate } from "../hooks/useProgressUpdate";
import useProgressFetch from "../hooks/useProgressFetch";

export type ProgressContextType = {
  selectedTextbookIds: number[];
  setSelectedTextbookIds: (materialIds: number[]) => void;
  selectedChapters: Chapter[];
  setSelectedChapters: (chapters: Chapter[]) => void;
  selectedSubChapters: SubChapter[];
  setSelectedSubChapters: (subChapters: SubChapter[]) => void;
  selectedSubTopics: SubTopic[];
  setSelectedSubTopics: (subTopics: SubTopic[]) => void;
  saveProgressFromTracker: () => void;
  saveProgressFromPicker: (textbookIdsFromPicker?: number[]) => void;
  initializeProgress: (data: ProgressDto) => void;
  progress: Progress | undefined;
};

type ProgressProviderProps = {
  children: ReactNode;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export const ProgressProvider = ({ children }: ProgressProviderProps) => {
  const { isAuthenticated } = useAuth0();
  const { saveProgress } = useProgressUpdate();

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

  const { fetchProgressInitial } = useProgressFetch(
    isAuthenticated,
    initializeProgress
  );
  const progress = fetchProgressInitial();

  const formatProgressForSave = (
    textbookIdsFromPicker?: number[]
  ): Progress => {
    const chapterIds = selectedChapters.map((c) => c.id);
    const subChapterIds = selectedSubChapters.map((c) => c.id);
    const subTopicIds = selectedSubTopics.map((c) => c.id);
    const updatedProgress: Progress = {
      selectedTextbookIds: textbookIdsFromPicker
        ? textbookIdsFromPicker
        : selectedTextbookIds,
      chapterProgress: chapterIds,
      subchapterProgress: subChapterIds,
      subtopicProgress: subTopicIds,
    };
    return updatedProgress;
  };

  const saveProgressFromTracker = async () => {
    const updatedProgress = formatProgressForSave();
    await saveProgress(updatedProgress);
  };

  const saveProgressFromPicker = async (textbookIdsFromPicker?: number[]) => {
    const updatedProgress = formatProgressForSave(textbookIdsFromPicker);
    await saveProgress(updatedProgress);
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
        saveProgressFromTracker,
        saveProgressFromPicker,
        initializeProgress,
        progress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;
