import { ConfigProvider } from "antd";
import React from "react";

interface BorderVariant {
  border: string;
  boxShadow: string;
}

interface NeoBrutalBorderVariants {
  small: BorderVariant;
  medium: BorderVariant;
  large: BorderVariant;
  leftSmall: BorderVariant;
  leftMedium: BorderVariant;
  leftLarge: BorderVariant;
}

export const themeColors = {
  primary100: "#FF5277",
  primary200: "#ff87a6",
  primary300: "#fff1ff",
  accent100: "#FFB6C1",
  accent200: "#985863",
  text100: "#333333",
  text200: "#5c5c5c",
  bg100: "#FFD3E0",
  bg200: "#f5c9d6",
  bg300: "#cba2ae",
} as const;

export type NeoBrutalVariant = "small" | "medium" | "large" | "leftSmall" | "leftMedium" | "leftLarge";
export const neoBrutalBorderVariants: NeoBrutalBorderVariants = {
  small: {
    border: `1px solid !important`,
    boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 1)",
  },
  medium: {
    border: `1px solid !important`,
    boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)",
  },
  large: {
    border: `1px solid !important`,
    boxShadow: "6px 6px 0px 0px rgba(0, 0, 0, 1)",
  },
  leftSmall: {
    border: `1px solid !important`,
    boxShadow: "-2px 2px 0px 0px rgba(0, 0, 0, 1)",
  },
  leftMedium: {
    border: `1px solid !important`,
    boxShadow: "-4px 4px 0px 0px rgba(0, 0, 0, 1)",
  },
  leftLarge: {
    border: `1px solid !important`,
    boxShadow: "-6px 6px 0px 0px rgba(0, 0, 0, 1)",
  },
};

interface AntdThemeProviderProps {
  children: React.ReactNode;
}

const AntdThemeProvider: React.FC<AntdThemeProviderProps> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: themeColors.primary200,
          colorText: themeColors.text100,
          colorLinkHover: themeColors.primary100,
          colorLink: themeColors.primary100,
        },
        components: {
          Layout: {
            headerPadding: 0,
            headerHeight: "auto",
            headerBg: themeColors.primary200,
            footerPadding: 0,
            bodyBg: themeColors.primary300,
            siderBg: themeColors.primary300,
          },
          Button: {
            defaultColor: themeColors.primary100,
            defaultHoverColor: themeColors.primary200,
            colorPrimaryHover: themeColors.primary100,
            colorPrimaryBg: themeColors.primary200,
            colorBgContainerDisabled: themeColors.accent100,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdThemeProvider;
