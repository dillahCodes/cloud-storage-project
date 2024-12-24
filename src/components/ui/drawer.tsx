import React from "react";
import { Drawer as AntdDrawer, DrawerProps as AntdDrawerProps } from "antd";
import { neoBrutalBorderVariants, NeoBrutalVariant } from "@/theme/antd-theme";

interface DrawerProps extends AntdDrawerProps {
  isDrawerOpen: boolean;
  onDrawerClose: () => void;
  children: React.ReactNode;
  neoBrutalType?: NeoBrutalVariant;
}

const Drawer: React.FC<DrawerProps> = ({ isDrawerOpen, onDrawerClose, children, neoBrutalType = "small", ...props }) => {
  return (
    <AntdDrawer
      closable={false}
      onClose={() => onDrawerClose()}
      open={isDrawerOpen}
      {...props}
      style={neoBrutalBorderVariants[neoBrutalType]}
    >
      {children}
    </AntdDrawer>
  );
};

export default Drawer;
