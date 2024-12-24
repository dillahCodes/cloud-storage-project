import { Flex } from "antd";
import { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BreadcrumbItemComponent from "./breadcrumb-item";
import BreadcrumbItemTruncatedComponent from "./breadcrumb-item-truncated-component";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = memo(({ items }) => {
  const navigate = useNavigate();

  // Helper function to check if an item is the last breadcrumb
  const isLast = (index: number, items: BreadcrumbItem[]) => index === items.length - 1;

  // Logic to truncate breadcrumb items
  const truncatedItems = useMemo(() => {
    if (items.length === 4) return items.slice(0, -2);
    else if (items.length > 4) return items.slice(0, -2);
    return undefined;
  }, [items]);

  const lastTruncatedItems = useMemo(() => {
    if (items.length === 4) return items.slice(-2);
    else if (items.length > 4) return items.slice(-2);
    return undefined;
  }, [items]);

  const handleClickBreadcrumbItem = (item: BreadcrumbItem) => navigate(item.path);

  const RenderBreadcrumbItems = memo(() => {
    if (truncatedItems) {
      return (
        <>
          <BreadcrumbItemTruncatedComponent truncatedItems={truncatedItems} handleItemsOnClick={handleClickBreadcrumbItem} />
          {lastTruncatedItems?.map((item, index) => (
            <BreadcrumbItemComponent
              isFirst={false}
              key={item.key}
              item={item}
              isLast={isLast(index, lastTruncatedItems)}
              onClick={() => handleClickBreadcrumbItem(item)}
            />
          ))}
        </>
      );
    } else {
      return items.map((item, index) => (
        <BreadcrumbItemComponent
          isFirst={index === 0}
          key={item.key}
          item={item}
          isLast={isLast(index, items)}
          onClick={() => handleClickBreadcrumbItem(item)}
        />
      ));
    }
  });

  return (
    <Flex component="ol" gap="small" className="flex items-center">
      <RenderBreadcrumbItems />
    </Flex>
  );
});

export default Breadcrumb;
