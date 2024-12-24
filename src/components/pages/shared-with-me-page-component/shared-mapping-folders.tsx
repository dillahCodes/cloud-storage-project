import useCurrentFolderState from "@/features/folder/hooks/use-current-folder-state";
import FoldersAndFilesSortingOptions from "@components/layout/folder-and-files-sorting-options";
import AllTypeFolderMapping from "@components/layout/folder/all-type-folder-mapping";
import FolderEmpty from "@components/layout/folder/empty";
import { useMemo } from "react";

const SharredMappingFolders: React.FC = () => {
  const { folders: sharedWithMeFolderData } = useCurrentFolderState();
  const isSharedFolderEmpty = useMemo(() => sharedWithMeFolderData && sharedWithMeFolderData.length === 0, [sharedWithMeFolderData]);

  return (
    <>
      {!isSharedFolderEmpty && <FoldersAndFilesSortingOptions sortingFor="Folders" />}
      {isSharedFolderEmpty ? <FolderEmpty isSharedFolder /> : <AllTypeFolderMapping />}
    </>
  );
};

export default SharredMappingFolders;
