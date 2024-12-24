import useDrawer from "@/hooks/use-drawer";
import useMobileHeaderTitle from "@/hooks/use-mobile-header-title";
import { Badge, Flex, Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import MobileProfileHeader from "./mobile-profile-header";
import { themeColors } from "@/theme/antd-theme";
import { messageSelector } from "@/features/message/slice/message-slice";
import { useSelector } from "react-redux";

const { Text } = Typography;

const MobileHeder = () => {
  const { messageCount } = useSelector(messageSelector);
  const { title } = useMobileHeaderTitle();
  const navigate = useNavigate();
  const { toggleDrawerMenu } = useDrawer();

  const handleNavigateToProfile = () => navigate("/storage/profile", { replace: true });

  return (
    <Header className="">
      <Flex className="w-full h-[58px] border-b-2 bg-transparent border-black" align="center" gap="small" justify="space-between">
        <Flex gap="large" align="center" className="h-full">
          {/* hamburger menu */}
          <Badge
            className=" cursor-pointer  flex items-center text-2xl px-4 "
            styles={{
              indicator: {
                fontSize: "12px",
                lineHeight: "16px",
                outline: "none",
                backgroundColor: themeColors.primary100,
                border: `1px solid !important`,
                boxShadow: "1px 1px 0px 0px rgba(0, 0, 0, 1)",
                right: "5px",
              },
            }}
            onClick={toggleDrawerMenu}
            count={messageCount}
          >
            <GiHamburgerMenu />
          </Badge>

          <Text className="text-lg capitalize font-poppins">{title}</Text>
        </Flex>

        <Flex gap="middle" className="h-full pr-4" align="center">
          <div className="h-full flex items-center text-2xl">
            <IoSearchSharp />
          </div>

          <div className="h-full flex items-center" onClick={handleNavigateToProfile}>
            <MobileProfileHeader />
          </div>
        </Flex>
      </Flex>
    </Header>
  );
};

export default MobileHeder;
