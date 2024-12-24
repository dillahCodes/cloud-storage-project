import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootFolderGetData, SubFolderGetData } from "../folder";
import useBreadcrumbSetState from "@/features/breadcrumb/hooks/use-breadcrumb-setstate";
import useDetectLocation from "@/hooks/use-detect-location";
import { auth } from "@/firebase/firebase-serices";

interface UseHandleClickFolderProps {
  isSubFolder: boolean;
  params: NestedBreadcrumbType;
}
const useHandleClickFolder = ({ isSubFolder, params }: UseHandleClickFolderProps) => {
  const { currentUser } = auth;

  const { isSharedWithMeLocation, isStarredLocation } = useDetectLocation();
  const { isTabletDevice, isMobileDevice } = useGetClientScreenWidth();
  const [mobileOpenedFolderId, setMobileOpenedFolderId] = useState<string | null>(null);

  const { addItemBreadcrumb } = useBreadcrumbSetState();

  const navigate = useNavigate();
  const { "1": setSearchParams } = useSearchParams();

  const handleIsUserClickFolderOptions = (folder: RootFolderGetData | SubFolderGetData) => {
    const timeoutId = setTimeout(() => {
      // get container parent and floating element
      const parentContainerLayout: HTMLElement | null = document.getElementById("container-main-layout");
      const floatingEL: HTMLElement | null = document.getElementById(`folder-options-floating-element-${folder.folder_id}`);

      if (!floatingEL || !parentContainerLayout) return;

      // get bounding rect element
      const parentRect = parentContainerLayout.getBoundingClientRect();
      const floatingRect = floatingEL.getBoundingClientRect();

      // logic for overflow
      const isElOverflowLeft: boolean = floatingRect.left < parentRect.left;
      // const isElOverflowRight: boolean = floatingRect.right > parentRect.right;

      if (isElOverflowLeft) {
        floatingEL.classList.toggle("right-0");
        floatingEL.classList.toggle("left-[-90px]");
        floatingEL.classList.toggle("min-w-max");
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  };

  const handleClickRootFolder = (folder: RootFolderGetData) => {
    setSearchParams({ st: params });
    addItemBreadcrumb({
      key: folder.folder_id,
      label: folder.folder_name,
      path: `/storage/folders/${folder.folder_id}?st=${params}`,
      icon: "folder",
    });
    navigate(`/storage/folders/${folder.folder_id}?st=${params}`);
  };

  const handleClickSubFolder = (folder: SubFolderGetData) => {
    setSearchParams({ st: params });
    navigate(`/storage/folders/${folder.folder_id}?st=${params}`);
    addItemBreadcrumb({
      key: folder.folder_id,
      label: folder.folder_name,
      path: `/storage/folders/${folder.folder_id}?st=${params}`,
      icon: "folder",
    });
  };

  const handleClickSharedWithMeFolder = (folder: SubFolderGetData | RootFolderGetData) => {
    navigate(`/storage/folders/${folder.folder_id}?st=shared-with-me`);
    addItemBreadcrumb({
      key: folder.folder_id,
      label: folder.folder_name,
      path: `/storage/folders/${folder.folder_id}?st=shared-with-me`,
      icon: "folder",
    });
  };

  const handleClickStarredFolder = (folder: SubFolderGetData | RootFolderGetData) => {
    if (!currentUser) return;

    const isOwnerRootFolder = folder.root_folder_user_id === currentUser.uid;
    const param: NestedBreadcrumbType = isOwnerRootFolder ? "my-storage" : "shared-with-me";

    navigate(`/storage/folders/${folder.folder_id}?st=${param}`);
    addItemBreadcrumb({
      key: folder.folder_id,
      label: folder.folder_name,
      path: `/storage/folders/${folder.folder_id}?st=${param}`,
      icon: "folder",
    });
  };

  const handleClickFolder = (folder: RootFolderGetData | SubFolderGetData, e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("#folder-options")) {
      return isMobileDevice || isTabletDevice ? setMobileOpenedFolderId(folder.folder_id) : handleIsUserClickFolderOptions(folder);
    }

    const isDrawerFolderMobileActive = mobileOpenedFolderId === folder.folder_id;
    if (isDrawerFolderMobileActive) return;

    if (isSharedWithMeLocation) return handleClickSharedWithMeFolder(folder as SubFolderGetData | RootFolderGetData);
    if (isStarredLocation) return handleClickStarredFolder(folder as SubFolderGetData | RootFolderGetData);

    if (isSubFolder) return handleClickSubFolder(folder as SubFolderGetData);
    else return handleClickRootFolder(folder as RootFolderGetData);
  };

  return { handleClickFolder, mobileOpenedFolderId, setMobileOpenedFolderId };
};

export default useHandleClickFolder;
