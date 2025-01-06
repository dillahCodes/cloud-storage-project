import { history } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetMobileMoveState } from "../slice/mobile-move-slice";
import { MobileFolderOrFileMoveLocalStorageKey } from "../move-folder-or-file";

const MOBILE_MOVE_STATE_KEY: MobileFolderOrFileMoveLocalStorageKey = "moveFolderOrFileMobile";
const useListenMovePageMobileLocationChange = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const listenLocationChange = history.listen(({ location }) => {
      const isNextStillInMovePage = location.pathname.includes("/storage/folder/move");
      if (isNextStillInMovePage) return;

      dispatch(resetMobileMoveState());
      localStorage.removeItem(MOBILE_MOVE_STATE_KEY);
    });

    return () => listenLocationChange();
  }, [dispatch]);
};

export default useListenMovePageMobileLocationChange;
