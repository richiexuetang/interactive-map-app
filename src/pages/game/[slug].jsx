import { Box, chakra, Text } from "@chakra-ui/react";
import useMapObject from "../../hooks/useMapObject";
import Link from "next/link";
import { useEffect } from "react";
import Image from "next/image";
import Section from "@components/Section/Section";
import Layout from "@components/Layout/Layout";

export const mapConfig = [
  {
    name: "witcher3",
    mapOptions: [
      ["white-orchard", "White Orchard"],
      ["velen-novigrad", "Velen & Novigrad"],
      ["skellige", "Skellige Isles"],
      ["kaer-morhen", "Kaer Morhen"],
      ["toussaint", "Toussaint"],
      ["fablesphere", "Fablesphere"],
      ["isle-of-mists", "Isle of Mists"],
    ],
  },
  {
    name: "totk",
    mapOptions: [["hyrule", "Hyrule"]],
  },
];

export async function getStaticProps(context) {
  const gameSlug = context.params.slug;

  const config = mapConfig.find((o) => o.name === gameSlug);

  return {
    props: {
      config: config,
    },
  };
}

export async function getStaticPaths() {
  const paths = [];

  mapConfig.map((conf) => {
    paths.push(`/game/${conf.name}`);
  });

  return {
    paths,
    fallback: false,
  };
}

const GamePage = ({ config }) => {
  const [mapRoutes, mapRoutesActions] = useMapObject(null);

  useEffect(() => {
    if (!mapRoutes) {
      mapRoutesActions.setAll(config.mapOptions);
    }
  });

  return (
    <Layout>
      <Section>
        <Box minH="100vh" my="3rem">
          <Box
            maxW="960px"
            w="100%"
            p="auto 15px !important"
            m="auto"
            textAlign="center"
          >
            <Text textAlign="center" fontSize={50}>
              Maps:
            </Text>

            <Box
              display="flex"
              flexWrap="wrap"
              mx="-15px"
              justifyContent="center"
            >
              {config &&
                config.mapOptions.map((option) => (
                  <Box
                    key={option[1]}
                    flex="0 0 25%"
                    maxW="25%"
                    px="15px"
                    mt="15px"
                  >
                    <Link href={"/map/[slug]"} as={`/map/${option[0]}`}>
                      <chakra.a
                        border="0"
                        background="#e8dfd0 !important"
                        cursor="pointer"
                        transition="all .2s ease-in-out"
                        borderRadius="0"
                        display="flex"
                        flexDirection="column"
                        wordBreak="break-word"
                        h="100% !important"
                        onClick={() => console.log("/" + option[1])}
                      >
                        <Image
                          src={`/images/maps/${config.name}/${option[0]}.jpg`}
                          alt={`${option[0]}-map`}
                          width={250}
                          height={100}
                          priority
                        />
                        <Box textAlign="center" flex="1 1 auto">
                          <Text
                            m="0 !important"
                            color="#173936"
                            fontWeight="400"
                            fontSize="1.5rem"
                            lineHeight="1.2"
                          >
                            {option[1]}
                          </Text>
                        </Box>
                      </chakra.a>
                    </Link>
                  </Box>
                ))}
            </Box>
          </Box>
        </Box>
      </Section>
    </Layout>
  );
};

export default GamePage;
