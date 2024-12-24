import useFilesState from "@/features/file/hooks/use-files-state";
import { mappingFileTypeSelector } from "@/features/file/slice/mapping-file-type-slice";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import useSider from "@/hooks/use-sider";
import { Col, Flex, Row } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import VariantFileGridItem from "./variant-file-grid-item";
import VariantFileListItem from "./variant-file-list-item";

const RootFileMapping: React.FC = () => {
  const { files: filesData } = useFilesState();
  const { mappingFileType: mappingType } = useSelector(mappingFileTypeSelector);

  const { isTabletDevice, isMobileDevice, isDesktopDevice } = useGetClientScreenWidth();
  const { isSiderOpen } = useSider().siderState;

  // Determine the grid column span based on the device type
  const gridColspan = useMemo(() => {
    if (isMobileDevice) {
      return 12;
    } else if (isTabletDevice && isSiderOpen) {
      return 12;
    } else if (isTabletDevice && !isSiderOpen) {
      return 8;
    } else if (isDesktopDevice) {
      return 6;
    }
  }, [isMobileDevice, isTabletDevice, isDesktopDevice, isSiderOpen]);

  // Render as a list
  if (mappingType === "list") {
    return (
      <Flex className="w-full" vertical gap="small">
        {filesData.map((folder) => (
          <VariantFileListItem key={folder.file_id} name={folder.file_name} fileType={folder.file_type} />
        ))}
      </Flex>
    );
  }

  // Render as a grid
  if (mappingType === "grid") {
    return (
      <Row gutter={[16, 16]}>
        {filesData.map((file) => (
          <Col key={file.file_id} span={gridColspan}>
            <VariantFileGridItem name={file.file_name} fileType={file.file_type} />
          </Col>
        ))}
      </Row>
    );
  }

  return null; // Handle unsupported mappingType cases gracefully
};

export default RootFileMapping;
