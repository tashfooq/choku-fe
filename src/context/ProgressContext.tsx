import { createContext, ReactNode, useState } from "react";
import { progressService } from "../services/ProgressService";

type Progress = {
  userId: number;
  selectedMaterialIds: number[];
  subChapterProgress: number[];
};

export type ProgressContextType = {
  selectedMaterialIds: number[];
  setSelectedMaterialIds: (materialIds: number[]) => void;
  progress: Progress | null;
  setProgress: (progress: Progress | null) => void;
  fetchProgress: (userId: number) => Promise<void>;
  updateProgress: (userId: number, selectedMaterialIds: number[]) => void;
};

type ProgressProviderProps = {
  children: ReactNode;
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export const ProgressProvider = ({ children }: ProgressProviderProps) => {
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<number[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);

  //fetchprog -> setSelectedMaterial and setProgress
  const fetchProgress = async () => {
    const prog = await progressService.getProgress();
    console.log(prog);
    setProgress(prog);
  };

  const updateProgress = async (
    userId: number,
    subChapterProgress: number[]
  ) => {
    const object: Progress = {
      userId,
      selectedMaterialIds,
      subChapterProgress,
    };
    setProgress(object);
    // needs to be a post request here
  };

  return (
    <ProgressContext.Provider
      value={{
        selectedMaterialIds,
        setSelectedMaterialIds,
        progress,
        setProgress,
        fetchProgress,
        updateProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;
