import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
} from "@mui/material";

import { motion } from "framer-motion";

import cilindro from "../../assets/images/cilindro.jpg";

import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Nosotros = () => {
  return (
    <Box
      id="nosotros"
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",

        py: {
          xs: 8,
          md: 12,
        },

        // 🎨 Fondo según el tema
        backgroundColor: "background.default",

        color: "text.primary",

        scrollMarginTop: "90px",

        transition:
          "background-color 0.4s ease, color 0.4s ease",
      }}
    >
      {/* =====================================
          BRILLO DECORATIVO
      ====================================== */}

      <Box
        sx={{
          position: "absolute",

          width: {
            xs: 250,
            md: 400,
          },

          height: {
            xs: 250,
            md: 400,
          },

          borderRadius: "50%",

          backgroundColor:
            "rgba(155, 94, 44, 0.08)",

          filter: "blur(120px)",

          right: -150,
          top: 100,

          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl">
        <Grid
          container
          spacing={{
            xs: 5,
            md: 10,
          }}
          alignItems="center"
        >
          {/* =====================================
              IMAGEN
          ====================================== */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                x: -60,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.8,
              }}
              viewport={{
                once: true,
              }}
            >
              <Box
                sx={{
                  position: "relative",

                  borderRadius: "58px",

                  overflow: "hidden",

                  height: {
                    xs: 350,
                    md: 520,
                  },
                }}
              >
                <Box
                  component="img"
                  src={cilindro}
                  alt="Chancho al cilindro"
                  sx={{
                    width: "100%",

                    height: "100%",

                    objectFit: "cover",

                    transition:
                      "transform 0.5s ease",

                    padding:
                      "0 0 0 54px",

                    borderRadius: "16px",

                    "&:hover": {
                      transform:
                        "scale(1.05)",
                    },
                  }}
                />

                {/* =====================================
                    ETIQUETA SOBRE LA IMAGEN
                ====================================== */}

                <Box
                  sx={{
                    position:
                      "absolute",

                    bottom: 25,

                    left: {
                      xs: 25,
                      md: 85,
                    },

                    backgroundColor:
                      "background.paper",

                    backdropFilter:
                      "blur(10px)",

                    px: 3,

                    py: 2,

                    borderRadius: "26px",

                    border:
                      "1px solid",

                    borderColor:
                      "rgba(155, 94, 44, 0.3)",

                    boxShadow:
                      "0 10px 30px rgba(0,0,0,0.15)",

                    transition:
                      "background-color 0.4s ease",
                  }}
                >
                  <Typography
                    sx={{
                      color:
                        "primary.main",

                      fontWeight:
                        "bold",

                      fontSize:
                        "1.1rem",
                    }}
                  >
                    🔥 Sabor al cilindro
                  </Typography>

                  <Typography
                    sx={{
                      color:
                        "text.secondary",

                      fontSize:
                        ".9rem",

                      mt: 0.3,
                    }}
                  >
                    Cocción lenta y tradicional
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          {/* =====================================
              TEXTO
          ====================================== */}

          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                x: 60,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.8,
              }}
              viewport={{
                once: true,
              }}
            >
              <Stack spacing={3}>
                {/* =====================================
                    PEQUEÑO TÍTULO
                ====================================== */}

                <Typography
                  sx={{
                    color:
                      "primary.main",

                    fontWeight: 500,

                    letterSpacing: 3,

                    textTransform:
                      "uppercase",

                    fontSize:
                      "0.9rem",
                  }}
                >
                  Sobre nosotros
                </Typography>

                {/* =====================================
                    TÍTULO
                ====================================== */}

                <Typography
                  variant="h2"
                  fontWeight="bold"
                  sx={{
                    color:
                      "text.primary",

                    fontSize: {
                      xs: "2.4rem",
                      md: "3.5rem",
                    },

                    lineHeight: 1.1,
                  }}
                >
                  Tradición y sabor

                  <Box
                    component="span"
                    sx={{
                      color:
                        "primary.main",

                      display: "block",
                    }}
                  >
                    en cada plato
                  </Box>
                </Typography>

                {/* =====================================
                    DESCRIPCIÓN
                ====================================== */}

                <Typography
                  sx={{
                    color:
                      "text.secondary",

                    fontSize:
                      "1.05rem",

                    lineHeight: 1.8,

                    maxWidth: 500,
                  }}
                >
                  En Leñas y Humos creemos que
                  un buen plato comienza con una
                  buena cocción. Nuestro chancho
                  al cilindro se prepara lentamente
                  para conseguir una carne tierna,
                  jugosa y llena de sabor.
                </Typography>

                <Typography
                  sx={{
                    color:
                      "text.secondary",

                    fontSize:
                      "1.05rem",

                    lineHeight: 1.8,

                    maxWidth: 500,
                  }}
                >
                  Combinamos ingredientes
                  seleccionados, técnicas
                  tradicionales y mucho cariño
                  para llevar a tu mesa una
                  experiencia que puedas disfrutar
                  y recordar.
                </Typography>

                {/* =====================================
                    CARACTERÍSTICAS
                ====================================== */}

                <Stack
                  spacing={2}
                  sx={{
                    pt: 1,
                  }}
                >
                  {/* COCción */}

                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <LocalFireDepartmentIcon
                      sx={{
                        color:
                          "primary.main",

                        fontSize: 30,
                      }}
                    />

                    <Typography
                      sx={{
                        color:
                          "text.primary",

                        fontWeight: 600,
                      }}
                    >
                      Cocción lenta al cilindro
                    </Typography>
                  </Stack>

                  {/* INGREDIENTES */}

                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <RestaurantIcon
                      sx={{
                        color:
                          "primary.main",

                        fontSize: 30,
                      }}
                    />

                    <Typography
                      sx={{
                        color:
                          "text.primary",

                        fontWeight: 600,
                      }}
                    >
                      Ingredientes frescos y
                      seleccionados
                    </Typography>
                  </Stack>

                  {/* PASIÓN */}

                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <FavoriteIcon
                      sx={{
                        color:
                          "primary.main",

                        fontSize: 30,
                      }}
                    />

                    <Typography
                      sx={{
                        color:
                          "text.primary",

                        fontWeight: 600,
                      }}
                    >
                      Preparado con pasión
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Nosotros;