import React, { useEffect, useState } from "react";

import { VStack, HStack, Button } from "@chakra-ui/react";

import { MarkerButton } from "@components/Sidebar/.";
import { useMapContext } from "@context/.";
import {
  SETTING_HIDDEN_CATEGORY,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";
import useMapObject, { MapOrEntries } from "@hooks/useMapObject";
import useLocalStorage from "@hooks/useLocalStorage";

interface CategoryGroupPropsType {
  group: string;
  categoryMap: MapOrEntries<string, string>;
  game: string;
}

const CategoryGroup = ({
  group,
  categoryMap,
  game,
}: CategoryGroupPropsType) => {
  const [members] = useMapObject<string, string>(categoryMap);
  const [categories, setCategories] = useState([]);
  const { markers } = useMapContext();
  const [categoryCounts, setCategoryCounts] = useState({});
  const [userSettings, setUserSettings] = useLocalStorage(
    USER_SETTING,
    initialUserSettings
  );

  useEffect(() => {
    if (!Object.keys(categoryCounts).length) {
      const counts = {...categoryCounts}
      markers.map(({ category }) => {
        counts[category] = (counts[category] + 1) || 1;
      });
      setCategoryCounts({...counts})
    }
  });

  useEffect(() => {
    if (!categories.length) {
      Array.from(members.entries()).map(([key]) => {
        categories.push(key);
        setCategories([...categories]);
      });
    }
  }, [categories, members]);

  const toggleGroupCategories = () => {
    const newHidden = {};

    Array.from(members.entries()).map(([key]) => {
      const prev = userSettings[SETTING_HIDDEN_CATEGORY][game][key];
      newHidden[key] = !prev;
    });

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
  };

  return (
    <VStack w="100%" key={group}>
      <HStack px="8px" pt={3} justifyContent="space-between" w="100%">
        <Button
          fontSize="1rem"
          pl={0}
          variant="underlined"
          onClick={toggleGroupCategories}
        >
          {group.toUpperCase() + ":"}
        </Button>
      </HStack>
      {Array.from(members.entries()).map(([key, value]) => {
        return (
          categoryCounts &&
          categoryCounts[key] && (
            <MarkerButton
              key={key}
              game={game}
              type={value}
              num={categoryCounts[key]}
              category={key}
              groupHide={userSettings[SETTING_HIDDEN_CATEGORY][game][key]}
            />
          )
        );
      })}
    </VStack>
  );
};

export default CategoryGroup;
