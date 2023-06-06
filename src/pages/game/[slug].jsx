import { useEffect } from "react";

import { chakra, Box } from "@chakra-ui/react";

import Layout from "@components/Layout";
import { mapConfig } from "@data/.";
import useMapObject from "@hooks/useMapObject";
import { ImageLayout } from "@layout/Image";
import Link from "next/link";
import Image from "next/image";

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
      <chakra.nav
        px={4}
        display="flex"
        position="relative"
        alignItems="center"
        py={2}
        justifyContent="flex-start"
      >
        <Box
          w="100%"
          px="15px"
          mx="auto"
          display="flex"
          justifyContent="space-between"
        >
          <Link
            href="/"
            style={{
              marginRight: "auto !important",
              marginLeft: "auto !important",
            }}
          >
            <Image
            src="https://i.ibb.co/yn9gLk3/app-logo.png"
            alt="logo"
            width={145}
            height={20}
            style={{ width: 'auto', height: 'auto' }}
            priority={true}
          />
          </Link>
        </Box>
      </chakra.nav>
      <ImageLayout imageData={config.mapOptions} imageType="Map" />
    </Layout>
  );
};

export default GamePage;
