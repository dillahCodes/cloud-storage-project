import { useDispatch } from "react-redux";
import {
  LocalStorageMapppingFoldersKey,
  MappingFolderType,
  setMappingFolderType,
} from "../slice/mapping-folder-type-slice";
import { useEffect } from "react";

const useMappingFolderType = () => {
  /**
   * state for mapping type
   */
  const dispatch = useDispatch();
  //   const mappingFolderType = useSelector(mappingFolderTypeSelector);

  /**
   * local storage key for mapping type
   */
  const localStorageFoldersMappingTypeKey: LocalStorageMapppingFoldersKey = "foldersMappingType";

  /**
   * set mapping type from local storage in mount
   */
  useEffect(() => {
    const foldersMappingTypeFromLocal = localStorage.getItem(localStorageFoldersMappingTypeKey);
    if (!foldersMappingTypeFromLocal) return;

    dispatch(setMappingFolderType(foldersMappingTypeFromLocal as MappingFolderType));
  }, [dispatch]);

  /**
   * set mapping type grid to local storage
   */
  const handleSetGridMappingtype = () => {
    localStorage.setItem(localStorageFoldersMappingTypeKey, "grid");
    dispatch(setMappingFolderType("grid"));
  };

  /**
   * set mapping type list to local storage
   */
  const handleSetListMappingtype = () => {
    localStorage.setItem(localStorageFoldersMappingTypeKey, "list");
    dispatch(setMappingFolderType("list"));
  };

  return {
    handleSetGridMappingtype,
    handleSetListMappingtype,
  };
};

export default useMappingFolderType;
