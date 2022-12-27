import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { contentService } from "../services/ContentService";
import { progressService } from "../services/ProgressService";

export type Progress = {
  id?: number;
  passes?: number;
};

export type ProgressDto = {
  selectedMaterialIds: number[];
  subChapterProgress?: Progress[];
  subTopicProgress?: Progress[];
};

export type ProgressContextType = {
  selectedMaterialIds: number[];
  setSelectedMaterialIds: (materialIds: number[]) => void;
  progress: ProgressDto | null;
  setProgress: (progress: ProgressDto | null) => void;
  fetchProgress: () => Promise<ProgressDto>;
  updateProgress: (
    subChapterProgress?: Progress[],
    subTopicProgress?: Progress[]
  ) => Promise<ProgressDto>;
  filteredMaterials: any[];
};

type ProgressProviderProps = {
  children: ReactNode;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export const ProgressProvider = ({ children }: ProgressProviderProps) => {
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<number[]>([]);
  const [progress, setProgress] = useState<ProgressDto | null>(null);
  const [filteredMaterials, setFilteredMaterials] = useState([]);

  const filterMaterials = async () => {
    const textbooks = await contentService.getAllTextbooks();
    setFilteredMaterials(
      textbooks.filter((t: any) => selectedMaterialIds.includes(t.textbook_id))
    );
  };

  const fetchProgress = async () => {
    const response = await progressService.getProgress();
    // need null checks around this
    // rename to something similar in db
    const { subchapters, textbooks, user_id } = response[0];
    const test: ProgressDto = {
      selectedMaterialIds: textbooks,
      subChapterProgress: subchapters.subChapProg,
    };
    setSelectedMaterialIds(textbooks);
    setProgress(test);
    return test;
  };

  // maybe update progress should only take userId and we should update
  // subchapter and subtopic progress in useEffect
  const updateProgress = async (
    subChapterProgress?: Progress[],
    subTopicProgress?: Progress[]
  ) => {
    const object: ProgressDto = {
      selectedMaterialIds,
      subChapterProgress,
      subTopicProgress,
    };
    setProgress(object);
    progressService.updateProgress(object);
    return object;
  };

  useEffect(() => {
    if (selectedMaterialIds.length > 0) {
      filterMaterials();
    }
  }, [selectedMaterialIds]);

  return (
    <ProgressContext.Provider
      value={{
        selectedMaterialIds,
        setSelectedMaterialIds,
        progress,
        setProgress,
        fetchProgress,
        updateProgress,
        filteredMaterials,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;
