import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { Flex } from "antd";
import classNames from "classnames";
import RenderBreadcrumbIcon from "./render-breadcrumb-icon";
import abbreviateText from "@/util/abbreviate-text";
import { RxSlash } from "react-icons/rx";

const BreadcrumbItemComponent: React.FC<{
  item: BreadcrumbItem;
  isLast: boolean;
  isFirst: boolean;
  onClick: () => void;
}> = ({ item, isLast, onClick, isFirst }) => (
  <Flex component="li" gap="small" align="center">
    <Flex
      align="center"
      gap="small"
      className={classNames(
        "max-w-[120px] px-2 py-0.5 text-xs font-archivo cursor-pointer  hover:bg-[#FF5277] transition-all duration-300 hover:text-[#fff1ff]",
        { "bg-[#FF5277] text-[#fff1ff]": isLast }
      )}
      onClick={onClick}
      style={{ ...neoBrutalBorderVariants.small, backgroundColor: themeColors.primary200 }}
    >
      {item.icon && <RenderBreadcrumbIcon icon={item.icon} />}
      <span>{isFirst ? item.label : abbreviateText(item.label, 10)}</span>
    </Flex>
    {!isLast && <RxSlash className="font-bold font-archivo" />}
  </Flex>
);

export default BreadcrumbItemComponent;
