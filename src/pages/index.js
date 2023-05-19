import Head from "next/head";

import Layout from "@components/Layout";
import Section from "@components/Section";
import { Box, chakra, Text, Image as ChakraImage } from "@chakra-ui/react";
import Image from "next/image";

import Link from "next/link";

const gamesData = [
  {
    name: "The Witcher 3",
    path: "witcher3",
    previewImage: "/images/preview/witcher3.png",
  },
  {
    name: "Tears of the Kingdom",
    path: "totk",
    previewImage: "/images/preview/totk.png",
  },
];

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Interactive Maps</title>
        <meta
          name="description"
          content="Interactive Maps for different RPGs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Text textAlign="center" fontSize={35}>
          Games:
        </Text>

        <Box display="flex" flexWrap="wrap" justifyContent="center">
          {gamesData.map((gameData) => (
            <Box key={gameData.name} px="1rem" maxW="25%">
              <chakra.a
                as={Link}
                href={`/game/${gameData.path}`}
                background="#e8dfd0 !important"
                cursor="pointer"
                display="flex"
                flexDirection="column"
                wordBreak="break-word"
              >
                <ChakraImage
                  boxSize={240}
                  objectFit="cover"
                  src={`${gameData.previewImage}`}
                  alt={`${gameData.previewImage}`}
                  style={{ objectFit: "contain" }}
                />
                <Box textAlign="center" flex="1 1 auto">
                  <Text
                    m="0 !important"
                    color="#173936"
                    fontWeight="400"
                    fontSize="1.5rem"
                    lineHeight="1.2"
                  >
                    {gameData.name}
                  </Text>
                </Box>
              </chakra.a>
            </Box>
          ))}
        </Box>
      </Section>
    </Layout>
  );
}
