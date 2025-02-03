import useUser from "@/features/auth/hooks/use-user";
import { CollaboratorUserData } from "@/features/collaborator/collaborator";
import useGetCollabolatorsByFolderId from "@/features/collaborator/hooks/use-get-collaborators-by-folderId";
import useGetGeneralAccessDataByFolderId from "@/features/collaborator/hooks/use-get-general-access-by-folderId";
import useGetIsCollaboratorByUserIdAndFolderId from "@/features/collaborator/hooks/use-get-is-collaborator-by-userId-and-folderId";
import useModalManageAccessContentSetState from "@/features/collaborator/hooks/use-modal-manage-access-content-setstate";
import useSecuredFolderOnDataChange from "@/features/collaborator/hooks/use-secured-folder-on-data-change";
import useFolderDetails from "@/features/folder/hooks/use-folder-details";
import useCreateDetailsFolderPermissions from "@/features/permissions/hooks/use-create-details-folder-permissions";
import useCreateParentFolderPermissions from "@/features/permissions/hooks/use-create-parent-folder-permissions";
import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import Button from "@components/ui/button";
import { Flex, Spin, Typography } from "antd";
import { useMemo } from "react";
import { GrStorage } from "react-icons/gr";
import { IoIosArrowBack } from "react-icons/io";
import { MdFolderOpen } from "react-icons/md";
import FolderCollaboratorsAvatar from "./folder-collaborators-avatar";
import ManageAccessButton from "./manage-access-button";

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
  const { user } = useUser();
  const currentUserUid: string | null = useMemo(() => user?.uid || null, [user]);

  const { isDesktopDevice } = useGetClientScreenWidth();
  const { folderDetailsData, handleNavigateToFolderLocation, folderStatus, handleBack, folderData, activeFolderId } = useFolderDetails();

  /**
   * get details folder active folder id
   * folderId from drawer state (if its dektop device)
   * and from param url (if its mobile device)
   * visit hooks useFolderDetails for details
   */
  const getDetailsFolderActiveFolderId: string | null = useMemo(() => activeFolderId || null, [activeFolderId]);

  /**
   * condition to fetch collaborators and general access
   */
  const shouldFetchCollaboratorsAndGenralAccess = useMemo(() => {
    return folderStatus === "succeeded" && Boolean(activeFolderId);
  }, [activeFolderId, folderStatus]);

  /**
   * fetch details folder collaborators data
   */
  const { collaborators: detailsFolderCollaborators, collaboratorsStatus: detailsFolderCollabotatorsStatus } = useGetCollabolatorsByFolderId({
    folderId: getDetailsFolderActiveFolderId,
    shouldFetch: shouldFetchCollaboratorsAndGenralAccess,
  });

  /**
   * fetch details folder general access data
   */
  const { generalAccess: detailsFolderGeneralAccess, generalAccessStatus: detailsFolderGeneralAccessStatus } = useGetGeneralAccessDataByFolderId({
    folderId: getDetailsFolderActiveFolderId,
    shouldFetch: shouldFetchCollaboratorsAndGenralAccess,
  });

  /**
   * watch details folder secured condition
   * true or false
   */
  const { isSecuredFolderActive: detailsFolderIsSecuredFolderActive } = useSecuredFolderOnDataChange({ folderId: getDetailsFolderActiveFolderId });

  /**
   * set general access data and collaborators data
   * to manage access modal state
   */
  useModalManageAccessContentSetState({
    withUseEffect: {
      setModalCollaboratorsUserData: detailsFolderCollaborators,
      setModalGeneralData: detailsFolderGeneralAccess,
      setModalFolderData: folderData,
      setIsSecuredFolderActive: detailsFolderIsSecuredFolderActive,
    },
  });

  /**
   * create details folder permissions based on details folder
   * collaborators, details folder general access and details
   * folder secured folder data
   */
  const detailsFolderPermissions = useCreateDetailsFolderPermissions({
    detailsFolderData: folderData,
    collaboratorsData: detailsFolderCollaborators,
    collaboratorsStatus: detailsFolderCollabotatorsStatus,
    generalAccess: detailsFolderGeneralAccess,
    generalAccessStatus: detailsFolderGeneralAccessStatus,
    isSecuredFolderActive: detailsFolderIsSecuredFolderActive,
  });

  /**
   * parent folder logic and data
   * for fetch collaborator and general access parent folder
   */
  const shouldFetchCollaboratorParentFolder: boolean = useMemo(() => Boolean(folderData?.parent_folder_id), [folderData]);
  const getParentDetailsFolderParentFolderId: string | null = useMemo(() => folderData?.parent_folder_id || null, [folderData]);

  /**
   *  fetch parent folder collaborator
   */
  const { collaboratorData: parentFolderCollaboratorData, collaboratorStatus: parentFolderCollaboratorStatus } =
    useGetIsCollaboratorByUserIdAndFolderId({
      folderId: getParentDetailsFolderParentFolderId,
      shouldFetch: shouldFetchCollaboratorParentFolder,
      userId: currentUserUid,
    });

  /**
   * fetch parent folder general access
   */
  const { generalAccess: parentFolderGeneralAccess, generalAccessStatus: parentFolderGeneralAccessStatus } = useGetGeneralAccessDataByFolderId({
    folderId: getParentDetailsFolderParentFolderId,
    shouldFetch: shouldFetchCollaboratorParentFolder,
  });

  /**
   * fetch parent folder secured folder data
   */
  const { isSecuredFolderActive } = useSecuredFolderOnDataChange({ folderId: getParentDetailsFolderParentFolderId });
  /**
   * create permissions for parent folder
   */
  const parentFolderPermissions = useCreateParentFolderPermissions({
    isParentSecuredFolderActive: isSecuredFolderActive,
    collaboratorData: parentFolderCollaboratorData,
    collaboratorStatus: parentFolderCollaboratorStatus,
    generalAccess: parentFolderGeneralAccess,
    generalAccessStatus: parentFolderGeneralAccessStatus,
  });

  /**
   * logic disabled manage access button
   */
  const disabledManageAccessButton = useMemo(() => {
    return (
      (!parentFolderPermissions.actionPermissions.canCRUD || !detailsFolderPermissions.actionPermissions.canCRUD) &&
      !detailsFolderPermissions.permissionsDetails.isRootFolderMine
    );
  }, [parentFolderPermissions, detailsFolderPermissions]);

  /**
   * logic loading page
   */
  const isLoading =
    folderStatus === "loading" ||
    detailsFolderGeneralAccessStatus === "loading" ||
    detailsFolderCollabotatorsStatus === "loading" ||
    parentFolderGeneralAccessStatus === "loading" ||
    parentFolderCollaboratorStatus === "loading";

  /**
   * generate collaborators name
   * for details folder
   */
  const isParentFolderPrivate = useMemo(() => parentFolderGeneralAccess?.type === "private", [parentFolderGeneralAccess]);
  const collaboratorsNameInfo = useMemo(() => {
    return generateCollaboratorsNameInfo(detailsFolderCollaborators, isParentFolderPrivate);
  }, [isParentFolderPrivate, detailsFolderCollaborators]);

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
          <FolderCollaboratorsAvatar collaborators={detailsFolderCollaborators} generalAccessData={detailsFolderGeneralAccess} />
          <Text className="text-sm font-archivo">{collaboratorsNameInfo}</Text>
          <ManageAccessButton disabledButton={disabledManageAccessButton} />
        </Flex>
      </Flex>
    </div>
  );
};

export default FolderDetails;
