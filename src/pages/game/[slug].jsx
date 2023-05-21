import { useEffect } from "react";

import Layout from "@components/Layout";
import { mapConfig } from "@data/.";
import useMapObject from "@hooks/useMapObject";
import { ImageLayout } from "@layout/Image";

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
      <ImageLayout imageData={config.mapOptions} imageType="Map"/>
    </Layout>
  );
};

export default GamePage;
