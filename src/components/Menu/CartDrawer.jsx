import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Divider,
  Button,
  Stack,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { getDishImage } from "../../utils/imageUtils";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";

const CartDrawer = ({ open, onClose }) => {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  const { mode } = useTheme();

  // =====================================
  // PEDIDO POR WHATSAPP
  // =====================================

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;

    const phone = "51936995196";

    const productsMessage = cart
      .map(
        (item) =>
          `${item.quantity}x ${item.name} - S/ ${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    const message = `Hola, quiero realizar el siguiente pedido:

${productsMessage}

Total: S/ ${cartTotal.toFixed(2)}

¿Podrían confirmar mi pedido?`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  // =====================================
  // IR AL MENÚ
  // =====================================

  const handleGoToMenu = () => {
    onClose();

    setTimeout(() => {
      const menuSection =
        document.getElementById("menu");

      if (menuSection) {
        menuSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: {
              xs: "100%",
              sm: 420,
            },

            backgroundColor:
              "background.paper",

            color: "text.primary",

            transition:
              "background-color 0.4s ease, color 0.4s ease",
          },
        },
      }}
    >
      {/* =====================================
          HEADER
      ====================================== */}

      <Box
        sx={{
          px: 3,
          py: 2.5,

          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <ShoppingCartOutlinedIcon
            sx={{
              color: "primary.main",
            }}
          />

          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              color: "text.primary",
            }}
          >
            Mi carrito
          </Typography>
        </Stack>

        <IconButton
          onClick={onClose}
          sx={{
            color: "text.primary",

            "&:hover": {
              backgroundColor:
                "primary.light",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider
        sx={{
          borderColor: "divider",
        }}
      />

      {/* =====================================
          CARRITO VACÍO
      ====================================== */}

      {cart.length === 0 ? (
        <Box
          sx={{
            flexGrow: 1,

            display: "flex",

            flexDirection: "column",

            alignItems: "center",

            justifyContent: "center",

            px: 3,

            textAlign: "center",
          }}
        >
          <ShoppingCartOutlinedIcon
            sx={{
              fontSize: 80,

              color: "text.muted",

              mb: 2,
            }}
          />

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              color: "text.primary",
            }}
          >
            Tu carrito está vacío
          </Typography>

          <Typography
            sx={{
              mt: 1,

              color: "text.secondary",

              lineHeight: 1.6,
            }}
          >
            Agrega algunos platos deliciosos
            para comenzar.
          </Typography>

          <Button
            variant="contained"
            onClick={handleGoToMenu}
            sx={{
              mt: 3,

              backgroundColor:
                "primary.main",

              color:
                "primary.contrastText",

              borderRadius: 50,

              px: 4,

              textTransform: "none",

              fontWeight: "bold",

              "&:hover": {
                backgroundColor:
                  "primary.dark",
              },
            }}
          >
            Ver menú
          </Button>
        </Box>
      ) : (
        <>
          {/* =====================================
              PRODUCTOS
          ====================================== */}

          <Box
            sx={{
              flexGrow: 1,

              overflowY: "auto",

              px: 2,

              py: 2,
            }}
          >
            {cart.map((item) => (
              <Box
                key={item.id}
                sx={{
                  mb: 2,

                  p: 2,

                  borderRadius: 3,

                  backgroundColor:
                    "background.subtle",

                  border:
                    "1px solid",

                  borderColor:
                    "divider",

                  transition:
                    "background-color 0.3s ease, border-color 0.3s ease",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                >
                  {/* IMAGEN */}

                  <Box
                     component="img"
                     src={getDishImage(item.image)}
                     alt={item.name}
                     sx={{
                       width: 80,
                       height: 80,
                       objectFit: "cover",
                       borderRadius: 2,
                     }}
                  />

                  {/* INFORMACIÓN */}

                  <Box
                    sx={{
                      flexGrow: 1,

                      minWidth: 0,
                    }}
                  >
                    <Typography
                      fontWeight="bold"
                      sx={{
                        mb: 0.5,

                        color:
                          "text.primary",

                        overflow: "hidden",

                        textOverflow:
                          "ellipsis",

                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {item.name}
                    </Typography>

                    {/* PRECIO */}

                    <Typography
                      sx={{
                        color:
                          "primary.main",

                        fontWeight:
                          "bold",
                      }}
                    >
                      S/{" "}
                      {Number(
                        item.price
                      ).toFixed(2)}
                    </Typography>

                    {/* CANTIDAD */}

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{
                        mt: 1,
                      }}
                    >
                      {/* RESTAR */}

                      <IconButton
                        size="small"
                        onClick={() =>
                          decreaseQuantity(
                            item.id
                          )
                        }
                        sx={{
                          color:
                            "text.primary",

                          backgroundColor:
                            "background.raised",

                          border:
                            "1px solid",

                          borderColor:
                            "divider",

                          "&:hover": {
                            backgroundColor:
                              "primary.light",
                          },
                        }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>

                      {/* CANTIDAD */}

                      <Typography
                        sx={{
                          minWidth: 25,

                          textAlign:
                            "center",

                          fontWeight:
                            "bold",

                          color:
                            "text.primary",
                        }}
                      >
                        {item.quantity}
                      </Typography>

                      {/* SUMAR */}

                      <IconButton
                        size="small"
                        onClick={() =>
                          increaseQuantity(
                            item.id
                          )
                        }
                        sx={{
                          color:
                            "text.primary",

                          backgroundColor:
                            "background.raised",

                          border:
                            "1px solid",

                          borderColor:
                            "divider",

                          "&:hover": {
                            backgroundColor:
                              "primary.light",
                          },
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>

                      {/* ELIMINAR */}

                      <IconButton
                        size="small"
                        onClick={() =>
                          removeFromCart(
                            item.id
                          )
                        }
                        sx={{
                          color:
                            "#D32F2F",

                          ml: "auto",

                          "&:hover": {
                            backgroundColor:
                              "rgba(211,47,47,0.10)",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Box>

          {/* =====================================
              RESUMEN
          ====================================== */}

          <Box
            sx={{
              p: 3,

              borderTop:
                "1px solid",

              borderColor:
                "divider",

              backgroundColor:
                "background.paper",
            }}
          >
            {/* SUBTOTAL */}

            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  color:
                    "text.secondary",
                }}
              >
                Subtotal
              </Typography>

              <Typography
                fontWeight="bold"
                sx={{
                  color:
                    "text.primary",
                }}
              >
                S/ {cartTotal.toFixed(2)}
              </Typography>
            </Stack>

            {/* TOTAL */}

            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  color:
                    "text.primary",
                }}
              >
                Total
              </Typography>

              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  color:
                    "primary.main",
                }}
              >
                S/ {cartTotal.toFixed(2)}
              </Typography>
            </Stack>

            {/* =====================================
                WHATSAPP
            ====================================== */}

            <Button
              fullWidth
              variant="contained"
              startIcon={<WhatsAppIcon />}
              onClick={handleWhatsAppOrder}
              sx={{
                py: 1.5,

                borderRadius: 50,

                backgroundColor:
                  "#25D366",

                color: "#FFFFFF",

                textTransform:
                  "none",

                fontWeight: "bold",

                fontSize: "1rem",

                "&:hover": {
                  backgroundColor:
                    "#1EBE5D",
                },
              }}
            >
              Realizar pedido por WhatsApp
            </Button>

            {/* =====================================
                VACIAR CARRITO
            ====================================== */}

            <Button
              fullWidth
              onClick={clearCart}
              sx={{
                mt: 1,

                color:
                  "text.muted",

                textTransform:
                  "none",

                "&:hover": {
                  color:
                    "#D32F2F",

                  backgroundColor:
                    "rgba(211,47,47,0.06)",
                },
              }}
            >
              Vaciar carrito
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default CartDrawer;