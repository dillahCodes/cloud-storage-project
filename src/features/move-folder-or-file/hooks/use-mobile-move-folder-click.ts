import { useSelector } from "react-redux";
import { mobileMoveSelector } from "../slice/mobile-move-slice";
import { message } from "antd";
import { useSearchParams } from "react-router-dom";

const useMobileMoveFolderClick = () => {
  const [params, setParams] = useSearchParams();
  const { folderId: folderIdWantToMove } = useSelector(mobileMoveSelector);

  const handleClickFolder = (folderId: string) => {
    if (folderIdWantToMove === folderId) {
      message.open({
        type: "error",
        content: "You cannot move to the same folder",
        className: "font-archivo text-sm",
        key: "folder-move-error-message",
      });
      return;
    }

    setParams({ parentId: folderId, st: params.get("st") || "" });
  };

  return handleClickFolder;
};

export default useMobileMoveFolderClick;
