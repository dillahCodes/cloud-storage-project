import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { mappingFolderTypeSelector } from "@/features/folder/slice/mapping-folder-type-slice";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import MobileFolder from "./mobile-folder";
import useHandleClickFolder from "@/features/folder/hooks/use-handle-click-folder";
import { useSearchParams } from "react-router-dom";
import DesktopFolder from "./dekstop-folder";
import { Col, Flex, Row } from "antd";
import useCurrentFolderState from "@/features/folder/hooks/use-current-folder-state";

const AllTypeFolderMapping: React.FC = () => {
  const { "0": urlSearchParams } = useSearchParams();

  const { mappingFolderType: mappingType } = useSelector(mappingFolderTypeSelector);
  const { folders: foldersData } = useCurrentFolderState();

  const { isTabletDevice, isMobileDevice } = useGetClientScreenWidth();

  const folderRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isGridView = mappingType === "grid";

  const { handleClickFolder, mobileOpenedFolderId, setMobileOpenedFolderId } = useHandleClickFolder({
    isSubFolder: true,
    params: (urlSearchParams.get("st") as NestedBreadcrumbType) || ("my-storage" as NestedBreadcrumbType),
  });

  // Determine the grid column span based on the device type
  const gridColspan = useMemo(() => {
    if (isMobileDevice) return 12;
    if (isTabletDevice) return 8;
    return 6;
  }, [isMobileDevice, isTabletDevice]);

  const renderFolder = (folder: SubFolderGetData | RootFolderGetData) => {
    if (isMobileDevice || isTabletDevice) {
      return (
        <MobileFolder
          setMobileOpenedFolderId={setMobileOpenedFolderId}
          isDrawerMobileOpen={mobileOpenedFolderId === folder.folder_id}
          key={folder.folder_id}
          folderData={folder}
          ref={(el) => (folderRefs.current[folder.folder_id] = el)}
          onClick={(e) => handleClickFolder(folder, e)}
        />
      );
    } else {
      return (
        <DesktopFolder
          key={folder.folder_id}
          folderData={folder}
          ref={(el) => (folderRefs.current[folder.folder_id] = el)}
          onClick={(e) => handleClickFolder(folder, e)}
        />
      );
    }
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
