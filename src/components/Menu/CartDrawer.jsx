
import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { getDishImage } from "../../utils/imageUtils";
import { useCart } from "../../context/CartContext";

const WHATSAPP_PHONE = "51936995196";

const INITIAL_FORM = {
  name: "",
  phone: "",
  delivery: "delivery",
  address: "",
  reference: "",
  payment: "yape",
  cashChange: "",
};

const formatMoney = (amount) =>
  Number(amount).toFixed(2);

const CartDrawer = ({ open, onClose }) => {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");

  const updateForm = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  };

  const handleClose = () => {
    onClose();
  };

  const handleGoToMenu = () => {
    onClose();

    window.setTimeout(() => {
      document.getElementById("menu")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleContinue = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      setFormError("Completa tu nombre y teléfono.");
      return;
    }

    if (form.delivery === "delivery" && !form.address.trim()) {
      setFormError("Ingresa la dirección de entrega.");
      return;
    }

    if (form.phone.replace(/\D/g, "").length < 7) {
      setFormError("Revisa el número de teléfono.");
      return;
    }

    setFormError("");
    setStep(2);
  };

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;

    const productsMessage = cart
      .map(
        (item) =>
          `• ${item.quantity} x ${item.name} — S/ ${formatMoney(
            item.price * item.quantity
          )}`
      )
      .join("\n");

    const deliveryMessage =
      form.delivery === "delivery"
        ? [
            "Modalidad: Delivery",
            `Dirección: ${form.address.trim()}`,
            form.reference.trim()
              ? `Referencia: ${form.reference.trim()}`
              : null,
          ]
            .filter(Boolean)
            .join("\n")
        : "Modalidad: Recojo en local";

    const paymentLabels = {
      cash: "Efectivo",
      yape: "Yape",
      plin: "Plin",
    };

    const message = [
      "¡Hola, Leñas y Humos! Quiero realizar este pedido:",
      "",
      "DATOS DEL CLIENTE",
      `Nombre: ${form.name.trim()}`,
      `Teléfono: ${form.phone.trim()}`,
      "",
      "ENTREGA",
      deliveryMessage,
      "",
      "PRODUCTOS",
      productsMessage,
      "",
      "PAGO",
      `Método: ${paymentLabels[form.payment]}`,
      form.payment === "cash" && form.cashChange.trim()
        ? `Pagaré con: S/ ${form.cashChange.trim()}`
        : null,
      "",
      `TOTAL: S/ ${formatMoney(cartTotal)}`,
      "",
      "Por favor, confirmen la disponibilidad y los detalles de mi pedido.",
    ]
      .filter((line) => line !== null)
      .join("\n");

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleBack = () => {
    setFormError("");
    setStep((current) => Math.max(0, current - 1));
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 440 },
            display: "flex",
            flexDirection: "column",
            height: "100%",
            backgroundColor: "background.paper",
            color: "text.primary",
          },
        },
      }}
    >
      {/* ENCABEZADO */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          {step > 0 && (
            <IconButton onClick={handleBack} aria-label="Volver">
              <ArrowBackIcon />
            </IconButton>
          )}

          <ShoppingCartOutlinedIcon color="primary" />

          <Typography variant="h5" fontWeight="bold">
            {step === 0
              ? "Mi carrito"
              : step === 1
                ? "Datos del pedido"
                : "Confirmar pedido"}
          </Typography>
        </Stack>

        <IconButton onClick={handleClose} aria-label="Cerrar carrito">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* CARRITO VACÍO */}
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
            sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
          />

          <Typography variant="h6" fontWeight="bold">
            Tu carrito está vacío
          </Typography>

          <Typography sx={{ mt: 1, color: "text.secondary" }}>
            Agrega algunos platos para comenzar tu pedido.
          </Typography>

          <Button variant="contained" onClick={handleGoToMenu} sx={{ mt: 3 }}>
            Ver menú
          </Button>
        </Box>
      ) : (
        <>
          {/* PASO 1: CARRITO */}
          {step === 0 && (
            <>
              <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
                {cart.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      mb: 2,
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 3,
                    }}
                  >
                    <Stack direction="row" spacing={2}>
                      <Box
                        component="img"
                        src={getDishImage(item.image)}
                        alt={item.name}
                        sx={{
                          width: 76,
                          height: 76,
                          objectFit: "cover",
                          borderRadius: 2,
                        }}
                      />

                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography fontWeight="bold">
                          {item.name}
                        </Typography>

                        <Typography color="primary.main" fontWeight="bold">
                          S/ {formatMoney(item.price)}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mt: 1 }}
                        >
                          <IconButton
                            size="small"
                            aria-label={`Restar ${item.name}`}
                            onClick={() => decreaseQuantity(item.id)}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>

                          <Typography>{item.quantity}</Typography>

                          <IconButton
                            size="small"
                            aria-label={`Sumar ${item.name}`}
                            onClick={() => increaseQuantity(item.id)}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            aria-label={`Eliminar ${item.name}`}
                            onClick={() => removeFromCart(item.id)}
                            sx={{ ml: "auto", color: "error.main" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Box>
                    </Stack>

                    <Typography
                      align="right"
                      sx={{ mt: 1, fontWeight: "bold" }}
                    >
                      Subtotal: S/ {formatMoney(item.price * item.quantity)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ p: 3, borderTop: "1px solid", borderColor: "divider" }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>

                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    S/ {formatMoney(cartTotal)}
                  </Typography>
                </Stack>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setStep(1)}
                  sx={{ py: 1.5, borderRadius: 50, textTransform: "none" }}
                >
                  Continuar con mis datos
                </Button>

                <Button
                  fullWidth
                  onClick={clearCart}
                  color="error"
                  sx={{ mt: 1, textTransform: "none" }}
                >
                  Vaciar carrito
                </Button>
              </Box>
            </>
          )}

          {/* PASO 2: DATOS DEL CLIENTE */}
          {step === 1 && (
            <Box
              component="form"
              onSubmit={handleContinue}
              sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}
            >
              <Stack spacing={2.5}>
                <Typography color="text.secondary">
                  Completa tus datos para preparar el pedido.
                </Typography>

                <TextField
                  label="Nombre completo"
                  name="name"
                  value={form.name}
                  onChange={updateForm}
                  autoComplete="name"
                  required
                  fullWidth
                />

                <TextField
                  label="Teléfono de contacto"
                  name="phone"
                  value={form.phone}
                  onChange={updateForm}
                  type="tel"
                  autoComplete="tel"
                  required
                  fullWidth
                  helperText="Incluye el número al que puedan contactarte."
                />

                <Divider />

                <FormControl>
                  <Typography fontWeight="bold" sx={{ mb: 1 }}>
                    ¿Cómo deseas recibir tu pedido?
                  </Typography>

                  <RadioGroup
                    name="delivery"
                    value={form.delivery}
                    onChange={updateForm}
                  >
                    <FormControlLabel
                      value="delivery"
                      control={<Radio />}
                      label="Delivery"
                    />

                    <FormControlLabel
                      value="pickup"
                      control={<Radio />}
                      label="Recojo en local"
                    />
                  </RadioGroup>
                </FormControl>

                {form.delivery === "delivery" && (
                  <>
                    <TextField
                      label="Dirección de entrega"
                      name="address"
                      value={form.address}
                      onChange={updateForm}
                      autoComplete="street-address"
                      required
                      fullWidth
                    />

                    <TextField
                      label="Referencia (opcional)"
                      name="reference"
                      value={form.reference}
                      onChange={updateForm}
                      fullWidth
                      multiline
                      minRows={2}
                    />
                  </>
                )}

                <Divider />

                <FormControl>
                  <Typography fontWeight="bold" sx={{ mb: 1 }}>
                    Método de pago
                  </Typography>

                  <RadioGroup
                    name="payment"
                    value={form.payment}
                    onChange={updateForm}
                  >
                    <FormControlLabel
                      value="yape"
                      control={<Radio />}
                      label="Yape"
                    />

                    <FormControlLabel
                      value="plin"
                      control={<Radio />}
                      label="Plin"
                    />

                    <FormControlLabel
                      value="cash"
                      control={<Radio />}
                      label="Efectivo"
                    />
                  </RadioGroup>
                </FormControl>

                {form.payment === "cash" && (
                  <TextField
                    label="¿Con cuánto pagarás? (opcional)"
                    name="cashChange"
                    value={form.cashChange}
                    onChange={updateForm}
                    type="number"
                    inputProps={{ min: 0, step: "0.10" }}
                    fullWidth
                    helperText="Puedes indicarlo si necesitas vuelto."
                  />
                )}

                {formError && <Alert severity="error">{formError}</Alert>}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ py: 1.5, borderRadius: 50, textTransform: "none" }}
                >
                  Revisar mi pedido · S/ {formatMoney(cartTotal)}
                </Button>
              </Stack>
            </Box>
          )}

          {/* PASO 3: REVISIÓN FINAL */}
          {step === 2 && (
            <Box sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
              <Stack spacing={2.5}>
                <Alert severity="info">
                  Revisa los datos antes de abrir WhatsApp. El pedido aún no
                  ha sido enviado.
                </Alert>

                <Box>
                  <Typography fontWeight="bold" sx={{ mb: 1 }}>
                    Cliente
                  </Typography>
                  <Typography>{form.name}</Typography>
                  <Typography color="text.secondary">{form.phone}</Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography fontWeight="bold" sx={{ mb: 1 }}>
                    Entrega
                  </Typography>

                  <Typography>
                    {form.delivery === "delivery"
                      ? "Delivery"
                      : "Recojo en local"}
                  </Typography>

                  {form.delivery === "delivery" && (
                    <>
                      <Typography>{form.address}</Typography>
                      {form.reference.trim() && (
                        <Typography color="text.secondary">
                          Referencia: {form.reference}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>

                <Divider />

                <Box>
                  <Typography fontWeight="bold" sx={{ mb: 1 }}>
                    Productos
                  </Typography>

                  {cart.map((item) => (
                    <Stack
                      key={item.id}
                      direction="row"
                      justifyContent="space-between"
                      spacing={2}
                      sx={{ mb: 1 }}
                    >
                      <Typography>
                        {item.quantity} × {item.name}
                      </Typography>

                      <Typography sx={{ whiteSpace: "nowrap" }}>
                        S/ {formatMoney(item.price * item.quantity)}
                      </Typography>
                    </Stack>
                  ))}
                </Box>

                <Divider />

                <Box>
                  <Typography fontWeight="bold" sx={{ mb: 1 }}>
                    Pago
                  </Typography>

                  <Typography>
                    {form.payment === "cash"
                      ? "Efectivo"
                      : form.payment === "yape"
                        ? "Yape"
                        : "Plin"}
                  </Typography>

                  {form.payment === "cash" && form.cashChange.trim() && (
                    <Typography color="text.secondary">
                      Pagará con: S/ {form.cashChange}
                    </Typography>
                  )}
                </Box>

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>

                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    S/ {formatMoney(cartTotal)}
                  </Typography>
                </Stack>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<WhatsAppIcon />}
                  onClick={handleWhatsAppOrder}
                  sx={{
                    py: 1.5,
                    borderRadius: 50,
                    backgroundColor: "#25D366",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#1EBE5D" },
                  }}
                >
                  Enviar pedido por WhatsApp
                </Button>

                <Button
                  fullWidth
                  onClick={handleBack}
                  sx={{ textTransform: "none" }}
                >
                  Volver y corregir datos
                </Button>
              </Stack>
            </Box>
          )}
        </>
      )}
    </Drawer>
  );
};

export default CartDrawer;
