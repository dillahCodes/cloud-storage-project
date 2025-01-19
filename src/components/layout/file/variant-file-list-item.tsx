import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { Flex, Typography } from "antd";
import { memo } from "react";
import FileIconsVariant from "./file-icons-variant";
import OptionsFileButtonWithDrawer from "./options-file-button-with-drawer";
import OptionsFileButtonWithFloatingElement from "./options-file-button-with-floating-element";
import RenderResponsiveFileName from "./responsive-file-name";

interface VariantFileListItemParams {
  fileData: SubFileGetData | RootFileGetData;
}

const { Text } = Typography;

const VariantFileListItem: React.FC<VariantFileListItemParams> = ({ fileData }) => {
  const { file_name, file_type } = fileData;
  const { isDesktopDevice } = useGetClientScreenWidth();

  return (
    <Flex
      className="border-2 border-black rounded-md cursor-pointer w-full p-3"
      gap="small"
      align="center"
      justify="space-between"
      style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.primary200 }}
    >
      {/* file icon and name */}
      <Flex align="center" gap="small">
        <Text className="text-xl">
          <FileIconsVariant fileType={file_type} />
        </Text>
        <Text className=" text-sm font-archivo">
          <RenderResponsiveFileName fileName={file_name} />
        </Text>
      </Flex>

      {/* file button options and drawer */}
      <div id="file-options">
        {isDesktopDevice ? <OptionsFileButtonWithFloatingElement fileData={fileData} /> : <OptionsFileButtonWithDrawer fileData={fileData} />}
      </div>
    </Flex>
  );
};

export default memo(VariantFileListItem);
