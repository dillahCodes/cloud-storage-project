import { Flex } from "antd";
import ModalStatusUploadContentHeader from "./modal-status-upload-content-header";
import ModalStatusUploadContentBody from "./modal-status-upload-content-body";

const ModalStatusUploadContent = () => (
  <Flex className="w-full" vertical gap="middle">
    <ModalStatusUploadContentHeader />
    <ModalStatusUploadContentBody />
  </Flex>
);

export default ModalStatusUploadContent;
