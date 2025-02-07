import { GeneralAccessRole } from "@/features/collaborator/collaborator";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import { withDynamicFloatingElement } from "@components/hoc/with-dynamic-floating-element";
import { Flex, Typography } from "antd";
import { RiArrowDownSFill } from "react-icons/ri";

const { Text } = Typography;
const AddCollaboratorsUserRoleDropDown: React.FC<{ selectedRole: GeneralAccessRole }> = ({ selectedRole }) => {
  return (
    <Flex
      className="border-2 border-black w-full  min-h-[35px]"
      justify="center"
      align="center"
      gap="small"
      style={neoBrutalBorderVariants.small}
    >
      <Text className="text-sm font-archivo capitalize">{selectedRole}</Text>
      <Text className="text-sm font-archivo font-bold">
        <RiArrowDownSFill />
      </Text>
    </Flex>
  );
};
const AddCollaboratorsUserRoleDropDownWithDynamicFloatingElement = withDynamicFloatingElement(AddCollaboratorsUserRoleDropDown);
export default AddCollaboratorsUserRoleDropDownWithDynamicFloatingElement;
