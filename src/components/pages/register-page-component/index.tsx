import useFormRegister from "@/features/auth/hooks/use-form-register-auth";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import AuthCarousel from "@components/layout/carousel/auth-carousel";
import RegisterForm from "@components/layout/form/register-form";
import { Flex, Layout } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterPageComponent: React.FC = () => {
  const { screenWidth } = useGetClientScreenWidth();
  const { formAuthRegister, handleChange, handleOnSubmit, isLoading, resultRegister, handleGoogleRegister } = useFormRegister();
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
        <RegisterForm
          alert={{
            isShow: resultRegister?.message !== undefined,
            message: resultRegister?.message,
            type: resultRegister?.isSuccess ? "success" : "error",
          }}
          isLoading={isLoading}
          formValue={formAuthRegister}
          handleOnSubmit={handleOnSubmit}
          handleEmailChange={handleChange}
          handlePasswordChange={handleChange}
          handleUserNameChange={handleChange}
          goToLogin={() => navigate("/login")}
          googleRegisterHandler={handleGoogleRegister}
        />
      </Flex>
    </Layout>
  );
};

export default RegisterPageComponent;
