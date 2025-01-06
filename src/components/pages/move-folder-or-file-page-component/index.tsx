import useGetFilesForMoveFolderOrFile from "@/features/move-folder-or-file/hooks/use-get-files-for-move-folder-or-file";
import useGetFoldersForMoveFolderOrFile from "@/features/move-folder-or-file/hooks/use-get-folders-for-move-folder-or-file";
import useGetMoveMobileStateFromLocalStorage from "@/features/move-folder-or-file/hooks/use-get-move-mobile-state-from-localstorage";
import useGetParentFolderData from "@/features/move-folder-or-file/hooks/use-get-parent-folder-data-move-folder-or-file";
import useListenMovePageMobileLocationChange from "@/features/move-folder-or-file/hooks/use-listen-move-page-mobile-location-change";
import useSaveMobileMoveStateToLocalStorage from "@/features/move-folder-or-file/hooks/use-save-mobile-move-state-to-localstorage";
import useMobileHeaderTitle from "@/hooks/use-mobile-header-title";
import MainLayout from "@components/layout/main-layout";
import MappingFiles from "./mapping-files";
import MappingFolders from "./mapping-folders";
import MoveButtonInfo from "./move-button-info";
import useDekstopUserNotAllowed from "@/features/move-folder-or-file/hooks/use-dekstop-user-not-allowed";

const MoveFolderOrFilePageComponent = () => {
  useMobileHeaderTitle("Select Destination");

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
   * get folders and files
   */
  useGetFoldersForMoveFolderOrFile();
  useGetFilesForMoveFolderOrFile();

  return (
    <MainLayout withBreadcrumb={false} showAddButton={false} showPasteButton>
      <MoveButtonInfo />
      <MappingFolders />
      <MappingFiles />
    </MainLayout>
  );
};
export default MoveFolderOrFilePageComponent;
