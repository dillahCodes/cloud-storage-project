import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import animationUploadIcon from "@assets/lotties/uploading-file-icon.json";
import classNames from "classnames";
import Lottie from "lottie-react";

// Interface for ButtonUploadStatus component props
interface ButtonUploadStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  notifCount?: number;
}

// ButtonUploadStatus component
const ButtonUploadStatus: React.FC<ButtonUploadStatusProps> = ({ notifCount, ...props }) => {
  return (
    <div
      {...props}
      className={classNames(" cursor-pointer z-10 border-2 border-black rounded-sm max-w-[57.6px]")}
      style={{ ...neoBrutalBorderVariants.medium, background: themeColors.primary300 }}
    >
      <div className="w-full h-full relative p-4">
        {/* Notification badge */}
        <div className="bg-red-500 absolute -top-2 -right-3 font-archivo font-bold text-white w-6 h-6 text-center text-xs rounded-full flex justify-center items-center">
          {notifCount && notifCount > 99 ? "99+" : notifCount}
        </div>

        {/* Lottie animation */}
        <Lottie animationData={animationUploadIcon} />
      </div>
    </div>
  );
};

export default ButtonUploadStatus;
