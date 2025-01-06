import { mobileMoveSelector } from "@/features/move-folder-or-file/slice/mobile-move-slice";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { Flex, Typography } from "antd";
import classNames from "classnames";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const ButtonMoveCancel = () => {
  const navigate = useNavigate();
  const { moveFromLocationPath } = useSelector(mobileMoveSelector);

  const handleNavigate = () => {
    moveFromLocationPath ? navigate(moveFromLocationPath) : navigate("/storage/my-storage");
  };

  return (
    <Flex
      align="center"
      justify="center"
      onClick={handleNavigate}
      className={classNames(" cursor-pointer z-10 border-2 border-black rounded-sm w-[57.6px] h-[58px]")}
      style={{ ...neoBrutalBorderVariants.medium, background: themeColors.primary300 }}
    >
      <Text className=" relative p-4 text-4xl animate-wiggle animate-infinite animate-ease-in">
        <IoMdClose />
      </Text>
    </Flex>
  );
};

export default ButtonMoveCancel;
