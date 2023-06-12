import { categoryItemsConfig } from "@data/categoryItemsConfig";

export const getGroupName = (gameSlug, categoryId) => {
  let groupName = "";
  categoryItemsConfig.map((item) => {
    if (item.gameSlug === gameSlug) {
      item.categoryGroups.map(({ members, name }) => {
        if (members.includes(categoryId)) {
          groupName = name;
        }
      });
    }
  });
  return groupName;
};
