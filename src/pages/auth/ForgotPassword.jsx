
import { Link } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";

export default function ForgotPassword() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Recuperar contraseña
        </Typography>

        <Typography color="text.secondary">
          La recuperación de cuentas estará disponible cuando
          conectemos el servicio de autenticación.
        </Typography>

        <Button component={Link} to="/login" sx={{ mt: 3 }}>
          Volver al inicio de sesión
        </Button>
      </Box>
    </Container>
  );
}
