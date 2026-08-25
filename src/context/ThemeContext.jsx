import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(
    localStorage.getItem("theme") || "light"
  );

  const toggleTheme = () => {
    setMode((prev) => {
      const newMode =
        prev === "light" ? "dark" : "light";

      localStorage.setItem("theme", newMode);

      return newMode;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,

          // =====================================
          // MODO CLARO
          // =====================================

          ...(mode === "light"
            ? {
                background: {
                  default: "#FBF9F5",
                  paper: "#FDFCF9",
                  subtle: "#EFE8DE",
                  raised: "#FDFCF9",
                },

                text: {
                  primary: "#222222",
                  secondary: "#494741",
                  tertiary: "#625F59",
                  muted: "#817E78",
                  inverse: "#F7F2EB",
                  accent: "#7D4A23",
                },

                primary: {
                  main: "#9B5E2C",
                  dark: "#7D4A23",
                  light: "#F4E8DB",
                  contrastText: "#FFFFFF",
                },

                divider: "#E5DCCE",

                border: {
                  subtle: "#E5DCCE",
                  default: "#D8CCBB",
                  strong: "#A9A7A2",
                },
              }

            // =====================================
            // MODO OSCURO
            // =====================================

            : {
                background: {
                  default: "#222222",
                  paper: "#2C2A27",
                  subtle: "#302D29",
                  raised: "#36322E",
                },

                text: {
                  primary: "#F7F2EB",
                  secondary: "#D8CCBB",
                  tertiary: "#B8B1A7",
                  muted: "#A9A7A2",
                  inverse: "#222222",
                  accent: "#D99A68",
                },

                primary: {
                  main: "#B8733C",
                  dark: "#9B5E2C",
                  light: "#D99A68",
                  contrastText: "#FFFFFF",
                },

                divider: "#4A4540",

                border: {
                  subtle: "#403C37",
                  default: "#4A4540",
                  strong: "#706B64",
                },
              }),
        },

        // =====================================
        // TIPOGRAFÍA
        // =====================================

        typography: {
          fontFamily:
            "Poppins, sans-serif",

          h1: {
            fontWeight: 800,
          },

          h2: {
            fontWeight: 800,
          },

          h3: {
            fontWeight: 700,
          },

          h4: {
            fontWeight: 700,
          },

          h5: {
            fontWeight: 700,
          },

          h6: {
            fontWeight: 700,
          },
        },

        // =====================================
        // COMPONENTES MUI
        // =====================================

        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                margin: 0,

                transition:
                  "background-color 0.4s ease, color 0.4s ease",
              },

              "*": {
                boxSizing: "border-box",
              },
            },
          },

          // =====================================
          // BUTTON
          // =====================================

          MuiButton: {
            styleOverrides: {
              root: {
                transition:
                  "all 0.3s ease",
              },
            },
          },

          // =====================================
          // CARD
          // =====================================

          MuiCard: {
            styleOverrides: {
              root: {
                transition:
                  "background-color 0.4s ease, color 0.4s ease, box-shadow 0.3s ease",
              },
            },
          },

          // =====================================
          // DRAWER
          // =====================================

          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor:
                  mode === "light"
                    ? "#FDFCF9"
                    : "#2C2A27",

                color:
                  mode === "light"
                    ? "#222222"
                    : "#F7F2EB",

                transition:
                  "background-color 0.4s ease, color 0.4s ease",
              },
            },
          },

          // =====================================
          // APPBAR
          // =====================================

          MuiAppBar: {
            styleOverrides: {
              root: {
                transition:
                  "background-color 0.4s ease",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider
      value={{
        mode,
        toggleTheme,
      }}
    >
      <MuiThemeProvider theme={theme}>
        <CssBaseline />

        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () =>
  useContext(ThemeContext);