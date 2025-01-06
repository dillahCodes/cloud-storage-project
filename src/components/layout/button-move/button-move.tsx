import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { Flex, Typography } from "antd";
import classNames from "classnames";
import { LiaPasteSolid } from "react-icons/lia";

const { Text } = Typography;
const ButtonMove = () => {
  return (
    <Flex
      align="center"
      justify="center"
      className={classNames(" cursor-pointer z-10 border-2 border-black rounded-sm w-[57.6px] h-[58px]")}
      style={{ ...neoBrutalBorderVariants.medium, background: themeColors.primary300 }}
    >
      <Text className=" relative p-4 text-4xl animate-wiggle animate-infinite animate-ease-in">
        <LiaPasteSolid />
      </Text>
    </Flex>
  );
};

export default ButtonMove;
