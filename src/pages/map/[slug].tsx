import React, { useEffect } from "react";

import { mapConfig } from "../game/[slug]";
import Map from "@components/Map";
import { areaConfig } from "@data/areaConfig";
import CustomMarker from "@components/Marker/CustomMarker";
import useLocalStorage from "@hooks/useLocalStorage";
import { initialUserSettings } from "@data/LocalStorage/initial";
import { categoryItemsConfig } from "@data/categoryItemsConfig";
import { COMPLETED, USER_SETTING } from "@data/LocalStorage";
import { useMapContext } from "src/context/app-context";
import { NextSeo } from "next-seo";

export async function getStaticProps(context) {
  const areaId = context.params.slug;

  const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/markers/${areaId}`);
  //const res = await fetch(`http://localhost:8080/api/markers/${areaId}`);

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
  };
}

export async function getStaticPaths() {
  const paths = [];

  mapConfig.map((conf) => {
    conf.mapOptions.map((option) => {
      paths.push(`/map/${option[0]}`);
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

  return (
    <>
      <NextSeo
        title="Interactive Map for Zelda: Tears of the Kingdom totk | Witcher 3"
        description="Interactive Map for Zelda: Tears of the Kingdom totk | Witcher 3"
      />
      <Map markers={markers}>
        {({ TileLayer, useMap }) => (
          <>
            <TileLayer url={`/tiles/${areaId}/{z}/{x}/{y}.png`} />
            {markers &&
              markers.map((marker, i) => {
                return (
                  <CustomMarker
                    key={i}
                    useMap={useMap}
                    marker={marker}
                    gameSlug={config.gameSlug}
                    rank={i}
                  />
                );
              })}
          </>
        )}
      </Map>
    </>
  );
};

export default MapPage;
