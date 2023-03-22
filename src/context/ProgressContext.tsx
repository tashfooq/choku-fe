import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { progressService } from "../services/ProgressService";

export type Progress = {
  id?: number;
  passes?: number;
};

export type ProgressDto = {
  selectedTextbookIds: number[];
  subchapterProgress?: Progress[];
  subtopicProgress?: Progress[];
};

export type ProgressContextType = {
  selectedTextbookIds: number[];
  setSelectedTextbookIds: (materialIds: number[]) => void;
  progress: ProgressDto | null;
  setProgress: (progress: ProgressDto | null) => void;
  updateProgress: (
    selectedTextbookIds: number[],
    subchapterProgress?: Progress[],
    subtopicProgress?: Progress[]
  ) => Promise<ProgressDto>;
};

type ProgressProviderProps = {
  children: ReactNode;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export const ProgressProvider = ({ children }: ProgressProviderProps) => {
  const [selectedTextbookIds, setSelectedTextbookIds] = useState<number[]>([]);
  const [progress, setProgress] = useState<ProgressDto | null>(null);

  const updateProgress = async (
    selectedTextbookIds: number[],
    subchapterProgress: Progress[] = [],
    subtopicProgress: Progress[] = []
  ) => {
    const object: ProgressDto = {
      selectedTextbookIds,
      subchapterProgress,
      subtopicProgress,
    };
    // make this smarter
    // setProgress(object);
    progressService.updateProgress(object);
    return object;
  };

  return (
    <ProgressContext.Provider
      value={{
        selectedTextbookIds,
        setSelectedTextbookIds,
        progress,
        setProgress,
        updateProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;
