import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { PiFolderLockDuotone } from "react-icons/pi";

const { Text } = Typography;
interface MoadlFolderPermissionDeniedProps {
  closeModal: () => void;
}
const MoadlFolderPermissionDenied: React.FC<MoadlFolderPermissionDeniedProps> = ({ closeModal }) => {
  return (
    <Flex vertical gap="middle" className="w-full">
      <Flex className="w-full" align="start" gap="middle">
        <div className="p-2 border-2  border-black rounded-sm bg-[#fff1ff]" style={neoBrutalBorderVariants.medium}>
          <Text className="font-archivo text-4xl">
            <PiFolderLockDuotone />
          </Text>
        </div>
        <Flex vertical className="w-full">
          <Text className="font-archivo text-base font-bold">Restricted Access</Text>
          <Text className="font-archivo text-sm ">You don't have permission to add folder or file in this folder.</Text>
        </Flex>
      </Flex>
      <Button
        onClick={closeModal}
        className="w-fit capitalize rounded-sm font-archivo cursor-pointer text-black ml-auto"
        type="primary"
        neoBrutalType="medium"
      >
        confirm
      </Button>
    </Flex>
  );
};
export default MoadlFolderPermissionDenied;
