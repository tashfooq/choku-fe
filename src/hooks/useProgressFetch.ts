import { ProgressDto } from "../types";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../common/queries";

const useProgressFetch = (
  isAuthenticated: boolean,
  initializer: (data: ProgressDto) => void
): { fetchProgressInitial: () => ProgressDto | undefined } => {
  const navigate = useNavigate();

  const onProgressError = (error: any) => {
    navigate("/picker");
  };

  const onProgressSuccess = (data: ProgressDto) => {
    initializer(data);
  };

  const {
    data: progress,
    isError,
    error: progressError,
  } = useProgress(isAuthenticated, onProgressSuccess, onProgressError);

  const fetchProgressInitial = () => {
    if (isError) {
      console.log(progressError);
      throw progressError;
    }
    return progress;
  };
  return { fetchProgressInitial };
};

export default useProgressFetch;
