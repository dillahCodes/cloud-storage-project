import { GeneralAccess } from "@/features/collaborator/collaborator";
import handleChangeGeneralAccessType from "@/features/collaborator/change-general-access-type";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { Flex, Typography } from "antd";
import { useState } from "react";
import { MdCheck } from "react-icons/md";

interface GeneralAccessComponentProps {
  generalAccessList?: GeneralAccess[];
  generalAccessSelected?: GeneralAccess;
  folderId: string;
}

const { Text } = Typography;
const generalAccessListArray: GeneralAccess[] = ["private", "public"];

const GeneralAccessTypeComponent: React.FC<GeneralAccessComponentProps> = ({
  generalAccessList = generalAccessListArray,
  generalAccessSelected,
  folderId,
}) => {
  const [selectedGeneralAccess, setSelectedGeneralAccess] = useState<GeneralAccess>(generalAccessSelected || "private");

  const handleSetGeneralAccess = (generalAccess: GeneralAccess) => {
    handleChangeGeneralAccessType({ folderId, type: generalAccess });
    setSelectedGeneralAccess(generalAccess);
  };

  return (
    <Flex
      className="max-w-[150px] p-3 border-2 border-black rounded-sm"
      vertical
      gap="small"
      style={{ ...neoBrutalBorderVariants.medium, background: "white" }}
    >
      {generalAccessList.map((generalAccess) => (
        <Flex
          key={generalAccess}
          className={`min-w-[120px] group hover:bg-[#ff87a6] cursor-pointer ${generalAccess === selectedGeneralAccess ? "" : "pl-[26px]"}`}
          align="center"
          gap="small"
          onClick={() => handleSetGeneralAccess(generalAccess)}
        >
          {generalAccess === selectedGeneralAccess && (
            <Text className="text-lg capitalize group-hover:text-white" style={{ color: themeColors.primary200 }}>
              <MdCheck />
            </Text>
          )}
          <Text className="text-sm w-full capitalize group-hover:text-white min-w-fit">{generalAccess}</Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default GeneralAccessTypeComponent;
