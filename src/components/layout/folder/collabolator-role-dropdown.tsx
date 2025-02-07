import { CollaboratorUserData } from "@/features/collaborator/collaborator";
import { CollaboratorMenuItem } from "@/features/collaborator/collaborator-menu";
import { RootFolderGetData, SubFolderGetData } from "@/features/folder/folder";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { Flex, Typography } from "antd";
import { MdCheck } from "react-icons/md";

const { Text } = Typography;

interface CollaboratorRoleDropdownProps {
  roleList?: CollaboratorMenuItem[];
  roleSelected?: string;
  roleSelectedCallback?: (generalAccess: string) => void;
  roleData: CollaboratorUserData;
  folderData: RootFolderGetData | SubFolderGetData | null;
}

const CollaboratorRoleDropdown: React.FC<CollaboratorRoleDropdownProps> = ({
  roleList = [],
  roleSelected,
  roleSelectedCallback,
  roleData,
  folderData,
}) => {
  const handleSetCollaboratorRole = (role: CollaboratorMenuItem) => {
    role.handleClick(roleData, role.label, folderData);
    if (roleSelectedCallback) roleSelectedCallback(role.label);
  };

  return (
    <Flex
      className="p-3 border-2 border-black rounded-sm"
      vertical
      gap="small"
      style={{ ...neoBrutalBorderVariants.medium, background: "white" }}
    >
      {roleList.map((role) => (
        <Flex
          key={role.key}
          className={`cursor-pointer group hover:bg-[#ff87a6] ${role.label.toLowerCase() === roleSelected ? "" : "pl-[26px]"}`}
          align="center"
          gap="small"
          onClick={() => handleSetCollaboratorRole(role)}
        >
          {role.label.toLowerCase() === roleSelected && (
            <Text className="text-lg capitalize group-hover:text-white" style={{ color: themeColors.primary200 }}>
              <MdCheck />
            </Text>
          )}
          <Text className="text-sm w-full min-w-[190px] group-hover:text-white ">{role.label}</Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default CollaboratorRoleDropdown;
