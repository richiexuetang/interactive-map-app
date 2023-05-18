import { VStack, HStack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import useMapObject, { MapOrEntries } from "src/hooks/useMapObject";
import MarkerButton from "../MarkerButton";
import { useMapContext } from "src/context/app-context";

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
  const {categoryCounts} = useMapContext();

  useEffect(() => {
    if (!categories.length) {
      Array.from(members.entries()).map(([key]) => {
        categories.push(key);
        setCategories([...categories]);
      });
    }
  }, [categories, members]);

  const getCategoryCount = (value) => {
    return 1;
  };

  return (
    <VStack w="100%" key={group}>
      <HStack px="8px" pt={5} justifyContent="space-between" w="100%">
        <Text fontSize="1rem" ml={3}>
          {group.toUpperCase() + ":"}
        </Text>
      </HStack>
      {Array.from(members.entries()).map(([key, value]) => {
        return (
          categoryCounts[key] && (
            <MarkerButton
              game={game}
              type={value}
              num={categoryCounts[key]}
              category={key}
            />
          )
        );
      })}
    </VStack>
  );
};

export default CategoryGroup;
