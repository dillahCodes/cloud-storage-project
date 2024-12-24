import useIsLocationActive from "@/hooks/use-is-location-active";
import { themeColors } from "@/theme/antd-theme";
import Button from "@components/ui/button";
import { Flex, Progress, Typography } from "antd";
import classNames from "classnames";
import { BsDatabaseAdd } from "react-icons/bs";
import { GrStorage } from "react-icons/gr";
import { MdAccessTime, MdOutlineShare, MdOutlineStarOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ButtonAddDesktop from "../button-add-folder-and-file/button-add-desktop";
// import ButtonAddDesktop from "../button-add-folder-and-file/button-add-desktop";

interface SiderMenuProps {
  showText: boolean;
}

interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path: string;
  isDisabled?: boolean;
}
const menu: MenuItem[] = [
  {
    key: "my-storage",
    label: "my storage",
    icon: <GrStorage />,
    path: "/storage/my-storage",
    // isDisabled: true,
  },
  {
    key: "shared-with-me",
    label: "shared with me",
    icon: <MdOutlineShare />,
    path: "/storage/shared-with-me",
  },
];

const menu2: MenuItem[] = [
  {
    key: "starred",
    label: "starred",
    icon: <MdOutlineStarOutline />,
    path: "/storage/starred",
  },
  {
    key: "recently-viewed",
    label: "recent",
    icon: <MdAccessTime />,
    path: "/storage/recently-viewed",
  },
];

const { Text } = Typography;
const DesktopSiderMenu: React.FC<SiderMenuProps> = ({ showText }) => {
  return (
    <Flex vertical>
      <Flex className="p-3 border-b-2 border-black">
        <ButtonAddDesktop showText={showText} />
      </Flex>

      <MappingMenu showText={showText} data={menu} />
      <MappingMenu showText={showText} data={menu2} />

      <Flex vertical gap="small" className=" p-3 border-black">
        {/* avaiblable storage */}
        <Flex vertical>
          <Progress percent={30} size="small" showInfo={false} strokeColor={themeColors.primary200} />
          {showText && <Text className="capitalize text-base font-archivo">1 GB of 5 GB used</Text>}
        </Flex>

        <Button type="primary" neoBrutalType="medium" size="large" className="h-[50px]">
          <Flex align="center" gap="middle" className=" rounded-md w-full">
            <Text className="text-lg">
              <BsDatabaseAdd />
            </Text>
            {showText && <Text className="capitalize text-base font-archivo">get more storage</Text>}
          </Flex>
        </Button>
      </Flex>
    </Flex>
  );
};

export default DesktopSiderMenu;

interface MappingMenuProps {
  showText: boolean;
  data: MenuItem[];
}
const MappingMenu: React.FC<MappingMenuProps> = ({ showText, data }) => {
  const navigate = useNavigate();
  const { handleIsLocationActive } = useIsLocationActive();
  return (
    <Flex vertical gap="small" className="p-3  border-b-2 border-black">
      {data.map((item) => (
        <Button
          onClick={() => navigate(item.path)}
          type="primary"
          neoBrutalType="medium"
          size="large"
          disabled={item.isDisabled}
          className={classNames("h-[50px]", {
            "bg-[#FF5277]": handleIsLocationActive(item.path),
          })}
          key={item.key}
        >
          <Flex align="center" gap="middle" className=" rounded-md w-full">
            <Text
              className={classNames("text-lg", {
                "mx-auto": !showText,
                "text-[#fff1ff]": handleIsLocationActive(item.path),
              })}
            >
              {item.icon}
            </Text>
            {showText && (
              <Text
                className={classNames("capitalize text-base font-archivo", {
                  "text-[#fff1ff]": handleIsLocationActive(item.path),
                })}
              >
                {item.label}
              </Text>
            )}
          </Flex>
        </Button>
      ))}
    </Flex>
  );
};