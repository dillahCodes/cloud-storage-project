import useFormForgotPassword from "@/features/auth/hooks/use-form-forgot-password";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import AuthCarousel from "@components/layout/carousel/auth-carousel";
import FrogotPasswordForm from "@components/layout/form/forgot-password-form";
import { Flex, Layout } from "antd";

const ForgotPasswordPageComponent: React.FC = () => {
  const { screenWidth } = useGetClientScreenWidth();
  const { alert, email, handleChange, handleGoToLogin, handleOnSubmit, isLoading } = useFormForgotPassword();

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

        <FrogotPasswordForm
          alert={alert}
          email={email}
          handleEmailChange={handleChange}
          handleGotoLogin={handleGoToLogin}
          handleOnSubmit={handleOnSubmit}
          isLoading={isLoading}
        />
      </Flex>
    </Layout>
  );
};

export default ForgotPasswordPageComponent;
