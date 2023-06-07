import React, { useEffect, useState } from "react";

import { VStack, HStack, Button } from "@chakra-ui/react";

import { MarkerButton } from "@components/Sidebar/.";
import { useMapContext } from "@context/.";
import {
  SETTING_HIDDEN_CATEGORY,
  USER_SETTING,
  initialUserSettings,
} from "@data/LocalStorage";
import useLocalStorage from "@hooks/useLocalStorage";
import { categoryIdNameMap } from "@data/categoryItemsConfig";

interface CategoryGroupPropsType {
  group: string;
  members: number[];
}

const CategoryGroup = ({ group, members }: CategoryGroupPropsType) => {
  const { categoryCounts } = useMapContext();

  const [userSettings, setUserSettings] = useLocalStorage(
    USER_SETTING,
    initialUserSettings
  );

  const toggleGroupCategories = () => {
    members.map((categoryId) => {
      const prev = userSettings[SETTING_HIDDEN_CATEGORY][categoryId];

      setUserSettings((prevState) => ({
        ...prevState,
        hiddenCategories: {
          ...prevState.hiddenCategories,
          [categoryId]: !prev,
        },
      }));
    });
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
      {members.map((member) => {
        return (
          categoryCounts[member] > 0 && (
            <MarkerButton
              key={member}
              category={member}
              groupHide={userSettings[SETTING_HIDDEN_CATEGORY][member]}
            />
          )
        );
      })}
    </VStack>
  );
};

export default CategoryGroup;
