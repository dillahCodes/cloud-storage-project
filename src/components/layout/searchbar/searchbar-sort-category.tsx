import { RenderSortCategoryIcon } from "@/features/search-folder-or-file/render-search-icon";
import { SORT_CATEGORY_NAME } from "@/features/search-folder-or-file/search-menu";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import { Flex, Typography } from "antd";
import classNames from "classnames";
import { SearchbarArrowWithFloatingElement } from "./searchbar-arrow-with-floating-element";

const { Text } = Typography;

interface sortCategoryMenuItemsType {
  name: SORT_CATEGORY_NAME;
  label: string;
}

interface SortCategoryProps {
  selectedSortCategoryName: SORT_CATEGORY_NAME;
  sortCategoryMenuItems: ReadonlyArray<sortCategoryMenuItemsType>;
  handleSetSortCategory: (name: SORT_CATEGORY_NAME) => void;
}
export const SortCategory: React.FC<SortCategoryProps> = ({
  selectedSortCategoryName,
  sortCategoryMenuItems,
  handleSetSortCategory,
}) => {
  return (
    <Flex className="bg-[#FFB6C1] rounded-sm" style={neoBrutalBorderVariants.small}>
      <Text className="text-xl p-1 border-2 border-black border-r-0">
        <RenderSortCategoryIcon name={selectedSortCategoryName} />
      </Text>
      <SearchbarArrowWithFloatingElement
        wraperClassName="z-20"
        floatingElClassName="-translate-x-36"
        floatingContent={
          <Flex className="w-[170px] p-1 no-scrollbar overflow-y-auto rounded-sm" vertical>
            {sortCategoryMenuItems.map((item) => (
              <Flex
                key={item.name}
                align="center"
                gap="middle"
                onClick={() => handleSetSortCategory(item.name)}
                className={classNames("p-1 hover:bg-[#FFB6C1]", { "bg-[#ff87a6]": item.name === selectedSortCategoryName })}
              >
                <Text className="text-base">
                  <RenderSortCategoryIcon name={item.name} />
                </Text>
                <Text className="text-sm font-archivo">{item.label}</Text>
              </Flex>
            ))}
          </Flex>
        }
      />
    </Flex>
  );
};
