//@ts-nocheck
import React, { useState } from "react";
import * as ReactLeaflet from "react-leaflet";
import { usePathname } from "next/navigation";

import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu";
import "leaflet-contextmenu/dist/leaflet.contextmenu.css";
import "./leaflet.smooth-wheel-zoom.js";
import { useMapContext } from "@context/.";
import { useCopyToClipboard } from "@hooks/index";

const { MapContainer } = ReactLeaflet;

const RMMapContainer = ({ children }) => {
  const pathname = usePathname();
  const { config } = useMapContext();

  const [noteMarkers, setNoteMarkers] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(config.zoom);
  const [map, setMap] = useState(null);
  const [value, copy] = useCopyToClipboard();

  const addMarker = (e) => {
    const currentPosition = e.latlng;
    setNoteMarkers((prev) => [
      ...prev,
      [currentPosition.lat, currentPosition.lng],
    ]);
  };

  const copyMapViewUrl = (e) => {
    const { lat, lng } = e.latlng;

    copy(
      `${process.env.BASE_URL}${pathname}?x=${lat}&y=${lng}&zoom=${zoomLevel}`
    );
  };

  return (
    <MapContainer
      style={{ background: "black", height: "100vh", width: "100vw" }}
      ref={setMap}
      zoomControl={false}
      scrollWheelZoom={false}
      attributionControl={false}
      center={config.center}
      zoom={zoomLevel}
      bounds={config.bounds}
      minZoom={config.minZoom}
      maxZoom={config.maxZoom}
      contextmenu={true}
      contextmenuItems={[
        {
          text: "Add marker",
          callback: (e) => addMarker(e),
        },
        {
          text: "Copy Map View Url",
          callback: (e) => copyMapViewUrl(e),
        },
      ]}
      smoothWheelZoom={true}
      smoothSensitivity={15}
    >
      {children(ReactLeaflet, setZoomLevel, map, noteMarkers)}
    </MapContainer>
  );
};

export default RMMapContainer;
