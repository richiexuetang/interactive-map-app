import React, { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import { MapPopup } from "@components/Popup";
import { useMapContext } from "@context/app-context";
import { useSearchParams } from "next/navigation";

const RMMarker = (props) => {
  const map = useMap();
  const params = useSearchParams();
  const markerSearchParam = params.get("markerId");

  const { Marker, coordinate, categoryId, rank, markerId, ...rest } = props;
  const [markerInfo, setMarkerInfo] = useState(null);
  const [triggerPopup, setTriggerPopup] = useState(false);
  const { markerRefs, config } = useMapContext();

  const getMarkerInfo = async () => {
    if (!markerInfo) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/getMarker?id=` + markerId
        );
        const json = await res.json();
        setMarkerInfo({ ...json });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (triggerPopup) {
      try {
        fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/getMarker?id=` + markerId)
          .then((res) => res.json())
          .then((data) => setMarkerInfo(data));
      } catch (error) {
        console.log(error);
      }
    }
  }, [triggerPopup]);

  useEffect(() => {
    if (markerSearchParam && markerSearchParam === markerId) {
      map.flyTo(coordinate, map.getMaxZoom(), {
        animate: true,
        duration: 0.5,
      });

      setTriggerPopup(true);
    }
    window.history.replaceState(null, "", `/map/${config.name}`);
  }, [markerSearchParam]);

  useEffect(() => {
    if (params.has("x") && params.has("y") && params.has("zoom")) {
      map.flyTo(
        [parseFloat(params.get("x")), parseFloat(params.get("y"))],
        parseFloat(params.get("zoom"))
      );
    }
    window.history.replaceState(null, "", `/map/${config.name}`);
  }, [params]);

  return (
    <Marker
      ref={(ref) => (markerRefs[markerId] = ref)}
      key={coordinate[0] + ", " + coordinate[1]}
      position={coordinate}
      icon={L.icon({
        iconUrl: `/images/icons/${categoryId}.png`,
        iconSize: [35, 45],
        iconAnchor: [17, 45],
      })}
      zIndexOffset={100 + rank}
      eventHandlers={{
        popupopen: () => getMarkerInfo(),
        mouseover: () => getMarkerInfo(),
      }}
      {...rest}
    >
      <MapPopup
        markerId={markerId}
        markerInfo={markerInfo}
        triggerPopup={triggerPopup}
        setTriggerPopup={setTriggerPopup}
      />
    </Marker>
  );
};

export default RMMarker;
