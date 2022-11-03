import { createContext, ReactNode, useState } from "react";
import { progressService } from "../services/ProgressService";

type Progress = {
  userId: number;
  selectedMaterialsIds: number[];
  subChapterProgress: number[];
};

export type ProgressContextType = {
  selectedMaterialIds: number[];
  setSelectedMaterialIds: (materialIds: number[]) => void;
  progress: Progress | null;
  setProgress: (progress: Progress | null) => void;
  fetchProgress: (userId: number) => Promise<void>;
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

  return (
    <ProgressContext.Provider
      value={{
        selectedMaterialIds,
        setSelectedMaterialIds,
        progress,
        setProgress,
        fetchProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;
