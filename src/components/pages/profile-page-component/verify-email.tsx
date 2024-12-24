import useUser from "@/features/auth/hooks/use-user";
import useVerifyEmail from "@/features/auth/hooks/use-verify-email";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import Alert from "@components/ui/alert";
import Button from "@components/ui/button";
import { Flex, Input, Typography } from "antd";

const { Text } = Typography;
const VerifyEmail: React.FC = () => {
  const { user } = useUser();
  const { handleConfirmVerifyEmail, verifyStatus, countdown } = useVerifyEmail();

  return (
    <div
      className="border-2 border-black  w-full rounded-md p-3"
      style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.primary200 }}
    >
      <div
        className="w-fit border-2 border-black p-1 rounded-sm px-2"
        style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.bg100 }}
      >
        <Text className="capitalize font-bold font-archivo">Verify Email {user?.emailVerified ? "✅" : "❌"}</Text>
      </div>

      {verifyStatus.type && (
        <Alert
          message={verifyStatus.message}
          className="rounded-sm font-archivo mt-3 capitalize"
          type={verifyStatus.type}
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
        <Flex className="w-full" align="center" gap="middle">
          <Input
            className="w-full border-2 border-black rounded-sm max-w-xs"
            placeholder="Enter New Name"
            value={user?.email || ""}
            type="email"
            size="large"
            style={neoBrutalBorderVariants.medium}
          />
          <Button
            type="primary"
            className="rounded-sm text-black font-archivo"
            neoBrutalType="medium"
            loading={verifyStatus.status === "loading" || countdown !== null}
            onClick={handleConfirmVerifyEmail}
            disabled={verifyStatus.status === "loading" || countdown !== null || user?.emailVerified}
          >
            {countdown !== null ? `Verify (${countdown}s)` : "Verify"}
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default VerifyEmail;
