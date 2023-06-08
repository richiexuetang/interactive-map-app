import React, { useEffect, useState } from "react";

import { Button, Box, Image, Flex } from "@chakra-ui/react";

import { useMapContext } from "@context/.";
import {
  SETTING_HIDDEN_CATEGORY,
  SETTING_HIDDE_ALL,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";
import useLocalStorage from "@hooks/useLocalStorage";
import { categoryIdNameMap } from "@data/categoryItemsConfig";

const CategoryGroup = ({ onLayerClick, layerObj }) => {
  const { categoryCounts, userSettings, setUserSettings } = useMapContext();

  const [show, setShow] = useState(layerObj.checked);

  const handleLayerClick = () => {
    const prev = userSettings[SETTING_HIDDEN_CATEGORY][layerObj.name];

    setUserSettings((prevState) => ({
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
    if (userSettings[SETTING_HIDDEN_CATEGORY][layerObj.name] || userSettings[SETTING_HIDDE_ALL]) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [userSettings]);

  return (
    <Button
      display="flex"
      flexDir="row"
      justifyContent="space-between"
      w="full"
      bg="sidebar.content"
      onClick={handleLayerClick}
    >
      <Flex
        w={5}
        h={6}
        alignItems="center"
        justifyContent="center"
      >
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
        {categoryCounts[layerObj.name]}
      </Box>
    </Button>
  );
};

export default CategoryGroup;
