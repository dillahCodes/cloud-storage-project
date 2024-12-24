import useChangeName from "@/features/auth/hooks/use-change-name";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import Alert from "@components/ui/alert";
import Button from "@components/ui/button";
import { Flex, Input, Typography } from "antd";

const { Text } = Typography;
const ChangeName: React.FC = () => {
  const { name, changeNameStatus, handleChangeName, handleConfirmChangeName } = useChangeName();
  return (
    <div
      className="border-2 border-black  w-full rounded-md p-3"
      style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.primary200 }}
    >
      <div
        className="w-fit border-2 border-black p-1 rounded-sm px-2"
        style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.bg100 }}
      >
        <Text className="capitalize font-bold font-archivo">Change Name</Text>
      </div>

      {changeNameStatus.type && (
        <Alert
          message={changeNameStatus.message}
          className="rounded-sm font-archivo mt-3 capitalize"
          type={changeNameStatus.type}
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
            defaultValue={name || ""}
            type="text"
            size="large"
            onChange={handleChangeName}
            style={neoBrutalBorderVariants.medium}
          />
          <Button
            onClick={handleConfirmChangeName}
            type="primary"
            disabled={changeNameStatus.status === "loading"}
            loading={changeNameStatus.status === "loading"}
            className="w-fit rounded-sm text-black font-archivo"
            neoBrutalType="medium"
          >
            Confirm
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default ChangeName;
