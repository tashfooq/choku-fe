import { ProgressDto } from "../types";
import { useNavigate } from "react-router-dom";
import useCustomQueries from "../common/queries";
import useProgressSet from "./useProgressSet";

const useProgressFetch = (): {
  fetchProgressInitial: () => ProgressDto | undefined;
} => {
  const navigate = useNavigate();

  const { useProgress } = useCustomQueries();

  const onProgressError = (error: any) => {
    console.log(error);
    navigate("/picker");
    throw error;
  };

  // setting onSuccessHandler to undefined
  const { data: progress } = useProgress(undefined, onProgressError);
  useProgressSet(progress);

  const fetchProgressInitial = () => {
    return progress;
  };
  return { fetchProgressInitial };
};

export default useProgressFetch;
