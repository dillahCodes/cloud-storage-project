import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import Alert from "@components/ui/alert";
import Button from "@components/ui/button";
import { Flex, Input, Typography } from "antd";

interface ForgotPasswordProps {
  alert?: {
    isShow: boolean;
    message: string;
    type: "success" | "error";
  };
  formValue: {
    email: string;
  };
  isLoading: boolean;
  handleOnSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGotoLogin: () => void;
}

const { Text } = Typography;
const FrogotPasswordForm: React.FC<ForgotPasswordProps> = ({
  alert,
  formValue,
  isLoading,
  handleOnSubmit,
  handleEmailChange,
  handleGotoLogin,
}) => {
  return (
    <Flex className="w-full p-5" vertical justify="space-evenly" gap="large">
      <Flex vertical gap="small">
        <Text className="text-2xl capitalize font-poppins font-bold">Reset Password</Text>
        <Text className="text-sm capitalize font-archivo">Lorem ipsum dolor, sit amet consectetur adipisicing.</Text>
      </Flex>

      {alert?.isShow && (
        <Alert
          message={alert?.message}
          className="rounded-sm font-archivo"
          type={alert?.type}
          showIcon
          neoBrutalVariants="medium"
        />
      )}

      <form onSubmit={handleOnSubmit}>
        <Flex vertical gap="middle">
          <Input
            value={formValue?.email}
            onChange={handleEmailChange}
            className="w-full border-2 border-black"
            name="email"
            type="email"
            placeholder="email"
            size="large"
            style={neoBrutalBorderVariants.medium}
          />
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={isLoading}
            className="capitalize text-black font-archivo border-2"
            neoBrutalType="medium"
          >
            Reset Password
          </Button>
        </Flex>
      </form>

      <Flex gap="middle" vertical>
        <Flex className="max-w-xs  mx-auto w-full items-center gap-2">
          <div className="flex-grow h-[1px] " style={{ backgroundColor: themeColors.primary200 }} />
          <Text className="text-sm capitalize font-archivo min-w-fit">OR</Text>
          <div className="flex-grow h-[1px] " style={{ backgroundColor: themeColors.primary200 }} />
        </Flex>

        <Text className="text-sm capitalize font-archivo text-center  cursor-pointer">
          already have an account?
          <Text className="text-sm ml-1 capitalize font-archivo underline cursor-pointer" onClick={handleGotoLogin}>
            Sign In
          </Text>
        </Text>
      </Flex>
    </Flex>
  );
};

export default FrogotPasswordForm;
