import useDrawer from "@/hooks/use-drawer";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import Drawer from "@components/ui/drawer";
import { Typography } from "antd";
import { useMemo } from "react";

interface DesktopDrawerProps {
  children: React.ReactNode;
}

const { Text } = Typography;
const DesktopDrawer: React.FC<DesktopDrawerProps> = ({ children }) => {
  const { drawerState, toggleDrawerDekstop } = useDrawer();
  const { screenWidth } = useGetClientScreenWidth();

  const drawerWidth = useMemo(() => {
    if (screenWidth < 1300) return "34%";
    else if (screenWidth > 1075 && screenWidth < 1300) return "33%";
    else if (screenWidth >= 1032 && screenWidth < 1075) return "35%";
    return "25%";
  }, [screenWidth]);

  return (
    <Drawer
      title={
        drawerState.desktopDrawerTitle ? (
          <div className="w-full  text-center">
            <Text className="font-poppins capitalize text-base ">{drawerState.desktopDrawerTitle}</Text>
          </div>
        ) : null
      }
      styles={{
        body: {
          padding: 0,
        },
        header: {
          padding: 12,
          borderBottom: "2px solid black",
        },
      }}
      width={drawerWidth}
      isDrawerOpen={drawerState.isDrawerDesktopOpen}
      className="border-2 border-black border-t-0"
      onDrawerClose={toggleDrawerDekstop}
    >
      {children}
    </Drawer>
  );
};

export default DesktopDrawer;
