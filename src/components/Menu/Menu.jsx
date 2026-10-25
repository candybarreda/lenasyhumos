
import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

import { motion, AnimatePresence } from "framer-motion";

import DishCard from "./DishCard";
import { dishes as platosLocales } from "./dishes";
import { obtenerProductos } from "../../services/productoService";

const Menu = () => {
  const [productos, setProductos] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState("Todos");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    const cargarProductos = async () => {
      try {
        setLoading(true);
        setError("");

        const datos = await obtenerProductos();

        if (!activo) return;

        // Conservamos imágenes y valoraciones locales
        // cuando exista un plato con el mismo nombre.
        const productosAdaptados = datos.map((producto) => {
          const local = platosLocales.find(
            (plato) =>
              plato.name?.trim().toLowerCase() ===
              producto.nombre?.trim().toLowerCase()
          );

          return {
            id: producto.id,
            name: producto.nombre,
            description: producto.descripcion || "",
            price: Number(producto.precio),
            image:
              producto.imagenUrl || local?.image || "",
            category:
              producto.categoria || local?.category || "Otros",
            rating: local?.rating ?? 0,
            reviews: local?.reviews ?? 0,
            disponible: producto.disponible,
          };
        });

        setProductos(productosAdaptados);
      } catch (err) {
        if (activo) {
          setError(
            "No pudimos cargar la carta. Verifica que el backend esté funcionando."
          );
        }

        console.error("Error al cargar productos:", err);
      } finally {
        if (activo) {
          setLoading(false);
        }
      }
    };

    cargarProductos();

    return () => {
      activo = false;
    };
  }, []);

  const productosDisponibles = productos.filter(
    (producto) => producto.disponible !== false
  );

  const categories = [
    "Todos",
    ...new Set(
      productosDisponibles.map((producto) => producto.category)
    ),
  ];

  const filteredDishes =
    selectedCategory === "Todos"
      ? productosDisponibles
      : productosDisponibles.filter(
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
        transition: "background-color 0.4s ease, color 0.4s ease",
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography
            variant="overline"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              letterSpacing: 2,
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
              fontSize: { xs: "2.2rem", md: "3rem" },
            }}
          >
            Sabores hechos a la leña
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 650, mx: "auto", mt: 2, lineHeight: 1.7 }}
          >
            Disfruta nuestros platos preparados con ingredientes
            seleccionados y el auténtico sabor de la cocina a la leña.
          </Typography>
        </Box>

        {loading && (
          <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
            <CircularProgress color="primary" />
            <Typography color="text.secondary">
              Cargando nuestra carta...
            </Typography>
          </Stack>
        )}

        {!loading && error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            {productosDisponibles.length > 0 && (
              <Stack
                direction="row"
                spacing={1.5}
                justifyContent="center"
                flexWrap="wrap"
                useFlexGap
                sx={{ mb: 6 }}
              >
                {categories.map((category) => {
                  const isSelected =
                    selectedCategory === category;

                  return (
                    <Button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      variant={isSelected ? "contained" : "outlined"}
                      sx={{
                        borderRadius: 5,
                        px: 3,
                        py: 1,
                        textTransform: "none",
                        fontWeight: 700,
                        ...(isSelected
                          ? {
                              backgroundColor: "primary.main",
                              color: "primary.contrastText",
                              "&:hover": {
                                backgroundColor: "primary.dark",
                              },
                            }
                          : {
                              borderColor: "primary.main",
                              color: "primary.main",
                              "&:hover": {
                                borderColor: "primary.dark",
                                color: "primary.dark",
                                backgroundColor: "primary.light",
                              },
                            }),
                        transition: "all 0.3s ease",
                      }}
                    >
                      {category}
                    </Button>
                  );
                })}
              </Stack>
            )}

            {productosDisponibles.length === 0 ? (
              <Typography
                textAlign="center"
                color="text.secondary"
                sx={{ py: 5 }}
              >
                Pronto tendremos deliciosos platos en nuestra carta.
              </Typography>
            ) : filteredDishes.length === 0 ? (
              <Typography
                textAlign="center"
                color="text.secondary"
                sx={{ py: 5 }}
              >
                No hay platos en esta categoría.
              </Typography>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
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
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Menu;
