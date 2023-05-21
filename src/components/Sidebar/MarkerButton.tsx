import React, { useEffect, useState } from "react";
import { Button, Box, Image } from "@chakra-ui/react";
import useLocalStorage from "@hooks/useLocalStorage";
import { initialUserSettings } from "@data/LocalStorage/initial";
import { useMarkerContext } from "src/context/marker-context";
import { USER_SETTING } from "@data/LocalStorage";

const MarkerButton = ({ type, num, category, game }) => {
  const { setHiddenCategories, hiddenCategories, hideAll } = useMarkerContext();
  const [userSettings, setUserSettings] = useLocalStorage(
    USER_SETTING,
    initialUserSettings
  );

  const [hidden, setHidden] = useState(userSettings["hiddenCategories"][game][category]);

  useEffect(() => {
    if (hideAll && !hidden) {
      setHidden(true);
    } 
    if (!hideAll && hidden && !hiddenCategories[category]) {
      setHidden(false);
    }
  }, [hideAll, hidden, hiddenCategories]);

  const toggleCategoryHide = () => {
    const current = userSettings["hiddenCategories"][game][category];
    const copy = { ...userSettings };
    copy.hiddenCategories[game][category] = !current;
    setUserSettings({ ...copy });
    setHiddenCategories({ ...hiddenCategories, [category]: !current });
    setHidden(!current);
  };

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
