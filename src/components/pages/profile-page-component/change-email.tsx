import useChangeEmail from "@/features/auth/hooks/use-change-mail";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import Alert from "@components/ui/alert";
import Button from "@components/ui/button";
import { Flex, Input, Typography } from "antd";

const { Text } = Typography;
const ChangeEmail: React.FC = () => {
  const { handleOnChange, handleConfrimChangeEmail, changeEmailStatus } = useChangeEmail();
  return (
    <div
      className="border-2 border-black  w-full rounded-md p-3"
      style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.primary200 }}
    >
      <div
        className="w-fit border-2 border-black p-1 rounded-sm px-2"
        style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.bg100 }}
      >
        <Text className="capitalize font-bold font-archivo">Change Email</Text>
      </div>

      {changeEmailStatus.type && (
        <Alert
          message={changeEmailStatus.message}
          className="rounded-sm font-archivo mt-3 capitalize"
          type={changeEmailStatus.type}
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
          <Input
            className="w-full border-2 border-black rounded-sm max-w-xs"
            placeholder="Enter New Email"
            type="email"
            onChange={handleOnChange}
            size="large"
            name="newEmail"
            style={neoBrutalBorderVariants.medium}
          />
          <Input.Password
            className="w-full border-2 border-black rounded-sm max-w-xs"
            placeholder="Enter Current Password"
            size="large"
            name="currentPassword"
            onChange={handleOnChange}
            style={neoBrutalBorderVariants.medium}
          />
          <Button
            type="primary"
            loading={changeEmailStatus.status === "loading"}
            onClick={handleConfrimChangeEmail}
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

export default ChangeEmail;
