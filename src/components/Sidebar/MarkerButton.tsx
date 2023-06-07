import React, { useEffect, useState } from "react";
import { Button, Box, Image } from "@chakra-ui/react";

import {
  SETTING_HIDDEN_CATEGORY,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";
import useLocalStorage from "@hooks/useLocalStorage";
import { useMapContext } from "@context/app-context";
import { categoryIdNameMap } from "@data/categoryItemsConfig";

const MarkerButton = ({ category, groupHide }) => {
  const {categoryCounts} = useMapContext();

  const [userSettings, setUserSettings] = useLocalStorage(
    USER_SETTING,
    initialUserSettings
  );
  const [hidden, setHidden] = useState(
    userSettings[SETTING_HIDDEN_CATEGORY][category] || groupHide
  );

  const toggleCategoryHide = () => {
    const current = userSettings[SETTING_HIDDEN_CATEGORY][category];

    setUserSettings((prev) => ({
      ...prev,
      hiddenCategories: {
        ...prev.hiddenCategories,
        [category]: !current,
      },
    }));

    setHidden(!current);
  };

  useEffect(() => {
    if (userSettings[SETTING_HIDDEN_CATEGORY][category]) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  }, [userSettings]);

  return (
    <Button
      display="flex"
      flexDir="row"
      justifyContent="space-between"
      w="100%"
      bg="#221c0f"
      _hover={{ bg: "#2a2927", pointerEvents: "pointer !important" }}
      onClick={toggleCategoryHide}
    >
      <Box
        w="20px"
        h="22px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box>
          <Image
            src={`/images/icons/${category}.png`}
            opacity={hidden ? "0.5" : "1"}
          />
        </Box>
      </Box>
      <Box
        fontSize="0.9375rem"
        fontWeight="normal"
        textDecor={hidden ? "line-through" : "none"}
      >
        {categoryIdNameMap[category]}
      </Box>
      <Box fontSize="0.6875rem" textDecor={hidden ? "line-through" : "none"}>
        {categoryCounts[category]}
      </Box>
    </Button>
  );
};

export default MarkerButton;
