import React, { memo } from "react";
import { neoBrutalBorderVariants, NeoBrutalVariant } from "@/theme/antd-theme";
import { Button as AntdButton, ButtonProps as AntdButtonProps } from "antd";
import classNames from "classnames";

export interface ButtonProps extends AntdButtonProps {
  neoBrutalType?: NeoBrutalVariant;
  className?: string; // Allows additional custom classes
}

const ButtonComponent = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ children, neoBrutalType = "small", className, ...props }, ref) => {
    const buttonClass = classNames("border-black", className);

    return (
      <AntdButton {...props} ref={ref} className={buttonClass} style={neoBrutalBorderVariants[neoBrutalType]}>
        {children}
      </AntdButton>
    );
  }
);

const Button = memo(ButtonComponent);

Button.displayName = "Button";

export default Button;
