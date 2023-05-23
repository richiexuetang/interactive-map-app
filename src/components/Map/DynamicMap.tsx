//@ts-nocheck
import React, { useState, useEffect } from "react";
import * as ReactLeaflet from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import {Sidebar, MarkerClusterGroup} from "@components/.";
import { useMapContext, MarkerProvider } from "@context/.";
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
      <MarkerProvider>
        <MarkerClusterGroup
          zoomToBoundsOnClick={true}
          disableClusteringAtZoom={mapInfo.minZoom + 2}
          maxClusterRadius={15}
        >
          {children(ReactLeaflet, L)}
        </MarkerClusterGroup>
        <Sidebar useMap={useMap} />
        <NoteMarkers setRefresh={false} noteMarkers={noteMarkers}/>
      </MarkerProvider>
    </MapContainer>
  );
};

export default Map;
