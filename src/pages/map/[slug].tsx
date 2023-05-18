import React from "react";
import { mapConfig } from "../game/[slug]";
import Map from "@components/Map";
import { areaConfig } from "@data/areaConfig";
import CustomMarker from "@components/Marker/CustomMarker";
import useLocalStorage from "@hooks/useLocalStorage";
import { initialUserSettings } from "@data/LocalStorage/initial";
import { useState } from "react";
import { categoryItemsConfig } from "@data/categoryItemsConfig";

export async function getStaticProps(context) {
  const areaId = context.params.slug;
  const res = await fetch(`http://localhost:8080/api/markers/${areaId}`);

  const data = await res.json();
  const markers = data.data;

  const sortedMarkers = [...markers];
  sortedMarkers.sort((a, b) => b.coord[0] - a.coord[0]);

  const config = areaConfig.find((o) => o.name === areaId);

  const categoryItems = categoryItemsConfig.find(
    (o) => o.gameSlug === config.gameSlug
  );

  const categoryCounts = {};
  markers.map(({category}) => {
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
      categoryCounts
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

const MapPage = ({ markers, areaId, config, categoryItems, categoryCounts }) => {
  if (typeof window !== "undefined") {
    useLocalStorage("interactive_map_user_setting", initialUserSettings);
    useLocalStorage("interactive_map_completed", {});
  }
  const [markerRefs, setMakerRefs] = useState([]);

  return (
    <>
      <Map
        config={config}
        area={areaId}
        markerRefs={markerRefs}
        categoryItems={categoryItems}
        categoryCounts={categoryCounts}
        markers={markers}
      >
        {({ TileLayer, useMap }, Leaflet) => (
          <>
            <TileLayer url={`/tiles/${areaId}/{z}/{x}/{y}.png`} />
            {markers &&
              markers.map((marker, i) => {
                return (
                  <CustomMarker
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
