import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

import GroupItem from "./GroupItem";
import { categoryHiddenState } from "@lib/getHiddenState";
import { useLocalStorage } from "@hooks/index";
import {
  SETTING_HIDDEN_CATEGORY,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";

const GroupContainer = (props) => {
  const { onLayerClick, section, layerSection } = props;

  const [groupHiddenState, setGroupHiddenState] = useState(null);
  const [storageSettings, setStorageSettings] = useLocalStorage(
    USER_SETTING,
    initialUserSettings
  );

  useEffect(() => {
    if (groupHiddenState === null) {
      layerSection?.map((layerObj) => {
        if (storageSettings[SETTING_HIDDEN_CATEGORY][layerObj.name] === true) {
          setGroupHiddenState(false);
        }
      });

      if (groupHiddenState === null) {
        setGroupHiddenState(true);
      }
    }
  }, [groupHiddenState]);

  const handleGroupToggle = () => {
    const newHidden = storageSettings[SETTING_HIDDEN_CATEGORY];
    layerSection?.map((layerObj) => {
      newHidden[layerObj.name] = !groupHiddenState;
    });
    setStorageSettings((prev) => ({
      ...prev,
      [SETTING_HIDDEN_CATEGORY]: {
        ...newHidden,
      },
    }));
    setGroupHiddenState(!groupHiddenState);
  };

  return (
    <>
      <Box
        textTransform="uppercase"
        py={3}
        cursor="pointer"
        onClick={handleGroupToggle}
      >
        {`${section}: `}
      </Box>
      {layerSection?.map((layerObj) => (
        <GroupItem
          key={`${section} ${layerObj.name}`}
          onLayerClick={onLayerClick}
          layerObj={layerObj}
        />
      ))}
    </>
  );
};

export default GroupContainer;
