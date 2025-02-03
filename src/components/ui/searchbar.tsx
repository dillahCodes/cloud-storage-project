import { Button, Flex } from "antd";
import { IoSearchSharp } from "react-icons/io5";
import { neoBrutalBorderVariants, NeoBrutalVariant } from "@/theme/antd-theme";

interface SearchbarProps {
  borderVariants?: NeoBrutalVariant;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const Searchbar: React.FC<SearchbarProps> = ({ borderVariants = "small", handleInputChange }) => {
  return (
    <Flex style={neoBrutalBorderVariants[borderVariants]} className="rounded-sm  w-full border-2 border-black" align="center">
      <input onChange={handleInputChange} type="text" className="focus:outline-none p-2 w-full h-full" placeholder="Search..." />
      <Button className="rounded-none shadow-none border-none outline-none m-0 p-3 text-black" type="primary" icon={<IoSearchSharp />} />
    </Flex>
  );
};

export default Searchbar;
