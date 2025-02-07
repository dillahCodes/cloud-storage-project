import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { Flex, Typography } from "antd";
import FileIconsVariant from "./file-icons-variant";
import OptionsFileButtonWithDrawer from "./options-file-button-with-drawer";
import OptionsFileButtonWithFloatingElement from "./options-file-button-with-floating-element";
import RenderResponsiveFileName from "./responsive-file-name";
import { RootFileGetData, SubFileGetData } from "@/features/file/file";

interface VariantFileGridItemParams {
  fileData: SubFileGetData | RootFileGetData;
}

const { Text } = Typography;

const VariantFileGridItem: React.FC<VariantFileGridItemParams> = ({ fileData }) => {
  const { file_name, file_type } = fileData;
  const { isDesktopDevice } = useGetClientScreenWidth();

  return (
    <Flex
      id={fileData.file_id}
      vertical
      gap="small"
      className="w-full h-fit border-2 border-black p-2 rounded-md"
      style={{ ...neoBrutalBorderVariants.medium, background: themeColors.primary200 }}
    >
      <Flex className="w-full" align="center" gap="small" justify="space-between">
        {/* file name and icon */}
        <Text className="text-lg font-archivo">
          <FileIconsVariant fileType={file_type} />
        </Text>
        <RenderResponsiveFileName fileName={file_name} />

        {/* file options button */}
        <div id="file-options">
          {isDesktopDevice ? (
            <OptionsFileButtonWithFloatingElement fileData={fileData} />
          ) : (
            <OptionsFileButtonWithDrawer fileData={fileData} />
          )}
        </div>
      </Flex>
      <Flex
        align="center"
        justify="center"
        className="h-[150px] border-2 border-black rounded-sm"
        style={{ background: themeColors.primary300, ...neoBrutalBorderVariants.small }}
      >
        <Text className="text-6xl font-archivo">
          <FileIconsVariant fileType={file_type} />
        </Text>
      </Flex>
    </Flex>
  );
};
export default VariantFileGridItem;
