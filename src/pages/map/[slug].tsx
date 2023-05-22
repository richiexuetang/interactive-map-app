import React, { Suspense, useEffect, useState } from "react";
import { NextSeo } from "next-seo";

import Map from "@components/Map";
import { areaConfig } from "@data/areaConfig";
import { initialUserSettings } from "@data/LocalStorage/initial";
import { categoryItemsConfig } from "@data/categoryItemsConfig";
import { COMPLETED, USER_SETTING } from "@data/LocalStorage";
import { mapConfig } from "@data/index";
import { useMapContext } from "src/context/app-context";
import Markers from "@components/Marker/Markers";
import { Loader } from "@components/Loader";
import useLocalStorage from "@hooks/useLocalStorage";
import { useRouter } from "next/router";

export async function getStaticProps(context) {
  const areaId = context.params.slug;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/markers/${areaId}`);

  const data = await res.json();
  const markers = data.data;

  const sortedMarkers = [...markers];
  sortedMarkers.sort((a, b) => b.coord[0] - a.coord[0]);

  const config = areaConfig.find((o) => o.name === areaId);

  const categoryItems = categoryItemsConfig.find(
    (o) => o.gameSlug === config.gameSlug
  );

  const categoryCounts = {};
  markers.map(({ category }) => {
    if (!categoryCounts[category]) {
      categoryCounts[category] = 1;
    } else {
      categoryCounts[category]++;
    }
  });

  return {
    props: {
      markers: sortedMarkers,
      areaId,
      config,
      categoryItems,
      categoryCounts,
    },
    revalidate: 20,
  };
}

export async function getStaticPaths() {
  const paths = [];

  mapConfig.map((conf) => {
    conf.mapOptions.map((option) => {
      paths.push(`/map/${option.path}`);
    });
  });

  return {
    paths,
    fallback: false,
  };
}

const MapPage = ({
  markers,
  areaId,
  config,
  categoryItems,
  categoryCounts,
}) => {
  if (typeof window !== "undefined") {
    useLocalStorage(USER_SETTING, initialUserSettings);
    useLocalStorage(COMPLETED, {});
  }

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => url !== router.asPath && setLoading(true);
    const handleComplete = (url) => url === router.asPath && setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  const {
    setArea,
    setConfig,
    setGame,
    setCategoryItems,
    setCategoryCounts,
    setMarkers,
  } = useMapContext();

  useEffect(() => {
    setArea(areaId);
    setConfig(config);
    setGame(config.gameSlug);
    setCategoryItems(categoryItems);
    setCategoryCounts(categoryCounts);
    setMarkers(markers);
  }, [areaId, config, categoryItems, categoryCounts]);

  if (loading) {
    return <Loader loading={loading} />;
  }
  return (
    <>
      <NextSeo
        title="Interactive Map for Zelda: Tears of the Kingdom totk | Witcher 3"
        description="Interactive Map for Zelda: Tears of the Kingdom totk | Witcher 3"
      />
      <Map markers={markers}>
        {({ TileLayer, useMap }) => (
          <>
            <TileLayer url={`/tiles/${areaId}/{z}/{x}/{y}.png`} noWrap bounds={config.bounds}/>
            {/* noWrap bounds={config.bounds} */}
            <Markers useMap={useMap} gameSlug={config.gameSlug} />
          </>
        )}
      </Map>
    </>
  );
};

export default MapPage;
