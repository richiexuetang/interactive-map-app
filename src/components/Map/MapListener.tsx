const MapListener = ({ setZoomLevel, useMapEvents }) => {
  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
    },
  });
  
  return null;
}

export default MapListener;
