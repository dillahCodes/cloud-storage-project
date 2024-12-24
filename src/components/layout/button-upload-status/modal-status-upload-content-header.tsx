import useFileUploading from "@/features/file/hooks/use-file-uploading";
import { useUploadTaskManager } from "@/features/file/slice/upload-task-manager";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { useMemo } from "react";

const { Text } = Typography;

// Modal content components
const ModalStatusUploadContentHeader = () => {
  const { cancelAllUploads } = useUploadTaskManager();
  const { fileUploadingState } = useFileUploading();

  const canCancelAll = useMemo(
    () => fileUploadingState.fileUploadingList.find((file) => ["uploading"].includes(file.status)),
    [fileUploadingState]
  );

  return (
    <Flex className="w-full" align="center" justify="space-between">
      <Text className="text-base font-archivo capitalize font-bold">
        Uploading {fileUploadingState.fileUploadingList.length > 1 ? `${fileUploadingState.fileUploadingList.length} files` : "1 file"}
      </Text>
      <Button type="primary" size="small" disabled={!canCancelAll} neoBrutalType="medium" onClick={cancelAllUploads}>
        <Text className="text-xs font-archivo capitalize">cancel All</Text>
      </Button>
    </Flex>
  );
};

export default ModalStatusUploadContentHeader;
