import { useNavigate } from "react-router-dom";

const useNavigationFolderMenu = () => {
  const navigate = useNavigate();
  const navigateToDetails = (folderId: string) => navigate(`/storage/folder/details/${folderId}`);
  const navigateToActivity = (folderId: string) => navigate(`/storage/folder/activity/${folderId}`);

  return {
    navigateToDetails,
    navigateToActivity,
  };
};

export default useNavigationFolderMenu;
