import useUser from "@/features/auth/hooks/use-user";
import { messageSelector } from "@/features/message/slice/message-slice";
import useDrawer from "@/hooks/use-drawer";
import useSider from "@/hooks/use-sider";
import { themeColors } from "@/theme/antd-theme";
import { Badge, Flex } from "antd";
import { Header } from "antd/es/layout/layout";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { MdOutlineNotifications } from "react-icons/md";
import { useSelector } from "react-redux";
import DekstopSearchbar from "../searchbar/desktop-searchbar";
import DesktopProfileHeader from "./desktop-profile-header";

const DekstopHeader = () => {
  const { messageCount } = useSelector(messageSelector);
  const { user } = useUser();
  const { siderState, toggleSider } = useSider();
  const { toggleDrawerDekstop, setDrawerDesktopTitle } = useDrawer();

  const handleOpenNotification = () => {
    toggleDrawerDekstop();
    setDrawerDesktopTitle("notification");
  };

  return (
    <Header className="">
      <Flex
        className="w-full h-[58px] border-b-2 px-5 bg-transparent border-black"
        align="center"
        gap="small"
        justify="space-between"
      >
        <Flex gap="middle" align="center" className="h-full w-full">
          <div className="h-full flex items-center  text-2xl  pr-3  cursor-pointer" onClick={toggleSider}>
            {siderState.isSiderOpen ? <GoSidebarCollapse /> : <GoSidebarExpand />}
          </div>

          {/* searchbar */}
          <DekstopSearchbar />

          <Flex align="center" gap="large" className="ml-auto">
            <Badge
              className="text-3xl cursor-pointer"
              styles={{
                indicator: {
                  fontSize: "12px",
                  lineHeight: "16px",
                  outline: "none",
                  backgroundColor: themeColors.primary100,
                  border: `1px solid !important`,
                  boxShadow: "1px 1px 0px 0px rgba(0, 0, 0, 1)",
                },
              }}
              count={messageCount}
              onClick={handleOpenNotification}
            >
              <MdOutlineNotifications />
            </Badge>

            {/* avatar menu */}
            <DesktopProfileHeader user={user} />
          </Flex>
        </Flex>
      </Flex>
    </Header>
  );
};

export default DekstopHeader;
