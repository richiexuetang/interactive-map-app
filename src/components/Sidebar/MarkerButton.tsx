import React from "react";
import { Button, Box, Image } from "@chakra-ui/react";

import { useMarkerContext } from "@context/marker-context";
import { SETTING_HIDDEN_CATEGORY, USER_SETTING, initialUserSettings} from "@data/LocalStorage";
import useLocalStorage from "@hooks/useLocalStorage";

const MarkerButton = ({ type, num, category, game, groupHide }) => {
  const { setHiddenCategories, hiddenCategories } = useMarkerContext();
  const [userSettings, setUserSettings] = useLocalStorage(
    USER_SETTING,
    initialUserSettings
  );

  const toggleCategoryHide = () => {
    const current = userSettings[SETTING_HIDDEN_CATEGORY][game][category];
    const copy = { ...userSettings };
    copy.hiddenCategories[game][category] = !current;
    
    setUserSettings({ ...copy });
    setHiddenCategories({ ...hiddenCategories, [category]: !current });
  };

  const hidden = hiddenCategories[category] || groupHide;

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
