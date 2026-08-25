import { useState } from "react";

import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { motion, AnimatePresence } from "framer-motion";

import DishCard from "./DishCard";
import { dishes } from "./dishes";

const categories = [
  "Todos",
  "Entradas",
  "Parrillas",
  "Bebidas",
];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] =
    useState("Todos");

  const filteredDishes =
    selectedCategory === "Todos"
      ? dishes
      : dishes.filter(
          (dish) => dish.category === selectedCategory
        );

  return (
    <Box
      component="section"
      id="menu"
      sx={{
        py: { xs: 8, md: 12 },

        backgroundColor: "background.default",

        color: "text.primary",

        transition:
          "background-color 0.4s ease, color 0.4s ease",
      }}
    >
      <Container maxWidth="lg">

        {/* =========================
            TÍTULO
        ========================= */}
        <Box
          textAlign="center"
          sx={{
            mb: 6,
          }}
        >
          <Typography
            variant="overline"
            sx={{
              color: "primary.main",

              fontWeight: 700,

              letterSpacing: 2,

              transition: "color 0.3s ease",
            }}
          >
            NUESTRO MENÚ
          </Typography>

          <Typography
            variant="h2"
            sx={{
              mt: 1,

              fontWeight: 800,

              color: "text.primary",

              fontSize: {
                xs: "2.2rem",
                md: "3rem",
              },

              transition: "color 0.3s ease",
            }}
          >
            Sabores hechos a la leña
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 650,

              mx: "auto",

              mt: 2,

              lineHeight: 1.7,

              transition: "color 0.3s ease",
            }}
          >
            Disfruta nuestros platos preparados con ingredientes
            seleccionados y el auténtico sabor de la cocina a la leña.
          </Typography>
        </Box>

        {/* =========================
            CATEGORÍAS
        ========================= */}
        <Stack
          direction="row"
          spacing={1.5}
          justifyContent="center"
          flexWrap="wrap"
          useFlexGap
          sx={{
            mb: 6,
          }}
        >
          {categories.map((category) => {
            const isSelected =
              selectedCategory === category;

            return (
              <Button
                key={category}
                onClick={() =>
                  setSelectedCategory(category)
                }
                variant={
                  isSelected
                    ? "contained"
                    : "outlined"
                }
                sx={{
                  borderRadius: 5,

                  px: 3,

                  py: 1,

                  textTransform: "none",

                  fontWeight: 700,

                  ...(isSelected
                    ? {
                        backgroundColor:
                          "primary.main",

                        color:
                          "primary.contrastText",

                        "&:hover": {
                          backgroundColor:
                            "primary.dark",
                        },

                        "&:active": {
                          backgroundColor:
                            "#663B1D",
                        },
                      }
                    : {
                        borderColor:
                          "primary.main",

                        color:
                          "primary.main",

                        "&:hover": {
                          borderColor:
                            "primary.dark",

                          color:
                            "primary.dark",

                          backgroundColor:
                            "primary.light",
                        },
                      }),

                  transition:
                    "all 0.3s ease",
                }}
              >
                {category}
              </Button>
            );
          })}
        </Stack>

        {/* =========================
            PLATOS
        ========================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -15,
            }}
            transition={{
              duration: 0.3,
            }}
          >
            <Grid
              container
              spacing={4}
              justifyContent="center"
            >
              {filteredDishes.map((dish) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={4}
                  key={dish.id}
                >
                  <DishCard dish={dish} />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default Menu;