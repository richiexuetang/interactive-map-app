import React, { useState } from "react";
import { Box, HStack, VStack, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { CategoryGroups, SearchInput, SearchResults } from "@components/Sidebar";
import { useMapContext } from "@context/index";
import {
  SETTING_HIDDEN_CATEGORY,
  SETTING_HIDE_ALL,
  SETTING_HIDE_COMPLETED,
  USER_SETTING,
  initialUserSettings
} from "@data/LocalStorage";
import useLocalStorage from "@hooks/useLocalStorage";

const Content = ({ useMap }) => {
  const router = useRouter();
  const map = useMap();

  const { area, game, config } = useMapContext();
  const navSelections = config.subSelections;

  const [userSettings, setUserSettings] = useLocalStorage(
    USER_SETTING,
    initialUserSettings
  );
  const [hideCompleted, setHideCompleted] =
    useState(userSettings["hideCompletedMarkers"][game]);

  const [results, setResults] = useState([]);

  const toggle = (settingKey) => {
    const current = userSettings[settingKey][game];
    const copy = { ...userSettings };
    copy[settingKey][game] = !current;

    if (settingKey === SETTING_HIDE_COMPLETED) {
      setHideCompleted(!current);
      setUserSettings(prev => ({
        ...prev, 
        hideCompletedMarkers: {
          ...prev.hideCompletedMarkers,
          [game]: !current,
        }
      }));
    } else if (settingKey === SETTING_HIDE_ALL) {
      const newHidden = userSettings[SETTING_HIDDEN_CATEGORY][game];
      for (const key in newHidden) {
        newHidden[key] = !current;
      }

      setUserSettings((prev) => ({
        ...prev,
        hiddenCategories: {
          ...prev.hiddenCategories,
          [game]: {
            ...prev.hiddenCategories[game],
            ...newHidden,
          },
        },
      }));
    }
  };

  const navigateToArea = (selection) => {
    const { to } = selection;

    if (!map) {
      return;
    }

    // console.log("" + map.getCenter().lat + "," + map.getCenter().lng);
    // console.log(map.getZoom());
    // console.log(map.getBounds())

    if (to === area) {
      map.flyTo(selection.location, selection.zoom, {
        animate: true,
        duration: 0.5,
      });
    } else {
      router.push(`/map/${to}`);
    }
  };

  const handleHideShowAll = (hide: boolean) => {
    const newHidden = userSettings[SETTING_HIDDEN_CATEGORY][game];
      for (const key in newHidden) {
        newHidden[key] = hide;
      }
      
      setUserSettings((prev) => ({
        ...prev,
        hiddenCategories: {
          ...prev.hiddenCategories,
          [game]: {
            ...prev.hiddenCategories[game],
            ...newHidden,
          },
        },
      }));
  }

  return (
    <VStack>
      <HStack>
        <Button
          onClick={() => handleHideShowAll(false)}
          variant="underlined"
          fontSize="12px"
        >
          Show All
        </Button>
        <Button
          onClick={() => handleHideShowAll(true)}
          variant="underlined"
          fontSize="12px"
        >
          Hide All
        </Button>
      </HStack>
      <Button
          onClick={() => toggle(SETTING_HIDE_COMPLETED)}
          variant="underlined"
          fontSize="12px"
        >
          {hideCompleted ? "Show Completed" : "Hide Completed"}
        </Button>

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

      <Box w="100%" p={3} pb={0}>
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
