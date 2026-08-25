import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getDishes } from "../../services/dishService";
import DishCard from "./DishCard";


const FeaturedDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDishes = async () => {
      try {
        const data = await getDishes();
        setDishes(data);
      } catch (error) {
        console.error("Error obteniendo platos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDishes();
  }, []);



  return (
    <Box
      id="menu"
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",

        scrollMarginTop: "90px",

        py: {
          xs: 8,
          md: 12,
        },

        // 🎨 Fondo del tema
        backgroundColor: "background.default",

        color: "text.primary",

        transition:
          "background-color 0.4s ease, color 0.4s ease",
      }}
    >
      {/* =====================================
          BRILLO DECORATIVO SUPERIOR
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

          top: -180,
          left: -180,

          pointerEvents: "none",
        }}
      />

      {/* =====================================
          BRILLO DECORATIVO INFERIOR
      ====================================== */}

      <Box
        sx={{
          position: "absolute",

          width: {
            xs: 220,
            md: 350,
          },

          height: {
            xs: 220,
            md: 350,
          },

          borderRadius: "50%",

          backgroundColor:
            "rgba(155, 94, 44, 0.06)",

          filter: "blur(110px)",

          bottom: -180,
          right: -180,

          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl">
        {/* =====================================
            ENCABEZADO
        ====================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
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
              mb: {
                xs: 6,
                md: 8,
              },
            }}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* ETIQUETA */}

              <Typography
                sx={{
                  color: "primary.main",

                  fontWeight: 600,

                  letterSpacing: 3,

                  textTransform:
                    "uppercase",

                  fontSize: {
                    xs: "0.8rem",
                    md: "0.9rem",
                  },

                  transition:
                    "color 0.3s ease",
                }}
              >
                Lo mejor de nuestra cocina
              </Typography>

              {/* TÍTULO */}

              <Typography
                variant="h2"
                sx={{
                  color: "text.primary",

                  fontWeight: 800,

                  fontSize: {
                    xs: "2.3rem",
                    sm: "3rem",
                    md: "3.8rem",
                  },

                  letterSpacing: "-1px",

                  transition:
                    "color 0.3s ease",
                }}
              >
                Nuestros Platos
              </Typography>

              {/* DESCRIPCIÓN */}

              <Typography
                sx={{
                  color: "text.secondary",

                  maxWidth: 600,

                  fontSize: {
                    xs: "1rem",
                    md: "1.1rem",
                  },

                  lineHeight: 1.7,

                  transition:
                    "color 0.3s ease",
                }}
              >
                Cada plato es preparado lentamente
                al cilindro, conservando todo el
                sabor, aroma y jugosidad que
                caracterizan a Leñas y Humos.
              </Typography>
            </Stack>
          </Box>
        </motion.div>

        {/* =====================================
            CARDS
        ====================================== */}

        <Grid
          container
          spacing={3}
          sx={{
            justifyContent: "center",
          }}
        >
          {dishes.slice(0, 9).map(
            (dish, index) => (
              <Grid
                key={dish.id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <motion.div
                  style={{
                    width: "100%",
                    maxWidth: "360px",
                  }}
                  initial={{
                    opacity: 0,
                    y: 60,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                  }}
                  viewport={{
                    once: true,
                  }}
                >
                  <DishCard dish={dish} />
                </motion.div>
              </Grid>
            )
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturedDishes;