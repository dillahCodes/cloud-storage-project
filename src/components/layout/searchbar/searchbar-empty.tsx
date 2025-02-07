import useGetClientScreenWidth from "@/hooks/use-get-client-screen-width";
import emptyIlustration from "@assets/File-bundle-amico.svg";
import { Flex, Typography } from "antd";

const { Text } = Typography;
const SearchbarEmpty = () => {
  const { isDesktopDevice } = useGetClientScreenWidth();
  return (
    <div className="flex items-center justify-center p-3">
      <Flex vertical className="w-fit mx-auto" align="center" gap="middle">
        <img
          src={emptyIlustration}
          alt="empty folder"
          className="max-w-[200px] mx-auto"
          sizes={isDesktopDevice ? "150px" : "200px"}
        />
        <Text className="text-sm text-center font-archivo font-bold max-w-[300px]">
          No Files or Folders found. Try another location or name.
        </Text>
      </Flex>
    </div>
  );
};

export default SearchbarEmpty;
