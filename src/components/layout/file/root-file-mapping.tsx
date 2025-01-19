import useFilesState from "@/features/file/hooks/use-files-state";
import { mappingFileTypeSelector } from "@/features/file/slice/mapping-file-type-slice";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import useSider from "@/hooks/use-sider";
import { Col, Flex, Row } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import RenderModalFileOptions from "./render-modal-file-options";
import VariantFileGridItem from "./variant-file-grid-item";
import VariantFileListItem from "./variant-file-list-item";

const RootFileMapping: React.FC = () => {
  const { files: filesData } = useFilesState();
  const { mappingFileType: mappingType } = useSelector(mappingFileTypeSelector);

  const { isTabletDevice, isMobileDevice, isDesktopDevice } = useGetClientScreenWidth();
  const { isSiderOpen } = useSider().siderState;

  const gridColspan = useMemo(() => {
    if (isMobileDevice) return 12;
    if (isTabletDevice) return isSiderOpen ? 12 : 8;
    if (isDesktopDevice) return 6;
    return 24;
  }, [isMobileDevice, isTabletDevice, isDesktopDevice, isSiderOpen]);

  return (
    <>
      <RenderModalFileOptions />
      {mappingType === "list" ? (
        <Flex className="w-full" vertical gap="small">
          {filesData.map((file) => (
            <VariantFileListItem fileData={file} key={file.file_id} />
          ))}
        </Flex>
      ) : (
        <Row gutter={[16, 16]}>
          {filesData.map((file) => (
            <Col key={file.file_id} span={gridColspan}>
              <VariantFileGridItem fileData={file} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default RootFileMapping;
