import useFormLoginAuth from "@/features/auth/hooks/use-form-login-auth";
import useFormRegister from "@/features/auth/hooks/use-form-register-auth";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import AuthCarousel from "@components/layout/carousel/auth-carousel";
import LoginForm from "@components/layout/form/login-form";
import { Flex, Layout } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPageComponent: React.FC = () => {
  const { handleGoogleRegister } = useFormRegister();
  const { formAuthLogin, handleChange, handleOnSubmit, isLoading, resultLogin } = useFormLoginAuth();
  const { screenWidth } = useGetClientScreenWidth();
  const navigate = useNavigate();

  return (
    <Layout className="min-h-screen flex justify-center items-center p-5 min-w-[360px]">
      <Flex
        className="max-w-screen-lg w-full max-md:max-w-[400px]  rounded-sm border-2 border-black"
        style={neoBrutalBorderVariants.large}
      >
        {screenWidth >= 768 && (
          <div
            className="w-full max-md:hidden  flex justify-center items-center border-r-2 border-black"
            style={{ backgroundColor: themeColors.primary200 }}
          >
            <AuthCarousel />
          </div>
        )}
        <LoginForm
          isLoading={isLoading}
          formValue={formAuthLogin}
          handleEmailChange={handleChange}
          handleOnSubmit={handleOnSubmit}
          handlePasswordChange={handleChange}
          alert={{
            isShow: resultLogin?.message !== undefined,
            message: resultLogin?.message,
            type: resultLogin?.isSuccess ? "success" : "error",
          }}
          goToRegister={() => navigate("/register")}
          googleLoginHandler={handleGoogleRegister}
          gotoForgotPassword={() => navigate("/forgot-password")}
        />
      </Flex>
    </Layout>
  );
};

export default LoginPageComponent;
