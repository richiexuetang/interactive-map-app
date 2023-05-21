import React, { useState } from "react";
import { Box, HStack, VStack, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

import useLocalStorage from "@hooks/useLocalStorage";
import { initialUserSettings } from "@data/LocalStorage/initial";
import { CategoryGroups } from "../CategoryGroup";
import { SearchInput, SearchResults } from "../Search";
import {
  SETTING_HIDE_ALL,
  SETTING_HIDE_COMPLETED,
  USER_SETTING,
} from "@data/LocalStorage";
import { useMapContext } from "src/context/app-context";
import { useMarkerContext } from "src/context/marker-context";

const Content = ({ useMap }) => {
  const router = useRouter();
  const map = useMap();

  const { setHideAll, setHideCompleted, hideCompleted, hideAll, setHiddenCategories } =
    useMarkerContext();

  const { area, game, config } = useMapContext();
  const navSelections = config.subSelections;

  const [userSettings, setUserSettings] = useLocalStorage(
    USER_SETTING,
    initialUserSettings
  );

  const [results, setResults] = useState([]);

  const toggle = (settingKey) => {
    const current = userSettings[settingKey][game];
    const copy = { ...userSettings };
    copy[settingKey][game] = !current;

    if (settingKey === SETTING_HIDE_COMPLETED) {
      setHideCompleted(!current);
    } else if (settingKey === SETTING_HIDE_ALL) {
      setHideAll(!current);
      const hiddenCategories = userSettings["hiddenCategories"][game];
      for (const key in hiddenCategories) {
        console.log(key);
        hiddenCategories[key] = !current;
      }
      console.log(hiddenCategories)
      setHiddenCategories({...hiddenCategories});
    }

    setUserSettings({ ...copy });
  };

  const navigateToArea = (selection) => {
    const { to } = selection;

    if (!map) {
      return;
    }

    console.log("" + map.getCenter().lat + "," + map.getCenter().lng);
    console.log(map.getZoom());
    // console.log(map.getBounds());

    if (to === area) {
      map.flyTo(selection.location, selection.zoom, {
        animate: true,
        duration: 0.5,
      });
    } else {
      router.push(`/map/${to}`);
    }
  };

  return (
    <VStack>
      <HStack>
        <Button
          onClick={() => toggle(SETTING_HIDE_ALL)}
          variant="underlined"
          fontSize="12px"
        >
          {hideAll ? "Show All" : "Hide All"}
        </Button>
        <Button
          onClick={() => toggle(SETTING_HIDE_COMPLETED)}
          variant="underlined"
          fontSize="12px"
        >
          {hideCompleted ? "Show Completed" : "Hide Completed"}
        </Button>
      </HStack>

      <Box mt={5}>
        <SearchInput results={results} setResults={setResults} />
      </Box>

      {navSelections && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          {navSelections.map((selection) => (
            <Button
              key={selection.name}
              variant="mapLink"
              flex={selection.flex}
              onClick={() => navigateToArea(selection)}
            >
              {selection.name}
            </Button>
          ))}
        </Box>
      )}

      <Box w="100%" p={4} pb={0}>
        {results && results.length ? (
          <SearchResults results={results} useMap={useMap} />
        ) : (
          <CategoryGroups />
        )}
      </Box>
    </VStack>
  );
};

export default Content;
