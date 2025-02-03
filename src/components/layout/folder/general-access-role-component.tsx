import handleChangeGeneralAccessRole from "@/features/collaborator/change-general-access-role";
import { GeneralAccessRole } from "@/features/collaborator/collaborator";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { Flex, Typography } from "antd";
import { useState } from "react";
import { MdCheck } from "react-icons/md";

interface GeneralAccessRoleComponentProps {
  generalAccessRole?: GeneralAccessRole[];
  generalAccessRoleSelected?: GeneralAccessRole;
  folderId: string;
}

const { Text } = Typography;
const generalAccessRoleList: GeneralAccessRole[] = ["viewer", "editor"];

const GeneralAccessRoleComponent: React.FC<GeneralAccessRoleComponentProps> = ({
  generalAccessRole = generalAccessRoleList,
  generalAccessRoleSelected,
  folderId,
}) => {
  const [selectedRoleGeneralAccess, setSelectedRoleGeneralAccess] = useState<GeneralAccessRole>(generalAccessRoleSelected || "viewer");

  const handleSetRoleGeneralAccess = (generalAccessRole: GeneralAccessRole) => {
    setSelectedRoleGeneralAccess(generalAccessRole);
    handleChangeGeneralAccessRole({ folderId, role: generalAccessRole });
  };

  return (
    <Flex
      className="max-w-[150px] p-3 border-2 border-black rounded-sm"
      vertical
      gap="small"
      style={{ ...neoBrutalBorderVariants.medium, background: "white" }}
    >
      {generalAccessRole.map((generalAccessRole) => (
        <Flex
          key={generalAccessRole}
          className={`min-w-[120px] group hover:bg-[#ff87a6]   cursor-pointer ${generalAccessRole === selectedRoleGeneralAccess ? "" : "pl-[26px]"}`}
          align="center"
          gap="small"
          onClick={() => handleSetRoleGeneralAccess(generalAccessRole)}
        >
          {generalAccessRole === selectedRoleGeneralAccess && (
            <Text className="text-lg capitalize group-hover:text-white " style={{ color: themeColors.primary200 }}>
              <MdCheck />
            </Text>
          )}
          <Text className="text-sm w-full capitalize min-w-fit group-hover:text-white ">{generalAccessRole}</Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default GeneralAccessRoleComponent;
