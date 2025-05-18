// lib/theme.js
import { createTheme } from "@mui/material/styles";

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Light mode colors
          primary: { main: "#1976d2" },
          background: { default: "#f5f5f5", paper: "#fff" },
        }
      : {
          // Dark mode colors
          primary: { main: "#90caf9" },
          background: { default: "#121212", paper: "#1e1e1e" },
        }),
  },
});

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));
