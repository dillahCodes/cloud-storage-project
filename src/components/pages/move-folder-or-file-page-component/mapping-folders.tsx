import useMobileMoveFolderClick from "@/features/move-folder-or-file/hooks/use-mobile-move-folder-click";
import { moveFoldersAndFilesDataSelector } from "@/features/move-folder-or-file/slice/move-folders-and-files-data-slice";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import abbreviateText from "@/util/abbreviate-text";
import { Flex, Spin, Typography } from "antd";
import { useMemo } from "react";
import { IoMdFolderOpen } from "react-icons/io";
import { useSelector } from "react-redux";

const { Text } = Typography;

const MappingFolders = () => {
  const { foldersData, folderStatus } = useSelector(moveFoldersAndFilesDataSelector);
  const isLoading = useMemo(() => folderStatus === "loading", [folderStatus]);

  const handleClickFolder = useMobileMoveFolderClick();

  if (isLoading)
    return (
      <Flex className="w-full p-3 py-4 h-full" justify="center" align="center" vertical>
        <Spin />
      </Flex>
    );

  return (
    <Flex className="w-full p-3 py-4 pb-0" gap={6} vertical>
      {foldersData &&
        foldersData.map((folder) => (
          <Flex
            onClick={() => handleClickFolder(folder.folder_id)}
            className="w-full border-2 border-black cursor-pointer p-2 transition-all duration-300 group rounded-sm hover:bg-[#985863]  bg-[#FFB6C1]"
            gap="middle"
            align="center"
            key={folder.folder_id}
            style={neoBrutalBorderVariants.small}
          >
            <Text className="text-2xl group-hover:text-[#FFD3E0]">
              <IoMdFolderOpen />
            </Text>
            <Text className="text-base font-archivo group-hover:text-[#FFD3E0]">{abbreviateText(folder.folder_name, 30)}</Text>
          </Flex>
        ))}
    </Flex>
  );
};

export default MappingFolders;
