import L from "leaflet";
import * as ReactLeaflet from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "@components/Sidebar/Sidebar";
import { useMapContext } from "src/context/app-context";
import MarkerClusterGroup from "@components/Marker/MarkerClusterGroup";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

const { MapContainer, useMap } = ReactLeaflet;

const Map = ({ children, ...rest }) => {
  const { config } = useMapContext();
  const { center, zoom, bounds, minZoom, maxZoom } = config;
  return (
    <MapContainer
      style={{ background: "#967959", height: "100vh", width: "100vw" }}
      scrollWheelZoom={false}
      smoothWheelZoom={true}
      smoothSensitivity={15}
      doubleClickZoom={false}
      attributionControl={false}
      zoomControl={false}
      center={center}
      zoom={zoom}
      bounds={bounds}
      minZoom={minZoom}
      maxZoom={maxZoom}
      {...rest}
    >
      <MarkerClusterGroup
        zoomToBoundsOnClick={true}
        disableClusteringAtZoom={12}
        maxClusterRadius={35}
      >
        {children(ReactLeaflet, L)}
      </MarkerClusterGroup>
      <Sidebar useMap={useMap} />
    </MapContainer>
  );
};

export default Map;
