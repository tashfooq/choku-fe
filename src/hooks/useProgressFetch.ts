import { ProgressDto } from "../types";
import { useNavigate } from "react-router-dom";
import useCustomQueries from "../common/queries";
import useTextbookSelect from "./useTextbookSelect";

const useProgressFetch = (
  isAuthenticated: boolean,
): { fetchProgressInitial: () => ProgressDto | undefined } => {
  const navigate = useNavigate();
  const { setSelectedTextbooks } = useTextbookSelect();
  const { useTextbooksByIds, useProgress } = useCustomQueries();

  const onProgressError = (error: any) => {
    navigate("/picker");
  };

  // this needs to be fleshed out to hold more progress information
  const onProgressSuccess = (data: ProgressDto) => {
    if (data.selectedTextbookIds && data.selectedTextbookIds.length > 0) {
      const { data: textbooks } = useTextbooksByIds(data.selectedTextbookIds);
      setSelectedTextbooks(textbooks);
    }
  };

  const {
    data: progress,
    isError,
    error: progressError,
  } = useProgress(onProgressSuccess, onProgressError);

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
