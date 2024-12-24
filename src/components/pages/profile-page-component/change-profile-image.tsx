import useChangeProfileImage from "@/features/auth/hooks/use-change-profile-image";
import { neoBrutalBorderVariants, themeColors } from "@/theme/antd-theme";
import Alert from "@components/ui/alert";
import Button from "@components/ui/button";
import InputImage from "@components/ui/input-image";
import { Flex, Typography } from "antd";
import { useRef } from "react";

const { Text } = Typography;
const ChangeProfileImage: React.FC = () => {
  const inputImageRef = useRef<HTMLInputElement>(null);
  const { fileData, handleChange, handleConfirmChangeImage, uploadImageStatus } = useChangeProfileImage();

  return (
    <div
      className="border-2 border-black  w-full rounded-md p-3"
      style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.primary200 }}
    >
      <div
        className="w-fit border-2 border-black p-1 rounded-sm px-2"
        style={{ ...neoBrutalBorderVariants.medium, backgroundColor: themeColors.bg100 }}
      >
        <Text className="capitalize font-bold font-archivo">Change Profile Image</Text>
      </div>

      {uploadImageStatus.type && (
        <Alert
          message={uploadImageStatus.message}
          className="rounded-sm font-archivo mt-3 capitalize"
          type={uploadImageStatus.type}
          showIcon
          neoBrutalVariants="medium"
        />
      )}

      <Flex
        vertical
        className="p-3 w-full mt-3 border-2 border-black rounded-sm"
        gap="middle"
        style={{ backgroundColor: themeColors.bg100, ...neoBrutalBorderVariants.medium }}
      >
        <Flex className="w-fit" vertical gap="middle">
          <InputImage
            onImageChange={handleChange}
            ref={inputImageRef}
            onClick={() => inputImageRef.current?.click()}
            image={fileData.base64Image}
          />
          <Button
            loading={uploadImageStatus.status === "loading"}
            type="primary"
            onClick={handleConfirmChangeImage}
            className="w-full rounded-sm text-black font-archivo p-3"
            neoBrutalType="medium"
          >
            Confirm
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default ChangeProfileImage;
