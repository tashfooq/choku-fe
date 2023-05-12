import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { progressService } from "../services/ProgressService";
import { Chapter, Progress, ProgressDto, SubChapter, SubTopic } from "../types";
import { useProgress } from "../common/queries";
import * as immer from "immer";
import { contentService } from "../services/ContentService";

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
};

type ProgressProviderProps = {
  children: ReactNode;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export const ProgressProvider = ({ children }: ProgressProviderProps) => {
  const { data: progress, isSuccess } = useProgress();
  const [selectedTextbookIds, setSelectedTextbookIds] = useState<number[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<Chapter[]>([]);
  const [selectedSubChapters, setSelectedSubChapters] = useState<SubChapter[]>(
    []
  );
  const [selectedSubTopics, setSelectedSubTopics] = useState<SubTopic[]>([]);
  // const [progress, setProgress] = useState<Progress | null>(null);

  const persistProgress = async (data: ProgressDto) => {
    const { chapterProgress, subchapterProgress, subtopicProgress } = data;

    console.log(chapterProgress);
    console.log(subchapterProgress);
    console.log(subtopicProgress);

    const completedChapters = await contentService.getChaptersByIds(
      chapterProgress
    );

    const completedSubChapters = await contentService.getSubChaptersByIds(
      subchapterProgress
    );

    const completedSubTopics = await contentService.getSubTopicsByIds(
      subtopicProgress
    );

    setSelectedChapters(completedChapters);
    setSelectedSubChapters(completedSubChapters);
    setSelectedSubTopics(completedSubTopics);
  };

  const saveProgress = () => {
    const chapterIds = selectedChapters.map((c) => c.id);
    const subChapterIds = selectedSubChapters.map((c) => c.id);
    const subTopicIds = selectedSubTopics.map((c) => c.id);
    const modifiedProgress = immer.produce(progress, (draft: ProgressDto) => {
      const chaptersIdsToBeAdded = chapterIds.filter(
        (id) => !draft.chapterProgress.includes(id)
      );
      const subchapterIdsToBeAdded = subChapterIds.filter(
        (id) => !draft.subchapterProgress.includes(id)
      );
      const subtopicIdsToBeAdded = subTopicIds.filter(
        (id) => !draft.subtopicProgress.includes(id)
      );
      draft.chapterProgress.push(...chaptersIdsToBeAdded);
      draft.subchapterProgress.push(...subchapterIdsToBeAdded);
      draft.subtopicProgress.push(...subtopicIdsToBeAdded);
    });
    const { chapterProgress, subchapterProgress, subtopicProgress } =
      modifiedProgress as ProgressDto;
    const updatedProgress: Progress = {
      selectedTextbookIds,
      chapterProgress,
      subchapterProgress,
      subtopicProgress,
    };
    // use react query to update progress
    progressService.updateProgress(updatedProgress);
  };

  useEffect(() => {
    if (progress && isSuccess) {
      persistProgress(progress);
    }
  }, [progress, isSuccess]);

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
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;
