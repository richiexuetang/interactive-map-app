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
    if (
      markerSearchParam &&
      markerSearchParam === markerId &&
      markerRefs[markerId]
    ) {
      map.flyTo(coordinate, map.getMaxZoom(), {
        animate: true,
        duration: 0.5,
      });

      markerRefs[markerId]?.openPopup();

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
      key={coordinate[0] + ", " + coordinate[1]}
      position={coordinate}
      icon={L.icon({
        iconUrl: `/images/icons/${categoryId}.png`,
        iconSize: [35, 45],
        iconAnchor: [17, 45],
      })}
      zIndexOffset={100 + rank}
      eventHandlers={{
        click: () => getMarkerInfo(),
        popupopen: () => getMarkerInfo(),
        mouseover: () => getMarkerInfo(),
      }}
      {...rest}
    >
      <MapPopup markerId={markerId} markerInfo={markerInfo} />
    </Marker>
  );
};

export default RMMarker;
