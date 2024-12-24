import useUser from "@/features/auth/hooks/use-user";
import useDrawer from "@/hooks/use-drawer";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { themeColors } from "@/theme/antd-theme";
import Drawer from "@components/ui/drawer";
import { Flex, Layout, Typography } from "antd";
import React, { useMemo } from "react";
import { IoMdClose } from "react-icons/io";
import AvatarOnlyIcon from "../avatar/avatar-only-icon";
import AvatarWithUserPhoto from "../avatar/avatar-with-user-photo";

interface MobileDrawerProps {
  children: React.ReactNode;
}

const { Text } = Typography;
const MobileDrawer: React.FC<MobileDrawerProps> = ({ children }) => {
  const { user } = useUser();
  const { screenWidth } = useGetClientScreenWidth();
  const { drawerState, toggleDrawerMenu } = useDrawer();

  const changeDrawerWidth = useMemo(() => {
    if (screenWidth >= 540) {
      return "50%";
    } else if (screenWidth >= 420 && screenWidth < 540) {
      return "65%";
    } else {
      return "80%";
    }
  }, [screenWidth]);

  return (
    <Drawer
      title={
        <Flex align="center" justify="space-between">
          <Flex vertical gap="small">
            {user?.photoURL ? <AvatarWithUserPhoto src={user?.photoURL} /> : <AvatarOnlyIcon />}
            <Text className="font-poppins text-sm">{user?.email}</Text>
          </Flex>
          <div className="h-full flex items-center text-2xl" onClick={toggleDrawerMenu}>
            <IoMdClose />
          </div>
        </Flex>
      }
      width={changeDrawerWidth}
      height={"100%"}
      isDrawerOpen={drawerState.isDrawerMenuOpen}
      onDrawerClose={toggleDrawerMenu}
      placement="left"
      styles={{
        header: {
          backgroundColor: themeColors.primary200,
          borderBottom: "3px solid black",
          padding: "1rem",
          borderRadius: "0 0 1em 0",
        },
        body: {
          padding: 0,
        },
      }}
      neoBrutalType="medium"
    >
      <Layout className="min-h-fit overflow-y-auto" style={{ backgroundColor: themeColors.primary300 }}>
        {children}
      </Layout>
    </Drawer>
  );
};

export default MobileDrawer;
