import { fileOptionsSelector } from "@/features/file/slice/file-options-slice";
import { folderPermissionSelector } from "@/features/folder/slice/folder-permission-slice";
import { parentFolderSelector } from "@/features/folder/slice/parent-folder-slice";
import {
  dekstopMoveSetFileData,
  openModal,
  setMoveParentFolderId,
  setMoveParentFolderLocationData,
} from "@/features/move-folder-or-file/slice/dekstop-move-slice";
import {
  setMobileMoveFileId,
  setMobileMoveFileName,
  setMobileMoveFileType,
  setMobileMoveFromLocationPath,
} from "@/features/move-folder-or-file/slice/mobile-move-slice";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { message } from "antd";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const useHandleActionMoveFile = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const parentFolderState = useSelector(parentFolderSelector);
  const { activeFileData } = useSelector(fileOptionsSelector);
  const { isMobileDevice, isDesktopDevice, isTabletDevice } = useGetClientScreenWidth();
  const { subFolderPermission } = useSelector(folderPermissionSelector);

  /**
   * handle for mobile device
   */
  const prepareForMobileDevice = useCallback(() => {
    if (subFolderPermission && !subFolderPermission.canCRUD) {
      message.open({
        type: "error",
        content: "You don't have permission to move this file.",
        className: "font-archivo text-sm",
        key: "file-move-error-message",
      });
      return;
    }

    if (!activeFileData) {
      message.open({
        type: "error",
        content: "File not found.",
        className: "font-archivo text-sm",
        key: "file-move-error-message",
      });
      return;
    }

    const fullPath = `${location.pathname}${location.search}`;
    const isSharedWithMeLocation = searchParams.get("st") === "shared-with-me";

    /**
     * set file data to move state
     */
    dispatch(setMobileMoveFileId(activeFileData.file_id));
    dispatch(setMobileMoveFileName(activeFileData.file_name));
    dispatch(setMobileMoveFileType(activeFileData.file_type));

    /**
     * save from location path
     */
    dispatch(setMobileMoveFromLocationPath(fullPath));

    /**
     * navigate to move page
     */
    isSharedWithMeLocation
      ? navigate(`/storage/folder/move?parentId=${parentFolderState.parentFolderData?.folder_id}&st=shared-with-me`)
      : navigate(`/storage/folder/move?st=my-storage`);
  }, [location, subFolderPermission, searchParams, dispatch, activeFileData, parentFolderState, navigate]);

  /**
   * handle for desktop device
   */
  const prepareForDekstopDevice = useCallback(() => {
    if (subFolderPermission && !subFolderPermission.canCRUD) {
      message.open({
        type: "error",
        content: "You don't have permission to move this file.",
        className: "font-archivo text-sm",
        key: "file-move-error-message",
      });
      return;
    }

    if (!activeFileData) {
      message.open({
        type: "error",
        content: "File not found.",
        className: "font-archivo text-sm",
        key: "file-move-error-message",
      });
      return;
    }

    dispatch(openModal());
    dispatch(setMoveParentFolderId(parentFolderState.parentFolderData?.folder_id || null));
    dispatch(
      setMoveParentFolderLocationData({
        locationParentFolderId: parentFolderState.parentFolderData?.folder_id || null,
        locationParentFolderName: parentFolderState.parentFolderData?.folder_name || "my storage",
      })
    );
    dispatch(
      dekstopMoveSetFileData({
        fileId: activeFileData.file_id,
        fileName: activeFileData.file_name,
        fileType: activeFileData.file_type,
      })
    );
  }, [dispatch, subFolderPermission, activeFileData, parentFolderState]);

  /**
   * triger when button file menu (move) click
   */
  const handleMoveFile = useCallback(() => {
    if (isDesktopDevice || isTabletDevice) prepareForDekstopDevice();
    if (isMobileDevice) prepareForMobileDevice();
  }, [isDesktopDevice, isTabletDevice, isMobileDevice, prepareForDekstopDevice, prepareForMobileDevice]);

  return { handleMoveFile };
};

export default useHandleActionMoveFile;
