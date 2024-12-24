import { CollaboratorUserData, GeneralAccessDataSerialized } from "@/features/folder/folder-collaborator";
import withModal from "@components/hoc/with-modal";
import { Flex, Typography } from "antd";
import { IoIosMore } from "react-icons/io";
import { IoEarthOutline } from "react-icons/io5";
import AvatarOnlyIcon from "../avatar/avatar-only-icon";
import AvatarWithUserPhoto from "../avatar/avatar-with-user-photo";

interface FolderCollaboratorsAvatarProps {
  collaborators: CollaboratorUserData[] | null;
  generalAccessData: GeneralAccessDataSerialized | null;
}

const AvatarOnlyIconWIthModal = withModal(AvatarOnlyIcon);
const { Title } = Typography;

const FolderCollaboratorsAvatar: React.FC<FolderCollaboratorsAvatarProps> = ({
  collaborators,
  generalAccessData,
}) => {
  const isFolderPrivate = generalAccessData?.type === "private";

  const ownerData = collaborators?.find((collaborator) => collaborator.role === "owner");
  const otherCollaborators = collaborators?.filter((collaborator) => collaborator.role !== "owner");

  const notTruncatedCollaborators = otherCollaborators?.slice(0, 2);
  const truncatedCollaborators = otherCollaborators?.slice(2);

  return (
    <Flex className="h-fit" gap="small">
      <RenderCollaboratorAvatar photoUrl={ownerData?.photoUrl} />

      {!isFolderPrivate && otherCollaborators && <div className="w-[2px] h-10 rounded-full bg-black" />}
      {isFolderPrivate && otherCollaborators && otherCollaborators?.length > 0 && (
        <div className="w-[2px] h-10 rounded-full bg-black" />
      )}

      <Flex align="center" gap="small" wrap>
        {!isFolderPrivate && <AvatarOnlyIcon icon={<IoEarthOutline />} size={35} />}

        {notTruncatedCollaborators?.map((collaborator) => (
          <RenderCollaboratorAvatar key={collaborator.userId} photoUrl={collaborator.photoUrl} />
        ))}

        {truncatedCollaborators && truncatedCollaborators?.length > 0 && (
          <AvatarOnlyIconWIthModal
            modalContent={
              <ModalOtherCollaborators
                ownerPhotoUrl={ownerData?.photoUrl}
                isFolderPrivate={isFolderPrivate}
                otherCollaborators={otherCollaborators}
              />
            }
            avatarOnlyIconClassName="cursor-pointer"
            icon={<IoIosMore />}
            size={35}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default FolderCollaboratorsAvatar;

interface ModalOtherCollaboratorsProps {
  ownerPhotoUrl: string | null | undefined;
  isFolderPrivate: boolean;
  otherCollaborators: CollaboratorUserData[] | undefined;
}
const ModalOtherCollaborators: React.FC<ModalOtherCollaboratorsProps> = ({
  ownerPhotoUrl,
  isFolderPrivate,
  otherCollaborators,
}) => {
  return (
    <Flex vertical className="h-fit" gap="middle">
      <Title level={1} className="text-base">
        Other Collaborators
      </Title>

      <Flex gap="small">
        <RenderCollaboratorAvatar photoUrl={ownerPhotoUrl} />
        {!isFolderPrivate && otherCollaborators && <div className="w-[2px] h-10 rounded-full bg-black" />}
        {!isFolderPrivate && <AvatarOnlyIcon icon={<IoEarthOutline />} size={35} />}
        {otherCollaborators?.map((collaborator) => (
          <RenderCollaboratorAvatar key={collaborator.userId} photoUrl={collaborator.photoUrl} />
        ))}
      </Flex>
    </Flex>
  );
};

interface RenderCollaboratorAvatarProps {
  photoUrl: string | null | undefined;
}

const RenderCollaboratorAvatar: React.FC<RenderCollaboratorAvatarProps> = ({ photoUrl }) => {
  return (
    <div>{photoUrl ? <AvatarWithUserPhoto src={photoUrl} size={35} /> : <AvatarOnlyIcon size={35} />}</div>
  );
};
