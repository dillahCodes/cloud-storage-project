import { moveFoldersAndFilesDataSelector, setMoveParentFolderData } from "@/features/move-folder-or-file/slice/move-folders-and-files-data-slice";
import useDetectLocation from "@/hooks/use-detect-location";
import Button from "@components/ui/button";
import { Flex, Spin, Typography } from "antd";
import { useMemo, useState } from "react";
import { GrStorage } from "react-icons/gr";
import { IoMdFolderOpen } from "react-icons/io";
import { IoChevronBackOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const { Text } = Typography;
const MoveButtonInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * hooks detect location
   */
  const { isSubMoveFolderOrFileLocation, isRootMoveFolderOrFileLocation } = useDetectLocation();

  /**
   * params
   */
  const [searchParams] = useSearchParams();
  const [params] = useState(searchParams.get("st") || "");

  /**
   *  parent folder state
   */
  const { parentFolderData, parentFolderStatus } = useSelector(moveFoldersAndFilesDataSelector);

  /**
   * loading and succeeded parent folder
   */
  const isLoading = useMemo(() => parentFolderStatus === "loading", [parentFolderStatus]);
  const isSucceeded = useMemo(() => parentFolderStatus === "succeeded", [parentFolderStatus]);

  /**
   * handle back to previous folder
   * if parent folder is not null
   */
  const toPrevFolder = useMemo(() => {
    return isSucceeded && parentFolderData && parentFolderData.parent_folder_id !== null;
  }, [isSucceeded, parentFolderData]);

  /**
   * handle back to root folder
   * if parent folder is null
   */
  const toRootFolder = useMemo(() => {
    return isSucceeded && parentFolderData && parentFolderData.parent_folder_id === null;
  }, [isSucceeded, parentFolderData]);

  const handleBack = () => {
    if (toPrevFolder) navigate(`/storage/folder/move?parentId=${parentFolderData?.parent_folder_id}&st=${params}`);

    if (toRootFolder) navigate(`/storage/folder/move?st=${params}`);
    if (toRootFolder) dispatch(setMoveParentFolderData(null));
  };

  /**
   * show loading if parent folder is loading
   */
  if (isLoading) {
    return (
      <Flex className="w-full p-3 py-4" align="center" justify="center" gap="small">
        <Spin />
      </Flex>
    );
  }

  return (
    <Flex className="w-full p-3 py-4" gap="small">
      {/* root button info navigation */}
      {isRootMoveFolderOrFileLocation && (
        <Button type="primary" className="w-fit rounded-sm">
          <Text className="text-sm capitalize font-archivo">
            <GrStorage />
          </Text>
          <Text className="text-sm capitalize font-archivo">my storage</Text>
        </Button>
      )}

      {/* sub button info navigation */}
      {isSubMoveFolderOrFileLocation && parentFolderData !== null && (
        <Flex align="center" gap="middle">
          <Button type="primary" className=" rounded-sm text-lg text-black" onClick={handleBack} icon={<IoChevronBackOutline />} />
          <Button type="primary" className="w-fit rounded-sm">
            <Text className="text-sm capitalize font-archivo">
              <IoMdFolderOpen />
            </Text>
            <Text className="text-sm  font-archivo">{parentFolderData.folder_name}</Text>
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default MoveButtonInfo;
