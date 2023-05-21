import { Box, Text, Image as ChakraImage } from "@chakra-ui/react";
import Image from "next/image";

//sm = 30em, md = 48em, lg = 62em, xl = 80em
const LogoContainer = () => {
  const logo = [
    {
      src: "https://i.ibb.co/yn9gLk3/app-logo.png",
    },
  ];
  
  return (
    <Box w="100%" px="15px" mx="auto" pt="1rem" pb="0.25rem">
      <Box
        display="flex"
        flexWrap="wrap"
        mx="-15px"
        textAlign="center"
      >
        <Box
          px="15px"
          mx="auto"
          maxW={{ lg: "960px", md: "720px", sm: "540px" }}
        >
          <Image
            src={logo[0].src}
            alt={logo[0].src}
            width={200}
            height={50}
            style={{ width: 'auto', height: 'auto' }}
          />
          <Text fontSize={16}>Interactive Game Maps</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default LogoContainer;
