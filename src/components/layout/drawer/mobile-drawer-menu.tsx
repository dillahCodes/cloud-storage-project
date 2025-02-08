import logOut from "@/features/auth/logout";
import { messageSelector } from "@/features/message/slice/message-slice";
import { userStorageSelector } from "@/features/storage/slice/user-storage-slice";
import useIsLocationActive from "@/hooks/use-is-location-active";
import { themeColors } from "@/theme/antd-theme";
import createPercentStorageUsed from "@/util/create-percent-storage-used";
import formatBytes from "@/util/format-bytes";
import Button from "@components/ui/button";
import { Badge, Flex, message, Progress, Typography } from "antd";
import classNames from "classnames";
import { useMemo } from "react";
import { BiLogOut } from "react-icons/bi";
import { BsDatabaseAdd } from "react-icons/bs";
import { GrStorage } from "react-icons/gr";
import { MdAccessTime, MdOutlineNotifications, MdOutlineShare, MdOutlineStarOutline } from "react-icons/md";
import { RxPerson } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path: string;
}

const menu: MenuItem[] = [
  {
    key: "my-storage",
    label: "my storage",
    icon: <GrStorage />,
    path: "/storage/my-storage",
  },
  {
    key: "profile",
    label: "profile",
    icon: <RxPerson />,
    path: "/storage/profile",
  },
  {
    key: "notification",
    label: "notification",
    icon: <MdOutlineNotifications />,
    path: "/storage/notification",
  },
  {
    key: "shared-with-me",
    label: "shared with me",
    icon: <MdOutlineShare />,
    path: "/storage/shared-with-me",
  },
  {
    key: "recently-viewed",
    label: "recent",
    icon: <MdAccessTime />,
    path: "/storage/recently-viewed",
  },
  {
    key: "starred",
    label: "starred",
    icon: <MdOutlineStarOutline />,
    path: "/storage/starred",
  },
];

const secondMenu: MenuItem[] = [
  {
    key: "send-feedback",
    label: "send feedback",
    path: "/",
  },
  {
    key: "privacy-policy",
    label: "privacy policy",
    path: "/",
  },
  {
    key: "terms-of-service",
    label: "terms of service",
    path: "/",
  },
  {
    key: "dekstop-version",
    label: "dekstop version",
    path: "/",
  },
];

const { Text } = Typography;
const MobileDrawerMenu = () => {
  const { data } = useSelector(userStorageSelector);
  const { messageCount } = useSelector(messageSelector);

  const userStoragePercentUsed = useMemo(() => data && createPercentStorageUsed(data.storageUsed, data.storageCapacity), [data]);
  const userStorageUsedInfo = useMemo(
    () => `${formatBytes(data?.storageUsed || 0)} of ${formatBytes(data?.storageCapacity || 0)}  used`,
    [data]
  );

  const { handleIsLocationActive } = useIsLocationActive();
  const navigate = useNavigate();

  const handleMessageComingSoon = () =>
    message.open({ type: "info", content: "coming soon", className: "font-archivo text-sm", key: "storage-coming-soon" });

  return (
    <>
      {/* menu 1 */}
      <Flex vertical gap="small" className="p-3 pb-3.5 border-b-2 border-black">
        {menu.map((item) => (
          <Button
            type="primary"
            neoBrutalType="medium"
            size="large"
            className={classNames("h-[50px]", {
              "bg-[#FF5277]": handleIsLocationActive(item.path),
            })}
            key={item.key}
            onClick={() => navigate(item.path)}
          >
            <Flex align="center" gap="middle" className="rounded-md w-full">
              <Text
                className={classNames("text-lg", {
                  "text-[#fff1ff]": handleIsLocationActive(item.path),
                })}
              >
                {item.icon}
              </Text>
              <Text
                className={classNames("capitalize text-base font-archivo", {
                  "text-[#fff1ff]": handleIsLocationActive(item.path),
                })}
              >
                {item.label}
              </Text>

              {/* count notification */}
              {item.key === "notification" && (
                <Badge
                  className="text-3xl cursor-pointer ml-auto "
                  styles={{
                    indicator: {
                      fontSize: "12px",
                      lineHeight: "16px",
                      outline: "none",
                      backgroundColor: themeColors.primary100,
                      border: `2px solid black !important`,
                      boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 1)",
                      color: handleIsLocationActive(item.path) ? "#fff1ff" : "black",
                    },
                  }}
                  count={messageCount}
                />
              )}
            </Flex>
          </Button>
        ))}
      </Flex>

      {/* avaiblable storage */}
      <Flex className="p-3 bg-transparent" vertical gap="middle">
        <Flex vertical>
          <Progress percent={userStoragePercentUsed || 0} size="small" showInfo={false} strokeColor={themeColors.primary200} />
          <Text className="text-base  font-archivo">{userStorageUsedInfo}</Text>
        </Flex>

        {/* more storage */}
        <Button type="primary" neoBrutalType="medium" size="large" className="h-[50px]" onClick={handleMessageComingSoon}>
          <Flex align="center" gap="middle" className=" rounded-md w-full">
            <Text className="text-lg">
              <BsDatabaseAdd />
            </Text>
            <Text className="capitalize text-base font-archivo">get more storage</Text>
          </Flex>
        </Button>

        {/* logout */}
        <Button type="primary" neoBrutalType="medium" size="large" className="h-[50px]" onClick={logOut}>
          <Flex align="center" gap="middle" className=" rounded-md w-full">
            <Text className="text-lg">
              <BiLogOut />
            </Text>
            <Text className="capitalize text-base font-archivo">Logout</Text>
          </Flex>
        </Button>
      </Flex>

      {/* menu 2 */}
      <Flex vertical gap="small" className="p-3 pb-3.5 border-b-2 border-black">
        <Text className="text-base font-bold">Help</Text>
        {secondMenu.map((item) => (
          <Flex key={item.key} align="center" gap="middle" className=" rounded-md w-full">
            <Text className="capitalize text-base font-archivo underline">{item.label}</Text>
          </Flex>
        ))}
      </Flex>
    </>
  );
};

export default MobileDrawerMenu;
