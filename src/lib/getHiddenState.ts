import { SETTING_HIDDEN_CATEGORY, USER_SETTING } from "@data/LocalStorage"

export const categoryHiddenState = (key) => {
    const item = JSON.parse(window.localStorage.getItem(USER_SETTING));
    if (!item) {
        return null;
    }
    return item[SETTING_HIDDEN_CATEGORY][key];
}