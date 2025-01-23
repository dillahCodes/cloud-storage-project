import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { folderPermissionSelector } from "@/features/folder/slice/folder-permission-slice";
import { parentFolderSelector } from "@/features/folder/slice/parent-folder-slice";
import {
  dekstopMoveSetFolderData,
  openModal,
  setMoveParentFolderId,
  setMoveParentFolderLocationData,
} from "@/features/move-folder-or-file/slice/dekstop-move-slice";
import {
  setMobileMoveFolderId,
  setMobileMoveFolderName,
  setMobileMoveFromLocationPath,
} from "@/features/move-folder-or-file/slice/mobile-move-slice";
import useDetectLocation from "@/hooks/use-detect-location";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import copyToClipboard from "@/util/copy-to-clipboard";
import { message } from "antd";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const useHandleActionFolderMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { subFolderPermission } = useSelector(folderPermissionSelector);
  const parentFolderState = useSelector(parentFolderSelector);
  const { isDesktopDevice, isTabletDevice, isMobileDevice } = useGetClientScreenWidth();
  const { isSubSharedWithMeLocation, isMystorageLocation, isSubMyStorageLocation } = useDetectLocation();

  /**
   * handle copy to clipboard
   */
  const handleClipboard = async (folderData: RootFolderGetData | SubFolderGetData) => {
    const params: NestedBreadcrumbType = "shared-with-me";
    const folderId = folderData?.folder_id ?? "";

    const domain = window.location.origin;
    const url = `${domain}/storage/folders/${folderId}?st=${params}`;

    await copyToClipboard(url);
  };

  /**
   * handle navigate
   */
  const handleNavigateList = useCallback(() => {
    const isMoveFromSharedSubFolder = isSubSharedWithMeLocation && parentFolderState.parentFolderData !== null;
    const isMoveFromRoot = isMystorageLocation;
    const isMoveFromSubFolder = isSubMyStorageLocation && parentFolderState.parentFolderData !== null;

    const moveActions = [
      {
        condition: isMoveFromSharedSubFolder,
        url: parentFolderState.parentFolderData
          ? `/storage/folder/move?parentId=${parentFolderState.parentFolderData.folder_id}&st=shared-with-me`
          : "",
        message: "move from shared sub folder",
      },
      {
        condition: isMoveFromRoot,
        url: `/storage/folder/move?st=my-storage`,
        message: "move from root",
      },
      {
        condition: isMoveFromSubFolder,
        url: parentFolderState.parentFolderData ? `/storage/folder/move?parentId=${parentFolderState.parentFolderData.folder_id}&st=my-storage` : "",
        message: "move from sub folder",
      },
    ];

    const findActions = moveActions.find((action) => action.condition && action.url);
    if (findActions) return findActions;

    return null;
  }, [isMystorageLocation, isSubMyStorageLocation, isSubSharedWithMeLocation, parentFolderState.parentFolderData]);

  /**
   * prepare mobile move folder
   */
  const prepareForMobileMove = useCallback(
    (folderId: string, folderName: string) => {
      if (subFolderPermission && !subFolderPermission.canCRUD) {
        message.open({
          type: "error",
          content: "You don't have permission to move this folder.",
          className: "font-archivo text-sm",
          key: "folder-move-error-message",
        });
        return;
      }

      const fullPath = `${location.pathname}${location.search}`;

      dispatch(setMobileMoveFolderName(folderName));
      dispatch(setMobileMoveFolderId(folderId));
      dispatch(setMobileMoveFromLocationPath(fullPath));

      /**
       * navigate
       */
      const findActions = handleNavigateList();
      if (findActions) {
        navigate(findActions.url);
        message.open({
          type: "info",
          content: "Please select a destination.",
          className: "font-archivo text-sm",
        });
      }
    },
    [subFolderPermission, location.pathname, location.search, dispatch, navigate, handleNavigateList]
  );

  /**
   * prepare desktop move folder
   */
  const prepareForDektopMove = useCallback(
    (folderId: string, folderName: string) => {
      if (subFolderPermission && !subFolderPermission.canCRUD) {
        message.open({
          type: "error",
          content: "You don't have permission to move this folder.",
          className: "font-archivo text-sm",
          key: "folder-move-error-message",
        });
        return;
      }

      dispatch(openModal());
      dispatch(dekstopMoveSetFolderData({ folderId, folderName }));
      dispatch(
        setMoveParentFolderLocationData({
          locationParentFolderId: parentFolderState.parentFolderData?.folder_id ?? null,
          locationParentFolderName: parentFolderState.parentFolderData?.folder_name ?? null,
        })
      );

      dispatch(setMoveParentFolderId(parentFolderState.parentFolderData?.folder_id ?? null));
    },
    [dispatch, parentFolderState.parentFolderData, subFolderPermission]
  );

  /**
   * handle move folder
   */
  const handleMoveFolder = useCallback(
    (folderId: string, folderName: string) => {
      if (isDesktopDevice || isTabletDevice) prepareForDektopMove(folderId, folderName);
      if (isMobileDevice) prepareForMobileMove(folderId, folderName);
    },
    [isDesktopDevice, isTabletDevice, isMobileDevice, prepareForMobileMove, prepareForDektopMove]
  );

  return { handleClipboard, handleMoveFolder };
};

export default useHandleActionFolderMenu;
