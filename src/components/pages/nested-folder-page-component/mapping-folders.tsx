import useCurrentFolderState from "@/features/folder/hooks/use-current-folder-state";
import FoldersAndFilesSortingOptions from "@components/layout/folder-and-files-sorting-options";
import FolderEmpty from "@components/layout/folder/empty";
import SubFolderMapping from "@components/layout/folder/sub-folder-mapping";
import { Flex } from "antd";
import { useMemo } from "react";

interface MappingFolderProps {
  isAllDataEmpty: boolean;
}

const MappingFolders: React.FC<MappingFolderProps> = ({ isAllDataEmpty }) => {
  const { folders } = useCurrentFolderState();

  const isFolderEmpty = useMemo(() => {
    return folders.length === 0;
  }, [folders]);

  const RenderFolder = isAllDataEmpty ? FolderEmpty : SubFolderMapping;
  return (
    <Flex className="max-w-screen-lg mx-auto px-3 my-5" vertical gap="middle">
      {!isFolderEmpty && <FoldersAndFilesSortingOptions sortingFor="Folders" />}
      <RenderFolder />
    </Flex>
  );
};

export default MappingFolders;
