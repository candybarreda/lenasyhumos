
import { useState } from "react";
import {
  Box,
  Fab,
  Paper,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import CloseIcon from "@mui/icons-material/Close";
import { useAccessibility } from "../context/AccessibilityContext.jsx";

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);

  const {
    fontScale,
    decreaseFont,
    increaseFont,
    resetFont,
  } = useAccessibility();

  return (
    <Box
      sx={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 1500,
      }}
    >
      {open && (
        <Paper
          id="accessibility-panel"
          elevation={8}
          role="region"
          aria-label="Panel de accesibilidad"
          sx={{
            width: 270,
            p: 2,
            mb: 1.5,
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="h6">
              Accesibilidad
            </Typography>

            <IconButton
              onClick={() => setOpen(false)}
              aria-label="Cerrar panel de accesibilidad"
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Tamaño del texto: {fontScale}%
          </Typography>

          <Box
            role="group"
            aria-label="Controles del tamaño del texto"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Tooltip title="Reducir tamaño del texto">
              <span>
                <IconButton
                  onClick={decreaseFont}
                  disabled={fontScale <= 80}
                  aria-label="Reducir tamaño del texto"
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    flex: 1,
                  }}
                >
                  <Typography fontWeight="bold">A−</Typography>
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Restablecer tamaño normal">
              <IconButton
                onClick={resetFont}
                aria-label="Restablecer tamaño normal"
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  flex: 1,
                }}
              >
                <Typography fontWeight="bold">A</Typography>
              </IconButton>
            </Tooltip>

            <Tooltip title="Aumentar tamaño del texto">
              <span>
                <IconButton
                  onClick={increaseFont}
                  disabled={fontScale >= 150}
                  aria-label="Aumentar tamaño del texto"
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    flex: 1,
                  }}
                >
                  <Typography fontWeight="bold">A+</Typography>
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Paper>
      )}

      <Tooltip title="Opciones de accesibilidad">
        <Fab
          color="primary"
          aria-label="Abrir opciones de accesibilidad"
          aria-expanded={open}
          aria-controls="accessibility-panel"
          onClick={() => setOpen((previous) => !previous)}
        >
          <AccessibilityNewIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
}
