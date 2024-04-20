import { createContext, ReactNode, useState } from "react";
import { Chapter, Progress, ProgressDto, SubChapter, SubTopic } from "../types";
import { useProgressUpdate } from "../hooks/useProgressUpdate";

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
};

type ProgressProviderProps = {
  children: ReactNode;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export const ProgressProvider = ({ children }: ProgressProviderProps) => {
  const { saveProgress } = useProgressUpdate();

  const [selectedTextbookIds, setSelectedTextbookIds] = useState<number[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<Chapter[]>([]);
  const [selectedSubChapters, setSelectedSubChapters] = useState<SubChapter[]>(
    [],
  );
  const [selectedSubTopics, setSelectedSubTopics] = useState<SubTopic[]>([]);

  const formatProgressForSave = (
    textbookIdsFromPicker?: number[],
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

  const saveProgressFromTracker = () => {
    const updatedProgress = formatProgressForSave();
    saveProgress(updatedProgress);
  };

  const saveProgressFromPicker = (textbookIdsFromPicker?: number[]) => {
    const updatedProgress = formatProgressForSave(textbookIdsFromPicker);
    saveProgress(updatedProgress);
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
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;
