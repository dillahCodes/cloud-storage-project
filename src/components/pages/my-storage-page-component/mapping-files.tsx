import useFilesState from "@/features/file/hooks/use-files-state";
import RootFileMapping from "@components/layout/file/root-file-mapping";
import FoldersAndFilesSortingOptions from "@components/layout/folder-and-files-sorting-options";
import { Flex } from "antd";
import { useMemo } from "react";

const MappingFiles: React.FC = () => {
  const { files, status } = useFilesState();

  const isFileEmpty = useMemo(() => files.length === 0 && status !== "loading", [files.length, status]);

  return (
    <Flex className="max-w-screen-lg mx-auto px-3 my-5" vertical gap="middle">
      {!isFileEmpty && <FoldersAndFilesSortingOptions sortingFor="Files" />}
      <RootFileMapping />
    </Flex>
  );
};

export default MappingFiles;
