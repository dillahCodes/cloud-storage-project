import { neoBrutalBorderVariants, NeoBrutalVariant } from "@/theme/antd-theme";
import { Flex } from "antd";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

interface ElementRef {
  floatingElementRef: HTMLDivElement | null;
  trigerElement: HTMLDivElement | null;
}

interface WithFloatingElementProps {
  neoBrutalVariant: NeoBrutalVariant; // neo brutal variant
  floatingContent: React.ReactNode; // floating element
  isFloatingOpen?: boolean; // if true, the floating element will be open
  isOriginalComponentExcluded?: boolean; // if true, the original component will be included and triger oudside click will not work
  wraperClassName?: string;
  floatingElClassName?: string;
}

export const withDynamicFloatingElement = <OriginalComponentProps extends object>(
  Component: React.ComponentType<OriginalComponentProps>
) => {
  const WrappedComponent: React.FC<OriginalComponentProps & WithFloatingElementProps> = ({
    floatingContent,
    neoBrutalVariant,
    isFloatingOpen,
    isOriginalComponentExcluded,
    wraperClassName,
    floatingElClassName,
    ...originalProps
  }) => {
    const [isOpen, setIsOpen] = useState<boolean>(isFloatingOpen || false);

    /**
     * ref to store elment without triger re-render
     */
    const refs = useRef<ElementRef>({
      floatingElementRef: null,
      trigerElement: null,
    });

    /**
     * always update isOpen when isFloatingOpen changes
     */
    useEffect(() => {
      setIsOpen(isFloatingOpen || false);
    }, [isFloatingOpen]);

    /**
     * logic click outside
     */
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        const isTrigerElement = refs.current.trigerElement?.contains(target);
        const isClickOutside = !refs.current.floatingElementRef?.contains(target);

        if (isTrigerElement && !isOriginalComponentExcluded) setIsOpen((prev) => !prev);
        else if (isTrigerElement && isOriginalComponentExcluded) setIsOpen(true);
        else if (isClickOutside && isOpen) setIsOpen(false);
      };

      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen, isOriginalComponentExcluded, refs.current.floatingElementRef, refs.current.trigerElement]);

    return (
      <Flex className={classNames("relative cursor-pointer", wraperClassName)} vertical>
        {/* triger element */}
        <Flex ref={(ref) => (refs.current.trigerElement = ref as HTMLDivElement)}>
          <Component {...(originalProps as OriginalComponentProps)} />
        </Flex>

        {/* floating element */}
        {isOpen && (
          <Flex
            ref={(ref) => (refs.current.floatingElementRef = ref as HTMLDivElement)}
            className={classNames(
              "absolute max-h-[130px] overflow-y-auto bg-white text-black left-0 right-0 border-2 border-black  bottom-0  translate-y-[calc(100%+0.5rem)]",
              floatingElClassName
            )}
            style={neoBrutalBorderVariants.small}
          >
            {floatingContent}
          </Flex>
        )}
      </Flex>
    );
  };

  WrappedComponent.displayName = `withDynamicFloatingElement(${Component.displayName || Component.name || "Component"})`;
  return WrappedComponent;
};
