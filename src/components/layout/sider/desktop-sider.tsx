import logo from "@/assets/logo.svg";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import useSider from "@/hooks/use-sider";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import { Flex, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DesktopSiderMenu from "./desktop-sider-menu";

const { Text } = Typography;
const DesktopSider: React.FC = () => {
  const navigate = useNavigate();
  const { isDesktopDevice, isTabletDevice } = useGetClientScreenWidth();
  const { siderState } = useSider();
  const [showText, setShowText] = useState(true);

  const changeSiderWIdth = useMemo(() => {
    if (isTabletDevice) {
      return "30%";
    } else if (isDesktopDevice) {
      return "22%";
    } else {
      return "33%";
    }
  }, [isTabletDevice, isDesktopDevice]);

  // delay show text
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (siderState.isSiderOpen) {
      timer = setTimeout(() => setShowText(true), 200);
    } else {
      setShowText(false);
    }

    return () => clearTimeout(timer);
  }, [siderState.isSiderOpen]);

  return (
    <Sider
      width={changeSiderWIdth}
      collapsed={!siderState.isSiderOpen}
      className="border-2 border-black border-t-0 border-l-0"
      style={{ ...neoBrutalBorderVariants.small }}
    >
      <Flex
        onClick={() => navigate("/")}
        align="center"
        className="border-b-2 p-[4.5px] border-black cursor-pointer"
        gap="small"
        justify={!siderState.isSiderOpen ? "center" : undefined}
      >
        <img src={logo} alt="logo" className="w-12 h-12 object-contain" />
        {showText && <Text className="text-xl capitalize font-poppins font-bold">{"<CherryStore />"}</Text>}
      </Flex>

      <DesktopSiderMenu showText={showText} />
    </Sider>
  );
};

export default DesktopSider;
