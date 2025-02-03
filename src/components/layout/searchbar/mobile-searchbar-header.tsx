import useSearch from "@/features/search-folder-or-file/hooks/use-search";
import { resetResultSearch } from "@/features/search-folder-or-file/slice/result-search-slice";
import { resetSerchbarState } from "@/features/search-folder-or-file/slice/search-bar-slice";
import Button from "@components/ui/button";
import Searchbar from "@components/ui/searchbar";
import { Flex } from "antd";
import { Header } from "antd/es/layout/layout";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";

const MobileSearchbarHeader = () => {
  const dispatch = useDispatch();
  const { handleSearchInputChange } = useSearch();

  const handleCloseMobileSearchBar = () => {
    dispatch(resetResultSearch());
    dispatch(resetSerchbarState());
  };

  return (
    <Header className="p-3 border-b-2 border-black">
      <Flex className="w-full" align="center" gap="middle">
        <Button
          type="primary"
          onClick={handleCloseMobileSearchBar}
          className="cursor-pointer  text-xl text-black  w-fit p-3 h-9 rounded-sm bg-[#FFB6C1] "
          neoBrutalType="small"
        >
          <IoMdClose />
        </Button>
        <Searchbar handleInputChange={handleSearchInputChange} />
      </Flex>
    </Header>
  );
};

export default MobileSearchbarHeader;
