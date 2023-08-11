import { createContext, ReactNode, useState } from "react";
import { progressService } from "../services/ProgressService";
import { Chapter, Progress, ProgressDto, SubChapter, SubTopic } from "../types";
import { useProgress } from "../common/queries";
import * as immer from "immer";
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

  // this needs to be renamed to initializeProgress
  // also we need to set selectedTextbookIds here instead of in the picker
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

  const { data: progress } = useProgress(isAuthenticated, initializeProgress);

  const formatProgressForSave = (
    textbookIdsFromPicker?: number[]
  ): Progress => {
    const chapterIds = selectedChapters.map((c) => c.id);
    const subChapterIds = selectedSubChapters.map((c) => c.id);
    const subTopicIds = selectedSubTopics.map((c) => c.id);
    const modifiedProgress = progress
      ? immer.produce(progress, (draft: ProgressDto) => {
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
        })
      : {};
    const { chapterProgress, subchapterProgress, subtopicProgress } =
      modifiedProgress as ProgressDto;
    const updatedProgress: Progress = textbookIdsFromPicker
      ? {
          selectedTextbookIds: textbookIdsFromPicker,
          chapterProgress,
          subchapterProgress,
          subtopicProgress,
        }
      : {
          selectedTextbookIds,
          chapterProgress,
          subchapterProgress,
          subtopicProgress,
        };
    return updatedProgress;
  };

  const saveProgress = () => {
    const updatedProgress = formatProgressForSave();
    progressService.updateProgress(updatedProgress);
  };

  const saveProgressFromPicker = (textbookIdsFromPicker?: number[]) => {
    const updatedProgress = formatProgressForSave(textbookIdsFromPicker);
    progressService.updateProgress(updatedProgress);
  };

  // instead of initializing here, maybe do it onSuccess of the query
  // commenting this out here to check if this actually works
  // useEffect(() => {
  //   if (progress && isSuccess) {
  //     initializeProgress(progress);
  //   }
  // }, [progress, isSuccess]);

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
        saveProgressFromPicker,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;
