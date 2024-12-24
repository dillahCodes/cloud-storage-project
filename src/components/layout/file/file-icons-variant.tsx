import { AiOutlineFileWord } from "react-icons/ai";
import { BsFileEarmark, BsFiletypeJpg, BsFiletypeMp4, BsFiletypePdf, BsFiletypePptx, BsFiletypeXls } from "react-icons/bs";

const FileIconsVariant = ({ fileType }: { fileType: string }) => {
  switch (fileType) {
    case "application/pdf":
      return <BsFiletypePdf />;
    case "image/jpeg":
      return <BsFiletypeJpg />;
    case "image/png":
      return <BsFiletypeJpg />;
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return <BsFiletypeXls />;
    case "application/msword":
      return <AiOutlineFileWord />;
    case "video/mp4":
      return <BsFiletypeMp4 />;
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return <BsFiletypePptx />;
    default:
      return <BsFileEarmark />;
  }
};

export default FileIconsVariant;
