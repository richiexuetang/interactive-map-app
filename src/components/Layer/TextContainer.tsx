import { divIcon } from "leaflet";
import { useState } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";

const TextContainer = ({ position, minZoom, maxZoom, content }) => {
  const map = useMap();
  const [show, setShow] = useState(
    map.getZoom() <= minZoom && map.getZoom() >= maxZoom
  );

  const icon = divIcon({
    className: "map-label",
    html: `<span>${content}</span>`,
  });

  useMapEvents({
    zoom() {
      setShow(maxZoom <= map.getZoom() && map.getZoom() <= minZoom);
    },
  });

  return (
    <>
      {show ? (
        <Marker position={[position[0], position[1]]} icon={icon} />
      ) : null}
    </>
  );
};

export default TextContainer;
