import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MobileFolderOrFileMoveLocalStorageKey } from "../move-folder-or-file";
import { mobileMoveSelector, resetMobileMoveState } from "../slice/mobile-move-slice";
import { resetMoveDataState } from "../slice/move-folders-and-files-data-slice";

const MOBILE_MOVE_STATE_KEY: MobileFolderOrFileMoveLocalStorageKey = "moveFolderOrFileMobile";

const useMobileMoveNavigate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { moveFromLocationPath } = useSelector(mobileMoveSelector);

  const handleCancelMove = () => {
    if (moveFromLocationPath) {
      navigate(moveFromLocationPath);
      dispatch(resetMobileMoveState());
      dispatch(resetMoveDataState());
      localStorage.removeItem(MOBILE_MOVE_STATE_KEY);
    } else {
      navigate("/storage/my-storage");
    }
  };

  return { handleCancelMove };
};

export default useMobileMoveNavigate;
