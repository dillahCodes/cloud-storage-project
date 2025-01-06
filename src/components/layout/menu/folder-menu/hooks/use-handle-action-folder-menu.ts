import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
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
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import copyToClipboard from "@/util/copy-to-clipboard";
import { message } from "antd";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ActionSelected } from "./use-folder-menu";

const useHandleActionFolderMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();

  const parentFolderState = useSelector(parentFolderSelector);
  const { isDesktopDevice, isTabletDevice, isMobileDevice } = useGetClientScreenWidth();

  const handleClipboard = async (
    folderData: RootFolderGetData | SubFolderGetData,
    setAction: React.Dispatch<React.SetStateAction<ActionSelected>>
  ) => {
    setAction("copy-link");
    const params: NestedBreadcrumbType = "shared-with-me";
    const folderId = folderData?.folder_id ?? "";

    const domain = window.location.origin;
    const url = `${domain}/storage/folders/${folderId}?st=${params}`;

    await copyToClipboard(url);
  };

  const prepareForMobileMove = useCallback(
    (folderId: string, folderName: string) => {
      const fullPath = `${location.pathname}${location.search}`;

      const isSharedWithMeLocation = searchParams.get("st") === "shared-with-me";

      dispatch(setMobileMoveFolderName(folderName));
      dispatch(setMobileMoveFolderId(folderId));
      dispatch(setMobileMoveFromLocationPath(fullPath));

      isSharedWithMeLocation
        ? navigate(`/storage/folder/move?parentId=${parentFolderState.parentFolderData?.folder_id}`)
        : navigate(`/storage/folder/move`);

      message.open({
        type: "info",
        content: "Please select a destination.",
        className: "font-archivo text-sm",
      });
    },
    [location.pathname, location.search, searchParams, dispatch, navigate, parentFolderState.parentFolderData]
  );

  const prepareForDektopMove = useCallback(
    (setAction: React.Dispatch<React.SetStateAction<ActionSelected>>, folderId: string, folderName: string) => {
      dispatch(openModal());
      dispatch(dekstopMoveSetFolderData({ folderId, folderName }));
      dispatch(
        setMoveParentFolderLocationData({
          locationParentFolderId: parentFolderState.parentFolderData?.folder_id ?? null,
          locationParentFolderName: parentFolderState.parentFolderData?.folder_name ?? null,
        })
      );

      dispatch(setMoveParentFolderId(parentFolderState.parentFolderData?.folder_id ?? null));
      setAction("move");
    },
    [dispatch, parentFolderState.parentFolderData]
  );

  const handleMoveFolder = useCallback(
    (folderId: string, folderName: string, setAction: React.Dispatch<React.SetStateAction<ActionSelected>>) => {
      if (isDesktopDevice || isTabletDevice) prepareForDektopMove(setAction, folderId, folderName);
      if (isMobileDevice) prepareForMobileMove(folderId, folderName);
    },
    [isDesktopDevice, isTabletDevice, isMobileDevice, prepareForMobileMove, prepareForDektopMove]
  );

  return { handleClipboard, handleMoveFolder };
};

export default useHandleActionFolderMenu;
