import { neoBrutalBorderVariants } from "@/theme/antd-theme";
import { Flex, Typography } from "antd";
import classNames from "classnames";
import React, { forwardRef } from "react";
import { LuUploadCloud } from "react-icons/lu";

interface InputImageProps extends React.InputHTMLAttributes<HTMLDivElement> {
  image?: string | null;
  onImageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const { Text } = Typography;

const InputImage = forwardRef<HTMLInputElement, InputImageProps>(({ image, onImageChange, ...props }, ref) => {
  return (
    <Flex
      align="center"
      justify="center"
      className="h-[150px] w-[150px] border-2 border-dashed rounded-sm border-black cursor-pointer "
      style={{ ...neoBrutalBorderVariants.medium, backgroundColor: "white" }}
      {...props}
    >
      <input type="file" className="hidden" onChange={onImageChange} ref={ref} />
      <Flex vertical justify="center" className="w-full h-full relative" align="center">
        {image && <img src={image} alt="" className="object-cover w-full h-full" />}
        <Flex
          gap="small"
          vertical
          className={classNames("absolute h-full w-full", {
            "bg-gradient-to-b from-[#00000068] to-[#00000083]": image,
          })}
          justify="center"
          align="center"
        >
          <Text
            className={classNames("text-4xl", {
              "text-black": !image,
              "text-[#FF5277]": image,
            })}
          >
            <LuUploadCloud />
          </Text>
          <Text
            className={classNames("capitalize text-xs font-light font-archivo", {
              "text-black": !image,
              "text-[#FF5277]": image,
            })}
          >
            upload image
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
});

InputImage.displayName = "InputImage";

export default InputImage;
