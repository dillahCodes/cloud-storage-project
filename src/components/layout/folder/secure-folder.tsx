import { Flex, Spin, Switch, Typography } from "antd";
import { PiFolderLockDuotone } from "react-icons/pi";
import AvatarOnlyIcon from "../avatar/avatar-only-icon";

const { Text } = Typography;
interface SecureFolderProps {
  isChecked: boolean;
  isLoading: boolean;
  handleToggle: () => Promise<void>;
}
const SecureFolder: React.FC<SecureFolderProps> = ({ isChecked, isLoading, handleToggle }) => {
  if (isLoading) return <Spin />;

  return (
    <>
      <Text className="text-base capitalize font-medium">Secured Access</Text>
      <Flex className="w-full" vertical>
        <Flex className="w-full" gap="middle" align="center" justify="space-between">
          <Flex align="center" gap="middle">
            <div>
              <AvatarOnlyIcon icon={<PiFolderLockDuotone />} size={35} />
            </div>

            <Flex vertical gap={3}>
              <Flex align="center" gap="small" className="w-fit">
                <Text className="text-sm ml-auto font-medium font-archivo">Secured this folder</Text>
              </Flex>
              <Text className="text-xs">Only people with access can modify or delete this folder.</Text>
            </Flex>
          </Flex>

          <Switch checked={isChecked} onChange={handleToggle} />
        </Flex>
      </Flex>
    </>
  );
};

export default SecureFolder;
