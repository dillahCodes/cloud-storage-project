import { isFileResult, isFolderResult, isNotificationResult, resultSearchSelector } from "@/features/search-folder-or-file/slice/result-search-slice";
import { Flex, Spin } from "antd";
import { Fragment, useMemo } from "react";
import { useSelector } from "react-redux";
import SearchbarItemFile from "./searchbar-item-file";
import SearchbarItemFolder from "./searchbar-item-folder";

const SearchbarResult = () => {
  /**
   * result state
   */
  const { data, dataLength } = useSelector(resultSearchSelector);
  const isHaveMoreData = data.length < dataLength;
  const isBlurActive = dataLength > 5;

  /**
   * render data and mapping by type
   */
  const mappingData = useMemo(() => {
    return data.map((item, index) => {
      return (
        <Fragment key={index}>
          {isFileResult(item) && <SearchbarItemFile file={item} />}
          {isFolderResult(item) && <SearchbarItemFolder folder={item} />}
          {isNotificationResult(item) && <div></div>}
        </Fragment>
      );
    });
  }, [data]);

  return (
    <Flex vertical className="w-full relative">
      {/* top blur */}
      {isBlurActive && (
        <div className="absolute top-0  w-full h-[30px] bg-transparent z-10  bg-gradient-to-b from-[#fff1ff] from-10% to-transparent flex items-center" />
      )}

      <Flex gap="small" className="w-full p-3 max-h-[350px] overflow-y-auto no-scrollbar" vertical id="result-search">
        {mappingData}
        {isHaveMoreData && (
          <Flex className="w-full p-3" align="center" justify="center">
            <Spin />
          </Flex>
        )}
      </Flex>

      {/* bottom blur */}
      {isBlurActive && (
        <div className="absolute bottom-0  w-full h-[30px] z-10  bg-gradient-to-t from-[#fff1ff] from-10% to-transparent flex items-center" />
      )}
    </Flex>
  );
};

export default SearchbarResult;
