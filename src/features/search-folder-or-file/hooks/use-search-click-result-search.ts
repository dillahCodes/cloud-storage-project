import { parentFolderSelector } from "@/features/folder/slice/parent-folder-slice";
import useDetectLocation from "@/hooks/use-detect-location";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FileSearchResult, FolderResultSearch } from "../search";
import { isFileResult } from "../search-menu";
import { resetSerchbarState, searchBarSelector } from "../slice/search-bar-slice";
import { setFromLocation, setSelectedData, setStartFinding } from "../slice/selected-search-result-selector";

const useSearchClickResultSearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedLocationName } = useSelector(searchBarSelector);
  const { parentFolderData } = useSelector(parentFolderSelector);

  const { isSubMyStorageLocation, isSubSharedWithMeLocation } = useDetectLocation();
  const { isDesktopDevice } = useGetClientScreenWidth();

  const isMyStorageLocationSearch = selectedLocationName === "my-storage";
  const isSubSharedWithMeLocationSearch = selectedLocationName === "shared-with-me";
  const isRecentLocationSearch = selectedLocationName === "recent";
  const isStarredLocationSearch = selectedLocationName === "starred";

  const isGoToRootMyStorageLocation = isMyStorageLocationSearch && !parentFolderData;
  const isGoToSubMyStorageLocation = isSubMyStorageLocation && parentFolderData && isMyStorageLocationSearch;

  const isGoToRootSharedWithMeLocation = isSubSharedWithMeLocationSearch && !parentFolderData;
  const isGoToSubSharedWithMeLocation = isSubSharedWithMeLocation && parentFolderData && isSubSharedWithMeLocationSearch;

  //   navigate to selected location and find the selected data
  const handleNavigateToSelectedLocation = useCallback(() => {
    const conditionsAndLocations = [
      { condition: isGoToRootMyStorageLocation, location: "/storage/my-storage" },
      { condition: isGoToSubMyStorageLocation, location: `/storage/folders/${parentFolderData?.folder_id}?st=my-storage` },
      { condition: isGoToRootSharedWithMeLocation, location: "/storage/shared-with-me" },
      { condition: isGoToSubSharedWithMeLocation, location: `/storage/folders/${parentFolderData?.folder_id}?st=shared-with-me` },
      { condition: isRecentLocationSearch, location: "/storage/recently-viewed" },
      { condition: isStarredLocationSearch, location: "/storage/starred" },
    ];

    const firstCondition = conditionsAndLocations.find((condition) => condition.condition)?.location;
    if (firstCondition) {
      navigate(firstCondition);
      dispatch(setStartFinding({ startFinding: true }));
    }
  }, [
    isGoToRootMyStorageLocation,
    isGoToSubMyStorageLocation,
    parentFolderData,
    isGoToRootSharedWithMeLocation,
    isGoToSubSharedWithMeLocation,
    isRecentLocationSearch,
    isStarredLocationSearch,
    navigate,
    dispatch,
  ]);

  const handleClickResultSearch = useCallback(
    (data: FileSearchResult | FolderResultSearch) => {
      const { file_id, file_name, folder_id, folder_name } = data;

      const selectedDataId = isFileResult(data) ? file_id : folder_id;
      const selectedDataName = isFileResult(data) ? file_name : folder_name;
      const selectedDataType = isFileResult(data) ? "file" : "folder";
      const fromLocation = selectedLocationName;

      dispatch(setSelectedData({ selectedDataId, selectedDataName, selectedDataType }));
      dispatch(setFromLocation({ fromLocation }));
      dispatch(resetSerchbarState());

      if (isDesktopDevice) {
        // click the input to close the search result
        const dekstopInputEl: HTMLElement | null = document.getElementById("desktop-searchbar");
        dekstopInputEl && dekstopInputEl.click();

        // click the selected result
        const selectedResultEl = document.getElementById(`search-result-${selectedDataId}`);
        selectedResultEl && selectedResultEl.click();
      }
      // navigate to selected location and find the selected data
      handleNavigateToSelectedLocation();
    },
    [dispatch, selectedLocationName, handleNavigateToSelectedLocation, isDesktopDevice]
  );

  return { handleClickResultSearch, handleNavigateToSelectedLocation };
};
export default useSearchClickResultSearch;
