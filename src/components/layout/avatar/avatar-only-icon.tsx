import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import { withFloatingElement } from "@components/hoc/with-floating-element";
import { Avatar, AvatarProps } from "antd";
import classNames from "classnames";
import { FaRegUser } from "react-icons/fa";

interface AvatarOnlyIconProps extends AvatarProps {
  size?: number;
  iconClassname?: string;
  avatarOnlyIconClassName?: string;
  icon?: React.ReactNode;
}
const AvatarOnlyIcon: React.FC<AvatarOnlyIconProps> = ({
  size = 40,
  iconClassname,
  icon = <FaRegUser />,
  avatarOnlyIconClassName,
  ...props
}) => {
  return (
    <Avatar
      size={size}
      className={classNames("bg-transparent border-2 border-black", avatarOnlyIconClassName)}
      style={neoBrutalBorderVariants.small}
      {...props}
      icon={<span className={classNames("text-base text-black", iconClassname)}>{icon}</span>}
    />
  );
};

export default AvatarOnlyIcon;
export const WithFloatingElementAvatarOnlyIcon = withFloatingElement(AvatarOnlyIcon);
