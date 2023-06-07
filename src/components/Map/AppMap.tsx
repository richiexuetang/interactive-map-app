import MarkerLayer from "@components/Marker/MarkerLayer";
import { useMapContext } from "@context/app-context";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

const RMMapContainer = dynamic(() => import("@components/Map/RMMapContainer"), {
  ssr: false,
});

const AppMap = () => {
  const {config} = useMapContext();
  
  return (
    <>
      <RMMapContainer>
        {({ TileLayer, useMap, useMapEvents }) => (
          <>
            <TileLayer
              url={`/tiles/${config.name}/{z}/{x}/{y}.png`}
              noWrap
              bounds={config.bounds}
            />
            <MarkerLayer useMap={useMap} useMapEvents={useMapEvents} />
          </>
        )}
      </RMMapContainer>
    </>
  );
};

export default AppMap;
