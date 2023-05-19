import Head from "next/head";

import Layout from "@components/Layout";
import Section from "@components/Section";
import { Box, chakra, Text } from "@chakra-ui/react";
import Image from "next/image";

import Link from "next/link";

const DEFAULT_CENTER = [83.93, -168.15];
const DEFAULT_BOUNDS = [
  [83.8, -169.65],
  [84, -167],
];

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
            <Box key={gameData.name} flex="0 0 25%" maxW="25%" px="1rem">
              <Link href={`/game/${gameData.path}`}>
                <chakra.a
                  background="#e8dfd0 !important"
                  cursor="pointer"
                  display="flex"
                  flexDirection="column"
                  wordBreak="break-word"
                >
                  <Image
                    width={210}
                    height={144}
                    src={`${gameData.previewImage}`}
                    alt={`${gameData.previewImage}`}
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
              </Link>
            </Box>
          ))}
        </Box>
      </Section>
    </Layout>
  );
}
