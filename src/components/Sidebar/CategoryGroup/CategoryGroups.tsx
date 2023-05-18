import React from "react";
import { CategoryGroup } from ".";
import useMapObject from "@hooks/useMapObject";
import { useMapContext } from "src/context/app-context";

const CategoryGroups = () => {
  const {categoryItems, game} = useMapContext();
  const {categoryGroups} = categoryItems;
  return (
    <>
      {categoryGroups.map((categoryGroup) => {
        // eslint-disable-next-line
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
