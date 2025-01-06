import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import useNavigationFolderMenu from "./use-navitagiton-folder-menu";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import useDrawer from "@/hooks/use-drawer";

const useHandleNavigationFolderMenu = () => {
  const { setDrawerDesktopFolderId, setDrawerDesktopTitle, openDrawerDesktop } = useDrawer();

  const { navigateToActivity, navigateToDetails } = useNavigationFolderMenu();
  const { isDesktopDevice } = useGetClientScreenWidth();

  const handleFolderDetails = (folderData: RootFolderGetData | SubFolderGetData) => {
    if (isDesktopDevice) {
      openDrawerDesktop();
      setDrawerDesktopTitle("details");
      setDrawerDesktopFolderId(folderData.folder_id);
      return;
    }

    navigateToDetails(folderData.folder_id, folderData.parent_folder_id);
  };

  const handleFolderActivity = (folderData: RootFolderGetData | SubFolderGetData) => {
    if (isDesktopDevice) {
      openDrawerDesktop();
      setDrawerDesktopTitle("activity");
      setDrawerDesktopFolderId(folderData.folder_id);
      return;
    }

    navigateToActivity(folderData.folder_id);
  };

  return {
    handleFolderDetails,
    handleFolderActivity,
  };
};

export default useHandleNavigationFolderMenu;
