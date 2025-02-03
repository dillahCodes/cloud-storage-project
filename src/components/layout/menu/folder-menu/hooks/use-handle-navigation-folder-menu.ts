import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import useSecuredFolderFolderActions from "@/features/permissions/hooks/use-secured-folder-folder-actions";
import useDrawer from "@/hooks/use-drawer";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { useCallback, useState } from "react";
import useNavigationFolderMenu from "./use-navitagiton-folder-menu";

const useHandleNavigationFolderMenu = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setDrawerDesktopFolderId, setDrawerDesktopTitle, openDrawerDesktop } = useDrawer();

  const { navigateToActivity, navigateToDetails } = useNavigationFolderMenu();
  const { isDesktopDevice } = useGetClientScreenWidth();
  const { handleCheckIsUserCanDoThisAction } = useSecuredFolderFolderActions();

  const handleDekstopFolderDetails = useCallback(
    (folderData: RootFolderGetData | SubFolderGetData) => {
      openDrawerDesktop();
      setDrawerDesktopTitle("details");
      setDrawerDesktopFolderId(folderData.folder_id);
    },
    [openDrawerDesktop, setDrawerDesktopTitle, setDrawerDesktopFolderId]
  );

  const handleFolderDetails = (folderData: RootFolderGetData | SubFolderGetData) => {
    if (isDesktopDevice) return handleDekstopFolderDetails(folderData);
    navigateToDetails(folderData.folder_id);
  };

  const handleFolderActivity = async (folderData: RootFolderGetData | SubFolderGetData) => {
    try {
      if (isLoading) return;

      setIsLoading(true);
      const isValidateSecuredFolderPass = await handleCheckIsUserCanDoThisAction(folderData.folder_id, "activity");
      if (!isValidateSecuredFolderPass) return;

      if (isDesktopDevice) {
        openDrawerDesktop();
        setDrawerDesktopTitle("activity");
        setDrawerDesktopFolderId(folderData.folder_id);
        return;
      }

      navigateToActivity(folderData.folder_id);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("error opening activity", error instanceof Error ? error.message : "an unknown error occurred");
    }
  };

  return {
    handleFolderDetails,
    handleFolderActivity,
  };
};

export default useHandleNavigationFolderMenu;
