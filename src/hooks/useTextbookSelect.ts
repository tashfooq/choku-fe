import { useState } from "react";
import { Textbook } from "../types";

const useTextbookSelect = () => {
  const [selectedTextbooks, setSelectedTextbooks] = useState<Textbook[]>([]);

  return { selectedTextbooks, setSelectedTextbooks };
};

export default useTextbookSelect;
