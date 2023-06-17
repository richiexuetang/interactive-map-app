import { useLocalStorage } from "@hooks/index";
import Polyline from "./PolyLine";

import { COMPLETED, USER_SETTING, initialUserSettings } from "@data/LocalStorage";
import { categoryHiddenState } from "@lib/getHiddenState";

const PolyLines = (props) => {
  const { pathMarkers } = props;
  const [completedMarkers] = useLocalStorage(COMPLETED, {});
  const [userSettings] = useLocalStorage(USER_SETTING, initialUserSettings)

  return (
    <>
      {pathMarkers &&
        pathMarkers.map(({ parentId, path }, i) => {
          return (
            !completedMarkers[parentId] && !categoryHiddenState(89) && (
              <Polyline key={`${parentId} + ${i}`} path={path} />
            )
          );
        })}
    </>
  );
};

export default PolyLines;
