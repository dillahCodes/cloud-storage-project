import { useSelector } from "react-redux";
import { fileSelector } from "../slice/file-slice";

const useFilesState = () => {
  const filesState = useSelector(fileSelector);
  return filesState;
};

export default useFilesState;
