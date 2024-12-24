import useFilesState from "@/features/file/hooks/use-files-state";
import SubFileMapping from "@components/layout/file/sub-file-mapping";
import FoldersAndFilesSortingOptions from "@components/layout/folder-and-files-sorting-options";
import { Flex } from "antd";

const MappingFiles: React.FC = () => {
  const { files, status } = useFilesState();

  const isFileEmpty = files.length === 0 && status !== "loading";

  return (
    <Flex className="max-w-screen-lg mx-auto px-3 my-5" vertical gap="middle">
      {!isFileEmpty && <FoldersAndFilesSortingOptions sortingFor="Files" />}
      <SubFileMapping />
    </Flex>
  );
};

export default MappingFiles;
