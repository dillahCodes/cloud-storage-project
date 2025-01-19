import useUser from "@/features/auth/hooks/use-user";
import { fileOptionsSelector, resetFileOptions, setActiveAction } from "@/features/file/slice/file-options-slice";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import abbreviateText from "@/util/abbreviate-text";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import { MdOutlineFileOpen } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const ModalContentVisitFile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useUser();
  const { activeFileData } = useSelector(fileOptionsSelector);

  const handleCancelVisitFile = () => dispatch(setActiveAction(null));
  const handleVisitFile = () => {
    if (!activeFileData || !user) return;

    const isRootFolderMine = activeFileData.root_folder_user_id === user.uid;
    const isFileInsideFolder = !!activeFileData.parent_folder_id;

    if (isFileInsideFolder) {
      const fileUrl = `/storage/folders/${activeFileData.parent_folder_id}?st=${isRootFolderMine ? "my-storage" : "shared-with-me"}`;
      navigate(fileUrl);
    } else {
      const fileUrl = `/storage/my-storage`;
      navigate(fileUrl);
    }

    dispatch(resetFileOptions());
  };

  return (
    <Flex className="w-full bg-white rounded-md p-4 border-2 border-black" vertical gap="middle" style={neoBrutalBorderVariants.small}>
      <Flex vertical gap="small">
        {/* Header*/}
        <Flex align="center" gap="small">
          <Text className="text-xl font-bold text-[#ff87a6]">
            <MdOutlineFileOpen />
          </Text>
          <Text className="text-lg font-bold font-archivo capitalize">Visit File</Text>
        </Flex>

        {/* message */}
        <Text className="text-sm font-archivo">
          Are you sure you want to visit the file{" "}
          <span className="font-bold">{activeFileData ? abbreviateText(activeFileData.file_name, 20) : "this file"}</span>?
        </Text>
      </Flex>
      {/* Button */}
      <Flex className="w-full" align="center" justify="end" gap="small">
        <Button onClick={handleCancelVisitFile} className=" font-archivo rounded-sm text-black capitalize" neoBrutalType="small">
          <p>cancel</p>
        </Button>
        <Button type="primary" onClick={handleVisitFile} className=" font-archivo rounded-sm text-black capitalize" neoBrutalType="small">
          <p>confirm</p>
        </Button>
      </Flex>
    </Flex>
  );
};

export default ModalContentVisitFile;
