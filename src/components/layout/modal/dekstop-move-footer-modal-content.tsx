import useConfirmDekstopMoveFolder from "@/features/move-folder-or-file/hooks/use-confirm-dekstop-move-folder";
import { dekstopMoveSelector, resetDektopMoveState } from "@/features/move-folder-or-file/slice/dekstop-move-slice";
import Button from "@components/ui/button";
import { Flex } from "antd";
import { useDispatch, useSelector } from "react-redux";

const DektopMoveFooterModalContent: React.FC = () => {
  const dispatch = useDispatch();
  const { isModalMoveButtonDisabled } = useSelector(dekstopMoveSelector);
  const { handleConfirmMoveFolder } = useConfirmDekstopMoveFolder();

  const handleCloseModal = () => dispatch(resetDektopMoveState());

  return (
    <Flex className="w-full py-3 px-3" gap="middle" justify="end">
      <Button className="text-black font-archivo rounded-sm" onClick={handleCloseModal}>
        Cancel
      </Button>
      <Button onClick={handleConfirmMoveFolder} disabled={isModalMoveButtonDisabled} type="primary" className="text-black font-archivo rounded-sm">
        Move
      </Button>
    </Flex>
  );
};

export default DektopMoveFooterModalContent;
