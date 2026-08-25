import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import DirectionsIcon from "@mui/icons-material/Directions";

const Contacto = () => {
  const phone = "51936995196";

  const locationUrl =
    "https://www.google.com/maps/place/Andromeda/@-12.1747781,-77.0053725,20z/data=!4m6!3m5!1s0x9105b9000099dfbb:0xf8b3906e0f94a0eb!8m2!3d-12.1746385!4d-77.0052325!16s%2Fg%2F11x5rh6slw?entry=ttu";

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    "Hola, quiero obtener información sobre Leñas y Humos."
  )}`;

  return (
    <Box
      component="section"
      id="contacto"
      sx={{
        py: { xs: 8, md: 12 },

        // 🔥 Se adapta automáticamente al tema
        backgroundColor: "background.default",
        color: "text.primary",

        width: "100%",

        transition:
          "background-color 0.4s ease, color 0.4s ease",
      }}
    >
      <Container maxWidth="lg">
        {/* =========================
            ENCABEZADO
        ========================== */}

        <Box
          textAlign="center"
          sx={{
            mb: { xs: 6, md: 8 },
          }}
        >
          <Typography
            sx={{
              color: "primary.main",
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              transition: "color 0.3s ease",
            }}
          >
            CONTÁCTANOS
          </Typography>

          <Typography
            variant="h2"
            sx={{
              mt: 1,
              fontWeight: 800,
              fontSize: {
                xs: "2.2rem",
                md: "3.2rem",
              },
              color: "text.primary",
              transition: "color 0.3s ease",
            }}
          >
            Ven a visitarnos
          </Typography>

          <Typography
            sx={{
              mt: 2,
              maxWidth: 650,
              mx: "auto",
              color: "text.secondary",
              lineHeight: 1.7,
              fontSize: "1.05rem",
              transition: "color 0.3s ease",
            }}
          >
            Estamos listos para recibirte y compartir contigo
            nuestros mejores platos preparados a la leña.
          </Typography>
        </Box>

        {/* =========================
            CONTENIDO
        ========================== */}

        <Box
          sx={{
            width: "100%",
            maxWidth: 1100,
            mx: "auto",

            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "0.85fr 1.15fr",
            },

            gap: {
              xs: 3,
              md: 5,
            },

            alignItems: "stretch",
          }}
        >
          {/* =========================
              INFORMACIÓN
          ========================== */}

          <Box
            sx={{
              width: "100%",
              minWidth: 0,

              p: {
                xs: 3,
                md: 4,
              },

              borderRadius: "24px",

              // 🎨 Se adapta al tema
              backgroundColor: "background.paper",

              border: "1px solid",
              borderColor: "divider",

              display: "flex",
              flexDirection: "column",

              boxShadow: (theme) =>
                theme.palette.mode === "light"
                  ? "0 10px 35px rgba(0,0,0,0.06)"
                  : "0 10px 35px rgba(0,0,0,0.25)",

              transition:
                "background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                mb: 4,
                color: "text.primary",
              }}
            >
              Información de contacto
            </Typography>

            {/* DIRECCIÓN */}

            <Stack
              direction="row"
              spacing={2}
              sx={{
                mb: 3,
              }}
            >
              <LocationOnIcon
                sx={{
                  color: "primary.main",
                  fontSize: 30,
                  flexShrink: 0,
                }}
              />

              <Box>
                <Typography
                  fontWeight="bold"
                  color="text.primary"
                >
                  Dirección
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  Lima, Perú
                </Typography>
              </Box>
            </Stack>

            {/* TELÉFONO */}

            <Stack
              direction="row"
              spacing={2}
              sx={{
                mb: 3,
              }}
            >
              <PhoneIcon
                sx={{
                  color: "primary.main",
                  fontSize: 28,
                  flexShrink: 0,
                }}
              />

              <Box>
                <Typography
                  fontWeight="bold"
                  color="text.primary"
                >
                  Teléfono
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  +51 936 995 196
                </Typography>
              </Box>
            </Stack>

            {/* HORARIO */}

            <Stack
              direction="row"
              spacing={2}
              sx={{
                mb: 4,
              }}
            >
              <AccessTimeIcon
                sx={{
                  color: "primary.main",
                  fontSize: 28,
                  flexShrink: 0,
                }}
              />

              <Box>
                <Typography
                  fontWeight="bold"
                  color="text.primary"
                >
                  Horario
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  Lunes - Domingo
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  12:00 PM - 10:00 PM
                </Typography>
              </Box>
            </Stack>

            {/* WHATSAPP */}

            <Button
              fullWidth
              variant="contained"
              startIcon={<WhatsAppIcon />}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                py: 1.5,
                borderRadius: 50,

                // WhatsApp mantiene su color propio
                backgroundColor: "#25D366",

                textTransform: "none",
                fontWeight: "bold",
                fontSize: "1rem",

                "&:hover": {
                  backgroundColor: "#1ebe5d",
                },
              }}
            >
              Escríbenos por WhatsApp
            </Button>

            {/* REDES SOCIALES */}

            <Box
              sx={{
                mt: 4,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  color: "text.secondary",
                  mb: 2,
                }}
              >
                Síguenos en nuestras redes
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
              >
                {/* INSTAGRAM */}

                <IconButton
                  component="a"
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "text.primary",

                    backgroundColor: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgba(155,94,44,0.08)"
                        : "rgba(255,255,255,0.06)",

                    transition: "all .3s",

                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <InstagramIcon />
                </IconButton>

                {/* FACEBOOK */}

                <IconButton
                  component="a"
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "text.primary",

                    backgroundColor: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgba(155,94,44,0.08)"
                        : "rgba(255,255,255,0.06)",

                    transition: "all .3s",

                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <FacebookIcon />
                </IconButton>
              </Stack>
            </Box>
          </Box>

          {/* =========================
              MAPA
          ========================== */}

          <Box
            sx={{
              height: "100%",
              minHeight: 450,

              borderRadius: "24px",
              overflow: "hidden",

              border: "1px solid",
              borderColor: "divider",

              position: "relative",
              cursor: "pointer",

              boxShadow: (theme) =>
                theme.palette.mode === "light"
                  ? "0 10px 35px rgba(0,0,0,0.06)"
                  : "0 10px 35px rgba(0,0,0,0.25)",
            }}
          >
            {/* MAPA CLICKEABLE */}

            <Box
              component="a"
              href={locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                display: "block",
                cursor: "pointer",
              }}
              aria-label="Ver ubicación en Google Maps"
            />

            {/* MAPA */}

            <Box
              component="iframe"
              title="Ubicación Leñas y Humos"
              src="https://www.google.com/maps?q=Lima,Peru&output=embed"
              loading="lazy"
              sx={{
                width: "100%",
                height: "100%",
                minHeight: 450,
                border: 0,

                pointerEvents: "none",
              }}
            />

            {/* BOTÓN */}

            <Button
              variant="contained"
              startIcon={<DirectionsIcon />}
              href={locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                position: "absolute",
                bottom: 20,
                left: 20,

                zIndex: 2,

                backgroundColor: "primary.main",
                color: "primary.contrastText",

                borderRadius: 50,
                px: 3,

                textTransform: "none",
                fontWeight: "bold",

                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              Cómo llegar
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Contacto;