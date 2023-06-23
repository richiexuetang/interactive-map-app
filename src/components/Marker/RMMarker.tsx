import React, { useState, useEffect } from "react";
import { MapPopup } from "@components/Popup";
import { useMapContext } from "@context/app-context";
import { useSearchParams } from "next/navigation";

const RMMarker = (props) => {
  const params = useSearchParams();
  const markerSearchParam = params.get("markerId");

  const { Marker, rank, data, useMap, hide, ...rest } = props;

  const { coordinate, _id: markerId, categoryId } = data;
  const map = useMap();

  const [triggerPopup, setTriggerPopup] = useState(false);
  const { markerRefs, config } = useMapContext();

  useEffect(() => {
    if (triggerPopup) {
      setTriggerPopup(false);
    }
  }, [triggerPopup]);

  useEffect(() => {
    if (markerSearchParam && markerSearchParam === markerId) {
      map.flyTo(coordinate, map.getMaxZoom(), {
        animate: true,
        duration: 0.5,
      });

      setTriggerPopup(true);
      window.history.replaceState(null, "", `/map/${config.name}`);
    }
  }, [markerSearchParam]);

  useEffect(() => {
    if (params.has("x") && params.has("y") && params.has("zoom")) {
      map.flyTo(
        [parseFloat(params.get("x")), parseFloat(params.get("y"))],
        parseFloat(params.get("zoom"))
      );
      window.history.replaceState(null, "", `/map/${config.name}`);
    }
  }, [params]);

  return (
    <Marker
      ref={(ref) => (markerRefs[markerId] = ref)}
      position={coordinate}
      icon={L.icon({
        iconUrl: `/images/icons/${categoryId}.png`,
        iconSize: [35, 45],
        iconAnchor: [17, 45],
      })}
      zIndexOffset={100 + rank}
      {...rest}
    >
      <MapPopup
        markerInfo={data}
        triggerPopup={triggerPopup}
        setTriggerPopup={setTriggerPopup}
      />
    </Marker>
  );
};

export default RMMarker;
