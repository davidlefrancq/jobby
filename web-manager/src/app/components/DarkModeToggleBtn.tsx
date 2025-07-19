'use client';

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { setTheme } from "../store/themeReducer";
import { ThemeType } from "@/types/ThemeType";

let isFirstLoad = true;

export default function DarkModeToggleBtn() {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector(state => state.themeReducer);

  const [isDark, setIsDark] = useState(theme === "dark");

  // FR: Initialisation du thème depuis localStorage
  // EN: Initialize the theme from localStorage
  useEffect(() => {
    if (isFirstLoad) {
      isFirstLoad = false;
      const hs_theme: ThemeType = (localStorage.getItem("hs_theme") ?? "dark") as ThemeType;
      setIsDark(hs_theme === "dark");
      updateHtmlClass(hs_theme === "dark" ? "dark" : "light");
      dispatch(setTheme(hs_theme));
      localStorage.setItem("hs_theme", hs_theme);
    }
  }, []);

  const updateHtmlClass = (theme: "light" | "dark") => {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(theme);
  };

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    updateHtmlClass(newTheme);
    dispatch(setTheme(newTheme));
    localStorage.setItem("hs_theme", newTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="font-medium text-gray-800 rounded-full hover:bg-gray-200 focus:outline-none focus:bg-gray-200 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
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