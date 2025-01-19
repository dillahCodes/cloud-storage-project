import useHandleClickFile from "@/features/file/hooks/use-handle-click-file";
import { withFloatingElement } from "@components/hoc/with-floating-element";
import { Button, Flex } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import useFileMenu from "../menu/file-menu/hooks/use-file-menu";
import MenuItemComponent from "../menu/menu-item";

interface OptionsFileButtonWithFloatingElementProps {
  fileData: RootFileGetData | SubFileGetData;
}

const ButtonWithFloatingElement = withFloatingElement(Button);

const OptionsFileButtonWithFloatingElement: React.FC<OptionsFileButtonWithFloatingElementProps> = ({ fileData }) => {
  const { handleClickFileOptions } = useHandleClickFile();
  const { fileMenuList } = useFileMenu();

  return (
    <ButtonWithFloatingElement
      /**
       * button props
       */
      className="p-0.5 text-black bg-transparent shadow-none border-none"
      size="small"
      icon={<BsThreeDotsVertical className="text-lg text-black" />}
      type="primary"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => handleClickFileOptions({ e, fileData })}
      /**
       * floating el props
       */
      parentId={`file-options-floating-element-${fileData.file_id}`}
      rightPosition={21.5}
      parentZIndex={2}
      parentFloatingElementClassName="rounded-md opacity-0 h-0 transition-all duration-300"
      floatingElement={
        <Flex className="p-2 min-w-[300px] h-auto w-full border-2 border-black rounded-md" vertical gap="small">
          <MenuItemComponent menuList={fileMenuList} />
        </Flex>
      }
    />
  );
};

export default OptionsFileButtonWithFloatingElement;
