import { neoBrutalBorderVariants, NeoBrutalVariant } from "@/theme/antd-theme";
import { Flex } from "antd";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

interface ElementRef {
  floatingElementRef: HTMLDivElement | null;
  trigerElement: HTMLDivElement | null;
}

interface WithFloatingElementProps {
  floatingContent: React.ReactNode; // floating element
  isFloatingOpen?: boolean; // if true, the floating element will be open
  isOriginalComponentExcluded?: boolean; // if true, the original component will be included and triger oudside click will not work
  wraperClassName?: string;
  floatingElClassName?: string;
  neobrutalType?: NeoBrutalVariant;
  callbackIsOpen?: (isOpen: boolean) => void;
}
export const withDynamicFloatingElement = <OriginalComponentProps extends object>(
  Component: React.ComponentType<OriginalComponentProps>
) => {
  const WrappedComponent: React.FC<OriginalComponentProps & WithFloatingElementProps> = ({
    floatingContent,
    isFloatingOpen,
    isOriginalComponentExcluded,
    wraperClassName,
    floatingElClassName,
    neobrutalType,
    callbackIsOpen,
    ...originalProps
  }) => {
    const [isOpen, setIsOpen] = useState<boolean>(isFloatingOpen || false);

    /**
     * ref to store element without trigger re-render
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
     * notify when isOpen changes
     */
    useEffect(() => {
      if (callbackIsOpen) {
        callbackIsOpen(isOpen);
      }
    }, [isOpen, callbackIsOpen]);

    /**
     * logic click outside
     */
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        const isTrigerElement = refs.current.trigerElement?.contains(target);
        const isClickOutside = !refs.current.floatingElementRef?.contains(target);

        if (isTrigerElement && !isOriginalComponentExcluded) {
          setIsOpen((prev) => {
            const newState = !prev;
            callbackIsOpen?.(newState);
            return newState;
          });
        } else if (isTrigerElement && isOriginalComponentExcluded) {
          setIsOpen(true);
          callbackIsOpen?.(true);
        } else if (isClickOutside && isOpen) {
          setIsOpen(false);
          callbackIsOpen?.(false);
        }
      };

      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen, isOriginalComponentExcluded, refs.current.floatingElementRef, refs.current.trigerElement, callbackIsOpen]);

    return (
      <Flex className={classNames("relative cursor-pointer", wraperClassName)} vertical>
        {/* trigger element */}
        <Flex ref={(ref) => (refs.current.trigerElement = ref as HTMLDivElement)}>
          <Component {...(originalProps as OriginalComponentProps)} />
        </Flex>

        {/* floating element */}
        {isOpen && (
          <Flex
            ref={(ref) => (refs.current.floatingElementRef = ref as HTMLDivElement)}
            className={classNames(
              "absolute w-fit bg-white text-black left-0 right-0 border-2 border-black bottom-0 translate-y-[calc(100%+0.5rem)]",
              floatingElClassName
            )}
            style={neoBrutalBorderVariants[neobrutalType || "small"]}
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
