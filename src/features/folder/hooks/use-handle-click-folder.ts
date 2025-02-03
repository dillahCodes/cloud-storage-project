import useUser from "@/features/auth/hooks/use-user";
import useBreadcrumbSetState from "@/features/breadcrumb/hooks/use-breadcrumb-setstate";
import useDetectLocation from "@/hooks/use-detect-location";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootFolderGetData, SubFolderGetData } from "../folder";
import { resetFolderOptions, setFolderOptionsFolderData } from "../slice/folder-options-slice";
import { MappingFolderType, mappingFolderTypeSelector } from "../slice/mapping-folder-type-slice";

interface AdjustFloatingPositionParams {
  folderData: RootFolderGetData | SubFolderGetData;
  folderMappingType: MappingFolderType;
  currentScrollHeight: number;
}

interface HandleListMappingOverFlow {
  parentElement: HTMLElement;
  floatingElement: HTMLElement;
  currentScrollHeight: number;
}

interface HandleGridMappingOverFlow {
  floatingElement: HTMLElement;
  parentRect: DOMRect;
  floatingRect: DOMRect;
}

/**
 * Handles the overflow of the folder options floating element in the grid mapping type
 * by adjusting its position to either the left or right of the parent element based on
 * whether the parent element is overflowing to the left or not.
 *
 * @param {HTMLElement} floatingElement - The floating element to adjust
 * @param {DOMRect} floatingRect - The bounding rectangle of the floating element
 * @param {DOMRect} parentRect - The bounding rectangle of the parent element
 */
const handleGridMappingOverflow = ({ floatingElement, floatingRect, parentRect }: HandleGridMappingOverFlow) => {
  const isOverflowLeft = floatingRect.left < parentRect.left;

  // Reset all positions first
  floatingElement.classList.remove("right-0", "left-[-90px]", "min-w-max", "h-0", "opacity-100", "h-auto");

  isOverflowLeft
    ? floatingElement.classList.add("opacity-100", "left-[-90px]", "min-w-max", "h-auto")
    : floatingElement.classList.add("opacity-100", "right-0", "min-w-max", "h-auto");
};

/**
 * Handles the overflow of the folder options floating element in the list mapping type
 * by adjusting its position to either the top or bottom of the parent element based on
 * whether the parent element is overflowing to the bottom or not.
 *
 * @param {HTMLElement} floatingElement - The floating element to adjust
 * @param {HTMLElement} parentElement - The parent element of the floating element
 * @param {number} currentScrollHeight - The current scroll height of the parent element
 */
const handleListMappingOverflow = ({ currentScrollHeight, floatingElement, parentElement }: HandleListMappingOverFlow) => {
  const isElOverflowBottom: boolean = parentElement.scrollHeight > currentScrollHeight;

  floatingElement.classList.remove("right-0", "min-w-max", "h-0", "opacity-100", "h-auto");

  isElOverflowBottom
    ? floatingElement.classList.add("opacity-100", "min-w-max", "h-auto", "-top-[160px]")
    : floatingElement.classList.add("opacity-100", "right-5", "h-auto");
};

/**
 * Adjust the position of the floating element based on the folder mapping type
 * and the position of the parent container and floating element.
 *
 * @param {AdjustFloatingPositionParams} params - The parameters of the function
 * @returns {() => void} A function that clears the timeout
 */
const adjustFloatingPosition = ({ currentScrollHeight, folderMappingType, folderData }: AdjustFloatingPositionParams) => {
  const timeoutId = setTimeout(() => {
    // Get parent container and floating element
    const parentContainerLayout: HTMLElement | null = document.getElementById("container-main-layout");
    const floatingEL: HTMLElement | null = document.getElementById(`folder-options-floating-element-${folderData.folder_id}`);

    if (!floatingEL || !parentContainerLayout) return;

    // Get bounding rect element
    const parentRect = parentContainerLayout.getBoundingClientRect();
    const floatingRect = floatingEL.getBoundingClientRect();

    if (folderMappingType === "list") {
      handleListMappingOverflow({
        floatingElement: floatingEL,
        parentElement: parentContainerLayout,
        currentScrollHeight,
      });
      return;
    }

    if (folderMappingType === "grid") {
      handleGridMappingOverflow({
        floatingElement: floatingEL,
        floatingRect,
        parentRect,
      });
    }
  }, 0);

  return () => clearTimeout(timeoutId);
};

const useHandleClickFolder = () => {
  /**
   * hooks
   */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [params] = useState<string | null>(searchParams.get("st"));

  /**
   * states
   */
  const { user } = useUser();
  const { mappingFolderType } = useSelector(mappingFolderTypeSelector);
  const [folderScrollHeight, setFolderScrollHeight] = useState<number>(0);

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

  /**
   * get current folder scroll height
   */
  useEffect(() => {
    const handleSetScrollHeight = () => {
      const parentFolderLayout: HTMLElement | null = document.getElementById("container-main-layout");
      if (!parentFolderLayout) return;

      setFolderScrollHeight(parentFolderLayout.scrollHeight);
    };

    handleSetScrollHeight();
  }, []);

  /**
   * handle click
   * root folder (my-storage)
   */
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

  /**
   * handle click sub folder
   *
   */
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

  /**
   * handle click shared with me folder
   */
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

  /**
   * handle starred folder
   */
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
      dispatch(setFolderOptionsFolderData(folder));
      adjustFloatingPosition({ currentScrollHeight: folderScrollHeight, folderData: folder, folderMappingType: mappingFolderType });
    },
    [dispatch, folderScrollHeight, mappingFolderType]
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
      dispatch(setFolderOptionsFolderData(folder));
    },
    [dispatch]
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
