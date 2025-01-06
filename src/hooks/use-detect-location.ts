import { useLocation } from "react-router-dom";

const useDetectLocation = () => {
  const location = useLocation();

  const isMystorageLocation = location.pathname === "/storage/my-storage";
  const handleDetectIsMyStorageLocation = (path: string): boolean => path === "/storage/my-storage";

  const isSharedWithMeLocation = location.pathname === "/storage/shared-with-me";
  const handleDetectIsSharedWithMeLocation = (path: string): boolean => path === "/storage/shared-with-me";

  const isMyProfileLocation = location.pathname === "/storage/profile";
  const handleDetectIsMyProfileLocation = (path: string): boolean => path === "/storage/profile";

  const isNotificationLocation = location.pathname === "/storage/notification";
  const handleDetectIsNotificationLocation = (path: string): boolean => path === "/storage/notification";

  const isRecentlyViewedLocation = location.pathname === "/storage/recently-viewed";
  const handleDetectIsRecentlyViewedLocation = (path: string): boolean => path === "/storage/recently-viewed";

  const isStarredLocation = location.pathname === "/storage/starred";
  const handleDetectIsStarredLocation = (path: string): boolean => path === "/storage/starred";

  const isTrashLocation = location.pathname === "/storage/trash";
  const handleDetectIsTrashLocation = (path: string): boolean => path === "/storage/trash";

  const isNotFoundLocation = location.pathname === "/not-found";
  const handleDetectIsNotFoundLocation = (path: string): boolean => path === "/not-found";

  const isDetailsFolderLocation = location.pathname === "/storage/folder/details/:folderId";
  const handleDetectIsDetailsFolderLocation = (path: string, folderId: string): boolean => path === `/storage/folder/details/${folderId}`;

  const isMoveFolderOrFileLocation = location.pathname === "/storage/folder/move";

  const handleDetectIsPathEqual = (path: string): boolean => location.pathname === path;

  return {
    isMystorageLocation,
    handleDetectIsMyStorageLocation,
    isMyProfileLocation,
    handleDetectIsMyProfileLocation,
    handleDetectIsPathEqual,
    isNotificationLocation,
    handleDetectIsNotificationLocation,
    isRecentlyViewedLocation,
    handleDetectIsRecentlyViewedLocation,
    isStarredLocation,
    handleDetectIsStarredLocation,
    isTrashLocation,
    handleDetectIsTrashLocation,
    isSharedWithMeLocation,
    handleDetectIsSharedWithMeLocation,
    isNotFoundLocation,
    handleDetectIsNotFoundLocation,
    isDetailsFolderLocation,
    handleDetectIsDetailsFolderLocation,
    isMoveFolderOrFileLocation,
  };
};

export default useDetectLocation;
