import { FormAuthRegister } from "@/features/auth/auth";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import Alert from "@components/ui/alert";
import Button from "@components/ui/button";
import { Flex, Input, Typography } from "antd";
import React from "react";
import { FaFacebookF, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

interface RegisterFormProps {
  goToLogin?: () => void;
  handleUserNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleOnSubmit: (event: React.FormEvent) => void;
  formValue: FormAuthRegister;
  isLoading: boolean;
  alert?: {
    isShow?: boolean;
    type?: "success" | "info" | "warning" | "error";
    message?: string;
  };
  googleRegisterHandler?: () => void;
}

const { Text } = Typography;
const RegisterForm: React.FC<RegisterFormProps> = ({
  goToLogin,
  handleEmailChange,
  handlePasswordChange,
  handleUserNameChange,
  handleOnSubmit,
  googleRegisterHandler,
  formValue,
  isLoading,
  alert,
}) => {
  return (
    <Flex className="w-full p-5" vertical justify="space-evenly" gap="large">
      <Flex vertical gap="small">
        <Text className="text-2xl capitalize font-poppins font-bold">register</Text>
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
            onChange={handleUserNameChange}
            value={formValue.username}
            className="w-full border-2 border-black"
            name="username"
            type="text"
            placeholder="username"
            size="large"
            style={neoBrutalBorderVariants.medium}
            required
          />
          <Input
            onChange={handleEmailChange}
            className="w-full border-2 border-black"
            name="email"
            type="email"
            value={formValue.email}
            placeholder="email"
            size="large"
            style={neoBrutalBorderVariants.medium}
            required
          />
          <Input.Password
            onChange={handlePasswordChange}
            className="w-full border-2 border-black"
            placeholder="password"
            name="password"
            value={formValue.password}
            size="large"
            style={neoBrutalBorderVariants.medium}
            required
          />
          <Button
            loading={isLoading}
            type="primary"
            htmlType="submit"
            size="large"
            className="capitalize text-black font-archivo border-2"
            neoBrutalType="medium"
          >
            register
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
            onClick={googleRegisterHandler}
            icon={<FcGoogle />}
          />
          <Button
            type="primary"
            size="large"
            className="capitalize text-black font-archivo border-2"
            neoBrutalType="medium"
            icon={<FaGithub />}
          />
          <Button
            type="primary"
            size="large"
            neoBrutalType="medium"
            className="capitalize text-black font-archivo border-2"
            icon={<FaFacebookF className="text-blue-700" />}
          />
        </Flex>

        <Text className="text-sm capitalize font-archivo text-center  cursor-pointer">
          already have an account?
          <Text className="text-sm ml-1 capitalize font-archivo underline cursor-pointer" onClick={goToLogin}>
            sign in
          </Text>
        </Text>
      </Flex>
    </Flex>
  );
};

export default RegisterForm;
