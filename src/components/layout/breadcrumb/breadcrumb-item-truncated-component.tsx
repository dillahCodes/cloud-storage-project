import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { Flex, Typography } from "antd";
import classNames from "classnames";
import RenderBreadcrumbIcon from "./render-breadcrumb-icon";
import { withFloatingElement } from "@components/hoc/with-floating-element";
import abbreviateText from "@/util/abbreviate-text";
import { RxSlash } from "react-icons/rx";

interface BreadcrumbItemTruncatedComponentProps {
  truncatedItems: BreadcrumbItem[] | undefined;
  handleItemsOnClick: (item: BreadcrumbItem, index: number) => void;
}

const { Text } = Typography;
const BreadcrumbItemTruncatedComponent: React.FC<BreadcrumbItemTruncatedComponentProps> = ({ truncatedItems, handleItemsOnClick }) => {
  const TruncateEl = () => (
    <Flex
      align="center"
      gap="small"
      className={classNames(
        "max-w-[100px] px-2 py-0.5 text-base font-archivo cursor-pointer hover:bg-[#FF5277] transition-all duration-300 hover:text-[#fff1ff]"
      )}
      style={{ ...neoBrutalBorderVariants.small, backgroundColor: themeColors.primary200 }}
    >
      <RenderBreadcrumbIcon icon="truncate" />
    </Flex>
  );

  const TruncateElWithFloatinEL = withFloatingElement(TruncateEl);

  return (
    <Flex component="li" gap="small" align="center">
      <TruncateElWithFloatinEL
        neoBrutalBorderVariants="medium"
        topPosition={30}
        floatingElement={
          <div className="min-w-[200px] max-h-[200px] overflow-y-auto h-fit p-2 border-2 border-black">
            {truncatedItems?.map((item, index) => (
              <Flex
                key={item.key}
                align="center"
                gap="small"
                className="cursor-pointer hover:bg-[#FF5277] p-2 font-archivo group transition-all duration-300"
                onClick={() => handleItemsOnClick(item, index)}
              >
                <Text className="text-lg group-hover:text-[#fff1ff]">
                  <RenderBreadcrumbIcon icon={item.icon as BreadcrumbIconType} />
                </Text>
                <Text className="group-hover:text-[#fff1ff]">{abbreviateText(item.label, 15)}</Text>
              </Flex>
            ))}
          </div>
        }
        parentZIndex={10}
      />
      <RxSlash className="font-bold font-archivo" />
    </Flex>
  );
};

export default BreadcrumbItemTruncatedComponent;
