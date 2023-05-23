import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Box, chakra, Text } from "@chakra-ui/react";

interface ImageLayoutPropsType {
  imageData: any[];
  imageType: string;
}

const ImageLayout: React.FC<ImageLayoutPropsType> = ({
  imageData,
  imageType,
}) => {
  const layoutTitle = imageType + "s:";
  const routeType = imageType.toLowerCase();

  return (
    <Box w="100%" px="15px" mx="auto">
      <Text fontSize="2rem" pos="relative" lineHeight="1.2" mb="0.5rem">
        {layoutTitle}
      </Text>

      <Box display="flex" flexWrap="wrap" mx="-15px" mb="30px" flexDir="row">
        {imageData.map(({ name, path, imagePath, blurDataUrl }) => (
          <Box
            key={name}
            mb="20px"
            maxW={{ md: "25%", sm: "100%" }}
            flex={{ md: "0 0 25%", sm: "0 0 100%" }}
            px="15px"
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
          >
            <Link href={`/${routeType}/[slug]`} as={`/${routeType}/${path}`} >
            <chakra.a
              
              display="flex"
              flexDirection="column"
              overflow="hidden"
              background="#e8dfd0 !important"
              pos="relative"
              h={{ lg: "300px", md: "250px", sm: "200px" }}
            >
              <Image
                src={`${imagePath}`}
                alt={`${imagePath}`}
                placeholder="blur"
                blurDataURL={`${blurDataUrl}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </chakra.a>
            </Link>
            <Box textAlign="center" background="#e8dfd0 !important">
              <Text
                m="0 !important"
                color="#173936"
                fontWeight="400"
                fontSize="1.2rem"
                p="1rem"
                transition="all .2s ease-in-out"
              >
                {name}
              </Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ImageLayout;
