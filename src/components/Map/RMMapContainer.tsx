//@ts-nocheck
import React from "react";
import * as ReactLeaflet from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import { Sidebar } from "@components/.";
import { useMapContext } from "@context/.";

const { MapContainer, useMap } = ReactLeaflet;

const RMMapContainer = ({ children }) => {
  const { config } = useMapContext();

  return (
    <MapContainer
      style={{ background: "black", height: "100vh", width: "100vw" }}
      smoothWheelZoom={true}
      smoothSensitivity={15}
      scrollWheelZoom={false}
      attributionControl={false}
      center={config.center}
      zoom={config.zoom}
      bounds={config.bounds}
      minZoom={config.minZoom}
      maxZoom={config.maxZoom}
    >
      {children(ReactLeaflet, L)}
      <Sidebar useMap={useMap} />
    </MapContainer>
  );
};

export default RMMapContainer;
