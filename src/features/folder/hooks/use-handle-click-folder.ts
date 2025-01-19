import useUser from "@/features/auth/hooks/use-user";
import useBreadcrumbSetState from "@/features/breadcrumb/hooks/use-breadcrumb-setstate";
import useDetectLocation from "@/hooks/use-detect-location";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootFolderGetData, SubFolderGetData } from "../folder";
import { resetFolderOptions, setFolderOptionsFolderData } from "../slice/folder-options-slice";
import { folderPermissionSelector } from "../slice/folder-permission-slice";
import { message } from "antd";

const useHandleClickFolder = () => {
  /**
   * hooks
   */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * states
   */
  const { subFolderPermission } = useSelector(folderPermissionSelector);
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const [params] = useState<string | null>(searchParams.get("st"));

  /**
   * set state
   */
  const { addItemBreadcrumb } = useBreadcrumbSetState();

  /**
   * condition
   */
  const isSubFolder = useMemo(() => ["shared-with-me", "my-storage"].includes(searchParams.get("st") ?? ""), [searchParams]);
  const { isSharedWithMeLocation, isStarredLocation } = useDetectLocation();
  const { isTabletDevice, isDesktopDevice } = useGetClientScreenWidth();

  const adjustFloatingPosition = useCallback((folder: RootFolderGetData | SubFolderGetData) => {
    setTimeout(() => {
      // get container parent and floating element
      const parentContainerLayout: HTMLElement | null = document.getElementById("container-main-layout");
      const floatingEL: HTMLElement | null = document.getElementById(`folder-options-floating-element-${folder.folder_id}`);

      if (!floatingEL || !parentContainerLayout) return;

      // get bounding rect element
      const parentRect = parentContainerLayout.getBoundingClientRect();
      const floatingRect = floatingEL.getBoundingClientRect();

      // logic for overflow
      const isElOverflowLeft: boolean = floatingRect.left < parentRect.left;
      floatingEL.classList.remove("right-0", "-right-40", "h-0", "opacity-100", "h-auto");

      isElOverflowLeft ? floatingEL.classList.add("opacity-100", "h-auto", "-left-24") : floatingEL.classList.add("opacity-100", "right-0", "h-auto");
    }, 0);
  }, []);

  const handleClickRootFolder = useCallback(
    (folder: RootFolderGetData) => {
      const path = `/storage/folders/${folder.folder_id}?st=my-storage`;
      addItemBreadcrumb({
        key: folder.folder_id,
        label: folder.folder_name,
        path,
        icon: "folder",
      });
      navigate(path);
    },
    [addItemBreadcrumb, navigate]
  );

  const handleClickSubFolder = useCallback(
    (folder: SubFolderGetData) => {
      if (!params) return;

      const path = `/storage/folders/${folder.folder_id}?st=${params}`;
      navigate(path);
      addItemBreadcrumb({
        key: folder.folder_id,
        label: folder.folder_name,
        path,
        icon: "folder",
      });
    },
    [addItemBreadcrumb, navigate, params]
  );

  const handleClickSharedWithMeFolder = useCallback(
    (folder: SubFolderGetData | RootFolderGetData) => {
      navigate(`/storage/folders/${folder.folder_id}?st=shared-with-me`);
      addItemBreadcrumb({
        key: folder.folder_id,
        label: folder.folder_name,
        path: `/storage/folders/${folder.folder_id}?st=shared-with-me`,
        icon: "folder",
      });
    },
    [addItemBreadcrumb, navigate]
  );

  const handleClickStarredFolder = (folder: SubFolderGetData | RootFolderGetData) => {
    if (!user) return;

    const isOwnerRootFolder = folder.root_folder_user_id === user.uid;
    const param: NestedBreadcrumbType = isOwnerRootFolder ? "my-storage" : "shared-with-me";

    navigate(`/storage/folders/${folder.folder_id}?st=${param}`);
    addItemBreadcrumb({
      key: folder.folder_id,
      label: folder.folder_name,
      path: `/storage/folders/${folder.folder_id}?st=${param}`,
      icon: "folder",
    });
  };

  const handleOpenDektopFolderSettings = useCallback(
    (folder: SubFolderGetData | RootFolderGetData) => {
      if (subFolderPermission && !subFolderPermission.canCRUD) {
        message.open({
          type: "error",
          content: "Access Denied: The folder is read-only.",
          className: "font-archivo text-sm",
          key: "folder-move-error-message",
        });
        return;
      }
      dispatch(setFolderOptionsFolderData(folder));
      adjustFloatingPosition(folder);
    },
    [dispatch, adjustFloatingPosition, subFolderPermission]
  );

  const handleClickFolder = (folder: RootFolderGetData | SubFolderGetData, e: React.MouseEvent<HTMLElement>) => {
    const isOptionsButtonClicked = Boolean((e.target as HTMLElement).closest("#folder-options"));
    const isOptionsButtonInDektopFolderClicked = (isDesktopDevice || isTabletDevice) && isOptionsButtonClicked;

    if (isOptionsButtonInDektopFolderClicked) {
      handleOpenDektopFolderSettings(folder);
      return;
    }

    if (isSubFolder) return handleClickSubFolder(folder as SubFolderGetData);
    if (isStarredLocation) return handleClickStarredFolder(folder as RootFolderGetData);
    if (isSharedWithMeLocation) return handleClickSharedWithMeFolder(folder as RootFolderGetData);
    return handleClickRootFolder(folder as RootFolderGetData);
  };

  const handleClickMobileFolderOptions = useCallback(
    (folder: SubFolderGetData | RootFolderGetData, e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      if (subFolderPermission && !subFolderPermission.canCRUD) {
        message.open({
          type: "error",
          content: "Access Denied: The folder is read-only.",
          className: "font-archivo text-sm",
          key: "folder-move-error-message",
        });
        return;
      }
      dispatch(setFolderOptionsFolderData(folder));
    },
    [dispatch, subFolderPermission]
  );

  const handleCloseDrawerFolderMobileOptions = useCallback(
    (e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => {
      e.stopPropagation();
      dispatch(resetFolderOptions());
    },
    [dispatch]
  );

  return {
    handleClickFolder,
    handleClickMobileFolderOptions,
    handleCloseDrawerFolderMobileOptions,
  };
};

export default useHandleClickFolder;
