'use client';

import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { setTheme } from "../store/themeReducer";
import { GraphicThemeType } from "@/types/GraphicThemeType";
import { LocalStorageManager } from "../lib/LocalStorageManager";

export default function DarkModeToggleBtn() {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector(state => state.themeReducer);

  // FR: Utilisation d'une référence pour éviter l'effet de bord lors du premier chargement
  // EN: Using a ref to avoid side effects on the first load
  const isFirstLoad = useRef(true);

  const [isDark, setIsDark] = useState(theme === "dark");

  // FR: Mise à jour de l'état isDark, de la classe HTML et du thème dans le store et du localStorage
  // EN: Update isDark state, HTML class, and theme in store and localStorage
  const updateTheme = (newTheme: GraphicThemeType) => {
    setIsDark(newTheme === "dark");
    updateHtmlClass(newTheme === "dark" ? "dark" : "light");
    dispatch(setTheme(newTheme));
    LocalStorageManager.setGraphicTheme(newTheme);
  }

  // FR: Initialisation du thème depuis localStorage
  // EN: Initialize the theme from localStorage
  useEffect(() => {
    if (isFirstLoad.current) {
      // Update isFirstLoad state to avoid side effects
      isFirstLoad.current = false;
      // Retrieve theme from localStorage or use default theme
      const graphicTheme: GraphicThemeType = LocalStorageManager.getGraphicTheme();
      // Update the theme state
      updateTheme(graphicTheme);
    }
  }, []);

  const updateHtmlClass = (theme: "light" | "dark") => {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(theme);
  };

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    updateTheme(newTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? "Light Mode" : "Dark Mode"}
      className={`
        flex
        items-center
        justify-center
        cursor-pointer
        h-[32px]
        w-[32px]

        font-medium
        text-gray-600
        focus:text-neutral-800
        hover:text-neutral-200
        dark:text-neutral-200
        dark:hover:text-neutral-800
        dark:focus:text-neutral-200

        border
        border-gray-500
        focus:border-neutral-800
        hover:border-neutral-200
        dark:border-neutral-200
        dark:hover:border-neutral-800
        dark:focus:border-neutral-200

        
        bg-white
        hover:bg-neutral-800
        focus:bg-white
        dark:bg-neutral-800
        dark:hover:bg-neutral-200
        dark:focus:bg-neutral-800

        transition-all
        hover:scale-125
        focus:scale-125
        dark:transition-all
        dark:hover:scale-125
        dark:focus:scale-125

        rounded-full
        focus:outline-none
      `}
      aria-label="Toggle theme"
    >
      <span className="group inline-flex shrink-0 justify-center items-center size-9">
        {isDark ? (
          // FR: ☀️ Soleil – visible en mode sombre (permet de repasser en clair)
          // EN: ☀️ Sun – visible in dark mode (allows switching back to light)
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          // FR: 🌙 Lune – visible en mode clair (permet de passer en sombre)
          // EN: 🌙 Moon – visible in light mode (allows switching to dark)
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </span>
    </button>
  );
}