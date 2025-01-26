import { CollaboratorUserData } from "@/features/collaborator/collaborator";
import useGetCollabolatorsByFolderId from "@/features/collaborator/hooks/use-get-collaborators.-by-folderId";
import useGetGeneralAccessDataByFolderId from "@/features/collaborator/hooks/use-get-general-access.-by-folderId";
import useSecuredFolderOnDataChange from "@/features/collaborator/hooks/use-secured-folder-on-data-change";
import useFolderDetails from "@/features/folder/hooks/use-folder-details";
import useCreateDetailsFolderPermissions from "@/features/permissions/hooks/use-create-details-folder-permissions";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import Button from "@components/ui/button";
import { Flex, Spin, Typography } from "antd";
import { useMemo } from "react";
import { GrStorage } from "react-icons/gr";
import { IoIosArrowBack } from "react-icons/io";
import { MdFolderOpen } from "react-icons/md";
import FolderCollaboratorsAvatar from "./folder-collaborators-avatar";
import ManageAccessButton from "./manage-access-button";
import useModalManageAccessContentSetState from "@/features/collaborator/hooks/use-modal-manage-access-content-setstate";

const generateCollaboratorsNameInfo = (collaborators: CollaboratorUserData[] | null, isFolderPrivate: boolean): string => {
  if (!collaborators || collaborators.length === 0) return "";
  if (isFolderPrivate || collaborators.length === 1) return "private to you";

  const ownerName = collaborators.find((c) => c.role === "owner")?.name;
  const otherNames = collaborators.map((c) => c.name).filter((name) => name !== ownerName);

  if (otherNames.length === 0) return "shared with collaborators";
  if (otherNames.length === 1) return `Owned by ${ownerName}. Shared with ${otherNames[0]}`;
  if (otherNames.length === 2) return otherNames.join(" and ");

  return `Owned by ${ownerName}. shared with ${otherNames.slice(0, -1).join(", ")}, and ${otherNames[otherNames.length - 1]}`;
};

const { Text } = Typography;
const FolderDetails = () => {
  const { isDesktopDevice } = useGetClientScreenWidth();
  const { folderDetailsData, handleNavigateToFolderLocation, folderStatus, handleBack, folderData } = useFolderDetails();

  /**
   * if parent folder is not exists its mean this folder is root folder
   */
  const isRootFolder = useMemo(() => !folderData?.parent_folder_id, [folderData?.parent_folder_id]);

  /**
   * if is root folder return folder id else return parent folder id
   */
  const folderId = useMemo(() => {
    if (isRootFolder) return folderData?.folder_id || null;
    return folderData?.parent_folder_id || null;
  }, [folderData?.folder_id, folderData?.parent_folder_id, isRootFolder]);

  /**
   * condition to fetch collaborators and general access
   */
  const shouldFetchCollaboratorsAndGenralAccess = useMemo(() => {
    return folderStatus === "succeeded" && Boolean(folderId);
  }, [folderId, folderStatus]);

  /**
   * fetch collaborators data
   */
  const { collaborators, collaboratorsStatus } = useGetCollabolatorsByFolderId({
    folderId,
    shouldFetch: shouldFetchCollaboratorsAndGenralAccess,
  });

  /**
   * fetch general access data
   */
  const { generalAccess, generalAccessStatus } = useGetGeneralAccessDataByFolderId({
    folderId,
    shouldFetch: shouldFetchCollaboratorsAndGenralAccess,
  });

  /**
   * watch folder secured condition true or false
   */
  const { isSecuredFolderActive } = useSecuredFolderOnDataChange({ folderId });

  /**
   * set general access data and collaborators data
   * to manage access modal state
   */
  useModalManageAccessContentSetState({
    withUseEffect: {
      setModalCollaboratorsUserData: collaborators,
      setModalGeneralData: generalAccess,
      setModalFolderData: folderData,
      setIsSecuredFolderActive: isSecuredFolderActive,
    },
  });

  /**
   * create details folder permissions based on
   * collaborators, general access and secured folder data
   */
  const permissions = useCreateDetailsFolderPermissions({
    collaboratorsData: collaborators,
    collaboratorsStatus,
    generalAccess,
    generalAccessStatus,
    isSecuredFolderActive,
  });

  /**
   * logic button manage access disabled
   */
  const disabledButton = useMemo(() => {
    return !permissions.actionPermissions.canCRUD && permissions.permissionsDetails.isSubFolderLocation;
  }, [permissions]);

  /**
   * logic loading page
   */
  const isFolderLoading = useMemo(() => folderStatus === "loading", [folderStatus]);
  const isCollaboratorLoading = useMemo(() => collaboratorsStatus === "loading", [collaboratorsStatus]);
  const isGeneralAccessLoading = useMemo(() => generalAccessStatus === "loading", [generalAccessStatus]);
  const isLoading = useMemo(() => {
    return isFolderLoading || isCollaboratorLoading || isGeneralAccessLoading;
  }, [isFolderLoading, isCollaboratorLoading, isGeneralAccessLoading]);

  const isFolderPrivate = generalAccess?.type === "private";

  const collaboratorsNameInfo = useMemo(() => {
    return generateCollaboratorsNameInfo(collaborators, isFolderPrivate);
  }, [collaborators, isFolderPrivate]);

  if (isLoading) {
    return (
      <Flex className="w-full h-screen" align="center" justify="center">
        <Spin />
      </Flex>
    );
  }

  return (
    <div className="w-full">
      <Flex className="w-full p-3" gap="middle" vertical>
        {!isDesktopDevice && (
          <Button type="primary" size="small" className="w-fit text-black" icon={<IoIosArrowBack />} onClick={handleBack}>
            <Text className="text-sm font-archivo">Back</Text>
          </Button>
        )}

        <Text className="text-9xl font-archivo mx-auto">
          <MdFolderOpen />
        </Text>

        <Flex vertical>
          <Text className="text-sm font-archivo font-bold  capitalize">folder name :</Text>
          <Text className="text-sm font-archivo ">{folderDetailsData.folderName}</Text>
        </Flex>

        <Flex vertical>
          <Text className="text-sm font-archivo font-bold  capitalize">owner :</Text>
          <Text className="text-sm font-archivo ">{folderDetailsData.folderOwnerName}</Text>
        </Flex>

        <Flex vertical>
          <Text className="text-sm font-archivo font-bold  capitalize">location :</Text>
          <Button type="primary" size="small" className="w-fit text-black" onClick={handleNavigateToFolderLocation} icon={<GrStorage />}>
            <Text className="text-sm font-archivo">{folderDetailsData.folderLocationName}</Text>
          </Button>
        </Flex>

        <Flex vertical>
          <Text className="text-sm font-archivo font-bold  capitalize">created :</Text>
          <Text className="text-sm font-archivo ">
            {folderDetailsData.folderCreatedAt} by {folderDetailsData.folderCreatedByName}
          </Text>
        </Flex>

        <Flex vertical>
          <Text className="text-sm font-archivo font-bold  capitalize">Modified :</Text>
          <Text className="text-sm font-archivo ">
            {folderDetailsData.folderModifiedAt} {folderDetailsData.folderModifiedByName !== "-" ? " by" : "-"}{" "}
            {folderDetailsData.folderModifiedByName}
          </Text>
        </Flex>
      </Flex>

      <Flex className="w-full border-t-2 border-black p-3" vertical gap="middle">
        <Text className="text-base font-archivo font-bold text-center  capitalize">Who has access</Text>

        <Flex vertical gap="small">
          <FolderCollaboratorsAvatar collaborators={collaborators} generalAccessData={generalAccess} />
          <Text className="text-sm font-archivo">{collaboratorsNameInfo}</Text>
          <ManageAccessButton disabledButton={disabledButton} />
        </Flex>
      </Flex>
    </div>
  );
};

export default FolderDetails;
