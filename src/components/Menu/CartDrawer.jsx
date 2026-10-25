import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  MenuItem,
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

import { getDishImage } from "../../utils/imageUtils";
import { useCart } from "../../context/CartContext";
import { obtenerZonasDelivery } from "../../services/zonaDeliveryService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const CartDrawer = ({ open, onClose }) => {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  const [mostrarCheckout, setMostrarCheckout] = useState(false);
  const [form, setForm] = useState({
    nombreCliente: "",
    telefonoCliente: "",
    tipoEntrega: "DELIVERY",
    zonaDeliveryId: "",
    direccion: "",
    metodoPago: "YAPE",
  });

  const [zonasDelivery, setZonasDelivery] = useState([]);
  const [cargandoZonas, setCargandoZonas] = useState(false);
  const [errorCheckout, setErrorCheckout] = useState("");
  const [procesandoPedido, setProcesandoPedido] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);

  useEffect(() => {
    if (!open || !mostrarCheckout || zonasDelivery.length > 0) return;

    let activo = true;

    const cargarZonas = async () => {
      try {
        setCargandoZonas(true);
        setErrorCheckout("");

        const datos = await obtenerZonasDelivery();

        if (activo) {
          setZonasDelivery(
            datos.filter((zona) => zona.habilitada === true)
          );
        }
      } catch (error) {
        console.error("Error al cargar zonas:", error);
        if (activo) {
          setErrorCheckout("No se pudieron cargar las zonas de delivery. Comprueba que el backend esté funcionando.");
        }
      } finally {
        if (activo) setCargandoZonas(false);
      }
    };

    cargarZonas();

    return () => {
      activo = false;
    };
  }, [open, mostrarCheckout, zonasDelivery.length]);

  const actualizarFormulario = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const abrirCheckout = () => {
    setMostrarCheckout(true);
    setPedidoConfirmado(null);
    setErrorCheckout("");
  };

  const volverAlCarrito = () => {
    setMostrarCheckout(false);
    setErrorCheckout("");
  };

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;

    const phone = "51936995196";
    const productsMessage = cart
      .map(
        (item) =>
          `${item.quantity}x ${item.name} - S/ ${(
            Number(item.price) * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    const message = `Hola, quiero realizar el siguiente pedido:\n\n${productsMessage}\n\nSubtotal de productos: S/ ${Number(cartTotal).toFixed(2)}\n\n¿Podrían confirmar el costo de delivery y mi pedido?`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const enviarPedido = async (event) => {
    event.preventDefault();
    setErrorCheckout("");

    if (cart.length === 0) {
      setErrorCheckout("Tu carrito está vacío.");
      return;
    }

    if (!form.nombreCliente.trim() || !form.telefonoCliente.trim()) {
      setErrorCheckout("Completa tu nombre y teléfono.");
      return;
    }

    if (
      form.tipoEntrega === "DELIVERY" &&
      (!form.zonaDeliveryId || !form.direccion.trim())
    ) {
      setErrorCheckout("Selecciona un distrito e ingresa tu dirección.");
      return;
    }

    setProcesandoPedido(true);

    const storageKey = "checkoutIdempotencyKey";
    let claveIdempotencia = sessionStorage.getItem(storageKey);

    if (!claveIdempotencia) {
      claveIdempotencia =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `lh-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      sessionStorage.setItem(storageKey, claveIdempotencia);
    }

    try {
      const payload = {
        claveIdempotencia,
        nombreCliente: form.nombreCliente.trim(),
        telefonoCliente: form.telefonoCliente.trim(),
        tipoEntrega: form.tipoEntrega,
        zonaDeliveryId:
          form.tipoEntrega === "DELIVERY"
            ? Number(form.zonaDeliveryId)
            : null,
        direccion:
          form.tipoEntrega === "DELIVERY" ? form.direccion.trim() : null,
        productos: cart.map((item) => ({
          productoId: Number(item.id),
          cantidad: Number(item.quantity),
        })),
      };

      const respuestaPedido = await fetch(`${API_URL}/api/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": claveIdempotencia,
        },
        body: JSON.stringify(payload),
      });

      const pedido = await respuestaPedido.json().catch(() => ({}));

      if (!respuestaPedido.ok) {
        throw new Error(
          pedido.error ||
            pedido.message ||
            "No se pudo registrar el pedido. Revisa los datos e inténtalo de nuevo."
        );
      }

      // El backend actual registra primero el pedido y luego el pago por separado.
      const respuestaPago = await fetch(`${API_URL}/api/pagos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pedidoId: pedido.id,
          metodo: form.metodoPago,
          referenciaOperacion: null,
        }),
      });

      const pago = await respuestaPago.json().catch(() => ({}));

      if (!respuestaPago.ok) {
        // Conservamos el pedido en pantalla para evitar que el cliente lo vuelva
        // a registrar accidentalmente. Se informa que el pago no quedó registrado.
        setPedidoConfirmado({
          ...pedido,
          pagoPendienteDeRegistro: true,
          errorPago:
            pago.error ||
            pago.message ||
            "El pedido se registró, pero no se pudo registrar el método de pago.",
        });
        clearCart();
        sessionStorage.removeItem(storageKey);
        return;
      }

      setPedidoConfirmado({
        ...pedido,
        pago,
        metodoPago: form.metodoPago,
      });
      clearCart();
      sessionStorage.removeItem(storageKey);
    } catch (error) {
      console.error("Error al registrar pedido:", error);
      setErrorCheckout(
        error.message ||
          "No fue posible conectar con el servidor. Puedes reintentar."
      );
    } finally {
      setProcesandoPedido(false);
    }
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

  const tarifaSeleccionada = zonasDelivery.find(
    (zona) => String(zona.id) === String(form.zonaDeliveryId)
  )?.tarifa;

  const totalEstimado =
    Number(cartTotal) +
    (form.tipoEntrega === "DELIVERY" ? Number(tarifaSeleccionada || 0) : 0);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 420, md: 460 },
            maxWidth: "100vw",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
            backgroundColor: "background.paper",
            color: "text.primary",
          },
        },
      }}
    >
      {/* Cabecera fija */}
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" minWidth={0}>
          <ShoppingCartOutlinedIcon sx={{ color: "primary.main" }} />
          <Typography variant="h5" fontWeight="bold" sx={{ minWidth: 0 }}>
            {pedidoConfirmado ? "Pedido registrado" : "Mi carrito"}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} aria-label="Cerrar carrito">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {pedidoConfirmado ? (
        <Box sx={{ p: { xs: 2, sm: 3 }, overflowY: "auto" }}>
          <Alert
            severity={pedidoConfirmado.pagoPendienteDeRegistro ? "warning" : "success"}
            sx={{ mb: 2, overflowWrap: "anywhere" }}
          >
            <Typography fontWeight="bold">
              ¡Tu pedido fue registrado!
            </Typography>
            <Typography>
              Número de pedido:{" "}
              {pedidoConfirmado.numeroPedido || pedidoConfirmado.id}
            </Typography>
            <Typography>
              Total: S/ {Number(pedidoConfirmado.total ?? cartTotal).toFixed(2)}
            </Typography>
            <Typography>
              Método de pago: {form.metodoPago}
            </Typography>
            {pedidoConfirmado.pagoPendienteDeRegistro && (
              <Typography sx={{ mt: 1 }}>
                {pedidoConfirmado.errorPago}
              </Typography>
            )}
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {form.metodoPago === "YAPE" || form.metodoPago === "PLIN"
              ? `El pago por ${form.metodoPago} queda pendiente de verificación. Coordina el envío del comprobante con el negocio.`
              : "El negocio confirmará los detalles de tu pedido."}
          </Typography>
          <Button fullWidth variant="contained" onClick={() => {
            setPedidoConfirmado(null);
            setMostrarCheckout(false);
            setForm({
              nombreCliente: "",
              telefonoCliente: "",
              tipoEntrega: "DELIVERY",
              zonaDeliveryId: "",
              direccion: "",
              metodoPago: "YAPE",
            });
            onClose();
          }}>
            Cerrar
          </Button>
        </Box>
      ) : cart.length === 0 ? (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            px: 3,
            py: 4,
            textAlign: "center",
          }}
        >
          <ShoppingCartOutlinedIcon sx={{ fontSize: 72, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" fontWeight="bold">
            Tu carrito está vacío
          </Typography>
          <Typography sx={{ mt: 1, color: "text.secondary", lineHeight: 1.6 }}>
            Agrega algunos platos deliciosos para comenzar.
          </Typography>
          <Button variant="contained" onClick={handleGoToMenu} sx={{ mt: 3, borderRadius: 50, px: 4 }}>
            Ver menú
          </Button>
        </Box>
      ) : (
        <>
          {/* Área principal desplazable */}
          <Box
            sx={{
              flex: "1 1 auto",
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              px: { xs: 1.5, sm: 2 },
              py: 2,
            }}
          >
            {!mostrarCheckout ? (
              <>
                {cart.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      mb: 2,
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 3,
                      backgroundColor: "background.subtle",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        component="img"
                        src={getDishImage(item.image)}
                        alt={item.name}
                        sx={{
                          width: { xs: 68, sm: 80 },
                          height: { xs: 68, sm: 80 },
                          flexShrink: 0,
                          objectFit: "cover",
                          borderRadius: 2,
                        }}
                      />
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          fontWeight="bold"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography color="primary.main" fontWeight="bold">
                          S/ {Number(item.price).toFixed(2)}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                          <IconButton size="small" onClick={() => decreaseQuantity(item.id)} aria-label="Restar cantidad">
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ minWidth: 22, textAlign: "center", fontWeight: "bold" }}>
                            {item.quantity}
                          </Typography>
                          <IconButton size="small" onClick={() => increaseQuantity(item.id)} aria-label="Aumentar cantidad">
                            <AddIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Eliminar ${item.name}`}
                            sx={{ ml: "auto", color: "error.main" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </>
            ) : (
              <Box
                component="form"
                id="checkout-cart-form"
                onSubmit={enviarPedido}
                sx={{
                  width: "100%",
                  maxWidth: "100%",
                  minWidth: 0,
                  boxSizing: "border-box",
                  px: { xs: 0.5, sm: 1 },
                  py: 1,
                  "& .MuiFormControl-root": { width: "100%", minWidth: 0 },
                  "& .MuiInputBase-root": { maxWidth: "100%", boxSizing: "border-box" },
                  "& .MuiFormControlLabel-root": { ml: 0, mr: 1 },
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Datos de tu pedido
                </Typography>

                {errorCheckout && (
                  <Alert severity="error" sx={{ mb: 2, overflowWrap: "anywhere" }}>
                    {errorCheckout}
                  </Alert>
                )}

                <Stack spacing={2}>
                  <TextField
                    label="Nombre completo"
                    name="nombreCliente"
                    value={form.nombreCliente}
                    onChange={actualizarFormulario}
                    required
                    fullWidth
                    inputProps={{ maxLength: 120 }}
                  />
                  <TextField
                    label="Teléfono"
                    name="telefonoCliente"
                    value={form.telefonoCliente}
                    onChange={actualizarFormulario}
                    required
                    fullWidth
                    inputProps={{ maxLength: 20, inputMode: "tel" }}
                  />

                  <FormControl>
                    <FormLabel>Tipo de entrega</FormLabel>
                    <RadioGroup
                      name="tipoEntrega"
                      value={form.tipoEntrega}
                      onChange={(event) => {
                        const tipoEntrega = event.target.value;
                        setForm((prev) => ({
                          ...prev,
                          tipoEntrega,
                          ...(tipoEntrega === "RECOJO"
                            ? { zonaDeliveryId: "", direccion: "" }
                            : {}),
                        }));
                      }}
                    >
                      <FormControlLabel value="DELIVERY" control={<Radio />} label="Delivery" />
                      <FormControlLabel value="RECOJO" control={<Radio />} label="Recojo en local" />
                    </RadioGroup>
                  </FormControl>

                  {form.tipoEntrega === "DELIVERY" && (
                    <>
                      <TextField
                        select
                        label="Distrito de entrega"
                        name="zonaDeliveryId"
                        value={form.zonaDeliveryId}
                        onChange={actualizarFormulario}
                        required
                        fullWidth
                        disabled={cargandoZonas || zonasDelivery.length === 0}
                        helperText={
                          cargandoZonas
                            ? "Cargando distritos..."
                            : zonasDelivery.length === 0
                              ? "No hay zonas disponibles. Intenta de nuevo en un momento."
                              : "Selecciona tu distrito."
                        }
                      >
                        {zonasDelivery.map((zona) => (
                          <MenuItem key={zona.id} value={String(zona.id)}>
                            {zona.nombre} — S/ {Number(zona.tarifa).toFixed(2)}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        label="Dirección de entrega"
                        name="direccion"
                        value={form.direccion}
                        onChange={actualizarFormulario}
                        required
                        fullWidth
                        inputProps={{ maxLength: 255 }}
                      />
                      {tarifaSeleccionada !== undefined && (
                        <Alert severity="info">
                          Costo de delivery: S/ {Number(tarifaSeleccionada).toFixed(2)}
                        </Alert>
                      )}
                    </>
                  )}

                  <FormControl>
                    <FormLabel>Método de pago</FormLabel>
                    <RadioGroup
                      name="metodoPago"
                      value={form.metodoPago}
                      onChange={actualizarFormulario}
                    >
                      <FormControlLabel value="YAPE" control={<Radio />} label="Yape" />
                      <FormControlLabel value="PLIN" control={<Radio />} label="Plin" />
                      <FormControlLabel value="EFECTIVO" control={<Radio />} label="Efectivo" />
                    </RadioGroup>
                  </FormControl>

                  <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "background.subtle", border: "1px solid", borderColor: "divider" }}>
                    <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 1 }}>
                      <Typography color="text.secondary">Subtotal</Typography>
                      <Typography fontWeight="medium">S/ {Number(cartTotal).toFixed(2)}</Typography>
                    </Stack>
                    {form.tipoEntrega === "DELIVERY" && (
                      <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mb: 1 }}>
                        <Typography color="text.secondary">Delivery estimado</Typography>
                        <Typography fontWeight="medium">
                          {tarifaSeleccionada === undefined
                            ? "Selecciona distrito"
                            : `S/ ${Number(tarifaSeleccionada).toFixed(2)}`}
                        </Typography>
                      </Stack>
                    )}
                    <Divider sx={{ my: 1.5 }} />
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Typography fontWeight="bold">Total estimado</Typography>
                      <Typography fontWeight="bold" color="primary.main">
                        S/ {totalEstimado.toFixed(2)}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                      El total definitivo lo calcula el servidor.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}
          </Box>

          {/* Resumen y acciones fijas */}
          <Box
            sx={{
              flexShrink: 0,
              borderTop: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
              px: { xs: 2, sm: 3 },
              pt: 2,
              pb: "max(16px, env(safe-area-inset-bottom))",
            }}
          >
            {!mostrarCheckout ? (
              <>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography fontWeight="bold">S/ {Number(cartTotal).toFixed(2)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">Total</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    S/ {Number(cartTotal).toFixed(2)}
                  </Typography>
                </Stack>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={abrirCheckout}
                  sx={{ py: 1.5, mb: 1.5, borderRadius: 50, textTransform: "none", fontWeight: "bold" }}
                >
                  Finalizar pedido
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<WhatsAppIcon />}
                  onClick={handleWhatsAppOrder}
                  sx={{
                    py: 1.5,
                    borderRadius: 50,
                    backgroundColor: "#25D366",
                    color: "#FFFFFF",
                    textTransform: "none",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#1EBE5D" },
                  }}
                >
                  Realizar pedido por WhatsApp
                </Button>
                <Button
                  fullWidth
                  onClick={clearCart}
                  sx={{ mt: 1, color: "text.secondary", textTransform: "none" }}
                >
                  Vaciar carrito
                </Button>
              </>
            ) : (
              <Stack direction="row" spacing={1.5}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={volverAlCarrito}
                  disabled={procesandoPedido}
                  sx={{ py: 1.3, borderRadius: 50, textTransform: "none" }}
                >
                  Volver
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  form="checkout-cart-form"
                  disabled={procesandoPedido || cart.length === 0 || (form.tipoEntrega === "DELIVERY" && !form.zonaDeliveryId)}
                  sx={{ py: 1.3, borderRadius: 50, textTransform: "none", fontWeight: "bold" }}
                >
                  {procesandoPedido ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={18} color="inherit" />
                      <span>Procesando...</span>
                    </Stack>
                  ) : (
                    "Confirmar pedido"
                  )}
                </Button>
              </Stack>
            )}
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default CartDrawer;
