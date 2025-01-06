import { useDispatch, useSelector } from "react-redux";
import { mobileMoveSelector, setMobileMoveFolderMoveErrorMessage } from "../slice/mobile-move-slice";
import { useCallback, useEffect } from "react";
import { message } from "antd";

const useMoveMobileErroMessage = () => {
  const dispatch = useDispatch();
  const { folderMoveErrorMessage } = useSelector(mobileMoveSelector);

  const handleAfterMessageClose = useCallback(() => dispatch(setMobileMoveFolderMoveErrorMessage(null)), [dispatch]);

  useEffect(() => {
    if (folderMoveErrorMessage) {
      message.open({
        type: "error",
        content: folderMoveErrorMessage,
        className: "font-archivo text-sm",
        onClose: handleAfterMessageClose,
        key: "folder-move-error-message",
      });
    }
  }, [folderMoveErrorMessage, handleAfterMessageClose]);
};

export default useMoveMobileErroMessage;
