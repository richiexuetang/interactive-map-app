import React from "react";
import { CategoryGroup } from ".";
import useMapObject from "@hooks/useMapObject";

const CategoryGroups = ({ categoryGroups, game, categoryCounts }) => {
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
            categoryCounts={categoryCounts}
          />
        );
      })}
    </>
  );
};

export default CategoryGroups;
