import { Polyline } from "react-leaflet";

import {
  SETTING_HIDDEN_CATEGORY,
  SETTING_HIDE_COMPLETED,
  USER_SETTING,
  initialUserSettings,
} from "@data/index";
import { useMapContext } from "@context/app-context";
import { COMPLETED } from "@data/index";
import useLocalStorage from "@hooks/useLocalStorage";

const PolyLines = () => {
  const { pathMarkers } = useMapContext();
  const [completedMarkers] = useLocalStorage(COMPLETED, {});
  const [userSettings] = useLocalStorage(USER_SETTING, initialUserSettings);

  return (
    <>
      {pathMarkers &&
        pathMarkers.map(({parentId, path}) => {
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
        })}
    </>
  );
};

export default PolyLines;
