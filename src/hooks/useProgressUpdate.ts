import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Progress } from "../types";
import { progressService } from "../services/ProgressService";

export const useProgressUpdate = (): {
  saveProgress: (progress: Progress) => void;
} => {
  const queryClient = useQueryClient();
  const progressMutation = useMutation({
    mutationFn: (progressPayload: Progress) =>
      progressService.updateProgress(progressPayload),
    onSuccess: () => {
      queryClient.invalidateQueries(["progress"]);
    },
  });
  const saveProgress = async (progress: Progress) => {
    await progressMutation.mutate(progress);
  };
  return { saveProgress };
};
