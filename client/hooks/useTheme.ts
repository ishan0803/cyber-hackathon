import { useEffect, useState } from "react";

type ThemeMode = "dark" | "light";

type ThemeState = {
  mode: ThemeMode;
  highContrast: boolean;
};

const THEME_KEY = "dcis:theme";

function applyTheme({ mode, highContrast }: ThemeState) {
  const root = document.documentElement;
  if (mode === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  if (highContrast) root.classList.add("hc");
  else root.classList.remove("hc");
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeState>(() => {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw) return JSON.parse(raw) as ThemeState;
    return { mode: "dark", highContrast: false };
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
  }, [theme]);

  const toggleMode = () =>
    setTheme((t) => ({ ...t, mode: t.mode === "dark" ? "light" : "dark" }));

  const toggleHighContrast = () =>
    setTheme((t) => ({ ...t, highContrast: !t.highContrast }));

  return { ...theme, setTheme, toggleMode, toggleHighContrast };
}
