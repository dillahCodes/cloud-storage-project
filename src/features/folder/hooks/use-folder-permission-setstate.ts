import { useDispatch } from "react-redux";
import {
  resetStateFolderPermission,
  setDetailsFolderPermission,
  setFetchStatus,
  setIsRootFolder,
  setSubFolderPermission,
} from "../slice/folder-permission-slice";
import { useCallback, useEffect } from "react";

interface UseFolderPermissionSetState {
  withUseEffect?: {
    rootFolder?: {
      data: boolean;
    };

    subFolder?: {
      data: FolderPermission;
    };

    detailsFolder?: {
      data: FolderPermission;
    };

    statusFetch?: {
      CollaboratorsFetchStatus: FetchPermissionStatus;
      GeneralAccessFetchStatus: FetchPermissionStatus;
    };

    setIsRoot?: boolean;
  };
}

const useFolderPermissionSetState = ({ withUseEffect }: UseFolderPermissionSetState) => {
  const dispatch = useDispatch();

  const setIsRootFolderPermissionState = useCallback(
    (data: boolean) => dispatch(setIsRootFolder(data)),
    [dispatch]
  );
  const setSubFolderPermissionState = useCallback(
    (data: FolderPermission) => dispatch(setSubFolderPermission(data)),
    [dispatch]
  );
  const setDetailsFolderPermissionState = useCallback(
    (data: FolderPermission) => dispatch(setDetailsFolderPermission(data)),
    [dispatch]
  );
  const resetState = useCallback(() => dispatch(resetStateFolderPermission()), [dispatch]);

  // root folder permission
  useEffect(() => {
    withUseEffect?.rootFolder && setIsRootFolderPermissionState(withUseEffect.rootFolder.data);
  }, [setIsRootFolderPermissionState, withUseEffect?.rootFolder]);

  // sub folder permission
  useEffect(() => {
    withUseEffect?.subFolder && setSubFolderPermissionState(withUseEffect.subFolder.data);
  }, [setSubFolderPermissionState, withUseEffect?.subFolder]);

  // details folder permission
  useEffect(() => {
    withUseEffect?.detailsFolder && setDetailsFolderPermissionState(withUseEffect.detailsFolder.data);
  }, [setDetailsFolderPermissionState, withUseEffect?.detailsFolder]);

  // status fetch
  useEffect(() => {
    withUseEffect?.statusFetch && dispatch(setFetchStatus(withUseEffect.statusFetch));
  }, [dispatch, withUseEffect?.statusFetch]);

  useEffect(() => {
    withUseEffect?.setIsRoot && setIsRootFolderPermissionState(true);

    return () => {
      withUseEffect?.setIsRoot && setIsRootFolderPermissionState(false);
    };
  }, [setIsRootFolderPermissionState, withUseEffect?.setIsRoot]);

  return {
    setIsRootFolderPermissionState,
    setSubFolderPermissionState,
    setDetailsFolderPermissionState,
    resetState,
  };
};

export default useFolderPermissionSetState;
