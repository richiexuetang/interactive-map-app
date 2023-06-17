import { useEffect } from "react";

const MapListener = ({ setZoomLevel, useMapEvents, map }) => {
  // const mapEvents = useMapEvents({
  //   zoomend: () => {
  //     setZoomLevel(mapEvents.getZoom());
  //   },
  // });

  const onZoomEnd = () => {
    setZoomLevel(map.getZoom());
  }

  useEffect(() => {
    map.on('zoomend', onZoomEnd)
    return () => {
      map.off('zoomend', onZoomEnd)
    }
  }, [map, onZoomEnd])
  
  return null;
}

export default MapListener;
