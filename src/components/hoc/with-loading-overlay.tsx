import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import { Flex, Spin, Typography } from "antd";

type Opacity = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
interface WithLoadingOverlayProps {
  opacity: Opacity;
  zIndex: number;
  showLoading: boolean;
  loadingText: string;
}

const { Text } = Typography;
const withLoadingOverlay = <P extends object>(Component: React.ComponentType<P>) => {
  const WrapperComponent: React.FC<P & WithLoadingOverlayProps> = ({ loadingText, showLoading, opacity, zIndex, ...props }) => {
    return (
      <>
        {showLoading && <LoadingComponent opacity={opacity} zIndex={zIndex} loadingText={loadingText} />}
        <Component {...(props as P)} />
      </>
    );
  };

  return WrapperComponent;
};

export default withLoadingOverlay;

interface LoadingComponentProps {
  opacity: Opacity;
  zIndex: number;
  loadingText: string;
}

// eslint-disable-next-line
const LoadingComponent: React.FC<LoadingComponentProps> = ({ opacity, zIndex, loadingText }) => {
  return (
    <Flex className="fixed top-0 left-0 right-0 bottom-0" style={{ zIndex }} vertical>
      {/* overlay */}
      <div className={`fixed top-0 left-0 right-0 bottom-0  bg-black`} style={{ opacity }} />

      {/* loading component */}
      <Flex
        style={neoBrutalBorderVariants.small}
        align="center"
        justify="center"
        gap="middle"
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 rounded-md border-2 border-black bg-[#fff1ff]"
      >
        <Spin size="default" />
        <Text className="font-archivo">{loadingText}</Text>
      </Flex>
    </Flex>
  );
};
