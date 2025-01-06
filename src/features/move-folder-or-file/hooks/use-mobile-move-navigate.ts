import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { mobileMoveSelector, resetMobileMoveState } from "../slice/mobile-move-slice";
import { MobileFolderOrFileMoveLocalStorageKey } from "../move-folder-or-file";

const MOBILE_MOVE_STATE_KEY: MobileFolderOrFileMoveLocalStorageKey = "moveFolderOrFileMobile";

const useMobileMoveNavigate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { moveFromLocationPath } = useSelector(mobileMoveSelector);

  const handleCancelMove = () => {
    if (moveFromLocationPath) {
      navigate(moveFromLocationPath);
      dispatch(resetMobileMoveState());
      localStorage.removeItem(MOBILE_MOVE_STATE_KEY);
    } else {
      navigate("/storage/my-storage");
    }
  };

  const handleBackPrevLocation = () => navigate(-1);

  return { handleCancelMove, handleBackPrevLocation };
};

export default useMobileMoveNavigate;
