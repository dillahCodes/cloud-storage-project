import { Carousel, Flex, Typography } from "antd";
import React from "react";

import fileIlustration1 from "@assets/File-bundle-amico.svg";
import fileIlustration2 from "@assets/File-bundle-bro.svg";
import fileIlustration3 from "@assets/File-bundle-cuate.svg";

const carouselMenu = [
  {
    image: fileIlustration1,
    title: "Lorem ipsum dolor sit amet.",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, omnis?",
  },
  {
    image: fileIlustration2,
    title: "Lorem ipsum dolor sit amet.",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, omnis?",
  },
  {
    image: fileIlustration3,
    title: "Lorem ipsum dolor sit amet.",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, omnis?",
  },
];

const { Text, Title } = Typography;
const AuthCarousel: React.FC = () => {
  return (
    <Carousel className="max-w-sm   w-full  mx-auto" autoplay>
      {carouselMenu.map((item, index) => (
        <Items key={index} image={item.image} title={item.title} description={item.description} />
      ))}
    </Carousel>
  );
};

export default AuthCarousel;

interface ItemsProps {
  image: string;
  title: string;
  description: string;
}
const Items: React.FC<ItemsProps> = ({ image, title, description }) => {
  return (
    <Flex vertical align="center" justify="center">
      <div className="md:h-[250px] md:w-[250px] w-[190px] h-[190px]">
        <img src={image} className="w-full h-full object-cover" />
      </div>
      <div className="text-center h-[140px] flex flex-col justify-center">
        <Title level={1} className={`capitalize font-bold font-poppins text-xl `}>
          {title}
        </Title>
        <Text className="text-sm capitalize font-archivo ">{description}</Text>
      </div>
    </Flex>
  );
};
