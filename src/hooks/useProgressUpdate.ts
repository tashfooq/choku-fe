import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Progress } from "../types";
import useProgressService from "./services/ProgressService";

export const useProgressUpdate = (): {
  saveProgress: (progress: Progress) => void;
} => {
  const queryClient = useQueryClient();
  const { updateProgress } = useProgressService();

  const progressMutation = useMutation({
    mutationFn: (progressPayload: Progress) => updateProgress(progressPayload),
    onSuccess: () => {
      queryClient.invalidateQueries(["progress"]);
    },
  });

  const saveProgress = (progress: Progress) => {
    progressMutation.mutate(progress);
  };

  return { saveProgress };
};
