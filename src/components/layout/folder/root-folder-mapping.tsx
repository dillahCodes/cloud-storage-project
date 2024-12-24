import { RootFolderGetData } from "@/features/folder/folder";
import useCurrentFolderState from "@/features/folder/hooks/use-current-folder-state";
import useHandleClickFolder from "@/features/folder/hooks/use-handle-click-folder";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { Col, Flex, Row } from "antd";
import { useMemo, useRef } from "react";
import DesktopFolder from "./dekstop-folder";
import MobileFolder from "./mobile-folder";
import { useSelector } from "react-redux";
import { mappingFolderTypeSelector } from "@/features/folder/slice/mapping-folder-type-slice";
import { useSearchParams } from "react-router-dom";

const RootFolderMapping: React.FC = () => {
  const { mappingFolderType: mappingType } = useSelector(mappingFolderTypeSelector);

  const { "0": urlSearchParams } = useSearchParams();

  const { isTabletDevice, isMobileDevice } = useGetClientScreenWidth();
  const folderRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { folders: foldersData } = useCurrentFolderState();

  const { handleClickFolder, mobileOpenedFolderId, setMobileOpenedFolderId } = useHandleClickFolder({
    isSubFolder: false,
    params: (urlSearchParams.get("st") as NestedBreadcrumbType) || ("my-storage" as NestedBreadcrumbType),
  });

  const isGridView = mappingType === "grid";

  // Filter folders to ensure correct type
  const rootFolders = useMemo(() => {
    return foldersData.filter((folder): folder is RootFolderGetData => folder.parent_folder_id === null);
  }, [foldersData]);

  const gridColspan = useMemo(
    () => (isMobileDevice ? 12 : isTabletDevice ? 8 : 6),
    [isMobileDevice, isTabletDevice]
  );

  // Render folder item
  const renderFolder = (folder: RootFolderGetData) => {
    const FolderComponent = isMobileDevice || isTabletDevice ? MobileFolder : DesktopFolder;
    return (
      <FolderComponent
        setMobileOpenedFolderId={setMobileOpenedFolderId}
        isDrawerMobileOpen={mobileOpenedFolderId === folder.folder_id}
        key={folder.folder_id}
        folderData={folder}
        ref={(el) => (folderRefs.current[folder.folder_id] = el)}
        onClick={(e) => handleClickFolder(folder, e)}
      />
    );
  };

  const GridFolderMapping = () => (
    <Row gutter={[16, 16]}>
      {rootFolders.map((folder) => (
        <Col key={folder.folder_id} span={gridColspan}>
          {renderFolder(folder)}
        </Col>
      ))}
    </Row>
  );

  const ListFolderMapping = () => (
    <Flex className="w-full" vertical gap="small">
      {rootFolders.map(renderFolder)}
    </Flex>
  );

  return isGridView ? <GridFolderMapping /> : <ListFolderMapping />;
};

export default RootFolderMapping;
