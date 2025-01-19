import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import useCurrentFolderState from "@/features/folder/hooks/use-current-folder-state";
import { mappingFolderTypeSelector } from "@/features/folder/slice/mapping-folder-type-slice";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { Col, Flex, Row } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import DesktopFolder from "./dekstop-folder";
import MobileFolder from "./mobile-folder";

const AllTypeFolderMapping: React.FC = () => {
  const { mappingFolderType: mappingType } = useSelector(mappingFolderTypeSelector);
  const { folders: foldersData } = useCurrentFolderState();

  const { isTabletDevice, isMobileDevice } = useGetClientScreenWidth();

  const isGridView = mappingType === "grid";

  // Determine the grid column span based on the device type
  const gridColspan = useMemo(() => {
    if (isMobileDevice) return 12;
    if (isTabletDevice) return 8;
    return 6;
  }, [isMobileDevice, isTabletDevice]);

  const renderFolder = (folder: SubFolderGetData | RootFolderGetData) => {
    const isMobile = isMobileDevice || isTabletDevice;
    return isMobile ? <MobileFolder key={folder.folder_id} folderData={folder} /> : <DesktopFolder key={folder.folder_id} folderData={folder} />;
  };

  const GridFolderMapping = () => {
    return (
      <Row gutter={[16, 16]}>
        {foldersData.map((folder) => (
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
        {foldersData.map(renderFolder)}
      </Flex>
    );
  };

  return isGridView ? <GridFolderMapping /> : <ListFolderMapping />;
};

export default AllTypeFolderMapping;
