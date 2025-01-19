import useGetFileLoaction from "@/features/file/hooks/use-get-file-location";
import useGetFileOwner from "@/features/file/hooks/use-get-file-owner";
import { fileOptionsSelector, resetFileOptions } from "@/features/file/slice/file-options-slice";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import formatFileSize from "@/util/format-file-size";
import formatTimestamp from "@/util/format-timestamp";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { useCallback, useMemo } from "react";
import { GrStorage } from "react-icons/gr";
import { IoMdFolderOpen } from "react-icons/io";
import { RiFileInfoLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type FileInfo = {
  type: "info" | "location";
  key: string;
  label: string;
  value?: string;
  parentLocation?: string;
};

const { Text } = Typography;

const ModalContentInfoFile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * selected file
   */
  const { activeFileData } = useSelector(fileOptionsSelector);
  /**
   * get file owne
   */
  const { fileOwner } = useGetFileOwner({
    fileData: activeFileData as SubFileGetData | RootFileGetData,
    shouldFetch: !!activeFileData,
  });
  /**
   * get path and label for folder location
   */
  const { fileLocationData } = useGetFileLoaction({
    fileData: activeFileData,
  });

  const fileSize = useMemo(() => formatFileSize(parseInt(activeFileData?.file_size ?? "0")), [activeFileData]);
  const fileDate = useMemo(() => formatTimestamp(activeFileData?.created_at.seconds ?? 0), [activeFileData]);

  /**
   * handle navigate
   */
  const handleNavigateFolder = useCallback(() => {
    if (fileLocationData) {
      navigate(fileLocationData.path);
      dispatch(resetFileOptions());
    }
  }, [fileLocationData, navigate, dispatch]);

  const createFileInfo: FileInfo[] = useMemo(
    () => [
      {
        type: "info",
        key: "1",
        label: "File Name",
        value: activeFileData?.file_name ?? "No Name",
      },
      {
        type: "info",
        key: "2",
        label: "Owner",
        value: fileOwner ?? "No Owner",
      },
      {
        type: "info",
        key: "3",
        label: "Size",
        value: fileSize ?? "No Size",
      },
      {
        type: "location",
        key: "5",
        label: "location",
        parentLocation: fileLocationData.labelButton,
      },
      {
        type: "info",
        key: "4",
        label: "Created At",
        value: fileDate ?? "No Date",
      },
    ],
    [activeFileData, fileOwner, fileSize, fileDate, fileLocationData]
  );

  const renderIcon = useCallback(() => {
    switch (fileLocationData.icon) {
      case "folder":
        return <IoMdFolderOpen />;
      case "storage":
        return <GrStorage />;
      default:
        return <GrStorage />;
    }
  }, [fileLocationData.icon]);

  const renderInfoComponentType = useCallback(
    (data: FileInfo) => {
      switch (data.type) {
        case "info":
          return <Text className="text-sm font-archivo ">{data.value}</Text>;
        case "location":
          return (
            <Button
              icon={renderIcon()}
              onClick={handleNavigateFolder}
              className="font-archivo rounded-sm text-black capitalize w-fit"
              type="primary"
              neoBrutalType="small"
            >
              <Text className="text-sm font-archivo">{data.parentLocation}</Text>
            </Button>
          );
        default:
          return <Text className="text-sm font-archivo ">{data.value}</Text>;
      }
    },
    [renderIcon, handleNavigateFolder]
  );

  return (
    <Flex className="w-full bg-white rounded-md p-4 border-2 border-black" vertical gap="middle" style={neoBrutalBorderVariants.small}>
      {/* Header*/}
      <Flex align="center" gap="small">
        <Text className="text-xl font-bold text-blue-500">
          <RiFileInfoLine />
        </Text>
        <Text className="text-lg font-bold font-archivo capitalize">File Information</Text>
      </Flex>

      {/* info section */}
      {createFileInfo.map((item) => {
        return (
          <Flex vertical key={item.key}>
            <Text className="text-sm font-archivo font-bold  capitalize">{item.label}:</Text>
            {renderInfoComponentType(item)}
          </Flex>
        );
      })}
    </Flex>
  );
};

export default ModalContentInfoFile;
