import { useState, useEffect } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Switch,
  Container,
  Badge,
} from "@mui/material";

import { useTheme } from "../../context/ThemeContext";

import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import CartDrawer from "../Menu/CartDrawer";
import { useCart } from "../../context/CartContext";

const menuItems = [
  { label: "Inicio", id: "inicio" },
  { label: "Nosotros", id: "nosotros" },
  { label: "Menú", id: "menu" },
  { label: "Contacto", id: "contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const [scroll, setScroll] = useState(false);

  const { mode, toggleTheme } = useTheme();

  // Carrito
  const [cartOpen, setCartOpen] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navegación hacia las secciones
  const handleNavigation = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // Cerrar menú móvil
    setOpen(false);
  };

  return (
    <>
      <AppBar
        elevation={scroll ? 5 : 0}
        sx={{
          backgroundColor: scroll
            ? "background.paper"
            : "transparent",

          color: "text.primary",

          transition: "0.4s",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar>

            {/* Logo */}
            <Typography
              onClick={() => handleNavigation("inicio")}
              sx={{
                flexGrow: 1,
                fontWeight: "bold",
                color: scroll ? "text.primary" : "#fff",
                fontSize: 30,
                cursor: "pointer",
              }}
            >
              Leñas y Humos
            </Typography>

            {/* Menú escritorio */}
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
                alignItems: "center",
                gap: 2,
              }}
            >
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  sx={{
                    color: scroll ? "text.primary" : "#fff",

                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* Modo oscuro */}
              <Switch
                checked={mode === "dark"}
                onChange={toggleTheme}
              />

              {/* Carrito */}
              <IconButton
                onClick={() => setCartOpen(true)}
                sx={{
                  color: scroll ? "text.primary" : "#fff",
                  position: "relative",
                  transition: "color 0.3s ease",
                  "&:hover": {
                    color: "primary.main",}
                }}
              >
                <ShoppingCartOutlinedIcon />

                {cartCount > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      background: "#F57C00",
                      color: "#fff",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      fontSize: 12,
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {cartCount}
                  </Box>
                )}
              </IconButton>

              {/* Reservar 
              <Button
                variant="contained"
                onClick={() => handleNavigation("contacto")}
                sx={{
                  borderRadius: 10,
                  background: "#FF9800",
                  "&:hover": {
                    background: "#E65100",
                  },
                }}
              >
                Reservar
              </Button>*/}
            </Box>

            {/* Móvil */}
            <Box
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },
                alignItems: "center",
              }}
            >
              {/* Carrito móvil */}
              <IconButton
                onClick={() => setCartOpen(true)}
                sx={{
                  color: scroll ? "text.primary" : "#fff",
                  mr: 1,
                  transition: "color 0.3s ease",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                <Badge
                  badgeContent={cartCount}
                  color="warning"
                  overlap="circular"
                >
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>

              {/* Menú móvil */}
              <IconButton
                sx={{
                  color: scroll ? "text.primary" : "#fff",
                  transition: "color 0.3s ease",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
                onClick={() => setOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>

          </Toolbar>
        </Container>

        {/* Drawer menú móvil */}
        <Drawer
          anchor="right"
          open={open}
          onClose={() => setOpen(false)}
        >
          <Box
            sx={{
              width: 250,
            }}
          >
            <List>

              {menuItems.map((item) => (
                <ListItem
                  key={item.id}
                  disablePadding
                >
                  <ListItemButton
                    onClick={() => handleNavigation(item.id)}
                  >
                    <ListItemText
                      primary={item.label}
                    />
                  </ListItemButton>
                </ListItem>
              ))}

              {/* Switch */}
              <ListItem>
                <Switch
                  checked={mode === "dark"}
                  onChange={toggleTheme}
                />

                <ListItemText
                  primary="Modo oscuro"
                />
              </ListItem>

              {/* Carrito móvil */}
              <ListItem>
                <ListItemButton
                  onClick={() => {
                    setOpen(false);
                    setCartOpen(true);
                  }}
                >
                  <Badge
                    badgeContent={cartCount}
                    color="warning"
                    sx={{ mr: 2 }}
                  >
                    <ShoppingCartOutlinedIcon />
                  </Badge>

                  <ListItemText
                    primary="Mi carrito"
                  />
                </ListItemButton>
              </ListItem>

              {/* Reservar */}
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleNavigation("contacto")}
                  sx={{
                    background: "#FF9800",
                    "&:hover": {
                      background: "#E65100",
                    },
                  }}
                >
                  Reservar
                </Button>
              </ListItem>

            </List>
          </Box>
        </Drawer>
      </AppBar>

      {/* Carrito */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}