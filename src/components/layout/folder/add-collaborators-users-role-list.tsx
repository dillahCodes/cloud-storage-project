import useUser from "@/features/auth/hooks/use-user";
import { GeneralAccessRole } from "@/features/collaborator/collaborator";
import { modalManageAccessContentSelector } from "@/features/collaborator/slice/modal-manage-access-content-slice";
import { addCollaboratorsMenu } from "@/features/folder/collaborator-menu";
import { Flex, Typography } from "antd";
import classNames from "classnames";
import { useState } from "react";
import { useSelector } from "react-redux";

interface AddCollaboratorsUsersRoleListProps {
  handleRoleCallback?: (role: GeneralAccessRole) => void;
  selectedUsersRole?: GeneralAccessRole;
}

const { Text } = Typography;
const AddCollaboratorsUsersRoleList: React.FC<AddCollaboratorsUsersRoleListProps> = ({ handleRoleCallback, selectedUsersRole }) => {
  const [selectedRole, setSelectedRole] = useState<GeneralAccessRole>(selectedUsersRole || "viewer");

  const { user } = useUser();
  const { collaboratorsUserData } = useSelector(modalManageAccessContentSelector);

  const isRoleAssigner = !!collaboratorsUserData?.find(
    (collaborator) => collaborator.userId === user?.uid && (collaborator.role === "owner" || collaborator.role === "editor")
  );
  const getMyMenu = collaboratorsUserData?.find((collaborator) => collaborator.userId === user?.uid);
  const menu = isRoleAssigner && getMyMenu ? addCollaboratorsMenu("assigner") : [];

  const handleChange = (item: string) => {
    setSelectedRole(item.toLowerCase() as GeneralAccessRole);
    handleRoleCallback && handleRoleCallback(item.toLowerCase() as GeneralAccessRole);
  };

  return (
    <Flex className="w-full p-1" vertical gap="small">
      {menu.map((item) => (
        <Flex
          align="center"
          className={classNames("p-1", {
            "bg-[#FF5277] ": selectedRole === item.label.toLowerCase(),
          })}
          gap="small"
          key={item.key}
          onClick={() => handleChange(item.label)}
        >
          <Text className={classNames("text-sm font-archivo", { "text-[#fff1ff]": selectedRole === item.label.toLowerCase() })}>{item.label}</Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default AddCollaboratorsUsersRoleList;
