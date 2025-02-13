import { messageSelector } from "@/features/message/slice/message-slice";
import useMobileMoveNavigate from "@/features/move-folder-or-file/hooks/use-mobile-move-navigate";
import useDetectLocation from "@/hooks/use-detect-location";
import useDrawer from "@/hooks/use-drawer";
import useMobileHeaderTitle from "@/hooks/use-mobile-header-title";
import { themeColors } from "@/theme/antd-theme";
import Button from "@components/ui/button";
import { Badge, Flex, Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MobileProfileHeader from "./mobile-profile-header";
import { setIsSearchbarOpen } from "@/features/search-folder-or-file/slice/search-bar-slice";

const { Text } = Typography;

const MobileHeder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isMoveFolderOrFileLocation } = useDetectLocation();
  const { title } = useMobileHeaderTitle();
  const { messageCount } = useSelector(messageSelector);

  const { toggleDrawerMenu } = useDrawer();
  const { handleCancelMove } = useMobileMoveNavigate();

  const handleNavigateToProfile = () => navigate("/storage/profile", { replace: true });
  const handleOpenSearchBar = () => dispatch(setIsSearchbarOpen(true));

  return (
    <Header className="">
      <Flex className="w-full h-[58px] border-b-2 bg-transparent border-black" align="center" gap="small" justify="space-between">
        <Flex gap="large" align="center" className="h-full ml-4 ">
          {isMoveFolderOrFileLocation ? (
            /**
             * cancel move button
             */
            <Button type="primary" onClick={handleCancelMove} className="cursor-pointer text-xl text-black  w-fit px-2 rounded-sm bg-[#FFB6C1] ">
              <IoMdClose />
            </Button>
          ) : (
            /**
             * hamburger menu
             */
            <Badge
              className=" cursor-pointer  flex items-center text-2xl"
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
          )}

          <Text className="text-lg font-archivo">{title}</Text>
        </Flex>

        {!isMoveFolderOrFileLocation && (
          /**
           * profile and search button
           */
          <Flex gap="middle" className="h-full pr-4" align="center">
            <div className="h-full flex items-center text-2xl" onClick={handleOpenSearchBar}>
              <IoSearchSharp />
            </div>

            <div className="h-full flex items-center" onClick={handleNavigateToProfile}>
              <MobileProfileHeader />
            </div>
          </Flex>
        )}
      </Flex>
    </Header>
  );
};

export default MobileHeder;
