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

const CategoryGroup = ({ onLayerClick, layerObj }) => {
  const [storageSettings, setStorageSettings] = useLocalStorage(
    USER_SETTING,
    initialUserSettings
  );
  const [completedMarkers] = useLocalStorage(COMPLETED, {});
  const { categoryCounts } = useMapContext();

  const [show, setShow] = useState(layerObj.checked);

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

  const getCompletedCount = (categoryId) => {
    let result = 0;
    for (const key in completedMarkers) {
      result = completedMarkers[key] === categoryId ? result + 1 : result;
    }
    return result;
  }

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
          src={`/images/icons/${layerObj.name}.png`}
          opacity={show ? 1 : 0.5}
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
        {getCompletedCount(layerObj.name)}/{categoryCounts[layerObj.name]}
      </Box>
    </Button>
  );
};

export default CategoryGroup;
