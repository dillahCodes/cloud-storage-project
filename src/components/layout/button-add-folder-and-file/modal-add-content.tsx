import { parentFolderPermissionSelector } from "@/features/permissions/slice/parent-folder-permissions";
import Button from "@components/ui/button";
import { Flex } from "antd";
import { useMemo, useRef } from "react";
import { RiFileAddLine, RiFolderAddLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import MoadlFolderPermissionDenied from "../modal/modal-folder-permission-content-denied";

interface ModalAddContentProps {
  setModalStatus: React.Dispatch<React.SetStateAction<ModalStatus>>;
  setFile: () => void;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalAddContent: React.FC<ModalAddContentProps> = ({ setModalStatus, setFile, setModalOpen }) => {
  const fileButtonRef = useRef(null);

  const { actionPermissions, permissionsDetails } = useSelector(parentFolderPermissionSelector);

  const isHavePermission = useMemo(() => {
    return !permissionsDetails.isSubFolderLocation || (permissionsDetails.isSubFolderLocation && actionPermissions.canCRUD);
  }, [permissionsDetails.isSubFolderLocation, actionPermissions.canCRUD]);

  const handleCloseModalPermissionDenied = () => setModalOpen(false);

  return (
    <Flex className="w-full" gap="middle" wrap>
      {isHavePermission ? (
        <>
          <Button
            type="primary"
            size="large"
            className="text-black font-archivo rounded-sm"
            onClick={() => setModalStatus("add-folder")}
            icon={<RiFolderAddLine />}
            neoBrutalType="medium"
          >
            New Folder
          </Button>
          <Button
            onClick={setFile}
            ref={fileButtonRef}
            type="primary"
            size="large"
            className="text-black font-archivo rounded-sm"
            neoBrutalType="medium"
            icon={<RiFileAddLine />}
          >
            Upload File
          </Button>
        </>
      ) : (
        <MoadlFolderPermissionDenied
          description="You don't have permission to add folder or file in this folder."
          closeModal={handleCloseModalPermissionDenied}
        />
      )}
    </Flex>
  );
};

export default ModalAddContent;
