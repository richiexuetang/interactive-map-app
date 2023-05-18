import L from "leaflet";
import * as ReactLeaflet from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "@components/Sidebar/Sidebar";

const { MapContainer, useMap } = ReactLeaflet;

const Map = ({
  children,
  config,
  markerRefs,
  categoryItems,
  navSelections,
  area,
  categoryCounts,
  markers,
  ...rest
}) => {
  const { center, zoom, bounds, minZoom, maxZoom, gameSlug, subSelections } = config;
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
      <Sidebar
        markerRefs={markerRefs}
        game={gameSlug}
        categoryGroups={categoryItems.categoryGroups}
        navSelections={subSelections}
        area={area}
        categoryCounts={categoryCounts}
        useMap={useMap}
        markers={markers}
      />
    </MapContainer>
  );
};

export default Map;
