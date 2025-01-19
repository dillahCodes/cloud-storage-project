const useHandleUpdateFolderMenu = () => {
  /**
   * Toggle the visibility of children menus for the target key.
   * If the target key matches an item, its `isChildrenOpen` property is toggled.
   * For nested menus, the function is recursively applied.
   */
  const updateMenuListVisibility = (menuItems: MenuItem[], targetKey: string): MenuItem[] => {
    return menuItems.map((item) => {
      // If the key matches, toggle its `isChildrenOpen` state
      if (item.key === targetKey) {
        return { ...item, isChildrenOpen: !item.isChildrenOpen };
      }
      // If the item has children, recursively update their visibility
      if (item.children) {
        return { ...item, children: updateMenuListVisibility(item.children, targetKey) };
      }
      // Otherwise, return the item unchanged
      return item;
    });
  };

  /**
   * Close all children menus recursively.
   * This ensures that all `isChildrenOpen` properties are set to `false`.
   */
  const closeAllChildren = (menuItems: MenuItem[]): MenuItem[] => {
    return menuItems.map((item) => ({
      ...item,
      isChildrenOpen: false,
      // If the item has children, recursively close them
      children: item.children ? closeAllChildren(item.children) : undefined,
    }));
  };

  return {
    updateMenuListVisibility,
    closeAllChildren,
  };
};

export default useHandleUpdateFolderMenu;
