import { DEFAULT_THEME_MODE, THEME_MODE_LIST } from "@/constants/default";
import { GraphicThemeType } from "@/types/GraphicThemeType";

export class LocalStorageManager {
  // isAutoMode
  static setIsAutoMode(value: boolean) {
    localStorage.setItem("isAutoMode", JSON.stringify(value));
  }

  static getIsAutoMode(): boolean {
    const value = localStorage.getItem("isAutoMode");
    const isTrue = value ? JSON.parse(value) : false;
    return isTrue === true;
  }

  static removeIsAutoMode() {
    localStorage.removeItem("isAutoMode");
  }

  // graphicTheme
  static setGraphicTheme(value: GraphicThemeType) {
    localStorage.setItem("graphic_theme", JSON.stringify(value));
  }

  static getGraphicTheme(): GraphicThemeType {
    let themeMode = DEFAULT_THEME_MODE
    const data = localStorage.getItem("graphic_theme");
    const value = data ? JSON.parse(data) : null
    if (value && THEME_MODE_LIST.includes(value)) {
      themeMode = value;
    }
    return themeMode;
  }

  static removeGraphicTheme() {
    localStorage.removeItem("graphic_theme");
  }
}
