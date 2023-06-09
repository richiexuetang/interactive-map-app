import { Polyline } from "react-leaflet";

import {
  SETTING_HIDDEN_CATEGORY,
  USER_SETTING,
  initialUserSettings,
} from "@data/index";
import { COMPLETED } from "@data/index";
import useLocalStorage from "@hooks/useLocalStorage";
import { useEffect, useState } from "react";

const PolyLine = ({ parentId, path }) => {
  const [storageSettings] = useLocalStorage(USER_SETTING, initialUserSettings);
  const [completedMarkers] = useLocalStorage(COMPLETED, {});

  const [loading, setLoading] = useState(false);
  const [parent, setParent] = useState(null);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/getMarker?id=` + parentId, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setParent(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (parent) {
      setHide(
        storageSettings[SETTING_HIDDEN_CATEGORY][parent.categoryId] &&
          completedMarkers[parentId]
      );
    } else {
      setHide(false);
    }
  }, [storageSettings, completedMarkers, parent]);

  if (loading || !parent || hide) return null;

  return (
    <Polyline
      key={parentId}
      positions={[
        [path[0][0], path[0][1]],
        [path[1][0], path[1][1]],
      ]}
      color={"white"}
      weight={1}
    />
  );
};

export default PolyLine;
