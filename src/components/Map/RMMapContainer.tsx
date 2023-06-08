//@ts-nocheck
import React, { useState } from "react";
import * as ReactLeaflet from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./leaflet.smooth-wheel-zoom.js";
import { useMapContext } from "@context/.";

const { MapContainer } = ReactLeaflet;

const RMMapContainer = ({ children }) => {
  const [map, setMap] = useState(null);
  const { config } = useMapContext();

  return (
    <MapContainer
      whenReady={(map) => setMap(map)}
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
    </MapContainer>
  );
};

export default RMMapContainer;
