//@ts-nocheck
import React, { useState } from "react";
import * as ReactLeaflet from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu";
import "leaflet-contextmenu/dist/leaflet.contextmenu.css";
import "./leaflet.smooth-wheel-zoom.js";
import { useMapContext } from "@context/.";

const { MapContainer } = ReactLeaflet;

const RMMapContainer = ({ children }) => {
  const { setNoteMarkers } = useMapContext();
  const [map, setMap] = useState(null);
  const { config } = useMapContext();

  const addMarker = (e) => {
    const currentPosition = e.latlng;
    setNoteMarkers((prev) => [
      ...prev,
      [currentPosition[0], currentPosition[1]],
    ]);
  };

  return (
    <MapContainer
      style={{ background: "black", height: "100vh", width: "100vw" }}
      scrollWheelZoom={false}
      attributionControl={false}
      center={config.center}
      zoom={config.zoom}
      bounds={config.bounds}
      minZoom={config.minZoom}
      maxZoom={config.maxZoom}
      whenReady={(map) => setMap(map)}
      contextmenu={true}
      contextmenuItems={[
        {
          text: "Add marker",
          callback: (e) => addMarker(e),
        },
      ]}
      smoothWheelZoom={true}
      smoothSensitivity={15}
    >
      {children(ReactLeaflet, L)}
    </MapContainer>
  );
};

export default RMMapContainer;
