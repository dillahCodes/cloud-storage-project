import useFormLoginAuth from "@/features/auth/hooks/use-form-login-auth";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import AuthCarousel from "@components/layout/carousel/auth-carousel";
import LoginForm from "@components/layout/form/login-form";
import { Flex, Layout } from "antd";
import React from "react";

const LoginCarousel = () => (
  <div
    className="w-full max-md:hidden  flex justify-center items-center border-r-2 border-black"
    style={{ backgroundColor: themeColors.primary200 }}
  >
    <AuthCarousel />
  </div>
);

const LoginPageComponent: React.FC = () => {
  const { screenWidth } = useGetClientScreenWidth();
  const {
    alert,
    formValue,
    handleEmailChange,
    handleOnSubmit,
    handlePasswordChange,
    isLoading,
    handleGoToForgotPassword,
    handleGoToRegister,
    googleLoginHandler,
  } = useFormLoginAuth();

  const isShowLoginCarousel = screenWidth >= 768;

  return (
    <Layout className="min-h-screen flex justify-center items-center p-5 min-w-[360px]">
      <Flex
        className="max-w-screen-lg w-full max-md:max-w-[400px]  rounded-sm border-2 border-black"
        style={neoBrutalBorderVariants.large}
      >
        {isShowLoginCarousel && <LoginCarousel />}
        <LoginForm
          alert={alert}
          isLoading={isLoading}
          formValue={formValue}
          handleOnSubmit={handleOnSubmit}
          handleEmailChange={handleEmailChange}
          handlePasswordChange={handlePasswordChange}
          goToRegister={handleGoToRegister}
          googleLoginHandler={googleLoginHandler}
          gotoForgotPassword={handleGoToForgotPassword}
        />
      </Flex>
    </Layout>
  );
};

export default LoginPageComponent;
