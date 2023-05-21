import React, { useEffect, useState } from "react";

import { VStack, HStack, Button } from "@chakra-ui/react";

import {MarkerButton} from "@components/Sidebar/.";
import { useMarkerContext, useMapContext} from "@context/.";
import { SETTING_HIDDEN_CATEGORY, USER_SETTING } from "@data/LocalStorage";
import useMapObject, { MapOrEntries } from "@hooks/useMapObject";

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
  const { categoryCounts } = useMapContext();
  const {hiddenCategories, setHiddenCategories} = useMarkerContext();

  useEffect(() => {
    if (!categories.length) {
      Array.from(members.entries()).map(([key]) => {
        categories.push(key);
        setCategories([...categories]);
      });
    }
  }, [categories, members]);

  const toggleGroupCategories = () => {
    const newHidden = {...hiddenCategories};
    const newSetting = JSON.parse(window.localStorage.getItem(USER_SETTING));
    Array.from(members.entries()).map(([key]) => {
      const prev = hiddenCategories[key];
      newHidden[key] = !prev;
    });
    newSetting[SETTING_HIDDEN_CATEGORY][game] = newHidden;
    setHiddenCategories({...newHidden});
    window.localStorage.setItem(USER_SETTING, JSON.stringify({...newSetting}));
  }

  return (
    <VStack w="100%" key={group}>
      <HStack px="8px" pt={3} justifyContent="space-between" w="100%">
        <Button fontSize="1rem" pl={0} variant='underlined' onClick={toggleGroupCategories}>
          {group.toUpperCase() + ":"}
        </Button>
      </HStack>
      {Array.from(members.entries()).map(([key, value]) => {
        return (
          categoryCounts[key] && (
            <MarkerButton
              key={key}
              game={game}
              type={value}
              num={categoryCounts[key]}
              category={key}
              groupHide={hiddenCategories[key]}
            />
          )
        );
      })}
    </VStack>
  );
};

export default CategoryGroup;
