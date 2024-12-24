import useDrawer from "@/hooks/use-drawer";
import Drawer from "@components/ui/drawer";
import { Typography } from "antd";

interface DesktopDrawerProps {
  children: React.ReactNode;
}

const { Text } = Typography;
const DesktopDrawer: React.FC<DesktopDrawerProps> = ({ children }) => {
  const { drawerState, toggleDrawerDekstop } = useDrawer();
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
      width={"26%"}
      isDrawerOpen={drawerState.isDrawerDesktopOpen}
      className="border-2 border-black border-t-0"
      onDrawerClose={toggleDrawerDekstop}
    >
      {children}
    </Drawer>
  );
};

export default DesktopDrawer;
