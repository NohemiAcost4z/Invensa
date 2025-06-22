'use client';
import { Button, Grid, Typography } from '@mui/material';
import { NavBarLayout } from '../components/layouts/NavBarLayout';
import { ModalAnnadirProductos } from '../components/ModalAnnadirProductos';
import { useEffect, useState } from 'react';
import { CardProducto } from '../components/CardProducto';
import { LoggedInLayout } from '../components/layouts/LoggedInLayout';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);

  const [modalAnnadirProductosAbierto, setModalAnnadirProductosAbierto] =
    useState(false);

  const leerProductos = async () => {
    const response = await fetch('http://localhost:3000/api/productos', {
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

    await fetch('http://localhost:3000/api/productos', {
      method: 'POST',
      body: formData,
    });
    leerProductos();
    setModalAnnadirProductosAbierto(false);
  };

  useEffect(() => {
    leerProductos();
  }, []);

  return (
    <NavBarLayout>
      <LoggedInLayout>
        <Typography variant="h2">Productos</Typography>
        <Button
          variant="contained"
          onClick={() => setModalAnnadirProductosAbierto(true)}
        >
          Agregar Producto
        </Button>
        <Grid container columns={3} spacing={4} direction="row">
          {productos.map((producto) => (
            <CardProducto
              key={producto.idProducto}
              producto={producto}
              onDelete={() => leerProductos()}
            />
          ))}
        </Grid>
        <ModalAnnadirProductos
          open={modalAnnadirProductosAbierto}
          onClose={() => setModalAnnadirProductosAbierto(false)}
          onCrearProducto={crearProducto}
        />
      </LoggedInLayout>
    </NavBarLayout>
  );
}
