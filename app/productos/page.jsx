'use client';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { CardProducto } from '../components/CardProducto';
import { LoggedInLayout } from '../components/layouts/LoggedInLayout';
import styles from './page.module.scss';
import { ExpandMore } from '@mui/icons-material';
import { ModalAnnadirProductos } from './components/ModalAnnadirProductos';

export default function ProductosPage() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);

  const [modalAnnadirProductosAbierto, setModalAnnadirProductosAbierto] =
    useState(false);

  const leerProductos = async () => {
    const response = await fetch('api/productos', {
      method: 'GET',
      credentials: 'include',
    });
    setProductos(await response.json());
  };

  const crearProducto = async (productoAAnnadir) => {
    const formData = new FormData();

    Object.keys(productoAAnnadir).map((key) =>
      formData.append(key, productoAAnnadir[key])
    );

    await fetch('api/productos', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    leerProductos();
    setModalAnnadirProductosAbierto(false);
  };
  const agregarCategoriaAlFiltro = (categoria) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(categoria)
        ? prev.filter((c) => c !== categoria)
        : [...prev, categoria]
    );
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    leerProductos();
  }, []);

  useEffect(() => {
    const categoriasActuales = [
      ...new Set(productos.map((producto) => producto.categoria)),
    ];
    setCategorias(categoriasActuales);
  }, [productos]);

  return (
    <LoggedInLayout>
      <Container>
        <Stack spacing={6}>
          <Box className={styles.titleContainer}>
            <Typography variant="h2">Productos</Typography>
            <Button
              variant="contained"
              onClick={() => setModalAnnadirProductosAbierto(true)}
            >
              Agregar Producto
            </Button>
          </Box>
          <Paper>
            <Container sx={{ paddingY: 4 }}>
              <Box sx={{ justifySelf: 'end', marginBottom: 2 }}>
                <Button
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  color={theme.palette.text.primary}
                  aria-label="Filtrar por categorías"
                  aria-controls="menu-categorias"
                  aria-haspopup="true"
                  edge="start"
                  sx={{ mr: 2 }}
                >
                  Filtrar por categorías
                  <ExpandMore />
                </Button>
                <Menu
                  id="menu-categorias"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {categorias.map((categoria) => (
                    <MenuItem
                      key={categoria}
                      onClick={() => agregarCategoriaAlFiltro(categoria)}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={categoriasSeleccionadas.includes(
                              categoria
                            )}
                          />
                        }
                        label={categoria}
                        sx={{
                          pointerEvents: 'none',
                          '&:hover': {
                            backgroundColor: 'transparent',
                          },
                        }}
                      />
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <Grid container columns={3} spacing={4} direction="row">
                {productos
                  .filter(
                    (producto) =>
                      categoriasSeleccionadas.length === 0 ||
                      categoriasSeleccionadas.includes(producto.categoria)
                  )
                  .map((producto) => (
                    <CardProducto
                      key={producto.idProducto}
                      producto={producto}
                      onDelete={() => leerProductos()}
                      onEdit={() => leerProductos()}
                    />
                  ))}
              </Grid>
            </Container>
          </Paper>
        </Stack>
      </Container>
      <ModalAnnadirProductos
        open={modalAnnadirProductosAbierto}
        onClose={() => setModalAnnadirProductosAbierto(false)}
        onCrearProducto={crearProducto}
      />
    </LoggedInLayout>
  );
}
