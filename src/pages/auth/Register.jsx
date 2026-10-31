
import { Link } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";

export default function Register() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Crear cuenta
        </Typography>

        <Typography color="text.secondary">
          Próximamente podrás registrarte como cliente.
        </Typography>

        <Button component={Link} to="/login" sx={{ mt: 3 }}>
          Ya tengo una cuenta
        </Button>
      </Box>
    </Container>
  );
}
