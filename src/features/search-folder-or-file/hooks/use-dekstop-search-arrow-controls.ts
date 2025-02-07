import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isFileResult, isFolderResult } from "../search-menu";
import { resultSearchSelector } from "../slice/result-search-slice";
import { searchBarSelector } from "../slice/search-bar-slice";
import { selectedSearchResultSelector, setFromLocation, setSelectedData } from "../slice/selected-search-result-selector";
import useSearchClickResultSearch from "./use-search-click-result-search";

// Function to get the selected data ID
const createSelectedDataId = (data: any): string => {
  return isFileResult(data) ? data.file_id : isFolderResult(data) ? data.folder_id : "";
};

const KEY_ALLOWED = ["ArrowUp", "ArrowDown", "Enter"];

const useDekstopSearchArrowControls = () => {
  const dispatch = useDispatch();

  // redux state
  const { selectedLocationName } = useSelector(searchBarSelector);
  const selectedResultState = useSelector(selectedSearchResultSelector);
  const { data } = useSelector(resultSearchSelector);

  // hooks navigate
  const { handleClickResultSearch } = useSearchClickResultSearch();

  // empty condition
  const isEmpty = data.length === 0;

  const isSelectedResultSearchEmpty = useMemo(() => {
    const { fromLocation, selectedDataId, selectedDataName, selectedDataType } = selectedResultState;
    return !fromLocation || !selectedDataId || !selectedDataName || !selectedDataType;
  }, [selectedResultState]);

  // Get the index of the selected item
  const getSelectedIndex = useCallback(() => {
    return data.findIndex((item) => createSelectedDataId(item) === selectedResultState.selectedDataId);
  }, [data, selectedResultState]);

  // Set the first data when the component first renders
  const handleSetFirstData = useCallback(() => {
    if (isEmpty) return;
    const { resultType, file_name, folder_name } = data[0];

    const selectedDataId = createSelectedDataId(data[0]);
    const selectedDataName = resultType === "file" ? file_name : folder_name;
    const selectedDataType = resultType;
    const fromLocation = selectedLocationName;

    dispatch(setSelectedData({ selectedDataId, selectedDataName, selectedDataType }));
    dispatch(setFromLocation({ fromLocation }));
  }, [data, dispatch, isEmpty, selectedLocationName]);

  // Logic for navigating with arrow keys
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!KEY_ALLOWED.includes(event.key) || isEmpty) return;
    event.preventDefault();

    const lastIndex = data.length - 1; // Last index in the list
    const currentIndex = getSelectedIndex();
    const isArrowDown = event.key === "ArrowDown";
    const isArrowUp = event.key === "ArrowUp";
    const isEnterKey = event.key === "Enter";

    let nextIndex = currentIndex;

    // If already at the end, go back to the start
    if (isArrowDown) nextIndex = currentIndex < lastIndex ? currentIndex + 1 : 0;
    // If already at the start, go back to the end
    if (isArrowUp) nextIndex = currentIndex > 0 ? currentIndex - 1 : lastIndex;

    // Set the next selected data
    const nextSelected = data[nextIndex];
    if (!nextSelected) return;

    const selectedDataId = createSelectedDataId(nextSelected);
    const selectedDataName = nextSelected.resultType === "file" ? nextSelected.file_name : nextSelected.folder_name;
    const selectedDataType = nextSelected.resultType;
    const fromLocation = selectedLocationName;
    dispatch(setSelectedData({ selectedDataId, selectedDataName, selectedDataType }));
    dispatch(setFromLocation({ fromLocation }));

    // handle if user press enter
    if (isEnterKey) handleClickResultSearch(data[nextIndex]);
  };

  // Set the first data when the search result appears
  useEffect(() => {
    isSelectedResultSearchEmpty && handleSetFirstData();
  }, [handleSetFirstData, isSelectedResultSearchEmpty]);

  return { handleKeyDown };
};

export default useDekstopSearchArrowControls;
