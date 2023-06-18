//@ts-nocheck
import React, { useState } from "react";
import * as ReactLeaflet from "react-leaflet";
import { usePathname } from "next/navigation";

import "leaflet-contextmenu";
import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu/dist/leaflet.contextmenu.css";
import "./leaflet.smooth-wheel-zoom.js";
import { useMapContext } from "@context/.";
import { useCopyToClipboard } from "@hooks/index";

const { MapContainer } = ReactLeaflet;

const RMMapContainer = ({ children }) => {
  const pathname = usePathname();
  const { config, setNoteMarkers } = useMapContext();
  const [zoomLevel, setZoomLevel] = useState(config.zoom);

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

    console.log(zoomLevel);
    copy(
      `${process.env.BASE_URL}${pathname}?x=${lat}&y=${lng}&zoom=${zoomLevel}`
    );
  };

  return (
    <MapContainer
      style={{ background: "black", height: "100vh", width: "100vw" }}
      zoomControl={false}
      scrollWheelZoom={false}
      attributionControl={false}
      center={config.center}
      zoom={config.zoom}
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
      {children(ReactLeaflet, setZoomLevel)}
    </MapContainer>
  );
};

export default RMMapContainer;
