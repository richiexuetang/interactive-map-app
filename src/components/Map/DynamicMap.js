import L from "leaflet";
import * as ReactLeaflet from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "@components/Sidebar/Sidebar";
import { useMapContext } from "src/context/app-context";

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
      {children(ReactLeaflet, L)}
      <Sidebar useMap={useMap} />
    </MapContainer>
  );
};

export default Map;
