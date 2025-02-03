import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveFileData } from "../slice/file-options-slice";
import { MappingFileType, mappingFileTypeSelector } from "../slice/mapping-file-type-slice";

interface HandleClickFileOptionsParams {
  e: React.MouseEvent<HTMLDivElement>;
  fileData: SubFileGetData | RootFileGetData;
}

interface HandleMappingOvervlowParams {
  parentElement: HTMLElement;
  floatingElement: HTMLElement;
  currentScrollHeight: number;
}

interface PrepareForDektopClickParams {
  fileData: SubFileGetData | RootFileGetData;
  currentScrollHeight: number;
}

interface AdjustFloatingPositionParams {
  fileData: SubFileGetData | RootFileGetData;
  fileMappingType: MappingFileType;
  currentScrollHeight: number;
}

interface HandleGridMappingOverFlow {
  floatingElement: HTMLElement;
  parentRect: DOMRect;
  floatingRect: DOMRect;
}

/**
 * Handles the overflow of the file options floating element in the list mapping type
 * by adjusting its position to either the top or bottom of the parent element based on
 * whether the parent element is overflowing or not.
 *
 * @param {HTMLElement} floatingElement - The floating element to adjust
 * @param {HTMLElement} parentElement - The parent element of the floating element
 * @param {number} currentScrollHeight - The current scroll height of the parent element
 */
const handleListMappingOverflow = ({ floatingElement, parentElement, currentScrollHeight }: HandleMappingOvervlowParams) => {
  const isElOverflowBottom: boolean = parentElement.scrollHeight > currentScrollHeight;

  floatingElement.classList.remove("right-0", "min-w-max", "h-0", "opacity-100", "h-auto");

  isElOverflowBottom
    ? floatingElement.classList.add("opacity-100", "min-w-max", "h-auto", "-top-[160px]")
    : floatingElement.classList.add("opacity-100", "right-5", "h-auto");
};

/**
 * Adjust the position of the floating element based on the grid mapping type
 * and the position of the parent container and floating element.
 *
 * @param {HTMLElement} floatingElement - The floating element to adjust
 * @param {DOMRect} parentRect - The bounding rectangle of the parent container
 * @param {DOMRect} floatingRect - The bounding rectangle of the floating element
 */
function handleGridMappingOverflow({ floatingElement, floatingRect, parentRect }: HandleGridMappingOverFlow) {
  const isOverflowLeft = floatingRect.left < parentRect.left;

  // Reset all positions first
  floatingElement.classList.remove("right-0", "left-[-90px]", "min-w-max", "h-0", "opacity-100", "h-auto");

  isOverflowLeft
    ? floatingElement.classList.add("opacity-100", "left-[-90px]", "min-w-max", "h-auto")
    : floatingElement.classList.add("opacity-100", "right-0", "h-auto");
}

/**
 * Adjust the position of the floating element based on the file mapping type
 * and the position of the parent container and floating element.
 * @param {SubFileGetData | RootFileGetData} fileData
 * @param {MappingFileType} fileMappingType
 * @returns {() => void} A function that clears the timeout
 */
const adjustFloatingPosition = ({ fileData, fileMappingType, currentScrollHeight }: AdjustFloatingPositionParams) => {
  const timeoutId = setTimeout(() => {
    // Get parent container and floating element
    const parentContainerLayout: HTMLElement | null = document.getElementById("container-main-layout");
    const floatingEL: HTMLElement | null = document.getElementById(`file-options-floating-element-${fileData.file_id}`);

    if (!floatingEL || !parentContainerLayout) return;

    // Get bounding rect element
    const parentRect = parentContainerLayout.getBoundingClientRect();
    const floatingRect = floatingEL.getBoundingClientRect();

    if (fileMappingType === "list") {
      handleListMappingOverflow({
        floatingElement: floatingEL,
        parentElement: parentContainerLayout,
        currentScrollHeight,
      });
      return;
    }

    if (fileMappingType === "grid") {
      handleGridMappingOverflow({
        floatingElement: floatingEL,
        floatingRect,
        parentRect,
      });
    }
  }, 0);

  return () => clearTimeout(timeoutId);
};

const useHandleClickFile = () => {
  const dispatch = useDispatch();

  const { mappingFileType: mappingType } = useSelector(mappingFileTypeSelector);

  const { isDesktopDevice } = useGetClientScreenWidth();
  const [fileScrollHeight, setFileScrollHeight] = useState<number>(0);

  useEffect(() => {
    const handleSetScrollHeight = () => {
      const parentFileLayout: HTMLElement | null = document.getElementById("container-main-layout");
      if (!parentFileLayout) return;

      setFileScrollHeight(parentFileLayout.scrollHeight);
    };

    handleSetScrollHeight();
  }, []);

  /**
   * helper: prepare for dektop click
   */
  const handlePrepareForDektopClick = useCallback(
    ({ fileData, currentScrollHeight }: PrepareForDektopClickParams) => {
      adjustFloatingPosition({ fileData, fileMappingType: mappingType, currentScrollHeight });
    },
    [mappingType]
  );

  const handleClickFileOptions = useCallback(
    ({ e, fileData }: HandleClickFileOptionsParams) => {
      /**
       * disable floating element in mobile device
       */
      !isDesktopDevice && e.stopPropagation();

      isDesktopDevice && handlePrepareForDektopClick({ fileData, currentScrollHeight: fileScrollHeight });
      dispatch(setActiveFileData(fileData));
    },
    [handlePrepareForDektopClick, isDesktopDevice, fileScrollHeight, dispatch]
  );

  return {
    handleClickFileOptions,
  };
};

export default useHandleClickFile;
