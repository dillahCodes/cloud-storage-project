import { useSelector } from "react-redux";
import { currentFolderSelector } from "../slice/current-folders-slice";

const useCurrentFolderState = () => {
  const currentFolderState = useSelector(currentFolderSelector);
  return currentFolderState;
};

export default useCurrentFolderState;
