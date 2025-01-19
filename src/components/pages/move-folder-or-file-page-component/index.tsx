import useDekstopUserNotAllowed from "@/features/move-folder-or-file/hooks/use-dekstop-user-not-allowed";
import useGetFilesForMoveFolderOrFile from "@/features/move-folder-or-file/hooks/use-get-files-for-move-folder-or-file";
import useGetFoldersForMoveFolderOrFile from "@/features/move-folder-or-file/hooks/use-get-folders-for-move-folder-or-file";
import useGetMobileMovePermissionFolder from "@/features/move-folder-or-file/hooks/use-get-mobile-move-permission-folder";
import useGetMoveMobileStateFromLocalStorage from "@/features/move-folder-or-file/hooks/use-get-move-mobile-state-from-localstorage";
import useGetParentFolderData from "@/features/move-folder-or-file/hooks/use-get-parent-folder-data-move-folder-or-file";
import useListenMovePageMobileLocationChange from "@/features/move-folder-or-file/hooks/use-listen-move-page-mobile-location-change";
import useMobileMovePermissionPage from "@/features/move-folder-or-file/hooks/use-mobile-move-permission-page";
import useSaveMobileMoveStateToLocalStorage from "@/features/move-folder-or-file/hooks/use-save-mobile-move-state-to-localstorage";
import { mobileMoveSelector } from "@/features/move-folder-or-file/slice/mobile-move-slice";
import { moveFoldersAndFilesDataSelector } from "@/features/move-folder-or-file/slice/move-folders-and-files-data-slice";
import useDetectLocation from "@/hooks/use-detect-location";
import useMobileHeaderTitle from "@/hooks/use-mobile-header-title";
import FolderEmpty from "@components/layout/folder/empty";
import MainLayout from "@components/layout/main-layout";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import MappingFiles from "./mapping-files";
import MappingFolders from "./mapping-folders";
import MoveButtonInfo from "./move-button-info";

const MoveFolderOrFilePageComponent = () => {
  useMobileHeaderTitle("Select Destination");

  /**
   * location detect
   */
  const { isRootMoveFolderOrFileLocation } = useDetectLocation();

  /**
   * folder and files state
   */
  const { filesData, foldersData } = useSelector(moveFoldersAndFilesDataSelector);
  const isEmpty = useMemo(() => (!foldersData || foldersData.length === 0) && (!filesData || filesData.length === 0), [foldersData, filesData]);

  /**
   * mobile move state
   */
  const { moveFromLocationPath } = useSelector(mobileMoveSelector);

  /**
   * dektop or tablet device not allowed open the move page
   */
  useDekstopUserNotAllowed();

  /**
   * listen next location change
   * if not in move page, reset move state and remove from local storage
   */
  useListenMovePageMobileLocationChange();

  /**
   * get state from local if missing
   */
  useGetMoveMobileStateFromLocalStorage();

  /**
   * save state if updated
   */
  useSaveMobileMoveStateToLocalStorage();

  /**
   * fetch parent folder data
   */
  useGetParentFolderData();

  /**
   * Get folder permisiion
   */
  const { isGetPermissionSuccess, permissions } = useGetMobileMovePermissionFolder();

  /**
   * validate permission
   */
  useMobileMovePermissionPage({ isGetPermissionSuccess, permissions, moveFromLocationPath });

  /**
   * conditions can get file and folder
   */
  const canFetchFileAndFolder = useMemo(() => {
    return (isGetPermissionSuccess && permissions.canCRUD) || isRootMoveFolderOrFileLocation;
  }, [isGetPermissionSuccess, permissions.canCRUD, isRootMoveFolderOrFileLocation]);

  /**
   * get folders and files
   */
  useGetFoldersForMoveFolderOrFile({ shouldFetch: canFetchFileAndFolder });
  useGetFilesForMoveFolderOrFile({ shouldFetch: canFetchFileAndFolder });

  return (
    <MainLayout withBreadcrumb={false} showAddButton={false} showPasteButton>
      <MoveButtonInfo />

      {isEmpty ? <FolderEmpty isMoveFolderOrFile /> : null}
      <MappingFolders />
      <MappingFiles />
    </MainLayout>
  );
};
export default MoveFolderOrFilePageComponent;
