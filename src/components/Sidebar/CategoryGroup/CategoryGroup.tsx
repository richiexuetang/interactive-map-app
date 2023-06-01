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
  const [categoryCounts, setCategoryCounts] = useState(null);
  const [userSettings, setUserSettings] = useLocalStorage(
    USER_SETTING,
    initialUserSettings
  );

  useEffect(() => {
    if (!categoryCounts) {
      const counts = {};
      markers.map(({ category }) => {
        if (!counts[category]) {
          counts[category] = 1;
        } else {
          counts[category]++;
        }
      });

      setCategoryCounts({ ...counts });
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
      const prev = userSettings["hiddenCategories"][game][key];
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
              groupHide={userSettings["hiddenCategories"][game][key]}
            />
          )
        );
      })}
    </VStack>
  );
};

export default CategoryGroup;
