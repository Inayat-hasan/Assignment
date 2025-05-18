"use client";
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createAppTheme } from "../lib/theme";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export default function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setMode(storedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
