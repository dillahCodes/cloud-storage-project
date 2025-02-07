import useSearchbarResultFind from "@/features/search-folder-or-file/hooks/use-searchbar-result-find";
import { Tour } from "antd";

const FolderOrFileFindOverlay = () => {
  /**
   * hook result find
   */
  const { handleCloseTour, isOpen, steps } = useSearchbarResultFind();

  return <Tour open={isOpen} onClose={handleCloseTour} steps={steps} disabledInteraction />;
};

export default FolderOrFileFindOverlay;
