import React from "react";

import { CategoryGroup } from ".";
import { useMapContext } from "@context/app-context";

const CategoryGroups = () => {
  const {categoryItems} = useMapContext();
  const {categoryGroups} = categoryItems;

  return (
    <>
      {categoryGroups.map(({groupId, name, members}) => {
        return (
          <CategoryGroup
            key={groupId}
            group={name}
            members={members}
          />
        );
      })}
    </>
  );
};

export default CategoryGroups;
