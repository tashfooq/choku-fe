import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { progressService } from "../services/ProgressService";
import { Progress } from "../types";

export type ProgressContextType = {
  selectedTextbookIds: number[];
  setSelectedTextbookIds: (materialIds: number[]) => void;
  progress: Progress | null;
  setProgress: (progress: Progress | null) => void;
  updateProgress: (progress: Progress) => Promise<Progress>;
};

type ProgressProviderProps = {
  children: ReactNode;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export const ProgressProvider = ({ children }: ProgressProviderProps) => {
  const [selectedTextbookIds, setSelectedTextbookIds] = useState<number[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);

  const updateProgress = async (progress: Progress) => {
    // make this smarter
    setProgress(progress);
    progressService.updateProgress(progress);
    return progress;
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
