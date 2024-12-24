import { Drawer, DrawerProps } from "antd";

interface WithDrawerProps extends DrawerProps {}

const withDrawer = <P extends object>(Component: React.ComponentType<P>) => {
  const WrappedComponent = (props: P & WithDrawerProps) => {
    const { ...drawerProps } = props;
    const componentProps = props as P;

    return (
      <>
        <Component {...componentProps} />
        <Drawer title="Basic Drawer" {...drawerProps}></Drawer>
      </>
    );
  };

  WrappedComponent.displayName = `withDrawer(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default withDrawer;
