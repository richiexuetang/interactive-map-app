import { Container } from "@components/Container";

import styles from "./Footer.module.scss";
import { Box, Icon, chakra } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

const Footer = ({ ...rest }) => {
  return (
    <chakra.footer bg="#221c0f" fontSize={18} p="3rem">
      <Box w="100%" px="15px" mx="auto" pt="1rem" pb="0.25rem">
        <Box display="flex" flexWrap="wrap" mx="-15px">
          <Box
            maxWidth="100%"
            justifyContent="center"
            textAlign="center"
            display="flex"
            flex="0 0 100%"
          >
            <chakra.a
              href="https://github.com/richiexuetang/interactive-map-app"
              opacity={0.8}
              _hover={{ opacity: 1 }}
              cursor="pointer"
              display="flex"
              flexDir="row"
            >
              <Icon as={FaGithub} mr={4} h="1.5em" />
              Contribute on Github
            </chakra.a>
          </Box>
        </Box>
      </Box>
    </chakra.footer>
  );
};

export default Footer;
