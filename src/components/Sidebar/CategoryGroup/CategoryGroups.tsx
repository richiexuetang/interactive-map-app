import React from "react";

import { CategoryGroup } from ".";
import { useMapContext } from "@context/app-context";
import useMapObject from "@hooks/useMapObject";

const CategoryGroups = () => {
  const {categoryItems, game} = useMapContext();
  const {categoryGroups} = categoryItems;
  return (
    <>
      {categoryGroups.map((categoryGroup) => {
        const [members] = useMapObject<string, string>(categoryGroup.members);
        const categories = [];
        Array.from(members.entries()).map(([key]) => {
          categories.push(key);
        });

        return (
          <CategoryGroup
            key={categoryGroup.name}
            group={categoryGroup.name}
            categoryMap={categoryGroup.members}
            game={game}
          />
        );
      })}
    </>
  );
};

export default CategoryGroups;
