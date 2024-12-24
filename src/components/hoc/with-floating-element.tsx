import useClickOutside from "@/hooks/use-click-outside";
import { neoBrutalBorderVariants as borderVariant, NeoBrutalVariant, themeColors } from "@/theme/antd-theme";
import classNames from "classnames";
import { useRef } from "react";

interface WithFloatingElementProps {
  floatingElement: React.ReactNode;
  neoBrutalBorderVariants?: NeoBrutalVariant;
  topPosition?: number;
  leftPosition?: number;
  rightPosition?: number;
  parentFloatingElementClassName?: string;
  parentZIndex?: number;
  parentId?: string;
}

export function withFloatingElement<P extends object>(Component: React.ComponentType<P>) {
  const WrappedComponent = (props: P & WithFloatingElementProps) => {
    const {
      floatingElement,
      leftPosition,
      neoBrutalBorderVariants,
      parentFloatingElementClassName,
      parentZIndex,
      rightPosition,
      topPosition,
      parentId,
      ...restProps
    } = props;

    const floatingElementRef = useRef<HTMLDivElement>(null);
    const trigerElement = useRef<HTMLDivElement>(null);
    const { isOpen } = useClickOutside({
      excludeELRef: floatingElementRef,
      trigerElRef: trigerElement,
    });

    const borderStyle = neoBrutalBorderVariants ? borderVariant[neoBrutalBorderVariants] : {};

    return (
      <div className="relative  cursor-pointer">
        <div ref={trigerElement}>
          <Component {...(restProps as P)} />
        </div>

        {isOpen && floatingElement && (
          <div
            ref={floatingElementRef}
            id={props.parentId}
            className={classNames("absolute cursor-default", parentFloatingElementClassName)}
            style={{
              ...borderStyle,
              top: topPosition ? `${topPosition}px` : undefined,
              left: leftPosition ? `${leftPosition}px` : undefined,
              right: rightPosition ? `${rightPosition}px` : undefined,
              backgroundColor: themeColors.primary300,
              zIndex: parentZIndex,
            }}
          >
            {floatingElement}
          </div>
        )}
      </div>
    );
  };
  return WrappedComponent;
}
