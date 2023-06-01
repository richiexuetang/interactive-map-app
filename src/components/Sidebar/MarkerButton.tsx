import React, { useEffect, useState } from "react";
import { Button, Box, Image } from "@chakra-ui/react";

import {
  SETTING_HIDDEN_CATEGORY,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";
import useLocalStorage from "@hooks/useLocalStorage";

const MarkerButton = ({ type, num, category, game, groupHide }) => {
  const [userSettings, setUserSettings] = useLocalStorage(
    USER_SETTING,
    initialUserSettings
  );
  const [hidden, setHidden] = useState(
    userSettings["hiddenCategories"][game][category] || groupHide
  );

  const toggleCategoryHide = () => {
    const current = userSettings[SETTING_HIDDEN_CATEGORY][game][category];

    setUserSettings((prev) => ({
      ...prev,
      hiddenCategories: {
        ...prev.hiddenCategories,
        [game]: {
          ...prev.hiddenCategories[game],
          [category]: !current,
        },
      },
    }));

    setHidden(!current);
  };

  useEffect(() => {
    if (userSettings[SETTING_HIDDEN_CATEGORY][game][category]) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  }, [userSettings]);

  return (
    <Button
      display="flex"
      flexDir="row"
      key={type}
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
            src={`/images/icons/${game}/${category}.png`}
            opacity={hidden ? "0.5" : "1"}
          />
        </Box>
      </Box>
      <Box
        fontSize="0.9375rem"
        fontWeight="normal"
        textDecor={hidden ? "line-through" : "none"}
      >
        {type}
      </Box>
      <Box fontSize="0.6875rem" textDecor={hidden ? "line-through" : "none"}>
        {num}
      </Box>
    </Button>
  );
};

export default MarkerButton;
