import { useNavigate } from "react-router-dom";

const useNavigationFolderMenu = () => {
  const navigate = useNavigate();

  const navigateToDetails = (folderId: string, parentFolderId: string | null) => {
    const isRootFolder = parentFolderId === null;
    const parentParam = isRootFolder ? folderId : parentFolderId;
    navigate(`/storage/folder/details/${folderId}?parent=${parentParam}`);
  };

  const navigateToActivity = (folderId: string) => {
    navigate(`/storage/folder/activity/${folderId}`);
  };

  return {
    navigateToDetails,
    navigateToActivity,
  };
};

export default useNavigationFolderMenu;
