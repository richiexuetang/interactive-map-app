import React, { useEffect, useState } from "react";

import { Button, Box, Image, Flex } from "@chakra-ui/react";

import { useMapContext } from "@context/.";
import {
  COMPLETED,
  SETTING_HIDDEN_CATEGORY,
  SETTING_HIDE_ALL,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";
import useLocalStorage from "@hooks/useLocalStorage";
import { categoryIdNameMap } from "@data/categoryItemsConfig";
import { categoryHiddenState } from "@lib/getHiddenState";


const GroupItem = ({ onLayerClick, layerObj }) => {
  const [storageSettings, setStorageSettings] = useLocalStorage(
    USER_SETTING,
    initialUserSettings
  );
  const [completedMarkers] = useLocalStorage(COMPLETED, {});
  const { categoryCounts, markerGroups } = useMapContext();

  const [show, setShow] = useState(layerObj.checked);
  const [imageUrl, setImageUrl] = useState(
    `/images/icons/${layerObj.name}.png`
  );

  useEffect(() => {
    if (storageSettings[SETTING_HIDDEN_CATEGORY][layerObj.name] === undefined) {
      setStorageSettings((prevState) => ({
        ...prevState,
        hiddenCategories: {
          ...prevState.hiddenCategories,
          [layerObj.name]: true,
        },
      }));
    }
  }, []);

  const handleLayerClick = () => {
    const prev = categoryHiddenState(layerObj.name);

    setStorageSettings((prevState) => ({
      ...prevState,
      hiddenCategories: {
        ...prevState.hiddenCategories,
        [layerObj.name]: !prev,
      },
    }));

    setShow(!show);
    onLayerClick(layerObj);
  };

  useEffect(() => {
    setShow(
      !categoryHiddenState(layerObj.name) && !storageSettings[SETTING_HIDE_ALL]
    );
  }, [storageSettings]);

  return (
    <Button
      display="flex"
      flexDir="row"
      justifyContent="space-between"
      w="full"
      bg="sidebar.content"
      onClick={handleLayerClick}
    >
      <Flex w={5} h={6} alignItems="center" justifyContent="center">
        <Image
          src={imageUrl}
          opacity={show ? 1 : 0.5}
          onError={() => setImageUrl("/images/icons/111.png")}
        />
      </Flex>
      <Box
        fontSize="md"
        fontWeight="normal"
        textDecor={show ? "none" : "line-through"}
      >
        {categoryIdNameMap[layerObj.name]}
      </Box>
      <Box fontSize="sm" textDecor={show ? "none" : "line-through"}>
        {categoryCounts[layerObj.name]}
      </Box>
    </Button>
  );
};

export default GroupItem;
