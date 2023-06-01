//@ts-nocheck
import React, { useState, useEffect } from "react";
import * as ReactLeaflet from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import { Sidebar } from "@components/.";
import { useMapContext } from "@context/.";
import NoteMarkers from "@components/Marker/NoteMarker/NoteMarkers";

const { MapContainer, useMap } = ReactLeaflet;

const Map = ({ children, ...rest }) => {
  const { config, noteMarkers } = useMapContext();
  const [mapInfo, setMapInfo] = useState(null);

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
      {...rest}
    >
        {children(ReactLeaflet, L)}
        <Sidebar useMap={useMap} />
        <NoteMarkers setRefresh={false} noteMarkers={noteMarkers} />
    </MapContainer>
  );
};

export default Map;
