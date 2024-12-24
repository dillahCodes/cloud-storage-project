import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import { withFloatingElement } from "@components/hoc/with-floating-element";
import { Avatar, AvatarProps } from "antd";

interface AvatarWithUserPhotoProps extends AvatarProps {
  size?: number;
}
const AvatarWithUserPhoto: React.FC<AvatarWithUserPhotoProps> = ({ size = 40, ...props }) => {
  return <Avatar size={size} className="bg-transparent border-2 border-black" style={neoBrutalBorderVariants.small} {...props} />;
};

export default AvatarWithUserPhoto;

export const WithFloatingElementAvatarUserPhoto = withFloatingElement(AvatarWithUserPhoto);
