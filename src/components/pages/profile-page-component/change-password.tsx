import useChangePassword from "@/features/auth/hooks/use-change-password";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import Alert from "@components/ui/alert";
import Button from "@components/ui/button";
import { Flex, Input, Typography } from "antd";

const { Text } = Typography;
const ChangePassword: React.FC = () => {
  const { handleChangeState, handleConfirmChangePassword, changePasswordStatus } = useChangePassword();

  return (
    <div
      className="border-2 border-black  w-full rounded-md p-3"
      style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.primary200 }}
    >
      <div
        className="w-fit border-2 border-black p-1 rounded-sm px-2"
        style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.bg100 }}
      >
        <Text className="capitalize font-bold font-archivo">Change Password</Text>
      </div>

      {changePasswordStatus.type && (
        <Alert
          message={changePasswordStatus.message}
          className="rounded-sm font-archivo mt-3 capitalize"
          type={changePasswordStatus.type}
          showIcon
          neoBrutalVariants="medium"
        />
      )}

      <Flex
        vertical
        className="p-3 w-full mt-3 border-2 border-black rounded-sm"
        gap="middle"
        style={{ backgroundColor: themeColors.bg100, ...neoBrutalBorderVariants.medium }}
      >
        <Flex className="w-full" align="center" gap="middle" wrap>
          <Input.Password
            className="w-full border-2 border-black rounded-sm max-w-xs"
            placeholder="Enter Current Password"
            size="large"
            style={neoBrutalBorderVariants.medium}
            name="currentPassword"
            onChange={handleChangeState}
          />
          <Input.Password
            className="w-full border-2 border-black rounded-sm max-w-xs"
            placeholder="Enter New Password"
            size="large"
            style={neoBrutalBorderVariants.medium}
            name="newPassword"
            onChange={handleChangeState}
          />
          <Input.Password
            className="w-full border-2 border-black rounded-sm max-w-xs"
            placeholder="Confirm New Password"
            size="large"
            name="confirmPassword"
            style={neoBrutalBorderVariants.medium}
            onChange={handleChangeState}
          />
          <Button
            type="primary"
            loading={changePasswordStatus.status === "loading"}
            onClick={handleConfirmChangePassword}
            className="w-fit rounded-sm text-black font-archivo"
            neoBrutalType="medium"
          >
            Confirm
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default ChangePassword;
