import { withDynamicFloatingElement } from "@components/hoc/with-dynamic-floating-element";
import { Typography } from "antd";
import { TiArrowSortedDown } from "react-icons/ti";

const { Text } = Typography;

const SearchbarArrow = () => {
  return (
    <Text className="text-xl border-2 p-1 border-black ">
      <TiArrowSortedDown />
    </Text>
  );
};

export const SearchbarArrowWithFloatingElement = withDynamicFloatingElement(SearchbarArrow);
