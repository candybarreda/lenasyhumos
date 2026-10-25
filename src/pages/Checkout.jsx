
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { useCart } from "../context/CartContext";
import { useEffect} from "react";
import { obtenerZonasDelivery } from "../services/zonaDeliveryService";
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();

  const [form, setForm] = useState({
    nombreCliente: "",
    telefonoCliente: "",
    tipoEntrega: "DELIVERY",
    zonaDeliveryId: "",
    direccion: "",
    metodoPago: "YAPE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pedidoCreado, setPedidoCreado] = useState(null);
  const [pagoCreado, setPagoCreado] = useState(null);
  const [zonasDelivery, setZonasDelivery] = useState([]);
const [cargandoZonas, setCargandoZonas] = useState(true);
const [errorZonas, setErrorZonas] = useState("");

useEffect(() => {
  let activo = true;

  const cargarZonas = async () => {
    try {
      setCargandoZonas(true);
      setErrorZonas("");

      const datos = await obtenerZonasDelivery();

      if (activo) {
        const habilitadas = datos.filter(
          (zona) => zona.habilitada === true
        );

        setZonasDelivery(habilitadas);
      }
    } catch (err) {
      if (activo) {
        setErrorZonas(
          "No se pudieron cargar las zonas de delivery."
        );
      }

      console.error("Error al cargar zonas:", err);
    } finally {
      if (activo) {
        setCargandoZonas(false);
      }
    }
  };

  cargarZonas();

  return () => {
    activo = false;
  };
}, []);

  const actualizar = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const leerRespuesta = async (response) => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.error ||
          data.message ||
          `Error del servidor (${response.status}).`
      );
    }

    return data;
  };

  const enviarPedido = async (event) => {
    event.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Tu carrito está vacío.");
      return;
    }

    if (
      !form.nombreCliente.trim() ||
      !form.telefonoCliente.trim()
    ) {
      setError("Completa tu nombre y teléfono.");
      return;
    }

    if (
      form.tipoEntrega === "DELIVERY" &&
      (!form.zonaDeliveryId || !form.direccion.trim())
    ) {
      setError("Selecciona una zona e ingresa tu dirección.");
      return;
    }

    if (!["YAPE", "PLIN", "EFECTIVO"].includes(form.metodoPago)) {
      setError("Selecciona un método de pago válido.");
      return;
    }

    setLoading(true);

    try {
      // Se conserva la clave para reutilizar el pedido si se reintenta.
      const storageKey = "checkoutIdempotencyKey";
      let claveIdempotencia =
        sessionStorage.getItem(storageKey);

      if (!claveIdempotencia) {
        claveIdempotencia = crypto.randomUUID();
        sessionStorage.setItem(
          storageKey,
          claveIdempotencia
        );
      }

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
          form.tipoEntrega === "DELIVERY"
            ? form.direccion.trim()
            : null,
        productos: cart.map((item) => ({
          productoId: Number(item.id),
          cantidad: item.quantity,
        })),
      };

      // 1. Crear o recuperar el pedido.
      const respuestaPedido = await fetch(
        `${API_URL}/api/pedidos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": claveIdempotencia,
          },
          body: JSON.stringify(payload),
        }
      );

      const pedido = await leerRespuesta(respuestaPedido);

      if (pedido.id == null) {
        throw new Error(
          "El servidor no devolvió el ID del pedido. Verifica el pedido antes de volver a intentarlo."
        );
      }

      // 2. Registrar el pago asociado al pedido creado.
      const respuestaPago = await fetch(
        `${API_URL}/api/pagos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pedidoId: pedido.id,
            metodo: form.metodoPago,
            referenciaOperacion: null,
          }),
        }
      );

      const pago = await leerRespuesta(respuestaPago);

      // 3. Mostrar la confirmación cuando ambas operaciones funcionen.
      setPedidoCreado(pedido);
      setPagoCreado(pago);
      clearCart();
      sessionStorage.removeItem(storageKey);
    } catch (err) {
      setError(
        err.message ||
          "No fue posible conectar con el servidor."
      );
    } finally {
      setLoading(false);
    }
  };

  if (pedidoCreado) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="success">
          <Typography fontWeight="bold">
            ¡Pedido registrado!
          </Typography>

          <Typography>
            Número de pedido:{" "}
            {pedidoCreado.numeroPedido || pedidoCreado.id}
          </Typography>

          <Typography>
            Total: S/{" "}
            {Number(pedidoCreado.total).toFixed(2)}
          </Typography>

          <Typography>
            Método de pago: {pagoCreado?.metodo || form.metodoPago}
          </Typography>

          <Typography>
            Estado del pago: {pagoCreado?.estado || "PENDIENTE"}
          </Typography>

          <Typography sx={{ mt: 1 }}>
            El pago queda pendiente de verificación. Esta
            confirmación no significa que Yape o Plin hayan
            procesado una transacción real.
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Finalizar compra
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {cart.length === 0 ? (
        <Alert severity="info">
          Tu carrito está vacío. Agrega productos antes de continuar.
        </Alert>
      ) : (
        <Stack
          component="form"
          onSubmit={enviarPedido}
          spacing={3}
        >
          <Typography variant="h6">
            Datos del cliente
          </Typography>

          <TextField
            label="Nombre completo"
            name="nombreCliente"
            value={form.nombreCliente}
            onChange={actualizar}
            required
            fullWidth
            inputProps={{ maxLength: 120 }}
          />

          <TextField
            label="Teléfono"
            name="telefonoCliente"
            value={form.telefonoCliente}
            onChange={actualizar}
            required
            fullWidth
            inputProps={{
              maxLength: 20,
              inputMode: "tel",
            }}
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
                    ? {
                        zonaDeliveryId: "",
                        direccion: "",
                      }
                    : {}),
                }));
              }}
            >
              <FormControlLabel
                value="DELIVERY"
                control={<Radio />}
                label="Delivery"
              />
              <FormControlLabel
                value="RECOJO"
                control={<Radio />}
                label="Recojo en local"
              />
            </RadioGroup>
          </FormControl>

          {form.tipoEntrega === "DELIVERY" && (
            <>
              
              <TextField
                select
                label="Zona de delivery"
                name="zonaDeliveryId"
                value={form.zonaDeliveryId}
                onChange={actualizar}
                required
                fullWidth
                disabled={cargandoZonas || zonasDelivery.length === 0}
                helperText={
                  cargandoZonas
                    ? "Cargando zonas disponibles..."
                    : errorZonas
                      ? errorZonas
                      : "Selecciona tu distrito y consulta su tarifa de envío."
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
                onChange={actualizar}
                required
                fullWidth
                inputProps={{ maxLength: 255 }}
              />
            </>
          )}

          <FormControl>
            <FormLabel>Método de pago</FormLabel>
            <RadioGroup
              name="metodoPago"
              value={form.metodoPago}
              onChange={actualizar}
            >
              <FormControlLabel
                value="EFECTIVO"
                control={<Radio />}
                label="Efectivo"
              />
              <FormControlLabel
                value="YAPE"
                control={<Radio />}
                label="Yape"
              />
              <FormControlLabel
                value="PLIN"
                control={<Radio />}
                label="Plin"
              />
            </RadioGroup>
          </FormControl>

          <Box
            sx={{
              p: 3,
              bgcolor: "background.paper",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Resumen de compra
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
                  {item.name} × {item.quantity}
                </Typography>

                <Typography>
                  S/{" "}
                  {(
                    Number(item.price) * item.quantity
                  ).toFixed(2)}
                </Typography>
              </Stack>
            ))}

            <Typography
              color="text.secondary"
              variant="body2"
            >
              Subtotal estimado: S/{" "}
              {Number(cartTotal).toFixed(2)}
            </Typography>

            <Typography
              color="text.secondary"
              variant="body2"
            >
              El total definitivo y el costo del delivery
              serán calculados por el servidor.
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || cart.length === 0}
          >
            {loading
              ? "Registrando pedido y pago..."
              : "Confirmar pedido"}
          </Button>
        </Stack>
      )}
    </Container>
  );
}
