
import { Link } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";

export default function Login() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Bienvenido de nuevo
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Inicia sesión en tu cuenta de Leñas y Humos.
        </Typography>

        <Typography color="text.secondary">
          El servicio de autenticación estará disponible próximamente.
        </Typography>

        <Button component={Link} to="/registro" sx={{ mt: 3 }}>
          Crear una cuenta
        </Button>
      </Box>
    </Container>
  );
}
