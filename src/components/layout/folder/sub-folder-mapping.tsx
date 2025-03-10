import { SubFolderGetData } from "@/features/folder/folder";
import useCurrentFolderState from "@/features/folder/hooks/use-current-folder-state";
import { mappingFolderTypeSelector } from "@/features/folder/slice/mapping-folder-type-slice";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { Col, Flex, Row } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import DesktopFolder from "./dekstop-folder";
import MobileFolder from "./mobile-folder";
import RenderFolderModal from "./render-folder-modal";

const SubFolderMapping: React.FC = () => {
  const { folders: foldersData } = useCurrentFolderState();
  const { isTabletDevice, isMobileDevice } = useGetClientScreenWidth();

  const { mappingFolderType: mappingType } = useSelector(mappingFolderTypeSelector);
  const isGridView = useMemo(() => mappingType === "grid", [mappingType]);

  // Determine the grid column span based on the device type
  const gridColspan = useMemo(() => {
    if (isMobileDevice) return 12;
    if (isTabletDevice) return 8;
    return 6; // Default for desktop and other cases
  }, [isMobileDevice, isTabletDevice]);

  // Filter folders to ensure correct type
  const subFolders = useMemo(() => {
    return foldersData.filter((folder): folder is SubFolderGetData => folder.parent_folder_id !== null);
  }, [foldersData]);

  // Render folder item
  const renderFolder = (folder: SubFolderGetData) => {
    const isMobile = isMobileDevice || isTabletDevice;
    return isMobile ? <MobileFolder key={folder.folder_id} folderData={folder} /> : <DesktopFolder key={folder.folder_id} folderData={folder} />;
  };

  const GridFolderMapping = () => {
    return (
      <Row gutter={[16, 16]}>
        <RenderFolderModal />
        {subFolders.map((folder) => (
          <Col key={folder.folder_id} span={gridColspan}>
            {renderFolder(folder)}
          </Col>
        ))}
      </Row>
    );
  };

  const ListFolderMapping = () => {
    return (
      <Flex className="w-full" vertical gap="small">
        <RenderFolderModal />
        {subFolders.map(renderFolder)}
      </Flex>
    );
  };

  return isGridView ? <GridFolderMapping /> : <ListFolderMapping />;
};

export default SubFolderMapping;
