import useFormRegister from "@/features/auth/hooks/use-form-register-auth";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import AuthCarousel from "@components/layout/carousel/auth-carousel";
import RegisterForm from "@components/layout/form/register-form";
import { Flex, Layout } from "antd";
import React from "react";

const RegisterCarousel = () => (
  <div
    className="w-full max-md:hidden  flex justify-center items-center border-r-2 border-black"
    style={{ backgroundColor: themeColors.primary200 }}
  >
    <AuthCarousel />
  </div>
);

const RegisterPageComponent: React.FC = () => {
  const { handleChange, handleGoogleRegister, handleOnSubmit, handleGoToLoginPage, form, status, response } = useFormRegister();
  const { screenWidth } = useGetClientScreenWidth();

  const isRegisterLoading: boolean = status === "loading";
  const alert = response ? { message: response.message, type: response.type } : null;
  const isShowRegisterCarousel = screenWidth >= 768;

  return (
    <Layout className="min-h-screen flex justify-center items-center p-5 min-w-[360px]">
      <Flex
        className="max-w-screen-lg w-full max-md:max-w-[400px]  rounded-sm border-2 border-black"
        style={neoBrutalBorderVariants.large}
      >
        {isShowRegisterCarousel && <RegisterCarousel />}
        <RegisterForm
          alert={alert}
          isLoading={isRegisterLoading}
          formValue={form}
          handleOnSubmit={handleOnSubmit}
          handleEmailChange={handleChange}
          handlePasswordChange={handleChange}
          handleUserNameChange={handleChange}
          goToLogin={handleGoToLoginPage}
          googleRegisterHandler={handleGoogleRegister}
        />
      </Flex>
    </Layout>
  );
};

export default RegisterPageComponent;
