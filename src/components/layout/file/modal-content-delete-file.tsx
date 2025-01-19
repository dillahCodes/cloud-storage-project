import useHandleDeleteFile from "@/features/file/hooks/use-handle-delete-file";
import { fileOptionsSelector } from "@/features/file/slice/file-options-slice";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import abbreviateText from "@/util/abbreviate-text";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";

const { Text } = Typography;

const ModalContentDeleteFile = () => {
  const { activeFileData } = useSelector(fileOptionsSelector);
  const { handleCancel, handleConfirm, isLoading } = useHandleDeleteFile();

  return (
    <Flex className="w-full bg-white rounded-md p-4 border-2 border-black" vertical gap="middle" style={neoBrutalBorderVariants.small}>
      <Flex vertical gap="small">
        {/* Header*/}
        <Flex align="center" gap="small">
          <Text className="text-xl font-bold text-red-500">
            <RiDeleteBin6Line />
          </Text>
          <Text className="text-lg font-bold font-archivo capitalize">Delete File</Text>
        </Flex>

        {/* message */}
        <Text className="text-sm font-archivo">
          Are you sure you want to delete the file{" "}
          <span className="font-bold">{activeFileData ? abbreviateText(activeFileData.file_name, 20) : "this file"}</span>?
        </Text>
      </Flex>

      {/* Button */}
      <Flex className="w-full" align="center" justify="end" gap="small">
        <Button
          onClick={handleCancel}
          loading={isLoading}
          disabled={isLoading}
          className=" font-archivo rounded-sm text-black capitalize"
          neoBrutalType="small"
        >
          <p>cancel</p>
        </Button>
        <Button
          type="primary"
          onClick={handleConfirm}
          disabled={isLoading}
          loading={isLoading}
          className=" font-archivo rounded-sm text-black capitalize"
          neoBrutalType="small"
        >
          <p>delete</p>
        </Button>
      </Flex>
    </Flex>
  );
};

export default ModalContentDeleteFile;
