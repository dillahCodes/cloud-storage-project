import { RenderSearchCategoryIcon } from "@/features/search-folder-or-file/render-search-icon";
import { SEARCH_CATEGORY_NAME } from "@/features/search-folder-or-file/search-menu";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import { Flex, Typography } from "antd";
import classNames from "classnames";
import { SearchbarArrowWithFloatingElement } from "./searchbar-arrow-with-floating-element";

const { Text } = Typography;

interface SearchCategoryItem {
  name: SEARCH_CATEGORY_NAME;
  label: string;
}

interface SearchCategoryProps {
  selectedSearchCategoryName: SEARCH_CATEGORY_NAME;
  searchCategoryMenuItems: ReadonlyArray<SearchCategoryItem>;
  handleSetSearchCategory: (categoryName: SEARCH_CATEGORY_NAME) => void;
}

export const SearchCategory: React.FC<SearchCategoryProps> = ({
  selectedSearchCategoryName,
  searchCategoryMenuItems,
  handleSetSearchCategory,
}) => {
  return (
    <Flex className="bg-[#FFB6C1] rounded-sm" style={neoBrutalBorderVariants.small}>
      <Text className="text-xl p-1 border-2 border-black border-r-0">
        <RenderSearchCategoryIcon name={selectedSearchCategoryName} />
      </Text>
      <SearchbarArrowWithFloatingElement
        wraperClassName="z-20 h-fit"
        floatingElClassName="rounded-sm w-fit"
        floatingContent={
          <Flex className="w-[170px] p-1 no-scrollbar overflow-y-auto rounded-sm h-fit" vertical>
            {searchCategoryMenuItems.map((item) => (
              <Flex
                key={item.name}
                align="center"
                gap="middle"
                onClick={() => handleSetSearchCategory(item.name)}
                className={classNames("p-1 hover:bg-[#FFB6C1]", { "bg-[#ff87a6]": item.name === selectedSearchCategoryName })}
              >
                <Text className="text-base">
                  <RenderSearchCategoryIcon name={item.name} />
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
