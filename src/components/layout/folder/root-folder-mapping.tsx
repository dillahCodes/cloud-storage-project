import { RootFolderGetData } from "@/features/folder/folder";
import useCurrentFolderState from "@/features/folder/hooks/use-current-folder-state";
import { mappingFolderTypeSelector } from "@/features/folder/slice/mapping-folder-type-slice";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { Col, Flex, Row } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import DesktopFolder from "./dekstop-folder";
import MobileFolder from "./mobile-folder";
import RenderFolderModal from "./render-folder-modal";

const RootFolderMapping: React.FC = () => {
  const { folders: foldersData } = useCurrentFolderState();
  const { isTabletDevice, isMobileDevice } = useGetClientScreenWidth();

  const { mappingFolderType: mappingType } = useSelector(mappingFolderTypeSelector);
  const isGridView = useMemo(() => mappingType === "grid", [mappingType]);

  // Filter folders to ensure correct type
  const rootFolders = useMemo(() => {
    return foldersData.filter((folder): folder is RootFolderGetData => folder.parent_folder_id === null);
  }, [foldersData]);

  const gridColspan = useMemo(() => (isMobileDevice ? 12 : isTabletDevice ? 8 : 6), [isMobileDevice, isTabletDevice]);

  // Render folder item
  const renderFolder = (folder: RootFolderGetData) => {
    const isMobile = isMobileDevice || isTabletDevice;
    return isMobile ? <MobileFolder key={folder.folder_id} folderData={folder} /> : <DesktopFolder key={folder.folder_id} folderData={folder} />;
  };

  const GridFolderMapping = () => (
    <Row gutter={[16, 16]}>
      <RenderFolderModal />
      {rootFolders.map((folder) => (
        <Col key={folder.folder_id} span={gridColspan}>
          {renderFolder(folder)}
        </Col>
      ))}
    </Row>
  );

  const ListFolderMapping = () => (
    <Flex className="w-full" vertical gap="small">
      <RenderFolderModal />
      {rootFolders.map(renderFolder)}
    </Flex>
  );

  return isGridView ? <GridFolderMapping /> : <ListFolderMapping />;
};

export default RootFolderMapping;
