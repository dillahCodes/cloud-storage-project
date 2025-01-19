import useHandleClickFile from "@/features/file/hooks/use-handle-click-file";
import { themeColors } from "@/theme/antd-theme";
import withDrawer from "@components/hoc/with-drawer";
import { Button } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import useFileMenu from "../menu/file-menu/hooks/use-file-menu";
import FileDrawerHeader from "./file-drawer-header";
import { fileOptionsSelector, resetFileOptions } from "@/features/file/slice/file-options-slice";
import MenuItemComponent from "../menu/menu-item";
import { useMemo } from "react";

interface OptionsFileButtonWithDrawerProps {
  fileData: SubFileGetData | RootFileGetData;
}

const ButtonWithDrawer = withDrawer(Button);

const OptionsFileButtonWithDrawer: React.FC<OptionsFileButtonWithDrawerProps> = ({ fileData }) => {
  const dispatch = useDispatch();
  const { activeFileData } = useSelector(fileOptionsSelector);
  const isDrawerOpen = useMemo(() => Boolean(activeFileData && activeFileData.file_id === fileData.file_id), [activeFileData, fileData]);

  const { fileMenuList } = useFileMenu();
  const { handleClickFileOptions } = useHandleClickFile();

  const handleDrawerClose = () => dispatch(resetFileOptions());

  return (
    <ButtonWithDrawer
      /**
       * button props
       */
      className="p-0.5 text-black  shadow-none border-none"
      icon={<BsThreeDotsVertical className="text-lg text-black" />}
      type="primary"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => handleClickFileOptions({ e, fileData })}
      /**
       * drawer props
       */

      // @ts-ignore
      title={<FileDrawerHeader fileName={fileData.file_name} fileType={fileData.file_type} />}
      drawerContent={isDrawerOpen && <MenuItemComponent menuList={fileMenuList} />}
      closeIcon={null}
      height="auto"
      onClose={handleDrawerClose}
      placement="bottom"
      open={isDrawerOpen}
      // @ts-ignore
      styles={{
        content: { borderRadius: "10px 10px 0 0" },
        header: {
          padding: "12px",
          backgroundColor: themeColors.primary300,
          borderBottomColor: "black",
          borderBottomWidth: "2px",
        },
        body: { backgroundColor: themeColors.primary300, padding: "12px" },
      }}
    />
  );
};

export default OptionsFileButtonWithDrawer;
