const useHandleUpdateFolderMenu = () => {
  const updateMenuListVisibility = (menuItems: MenuItem[], targetKey: string): MenuItem[] => {
    return menuItems.map((item) => {
      if (item.key === targetKey) return { ...item, isChildrenOpen: !item.isChildrenOpen };
      if (item.children) return { ...item, children: updateMenuListVisibility(item.children, targetKey) };
      return item;
    });
  };

  const closeAllChildren = (items: MenuItem[]): MenuItem[] => {
    return items.map((item) => ({
      ...item,
      isChildrenOpen: false,
      children: item.children ? closeAllChildren(item.children) : undefined,
    }));
  };

  return {
    updateMenuListVisibility,
    closeAllChildren,
  };
};

export default useHandleUpdateFolderMenu;
