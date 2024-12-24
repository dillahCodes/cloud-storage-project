interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  action?: () => void;
  isChildrenOpen?: boolean;
  children?: MenuItem[]; // Recursive type
}

interface MenuItemProps {
  menuList: MenuItem[];
  handleToggleChildren: (key: string) => void;
}
