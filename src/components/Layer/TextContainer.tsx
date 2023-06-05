import { useMapContext } from "@context/app-context";
import { divIcon } from "leaflet";
import { useState } from "react";
import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";

const TextContainer = ({ position, minZoom, maxZoom, content, game, area }) => {
  const { game: gameMap, area: areaMap } = useMapContext();
  const map = useMap();
  const [show, setShow] = useState(
    map.getZoom() <= minZoom &&
      map.getZoom() >= maxZoom &&
      game === gameMap &&
      area === areaMap
  );

  const icon = divIcon({
    className: "map-label",
    html: `<span>${content}</span>`,
  });

  useMapEvents({
    zoom() {
      setShow(
        maxZoom <= map.getZoom() &&
          map.getZoom() <= minZoom &&
          game === gameMap &&
          area === areaMap
      );
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
