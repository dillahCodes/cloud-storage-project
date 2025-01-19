import useHandleDowloadFile from "@/features/file/hooks/use-handle-dowload-file";
import { fileOptionsSelector } from "@/features/file/slice/file-options-slice";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import abbreviateText from "@/util/abbreviate-text";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { MdOutlineFileDownload } from "react-icons/md";
import { useSelector } from "react-redux";

const { Text } = Typography;

const ModalContentDowloadFile = () => {
  const { activeFileData } = useSelector(fileOptionsSelector);
  const { handleCancelDowloadFile, handleConfirmDownlaodFile, isDownloadLoading } = useHandleDowloadFile({ fileData: activeFileData });

  return (
    <Flex className="w-full bg-white rounded-md p-4 border-2 border-black" vertical gap="middle" style={neoBrutalBorderVariants.small}>
      <Flex vertical gap="small">
        {/* Header*/}
        <Flex align="center" gap="small">
          <Text className="text-xl font-bold text-[#ff87a6]">
            <MdOutlineFileDownload />
          </Text>
          <Text className="text-lg font-bold font-archivo capitalize">Download File</Text>
        </Flex>

        {/* message */}
        <Text className="text-sm font-archivo">
          Are you sure you want to download the file{" "}
          <span className="font-bold">{activeFileData ? abbreviateText(activeFileData.file_name, 20) : "this file"}</span>?
        </Text>
      </Flex>
      {/* Button */}
      <Flex className="w-full" align="center" justify="end" gap="small">
        <Button onClick={handleCancelDowloadFile} className=" font-archivo rounded-sm text-black capitalize" neoBrutalType="small">
          <p>cancel</p>
        </Button>
        <Button
          type="primary"
          disabled={isDownloadLoading}
          onClick={handleConfirmDownlaodFile}
          loading={isDownloadLoading}
          className=" font-archivo rounded-sm text-black capitalize"
          neoBrutalType="small"
        >
          <p>download</p>
        </Button>
      </Flex>
    </Flex>
  );
};

export default ModalContentDowloadFile;
