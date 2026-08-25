import { useState } from "react";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Rating,
  Stack,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";

import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useCart } from "../../context/CartContext";

import { getDishImage } from "../../utils/imageUtils";
// =====================================
// IMÁGENES LOCALES
// =====================================


// =====================================
// DISH CARD
// =====================================

const DishCard = ({ dish }) => {
  const { addToCart } = useCart();

  const [showNotification, setShowNotification] =
    useState(false);

    const handleAddToCart = () => {
      const dishWithImage = {
        ...dish,
        image: getDishImage(dish.image),
      };
    
      addToCart(dishWithImage);
      setShowNotification(true);
    };

  return (
    <>
      {/* =====================================
          CARD
      ====================================== */}

      <Card
        sx={{
          width: "100%",
          height: 600,
          backgroundColor: "background.paper",
          borderRadius: "24px",
          overflow: "hidden",
          color: "text.primary",
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          boxShadow:
            "0 8px 25px rgba(0, 0, 0, 0.08)",
          transition:
            "transform 0.4s ease, box-shadow 0.4s ease, background-color 0.4s ease",

          "&:hover": {
            transform: "translateY(-10px)",
            boxShadow:
              "0 25px 60px rgba(155, 94, 44, 0.22)",
          },

          "&:hover img": {
            transform: "scale(1.08)",
          },
        }}
      >
        {/* =====================================
            IMAGEN
        ====================================== */}

        <Box
          sx={{
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <CardMedia
            component="img"
            image={getDishImage(dish.image)}
            alt={dish.name}
            sx={{
              height: 280,
              width: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
            }}
          />

          {/* =====================================
              PRECIO
          ====================================== */}

          <Box
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              px: 2,
              py: 0.8,
              borderRadius: 50,
              boxShadow:
                "0 4px 12px rgba(0,0,0,.25)",
              transition:
                "background-color 0.3s ease",
            }}
          >
            <Typography
              fontWeight="bold"
              sx={{
                fontSize: "1rem",
              }}
            >
              S/ {dish.price}
            </Typography>
          </Box>
        </Box>

        {/* =====================================
            CONTENIDO
        ====================================== */}

        <CardContent
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minHeight: 0,
          }}
        >
          {/* =====================================
              NOMBRE
          ====================================== */}

          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              minHeight: 55,
              color: "text.primary",
              transition: "color 0.3s ease",
            }}
          >
            {dish.name}
          </Typography>

          {/* =====================================
              RATING
          ====================================== */}

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            mt={1.5}
          >
            <Rating
              value={dish.rating}
              precision={0.5}
              readOnly
              sx={{
                color: "primary.main",
              }}
            />

            <Typography
              sx={{
                color: "text.muted",
                fontSize: ".9rem",
                whiteSpace: "nowrap",
                transition: "color 0.3s ease",
              }}
            >
              {dish.rating} ({dish.reviews} reseñas)
            </Typography>
          </Stack>

          {/* =====================================
              DESCRIPCIÓN
          ====================================== */}

          <Typography
            sx={{
              mt: 2,
              color: "text.secondary",
              lineHeight: 1.6,
              width: "100%",
              overflow: "hidden",
              wordBreak: "break-word",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              textOverflow: "ellipsis",
              minHeight: 55,
              transition: "color 0.3s ease",
            }}
          >
            {dish.description}
          </Typography>

          {/* =====================================
              BOTÓN
          ====================================== */}

          <Button
            fullWidth
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            startIcon={<ShoppingCartCheckoutIcon />}
            onClick={handleAddToCart}
            sx={{
              mt: "auto",
              pt: 1.3,
              pb: 1.3,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              borderRadius: 50,
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",

              "&:hover": {
                backgroundColor: "primary.dark",
                transform: "translateY(-2px)",
              },

              transition: "all 0.3s ease",
            }}
          >
            Agregar al carrito
          </Button>
        </CardContent>
      </Card>

      {/* =====================================
          NOTIFICACIÓN
      ====================================== */}

      <Snackbar
        open={showNotification}
        autoHideDuration={2500}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setShowNotification(false)}
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            backgroundColor: "primary.main",
            color: "#FFFFFF",
            fontWeight: "bold",
            borderRadius: 2,
          }}
        >
          🛒 {dish.name} agregado al carrito
        </Alert>
      </Snackbar>
    </>
  );
};

export default DishCard;