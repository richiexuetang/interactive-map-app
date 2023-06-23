export const categoryHiddenState = (key) => {
    const item = JSON.parse(window.localStorage.getItem("interactive_map_user_setting"));
    if (!item) {
        return null;
    }
    return item["hiddenCategories"][key];
}