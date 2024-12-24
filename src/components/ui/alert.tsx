import { neoBrutalBorderVariants, NeoBrutalVariant } from "@/theme/antd-theme";
import { Alert as AntdAlert, AlertProps as AntdAlertProps } from "antd";

interface AlertProps extends AntdAlertProps {
  neoBrutalVariants: NeoBrutalVariant;
}

const Alert: React.FC<AlertProps> = ({ neoBrutalVariants, ...props }) => {
  return (
    <AntdAlert
      message="Success Tips"
      className="rounded-sm font-archivo"
      type="success"
      showIcon
      style={neoBrutalBorderVariants[neoBrutalVariants]}
      {...props}
    />
  );
};

export default Alert;
