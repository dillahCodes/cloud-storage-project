import { FormAuthLogin } from "@/features/auth/auth";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import Alert from "@components/ui/alert";
import Button from "@components/ui/button";
import { Flex, Input, message, Typography } from "antd";
import React from "react";
import { FaFacebookF, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

interface LoginFormProps {
  goToRegister?: () => void;
  gotoForgotPassword?: () => void;
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleOnSubmit: (event: React.FormEvent) => void;
  formValue: FormAuthLogin;
  isLoading: boolean;
  alert?: {
    isShow?: boolean;
    type?: "success" | "info" | "warning" | "error";
    message?: string;
  };
  googleLoginHandler?: () => void;
}

const { Text } = Typography;
const LoginForm: React.FC<LoginFormProps> = ({
  goToRegister,
  gotoForgotPassword,
  alert,
  formValue,
  isLoading,
  handleEmailChange,
  handleOnSubmit,
  handlePasswordChange,
  googleLoginHandler,
}) => {
  const handleMessageComingSoon = () =>
    message.open({ type: "info", content: "coming soon", className: "font-archivo text-sm", key: "auth-coming-soon" });

  return (
    <Flex className="w-full p-5" vertical justify="space-evenly" gap="large">
      <Flex vertical gap="small">
        <Text className="text-2xl capitalize font-poppins font-bold">login</Text>
        <Text className="text-sm capitalize font-archivo">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Obcaecati, hic.
        </Text>
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
          <Input.Password
            onChange={handlePasswordChange}
            value={formValue?.password}
            className="w-full border-2 border-black"
            placeholder="password"
            name="password"
            size="large"
            style={neoBrutalBorderVariants.medium}
          />
          <Text className="text-sm capitalize font-archivo self-end underline cursor-pointer" onClick={gotoForgotPassword}>
            forgot password?
          </Text>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={isLoading}
            className="capitalize text-black font-archivo border-2"
            neoBrutalType="medium"
          >
            login
          </Button>
        </Flex>
      </form>

      <Flex gap="middle" vertical>
        <Flex className="max-w-xs  mx-auto w-full items-center gap-2">
          <div className="flex-grow h-[1px] " style={{ backgroundColor: themeColors.primary200 }} />
          <Text className="text-sm capitalize font-archivo min-w-fit">OR</Text>
          <div className="flex-grow h-[1px] " style={{ backgroundColor: themeColors.primary200 }} />
        </Flex>

        <Flex gap="middle" className="mx-auto">
          <Button
            type="primary"
            size="large"
            className="capitalize text-black font-archivo border-2"
            neoBrutalType="medium"
            icon={<FcGoogle />}
            onClick={googleLoginHandler}
          />
          <Button
            type="primary"
            size="large"
            className="capitalize text-black font-archivo border-2"
            neoBrutalType="medium"
            icon={<FaGithub />}
            onClick={handleMessageComingSoon}
          />
          <Button
            type="primary"
            size="large"
            neoBrutalType="medium"
            className="capitalize text-black font-archivo border-2"
            icon={<FaFacebookF className="text-blue-700" />}
            onClick={handleMessageComingSoon}
          />
        </Flex>

        <Text className="text-sm capitalize font-archivo text-center  cursor-pointer">
          don't have an account?
          <Text className="text-sm ml-1 capitalize font-archivo underline cursor-pointer" onClick={goToRegister}>
            sign up
          </Text>
        </Text>
      </Flex>
    </Flex>
  );
};

export default LoginForm;
