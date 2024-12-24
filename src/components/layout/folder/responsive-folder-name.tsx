import { mappingFolderTypeSelector } from "@/features/folder/slice/mapping-folder-type-slice";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import useSider from "@/hooks/use-sider";
import abbreviateText from "@/util/abbreviate-text";
import { Typography } from "antd";
import { memo } from "react";
import { useSelector } from "react-redux";

interface RenderResponsiveTextProps {
  folderName: string;
}

const { Text } = Typography;
const RenderResponsiveTextMemoized: React.FC<RenderResponsiveTextProps> = memo(({ folderName }) => {
  const { mappingFolderType: mappingType } = useSelector(mappingFolderTypeSelector);
  const isListMappingType = mappingType === "list";

  const screenWidth = useGetClientScreenWidth().screenWidth;
  const { isMobileDevice, isTabletDevice, isDesktopDevice } = useGetClientScreenWidth();
  const { siderState } = useSider();

  return (
    <Text className="text-sm font-archivo select-none">
      {abbreviateText(
        folderName,
        getScreenWidth(
          screenWidth,
          isMobileDevice,
          isTabletDevice,
          isDesktopDevice,
          siderState.isSiderOpen,
          isListMappingType
        )
      )}
    </Text>
  );
});

export default RenderResponsiveTextMemoized;

const getScreenWidth = (
  screenWidth: number,
  isMobileDevice: boolean,
  isTabletDevice: boolean,
  isDesktopDevice: boolean,
  isSiderOpen: boolean,
  isListMappingType: boolean
): number => {
  if (isMobileDevice) return isListMappingType ? screenWidth / 20 : screenWidth / 41;

  if (isTabletDevice) {
    if (isListMappingType) return screenWidth / 30;
    return isSiderOpen ? screenWidth / 90 : screenWidth / 50;
  }

  if (isDesktopDevice) return isListMappingType ? screenWidth / 30 : screenWidth / 110;

  return screenWidth / 30; // Default case
};
