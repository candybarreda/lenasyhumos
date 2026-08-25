import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

import heroImage from "./hero.jpg";
import cartaPdf from "../../assets/pdf/carta.pdf";

import { useTheme } from "../../context/ThemeContext";

const Hero = () => {
  const { mode } = useTheme();

  const whatsappMenuUrl =
    "https://wa.me/51936995196?text=Hola%2C%20quisiera%20recibir%20la%20carta%20de%20Le%C3%B1as%20y%20Humos%20%F0%9F%94%A5%F0%9F%8D%96";

  const handleGoToMenu = () => {
    const menuSection = document.getElementById("menu");

    if (menuSection) {
      menuSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const isDark = mode === "dark";

  return (
    <Box
      id="inicio"
      sx={{
        minHeight: "100vh",

        position: "relative",

        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",

        display: "flex",
        alignItems: "center",

        overflow: "hidden",

        "&::before": {
          content: '""',

          position: "absolute",
          inset: 0,

          background: isDark
            ? "linear-gradient(90deg, rgba(0,0,0,.82) 0%, rgba(0,0,0,.65) 50%, rgba(0,0,0,.45) 100%)"
            : "linear-gradient(90deg, rgba(34,34,34,.68) 0%, rgba(34,34,34,.48) 50%, rgba(34,34,34,.30) 100%)",

          transition: "background 0.5s ease",
        },

        transition: "background-color 0.5s ease",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* TÍTULO */}
          <Typography
            sx={{
              color: isDark ? "#F7F2EB" : "#FBF9F5",

              mt: 3,

              maxWidth: 650,

              fontSize: {
                xs: "2.5rem",
                sm: "3.5rem",
                md: "4rem",
              },

              fontWeight: 800,

              letterSpacing: "1px",

              textShadow: isDark
                ? "0 4px 15px rgba(0,0,0,.7)"
                : "0 3px 12px rgba(0,0,0,.5)",

              transition: "color 0.4s ease",
            }}
          >
            LEÑAS Y HUMOS
          </Typography>

          {/* SUBTÍTULO */}
          <Typography
            sx={{
              color: isDark ? "#D8CCBB" : "#F4E8DB",

              mt: 3,

              maxWidth: 600,

              fontSize: {
                xs: "1rem",
                md: "1.2rem",
              },

              fontWeight: 500,

              transition: "color 0.4s ease",
            }}
          >
            El auténtico sabor cocinado al fuego
          </Typography>

          {/* DESCRIPCIÓN */}
          <Typography
            sx={{
              color: isDark ? "#BDB7AE" : "#E5DCCE",

              mt: 2,

              maxWidth: 600,

              fontSize: "1.05rem",

              lineHeight: 1.7,

              transition: "color 0.4s ease",
            }}
          >
            Disfruta del mejor Chancho al Cilindro y Pollo al Cilindro,
            preparados lentamente con el auténtico sabor peruano.
          </Typography>

          {/* BOTONES */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            mt={5}
          >
            {/* VER MENÚ */}
            <Button
              variant="contained"
              onClick={handleGoToMenu}
              size="large"
              sx={{
                backgroundColor: isDark
                  ? "#B8733C"
                  : "#9B5E2C",

                color: "#FFFFFF",

                borderRadius: 3,

                px: 4,
                py: 1.5,

                fontWeight: 600,

                boxShadow: isDark
                  ? "0 6px 25px rgba(0,0,0,.5)"
                  : "0 6px 20px rgba(0,0,0,.25)",

                "&:hover": {
                  backgroundColor: isDark
                    ? "#9B5E2C"
                    : "#7D4A23",

                  transform: "translateY(-2px)",

                  boxShadow: "0 8px 25px rgba(0,0,0,.35)",
                },

                transition: "all 0.3s ease",
              }}
            >
              Ver Menú
            </Button>

            {/* VER CARTA */}
            <Button
              variant="outlined"
              size="large"
              href={cartaPdf}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#FBF9F5",

                borderColor: isDark
                  ? "#D8CCBB"
                  : "#F7F2EB",

                borderWidth: 1.5,

                borderRadius: 3,

                px: 4,
                py: 1.5,

                fontWeight: 600,

                backgroundColor: isDark
                  ? "rgba(255,255,255,.04)"
                  : "rgba(255,255,255,.08)",

                backdropFilter: "blur(6px)",

                "&:hover": {
                  borderColor: "#9B5E2C",

                  color: "#FFFFFF",

                  backgroundColor: "rgba(155,94,44,.35)",

                  borderWidth: 1.5,
                },

                transition: "all 0.3s ease",
              }}
            >
              Ver carta
            </Button>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Hero;