import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  LocalStorageMapppingFilesKey,
  MappingFileType,
  setMappingFileType,
} from "../slice/mapping-file-type-slice";

const useMappingFileType = () => {
  /**
   * state for mapping type
   */
  const dispatch = useDispatch();
  //   const mappingFileTypeState = useSelector(mappingFileTypeSelector);

  /**
   * local storage key for mapping type
   */
  const localStorageFilesMappingTypeKey: LocalStorageMapppingFilesKey = "filesMappingType";

  /**
   * set mapping type from local storage in mount
   */
  useEffect(() => {
    const filesMappingTypeFromLocal = localStorage.getItem(localStorageFilesMappingTypeKey);
    if (filesMappingTypeFromLocal) dispatch(setMappingFileType(filesMappingTypeFromLocal as MappingFileType));
  }, [dispatch]);

  /**
   * set mapping type grid to local storage
   */
  const handleSetGridMappingtype = () => {
    localStorage.setItem(localStorageFilesMappingTypeKey, "grid");
    dispatch(setMappingFileType("grid"));
  };

  /**
   * set mapping type list to local storage
   */
  const handleSetListMappingtype = () => {
    localStorage.setItem(localStorageFilesMappingTypeKey, "list");
    dispatch(setMappingFileType("list"));
  };

  return {
    handleSetGridMappingtype,
    handleSetListMappingtype,
  };
};

export default useMappingFileType;
