import useCurrentFolderState from "@/features/folder/hooks/use-current-folder-state";
import FoldersAndFilesSortingOptions from "@components/layout/folder-and-files-sorting-options";
import AllTypeFolderMapping from "@components/layout/folder/all-type-folder-mapping";
import FolderEmpty from "@components/layout/folder/empty";
import RenderFolderModal from "@components/layout/folder/render-folder-modal";
import { useMemo } from "react";

const StarredMappingFolders = () => {
  const { folders: starredFoldersDara } = useCurrentFolderState();
  const isStarredFolderEmpty = useMemo(() => starredFoldersDara && starredFoldersDara.length === 0, [starredFoldersDara]);

  return (
    <>
      <RenderFolderModal />
      {!isStarredFolderEmpty && <FoldersAndFilesSortingOptions sortingFor="Folders" />}
      {isStarredFolderEmpty ? <FolderEmpty isStarred /> : <AllTypeFolderMapping />}
    </>
  );
};

export default StarredMappingFolders;
