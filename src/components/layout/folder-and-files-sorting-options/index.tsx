import useFileSortOptions from "@/features/file/hooks/use-file-sort-options";
import useMappingFileType from "@/features/file/hooks/use-mapping-file-type";
import { FileSortingMenu, fileSortingTypeSelector } from "@/features/file/slice/file-sorting-type-slice";
import { mappingFileTypeSelector } from "@/features/file/slice/mapping-file-type-slice";
import useFolderSortOptions from "@/features/folder/hooks/use-folder-sort-options";
import useMappingFolderType from "@/features/folder/hooks/use-mapping-folder-type";
import {
  FolderSortingMenu,
  folderSortingTypeSelector,
  SortingFor,
} from "@/features/folder/slice/folder-sorting-type";
import { mappingFolderTypeSelector } from "@/features/folder/slice/mapping-folder-type-slice";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import { withFloatingElement } from "@components/hoc/with-floating-element";
import Button from "@components/ui/button";
import { Flex, Typography } from "antd";
import classNames from "classnames";
import { useState } from "react";
import { BsGrid, BsList } from "react-icons/bs";
import { IoArrowDownSharp } from "react-icons/io5";
import { MdArrowDropDown } from "react-icons/md";
import { useSelector } from "react-redux";

const { Text } = Typography;
const ButtonWithFloatinEl = withFloatingElement(Button);

interface FoldersAndFilesSortingOptionsProps {
  sortingFor: SortingFor;
}

const FoldersAndFilesSortingOptions: React.FC<FoldersAndFilesSortingOptionsProps> = ({ sortingFor }) => {
  // mapping state
  const { mappingFolderType } = useSelector(mappingFolderTypeSelector);
  const { mappingFileType } = useSelector(mappingFileTypeSelector);

  // sorting state
  const fileSortingState = useSelector(fileSortingTypeSelector);
  const folderSortingState = useSelector(folderSortingTypeSelector);

  const isForFile = sortingFor === "Files";

  // mapping handler
  const {
    handleSetGridMappingtype: handleSetFolderGridMappingtype,
    handleSetListMappingtype: handleSetFolderListMappingtype,
  } = useMappingFolderType();
  const {
    handleSetGridMappingtype: handleSetFileGridMappingtype,
    handleSetListMappingtype: handleSetFileListMappingtype,
  } = useMappingFileType();

  // sorting handle
  const { handleFolderChangeSorting } = useFolderSortOptions();
  const { handleFileChangeSorting } = useFileSortOptions();

  return (
    <Flex className="w-full" align="center" justify="space-between">
      {/* title for */}
      <Text className="font-bold text-base font-archivo">{sortingFor}</Text>

      {/* sorting options */}
      <Flex gap="middle">
        <Button
          type="primary"
          size="small"
          icon={
            <IoArrowDownSharp
              className={classNames("text-black text-sm  transition-all duration-300", {
                "rotate-180": isForFile
                  ? fileSortingState.selectedSorting === "Ascending"
                  : folderSortingState.selectedSorting === "Ascending",
              })}
              onClick={isForFile ? handleFileChangeSorting : handleFolderChangeSorting}
            />
          }
          neoBrutalType="medium"
        />
        <ButtonWithFloatinEl
          floatingElement={<Options sortingFor={sortingFor} />}
          parentFloatingElementClassName="right-0 top-8 rounded-md"
          parentZIndex={3}
          type="primary"
          size="small"
          icon={<MdArrowDropDown className="text-black text-xl" />}
          iconPosition="end"
          className="flex items-center"
          neoBrutalType="medium"
        >
          <Text className="text-black font-archivo">
            {isForFile ? fileSortingState.selectedCategory : folderSortingState.selectedCategory}
          </Text>
        </ButtonWithFloatinEl>

        {/* mapping options */}
        <Flex
          align="center"
          gap="small"
          className="border p-0.5 px-1 rounded-md border-black relative overflow-hidden"
          style={neoBrutalBorderVariants.medium}
        >
          <div
            className={classNames("absolute w-1/2  h-full left-0 transition-all duration-300", {
              "translate-x-full": isForFile ? mappingFileType === "list" : mappingFolderType === "list",
            })}
            style={{ backgroundColor: themeColors.primary200 }}
          />
          <Text
            className="font-bold text-base font-archivo z-[1] cursor-pointer"
            onClick={isForFile ? handleSetFileGridMappingtype : handleSetFolderGridMappingtype}
          >
            <BsGrid />
          </Text>
          <Text
            className="font-bold text-lg font-archivo z-[1] cursor-pointer"
            onClick={isForFile ? handleSetFileListMappingtype : handleSetFolderListMappingtype}
          >
            <BsList />
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default FoldersAndFilesSortingOptions;

const fileSortingMenu: FileSortingMenu[] = [
  {
    label: "Name",
    value: "Name",
  },
  {
    label: "Size",
    value: "Size",
  },
  {
    label: "Upload Time",
    value: "Upload Time",
  },
];

const folderSortingMenu: FolderSortingMenu[] = [
  {
    label: "Name",
    value: "Name",
  },
  {
    label: "Last Modified",
    value: "Last Modified",
  },
];

interface OptionsProps {
  sortingFor: SortingFor;
}

const Options: React.FC<OptionsProps> = ({ sortingFor }) => {
  const isForFile = sortingFor === "Files";

  // sorting  menu state
  const [sortingMenu] = useState<FileSortingMenu[] | FolderSortingMenu[]>(
    isForFile ? [...fileSortingMenu] : [...folderSortingMenu]
  );

  // sorting handle
  const { handleFolderChangeSelectedCategory } = useFolderSortOptions();
  const { handleFileChangeSelectedCategory } = useFileSortOptions();

  return (
    <Flex
      className="w-[150px] border-2 border-black rounded-md p-1.5"
      style={neoBrutalBorderVariants.medium}
      vertical
    >
      {sortingMenu.map((option) => (
        <Text
          className="text-black font-archivo cursor-pointer p-1 hover:bg-[#FF5277] transition-all duration-300 rounded-sm hover:text-[#fff1ff]"
          key={option.value}
          onClick={() =>
            isForFile
              ? handleFileChangeSelectedCategory(option.value as FileSortingMenu["value"])
              : handleFolderChangeSelectedCategory(option.value as FolderSortingMenu["value"])
          }
        >
          {option.label}
        </Text>
      ))}
    </Flex>
  );
};
