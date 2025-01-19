import { useLocation, useSearchParams } from "react-router-dom";

const useDetectLocation = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const isMystorageLocation = location.pathname === "/storage/my-storage";
  const isSubMyStorageLocation = searchParams.get("st") === "my-storage";
  const handleDetectIsMyStorageLocation = (path: string): boolean => path === "/storage/my-storage";

  const isSharedWithMeLocation = location.pathname === "/storage/shared-with-me";
  const isSubSharedWithMeLocation = searchParams.get("st") === "shared-with-me";
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
  const isSubMoveFolderOrFileLocation = !!searchParams.get("parentId");
  const isRootMoveFolderOrFileLocation = location.pathname === "/storage/folder/move" && !searchParams.get("parentId");

  const handleDetectIsPathEqual = (path: string): boolean => location.pathname === path;

  return {
    isMystorageLocation,
    isSubMyStorageLocation,
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
    isSubSharedWithMeLocation,
    handleDetectIsSharedWithMeLocation,
    isNotFoundLocation,
    handleDetectIsNotFoundLocation,
    isDetailsFolderLocation,
    handleDetectIsDetailsFolderLocation,
    isMoveFolderOrFileLocation,
    isSubMoveFolderOrFileLocation,
    isRootMoveFolderOrFileLocation,
  };
};

export default useDetectLocation;
