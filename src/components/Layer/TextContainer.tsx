import { useMapContext } from "@context/app-context";
import { divIcon } from "leaflet";
import { useState } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import styles from '@styles/styles.module.scss';

const TextContainer = ({ id, position, minZoom, maxZoom, content }) => {
  const { markerRefs } = useMapContext();
  const map = useMap();
  const [show, setShow] = useState(
    map.getZoom() <= minZoom && map.getZoom() >= maxZoom
  );

  const iconWidth = content.length * 10
  const iconHTML = `<div title="${content}"/>${content}</div>`
  const icon = divIcon({
    className: `${styles.label}`,
    iconSize: [iconWidth, 50],
    // iconAnchor: [iconWidth/2, 12],
    html: iconHTML,
  });

  useMapEvents({
    zoom() {
      setShow(maxZoom <= map.getZoom() && map.getZoom() <= minZoom);
    },
  });

  return (
    <>
      {show ? (
        <Marker
          ref={(ref) => (markerRefs[id] = ref)}
          position={[position[0], position[1]]}
          icon={icon}
        />
      ) : null}
    </>
  );
};

export default TextContainer;
