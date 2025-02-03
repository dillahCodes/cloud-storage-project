import { Flex, Typography } from "antd";
import { RenderSearchLocationIcon } from "@/features/search-folder-or-file/render-search-icon";
import { LOCATION_CATEGORY } from "@/features/search-folder-or-file/search-menu";
import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import { SearchbarArrowWithFloatingElement } from "./searchbar-arrow-with-floating-element";
import classNames from "classnames";
import { SearchState } from "@/features/search-folder-or-file/search";

const { Text } = Typography;

interface LocationFilterProps {
  selectedLocationName: SearchState["selectedLocationName"];
  handleSetSearchLocation: (locationName: SearchState["selectedLocationName"]) => void;
}
export const LocationFilter: React.FC<LocationFilterProps> = ({ selectedLocationName, handleSetSearchLocation }) => {
  return (
    <Flex className="bg-[#FFB6C1] rounded-sm" style={neoBrutalBorderVariants.small}>
      <Text className="text-xl p-1 border-2 border-black border-r-0">
        <RenderSearchLocationIcon name={selectedLocationName} />
      </Text>
      <SearchbarArrowWithFloatingElement
        wraperClassName="z-20"
        floatingElClassName="rounded-sm w-fit"
        floatingContent={
          <Flex className="w-[170px] p-1 no-scrollbar overflow-y-auto rounded-sm" vertical>
            {LOCATION_CATEGORY.map((item) => (
              <Flex
                key={item.name}
                align="center"
                gap="middle"
                onClick={() => handleSetSearchLocation(item.name)}
                className={classNames("p-1", { "bg-[#ff87a6]": item.name === selectedLocationName })}
              >
                <Text className="text-base">
                  <RenderSearchLocationIcon name={item.name} />
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
