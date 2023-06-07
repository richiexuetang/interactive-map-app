import React, { useEffect, useState } from "react";

import { useMapContext } from "src/context/app-context";
import CustomMarker from "./CustomMarker";
import useLocalStorage from "@hooks/useLocalStorage";
import {
  COMPLETED,
  SETTING_HIDE_COMPLETED,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";
import dynamic from "next/dynamic";
import Markers from "./Markers";

const PolyLines = dynamic(() => import("@components/Line/PolyLines"), {
  ssr: false,
});

const TextLayer = dynamic(() => import("@components/Layer/TextLayer"), {
  ssr: false,
});

const ClusterLayer = dynamic(
  () => import("@components/Layer/ClusterLayer/ClusterLayer"),
  {
    ssr: false,
  }
);

const MarkerLayer = (props) => {
  const { useMap, useMapEvents } = props;
  const [userSettings] = useLocalStorage(USER_SETTING, initialUserSettings);
  const [completedMarkers] = useLocalStorage(COMPLETED, {});
  const { standardMarker, config } = useMapContext();

  return (
    <>
      <Markers useMap={useMap} useMapEvents={useMapEvents} />
      <PolyLines />
      <TextLayer />
      <ClusterLayer />
    </>
  );
};

export default MarkerLayer;
