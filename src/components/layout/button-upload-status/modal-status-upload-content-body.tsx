import useFileUploading from "@/features/file/hooks/use-file-uploading";
import { useUploadTaskManager } from "@/features/file/slice/upload-task-manager";
import { themeColors } from "@/theme/antd-theme";
import Button from "@components/ui/button";
import { Flex, Progress, Typography } from "antd";
import classNames from "classnames";
import { IoCheckmarkOutline, IoClose, IoWarningOutline } from "react-icons/io5";
import { RiFileCloseLine } from "react-icons/ri";

const RenderIcon: React.FC<{ status: FileUploadingList["status"]; fileId: string }> = ({ status, fileId }) => {
  const { cancelUploadTask } = useUploadTaskManager();

  switch (status) {
    case "uploading":
      return <IoClose onClick={() => cancelUploadTask(fileId)} />;
    case "succeeded":
      return <IoCheckmarkOutline />;
    case "canceled":
      return <RiFileCloseLine />;
    case "failed":
      return <IoWarningOutline />;
  }
};

const { Text } = Typography;
const ModalStatusUploadContentBody = () => {
  const { fileUploadingState } = useFileUploading();

  return (
    <Flex className="w-full" vertical gap="small">
      {fileUploadingState.fileUploadingList.map((file) => (
        <Flex key={file.fileId} className="w-full p-2" align="center" gap="small">
          <Progress type="circle" percent={file.progress} size={20} strokeColor={themeColors.primary200} />
          <Text
            className={classNames("text-sm font-archivo line-clamp-1", {
              "line-through": ["canceled", "failed"].includes(file.status),
              " text-red-500": ["failed"].includes(file.status),
            })}
          >
            {file.fileName}
          </Text>
          <Button
            type="primary"
            className="text-black ml-auto"
            disabled={["failed", "canceled", "succeeded"].includes(file.status)}
            size="small"
            icon={<RenderIcon status={file.status} fileId={file.fileId} />}
          />
        </Flex>
      ))}
    </Flex>
  );
};

export default ModalStatusUploadContentBody;
