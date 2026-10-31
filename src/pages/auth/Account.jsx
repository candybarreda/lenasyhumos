
import { Box, Container, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function Account() {
  const { user } = useAuth();

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Mi cuenta
        </Typography>

        <Typography color="text.secondary">
          Bienvenido, {user?.name || user?.email || "cliente"}.
        </Typography>
      </Box>
    </Container>
  );
}
