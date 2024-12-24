import useUser from "@/features/auth/hooks/use-user";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import useMobileHeaderTitle from "@/hooks/use-mobile-header-title";
import MainLayout from "@components/layout/main-layout";
import { Flex, Layout } from "antd";
import classNames from "classnames";
import { useMemo } from "react";
import ChangeEmail from "./change-email";
import ChangeName from "./change-name";
import ChangePassword from "./change-password";
import ChangeProfileImage from "./change-profile-image";
import UserInfo from "./user-info";
import VerifyEmail from "./verify-email";
import useResetAllBreadcrumbItems from "@/features/breadcrumb/hooks/use-reset-all-breadcrumb-items";

const ProfilePageComponent: React.FC = () => {
  useMobileHeaderTitle("my profile");

  useResetAllBreadcrumbItems({
    shouldReset: true,
    addFirstBreadcrumbItem: {
      label: "my profile",
      path: "/storage/profile",
      key: "my profile",
      icon: "user",
    },
  });

  const { user } = useUser();
  const { screenWidth } = useGetClientScreenWidth();

  const isUserLoginWithGoogle = useMemo(() => {
    return user?.providerData.some((data) => data.providerId === "google.com");
  }, [user]);

  const isWrap = useMemo(() => {
    return screenWidth < 990 ? true : false;
  }, [screenWidth]);

  return (
    <MainLayout showAddButton={false}>
      <Layout
        className={classNames("w-full p-3  ", {
          "max-w-screen-lg mx-auto": !isWrap,
          "max-w-lg mx-auto": isWrap,
        })}
      >
        <Flex vertical gap="small">
          <Layout
            className={classNames("min-h-screen w-full mb-3", {
              "max-w-screen-lg mx-auto": !isWrap,
              "max-w-lg mx-auto": isWrap,
            })}
          >
            <Flex gap="large" wrap={isWrap}>
              <UserInfo />
              <Flex vertical className="w-full" gap="large">
                <ChangeProfileImage />
                <VerifyEmail />
                <ChangeName />
                {!isUserLoginWithGoogle && <ChangePassword />}
                {!isUserLoginWithGoogle && <ChangeEmail />}
              </Flex>
            </Flex>
          </Layout>
        </Flex>
      </Layout>
    </MainLayout>
  );
};

export default ProfilePageComponent;
