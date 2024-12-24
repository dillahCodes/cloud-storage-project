import { mappingFileTypeSelector } from "@/features/file/slice/mapping-file-type-slice";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import useSider from "@/hooks/use-sider";
import abbreviateText from "@/util/abbreviate-text";
import { Typography } from "antd";
import { memo } from "react";
import { useSelector } from "react-redux";

interface RenderResponsiveTextProps {
  fileName: string;
}

const { Text } = Typography;

const RenderResponsiveFileName: React.FC<RenderResponsiveTextProps> = memo(({ fileName }) => {
  const { mappingFileType: mappingType } = useSelector(mappingFileTypeSelector);

  const { screenWidth, isMobileDevice, isTabletDevice, isDesktopDevice } = useGetClientScreenWidth();
  const { isSiderOpen } = useSider().siderState;

  const isListMappingType = mappingType === "list";

  const maxLength = calculateMaxLength(
    screenWidth,
    isMobileDevice,
    isTabletDevice,
    isDesktopDevice,
    isSiderOpen,
    isListMappingType
  );

  return <Text className="text-sm font-archivo select-none">{abbreviateText(fileName, maxLength)}</Text>;
});

export default RenderResponsiveFileName;

const calculateMaxLength = (
  screenWidth: number,
  isMobileDevice: boolean,
  isTabletDevice: boolean,
  isDesktopDevice: boolean,
  isSiderOpen: boolean,
  isListMappingType: boolean
): number => {
  if (isMobileDevice) {
    return isListMappingType ? screenWidth / 20 : screenWidth / 41;
  }

  if (isTabletDevice) {
    return isListMappingType ? screenWidth / 30 : isSiderOpen ? screenWidth / 90 : screenWidth / 50;
  }

  if (isDesktopDevice) {
    return isListMappingType ? screenWidth / 30 : screenWidth / 110;
  }

  return screenWidth / 30; // Default case
};
