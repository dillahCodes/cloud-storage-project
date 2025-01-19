import { RootFolderGetData, SubFolderGetData } from "../folder/folder";

type MobileFolderOrFileMoveLocalStorageKey = "moveFolderOrFileMobile";
type DekstopFolderOrFileMoveLocalStorageKey = "moveFolderOrFileDesktop";

interface MoveFolderOrFileMobileState {
  folderId: string | null;
  folderName: string | null;

  fileId: string | null;
  fileName: string | null;
  fileType: string | null;

  moveFromLocationPath: string | null;

  moveStatus: "idle" | "loading" | "success" | "error";
  folderMoveErrorMessage: string | null;
}

interface MoveFolderOrFileFoldersAndFilesDataState {
  foldersData: RootFolderGetData[] | SubFolderGetData[] | null;
  filesData: RootFileGetData[] | SubFileGetData[] | null;
  parentFolderData: RootFolderGetData | SubFolderGetData | null;

  folderStatus: "idle" | "loading" | "succeeded" | "failed";
  fileStatus: "idle" | "loading" | "succeeded" | "failed";
  parentFolderStatus: "idle" | "loading" | "succeeded" | "failed";
}

interface DektopMovePermissionState {
  canCRUD: boolean;
  canView: boolean;
  canManageAccess: boolean;
}

interface DekstopMoveState {
  isModalOpen: boolean;
  isModalMoveButtonDisabled: boolean;

  parentFolderId: string | null;

  folderId: string | null;
  folderName: string | null;

  locationParentFolderId: string | null;
  locationParentFolderName: string | null;

  fileId: string | null;
  fileName: string | null;
  fileType: string | null;

  folderMovePermission: DektopMovePermissionState;

  dekstopMoveStatus: "idle" | "loading" | "success" | "error";
}
