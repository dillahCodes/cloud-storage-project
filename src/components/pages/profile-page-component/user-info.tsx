import useUser from "@/features/auth/hooks/use-user";
import logOut from "@/features/auth/logout";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import AvatarOnlyIcon from "@components/layout/avatar/avatar-only-icon";
import AvatarWithUserPhoto from "@components/layout/avatar/avatar-with-user-photo";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import classNames from "classnames";
import { useMemo } from "react";
import { BiLogOut } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineEmail } from "react-icons/md";

const generateUserInfoList = (user: AuthState["user"]) => {
  return [
    {
      label: "name",
      value: user?.displayName,
    },
    {
      label: "email",
      value: user?.email,
      secondValue: user?.emailVerified ? "✅" : "❌",
    },
    {
      label: "login with",
      value: user?.providerData[0]?.providerId === "google.com" ? <FcGoogle /> : <MdOutlineEmail />,
    },
  ];
};

const { Text } = Typography;
const UserInfo: React.FC = () => {
  const { user } = useUser();
  const { screenWidth } = useGetClientScreenWidth();

  const infoList = useMemo(() => generateUserInfoList(user), [user]);

  const isWrap = useMemo(() => {
    return screenWidth < 990 ? true : false;
  }, [screenWidth]);

  return (
    <Flex
      vertical
      className={classNames(" border-2 border-black p-3 rounded-md h-fit", {
        "sticky top-5 max-w-sm w-full": !isWrap,
        "w-full": isWrap,
      })}
      style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.primary200 }}
    >
      <div
        className="w-fit border-2 border-black p-1 rounded-sm px-2"
        style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.bg100 }}
      >
        <Text className="capitalize font-bold font-archivo">User Info</Text>
      </div>

      <Flex vertical justify="space-around" align="center" className="h-full" gap="middle">
        {user?.photoURL ? (
          <AvatarWithUserPhoto size={100} src={user?.photoURL} />
        ) : (
          <AvatarOnlyIcon iconClassname="text-5xl" size={100} />
        )}

        <Flex
          className="w-full border-2 border-black p-2 rounded-sm"
          vertical
          gap="small"
          style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.bg100 }}
        >
          {infoList.map((item) => (
            <Flex align="center" className="max-w-sm " gap="small" key={item.label}>
              <Flex gap="small" justify="space-around">
                <Text className="font-bold font-archivo capitalize text-sm min-w-[80px]">{item.label}</Text>
                <Text className="font-bold font-archivo capitalize text-sm">:</Text>
              </Flex>
              <Text className=" font-archivo  text-sm line-clamp-1">{item.value}</Text>
              {item.secondValue && <Text className=" font-archivo  text-sm">{item.secondValue}</Text>}
            </Flex>
          ))}
        </Flex>

        <Button className="rounded-sm w-full bg-[#FFD3E0]" neoBrutalType="medium" onClick={logOut}>
          <Flex align="center" gap="middle" className=" rounded-md w-full">
            <Text className="text-lg">
              <BiLogOut />
            </Text>
            <Text className="capitalize text-sm font-archivo">logout</Text>
          </Flex>
        </Button>
      </Flex>
    </Flex>
  );
};

export default UserInfo;
