import withDrawer from "@components/hoc/with-drawer";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import classNames from "classnames";
import { MdPlayArrow } from "react-icons/md";

const { Text } = Typography;
const MenuItemComponent: React.FC<MenuItemProps> = ({ menuList, handleToggleChildren }) => {
  const renderMenu = (items: MenuItem[], depth = 0) => {
    return items.map((item) => {
      const isRootNoChildren = !item.children || item.children.length === 0;
      const isChild = depth > 0;
      //   const isRootWithChildren = item.children && item.children.length > 0;

      return (
        <Flex key={item.key} vertical gap="small">
          <Button
            type="primary"
            size="large"
            icon={item.icon}
            onClick={item.action}
            className={classNames("text-black flex items-center justify-start", {
              "bg-transparent": isChild && isRootNoChildren,
            })}
          >
            <Text className="text-sm font-archivo">{item.label}</Text>
            {item.children && (
              <Text
                className=" font-archivo ml-auto text-lg transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleChildren && handleToggleChildren(item.key);
                }}
              >
                <MdPlayArrow className={`transition-transform ${item.isChildrenOpen ? "rotate-90" : ""}`} />
              </Text>
            )}
          </Button>
          {item.isChildrenOpen && item.children && (
            <Flex className="ml-2 border-l-2 pl-2 border-black" vertical gap="small">
              {renderMenu(item.children, depth + 1)}
            </Flex>
          )}
        </Flex>
      );
    });
  };

  return <div className="flex flex-col gap-2">{renderMenu(menuList)}</div>;
};

export default MenuItemComponent;
export const MenuItemComponentWithDrawer = withDrawer(MenuItemComponent);
