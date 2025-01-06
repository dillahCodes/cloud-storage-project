import { moveFoldersAndFilesDataSelector } from "@/features/move-folder-or-file/slice/move-folders-and-files-data-slice";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import abbreviateText from "@/util/abbreviate-text";
import FileIconsVariant from "@components/layout/file/file-icons-variant";
import { Flex, Spin, Typography } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const { Text } = Typography;

const MappingFiles = () => {
  const { fileStatus, filesData } = useSelector(moveFoldersAndFilesDataSelector);
  const isLoading = useMemo(() => fileStatus === "loading", [fileStatus]);

  if (isLoading)
    return (
      <Flex className="w-full p-3 py-4 h-full" justify="center" align="center" vertical>
        <Spin />
      </Flex>
    );

  return (
    <Flex className="w-full p-3 py-4" gap={6} vertical>
      {filesData &&
        filesData.map((file) => (
          <Flex
            className="w-full border-2 opacity-[.6] cursor-pointer hover:bg-[#985863] group border-black p-2 rounded-sm bg-[#FFB6C1]"
            gap="middle"
            align="center"
            key={file.file_name}
            style={neoBrutalBorderVariants.small}
          >
            <Text className="text-2xl group-hover:text-[#FFD3E0]">
              <FileIconsVariant fileType={file.file_type} />
            </Text>
            <Text className="text-base font-archivo group-hover:text-[#FFD3E0]">{abbreviateText(file.file_name, 30)}</Text>
          </Flex>
        ))}
    </Flex>
  );
};

export default MappingFiles;
