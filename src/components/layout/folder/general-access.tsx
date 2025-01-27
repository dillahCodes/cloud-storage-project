// import { GeneralAccess, GeneralAccessDataSerialized } from "@/features/folder/folder-collaborator";
import { withFloatingElement } from "@components/hoc/with-floating-element";
import { Flex, Typography } from "antd";
import { HiOutlineLockClosed } from "react-icons/hi";
import { IoEarthOutline } from "react-icons/io5";
import { TiArrowSortedDown } from "react-icons/ti";
import AvatarOnlyIcon from "../avatar/avatar-only-icon";
import GeneralAccessRoleComponent from "./general-access-role-component";
import GeneralAccessTypeComponent from "./general-access-type";
import { GeneralAccess, GeneralAccessData } from "@/features/collaborator/collaborator";

const { Text } = Typography;
const FlexWithFloatinElement = withFloatingElement(Flex);

interface GeneralAccessProps {
  generalData: GeneralAccessData | null;
  folderId: string;
}

const createTypeDescription = (type: GeneralAccess | undefined) => {
  switch (type) {
    case "public":
      [];
      return "Anyone on the internet with the link can view";
    case "private":
      return "Only people with access can open with the link";
    default:
      return "";
  }
};

const GeneralAccessComponent: React.FC<GeneralAccessProps> = ({ generalData, folderId }) => {
  const description = createTypeDescription(generalData?.type);
  const isPrivate = generalData?.type === "private";

  return (
    <>
      <Text className="text-base capitalize font-medium">general access</Text>
      <Flex className="w-full" vertical>
        <Flex className="w-full" gap="middle" align="center" justify="space-between">
          <Flex align="center" gap="middle">
            <div>
              {isPrivate ? <AvatarOnlyIcon icon={<HiOutlineLockClosed />} size={35} /> : <AvatarOnlyIcon icon={<IoEarthOutline />} size={35} />}
            </div>

            <Flex vertical gap={3}>
              <FlexWithFloatinElement
                align="center"
                gap="small"
                className="w-fit"
                parentFloatingElementClassName="rounded-sm z-10"
                floatingElement={<GeneralAccessTypeComponent generalAccessSelected={generalData?.type} folderId={folderId} />}
              >
                <Text className="text-sm ml-auto font-medium font-archivo">{generalData?.type}</Text>
                <Text className="text-sm ml-auto font-medium font-archivo">
                  <TiArrowSortedDown />
                </Text>
              </FlexWithFloatinElement>
              <Text className="text-xs">{description}</Text>
            </Flex>
          </Flex>

          {!isPrivate && (
            <FlexWithFloatinElement
              align="center"
              gap="small"
              rightPosition={5}
              parentFloatingElementClassName="rounded-sm z-10"
              floatingElement={<GeneralAccessRoleComponent generalAccessRoleSelected={generalData?.role} folderId={folderId} />}
            >
              <Text className="text-sm ml-auto min-w-fit font-medium font-archivo capitalize">{generalData?.role}</Text>
              <Text className="text-sm ml-auto font-medium font-archivo">
                <TiArrowSortedDown />
              </Text>
            </FlexWithFloatinElement>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default GeneralAccessComponent;
