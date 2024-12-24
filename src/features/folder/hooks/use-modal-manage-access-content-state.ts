import { useSelector } from "react-redux";
import { modalManageAccessContentSelector } from "../slice/modal-manage-access-content-slice";

const useModalManageAccessContentState = () => {
  const modalManageAccessContentState = useSelector(modalManageAccessContentSelector);
  return modalManageAccessContentState;
};

export default useModalManageAccessContentState;
