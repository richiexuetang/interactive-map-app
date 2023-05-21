//@ts-nocheck
import React, { useState, useEffect } from "react";
import * as ReactLeaflet from "react-leaflet";
import L from "leaflet";

import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";

import Sidebar from "@components/Sidebar/Sidebar";
import { useMapContext } from "src/context/app-context";
import { MarkerProvider } from "src/context/marker-context";
import MarkerClusterGroup from "@components/Marker/MarkerClusterGroup";
import { FullscreenControl } from "react-leaflet-fullscreen";


const { MapContainer, useMap } = ReactLeaflet;

const Map = ({ children, ...rest }) => {
  const { config } = useMapContext();

  const [mapInfo, setMapInfo] = useState(null);

  useEffect(() => {
    if (typeof window === undefined) {
      console.log('herro')
      return;
    }
  }, [window]);

  useEffect(() => {
    if (!mapInfo && config) {
      setMapInfo({ ...config });
    }
  }, [mapInfo, config]);

  if (!mapInfo) {
    return <div>Loading...</div>;
  }

  return (
    <MapContainer
      style={{ background: "#967959", height: "100vh", width: "100vw" }}
      smoothWheelZoom={true}
      smoothSensitivity={15}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      attributionControl={false}
      zoomControl={false}
      center={config.center}
      zoom={config.zoom}
      bounds={config.bounds}
      minZoom={config.minZoom}
      maxZoom={config.maxZoom}
      {...rest}
    >
      <MarkerProvider>
        <MarkerClusterGroup
          zoomToBoundsOnClick={true}
          disableClusteringAtZoom={mapInfo.maxZoom - 1}
          maxClusterRadius={15}
        >
          {children(ReactLeaflet, L)}
        </MarkerClusterGroup>
        <Sidebar useMap={useMap} />
      </MarkerProvider>
    </MapContainer>
  );
};

export default Map;
