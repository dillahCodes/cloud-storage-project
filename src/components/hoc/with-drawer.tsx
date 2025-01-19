import { Drawer, DrawerProps } from "antd";

interface WithDrawerProps extends DrawerProps {
  drawerContent: React.ReactNode;
}

const withDrawer = <P extends object>(Component: React.ComponentType<P>) => {
  const WrappedComponent = (props: P & WithDrawerProps) => {
    const { drawerContent, closeIcon, ...otherProps } = props;
    const { ...drawerProps } = otherProps;
    const componentProps = otherProps as P;

    return (
      <>
        <Component {...componentProps} />
        <Drawer closeIcon={closeIcon} {...drawerProps}>
          {drawerContent}
        </Drawer>
      </>
    );
  };

  WrappedComponent.displayName = `withDrawer(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default withDrawer;
