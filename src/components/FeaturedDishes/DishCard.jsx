  import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Rating,
    Stack,
    Box,
  } from "@mui/material";

  import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
  import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
  
  
  const DishCard = ({ dish }) => {
    const handlePedido = () => {
      const phone = "51936995196";
    
      const message = `Hola, quiero pedir el plato "${dish.name}" por S/ ${dish.price}.`;
    
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
        message
      )}`;
    
      window.open(whatsappUrl, "_blank");
    };
    return (
      <Card
        sx={{
          width: "100%",
          height: 600,
          background: "#171717",
          borderRadius: "24px",
          overflow: "hidden",
          color: "#fff",
          border: "1px solid rgba(200,200,200,.08)",

          display: "flex",
          flexDirection: "column",

          transition: ".4s",

          "&:hover": {
            transform: "translateY(-10px)",
            boxShadow: "0 25px 60px rgba(245,124,0,.25)",
          },

          "&:hover img": {
            transform: "scale(1.08)",
          },
        }}
      >
        {/* Imagen */}
        <Box
          sx={{
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <CardMedia
            component="img"
            image={dish.image}
            alt={dish.name}
            sx={{
              height: 360,
              width: "100%",
              objectFit: "cover",
              transition: ".5s",
            }}
          />

          {/* Precio */}
          <Box
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "#F57C00",
              px: 2,
              py: 0.8,
              borderRadius: 50,
            }}
          >
            <Typography fontWeight="bold">
              S/ {dish.price}
            </Typography>
          </Box>
        </Box>

        {/* Contenido */}
        <CardContent
          sx={{
            height: "77px",
            p: 3,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minHeight: 0,
          }}
        >
          {/* Nombre */}
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              minHeight: 35,
            }}
          >
            {dish.name}
          </Typography>

          {/* Rating */}
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
            />

            <Typography
              sx={{
                color: "#9E9E9E",
                fontSize: ".9rem",
                whiteSpace: "nowrap",
              }}
            >
              {dish.rating} ({dish.reviews} reseñas)
            </Typography>
          </Stack>

          {/* Descripción */}
          <Typography
            sx={{
              mt: 2,
              color: "#bdbdbd",
              lineHeight: 1.6,

              // Se adapta al ancho de la card
              width: "100%",
              overflow: "hidden",
              wordBreak: "break-word",

              // Máximo 3 líneas
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              textOverflow: "ellipsis",
            }}
          >
            {dish.description}
          </Typography>

          {/* Botón */}
          <Button
            fullWidth
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            startIcon={<ShoppingCartCheckoutIcon />}
            onClick={handlePedido}
            sx={{
              mt: "auto",
              pt: 1.3,
              pb: 1.3,
              background: "#F57C00",
              borderRadius: 50,
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",

              "&:hover": {
                background: "#E65100",
              },
            }}
          >
            Pedir Ahora
          </Button>
        </CardContent>
      </Card>
    );
  };

  export default DishCard;