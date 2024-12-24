import { fileSelector } from "@/features/file/slice/file-slice";
import useCurrentFolderState from "@/features/folder/hooks/use-current-folder-state";
import FoldersAndFilesSortingOptions from "@components/layout/folder-and-files-sorting-options";
import FolderEmpty from "@components/layout/folder/empty";
import RootFolderMapping from "@components/layout/folder/root-folder-mapping";
import { Flex } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const MappingFolder: React.FC = () => {
  const { status, folders } = useCurrentFolderState();

  const fileState = useSelector(fileSelector);

  const isAllDataEmpty = useMemo(
    () =>
      fileState.files.length === 0 &&
      fileState.status !== "loading" &&
      fileState.status !== "idle" &&
      folders.length === 0 &&
      status !== "loading" &&
      status !== "idle",
    [fileState.files, fileState.status, folders, status]
  );

  const isFolderEmpty = useMemo(() => {
    return folders.length === 0 && folders.length === 0;
  }, [folders.length]);

  return (
    <Flex className="max-w-screen-lg mx-auto px-3 my-5" vertical gap="middle">
      {!isFolderEmpty && <FoldersAndFilesSortingOptions sortingFor="Folders" />}
      {isAllDataEmpty ? <FolderEmpty /> : <RootFolderMapping />}
    </Flex>
  );
};

export default MappingFolder;
