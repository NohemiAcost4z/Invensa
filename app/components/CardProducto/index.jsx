import { Delete, Edit, Warning } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Stock } from '../Stock';
import styles from './CardProducto.module.scss';
import { ModalEditarProducto } from '../ModalEditarProducto';
import { useState } from 'react';

function CardProducto({ producto, onEdit, onDelete }) {
  const [modalEditarProductoAbierto, setModalEditarProductoAbierto] =
    useState(false);

  const colombianPeso = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });

  const eliminarProducto = async (idProductoAEliminar) => {
    await fetch('api/productos', {
      method: 'DELETE',
      body: JSON.stringify({ idProducto: idProductoAEliminar }),
      credentials: 'include',
    });
    onDelete();
  };

  const handleModalClose = () => {
    setModalEditarProductoAbierto(false);
  };

  return (
    <>
      <Card className={styles.cardContainer} key={producto.codigo}>
        <CardContent className={styles.imageContainer}>
          <Box className={styles.topButtonsContainer}>
            <Box
              sx={{ display: 'flex', marginLeft: 1.5, alignItems: 'center' }}
              gap={1}
            >
              {producto.cantidadMinima && (
                <Tooltip
                  placement="top"
                  title={`El stock se está agotando, el stock mínimo es: ${producto.cantidadMinima}`}
                >
                  <Warning color="warning" sx={{ fontSize: 20 }} />
                </Tooltip>
              )}
              <Tooltip
                title={`${producto.nombreProducto[0].toUpperCase()}${producto.nombreProducto.slice(
                  1
                )}`}
                placement="top"
              >
                <Typography
                  className={styles.nombreProducto}
                  variant="h3"
                  fontSize={24}
                  color="white"
                >
                  {`${producto.nombreProducto[0].toUpperCase()}${producto.nombreProducto.slice(
                    1
                  )}`}
                </Typography>
              </Tooltip>
            </Box>
            <Box>
              <IconButton
                aria-label="Editar producto"
                onClick={() => setModalEditarProductoAbierto(true)}
              >
                <Tooltip title="Editar producto" placement="top">
                  <Edit sx={{ color: 'white', fontSize: 20 }} />
                </Tooltip>
              </IconButton>
              <IconButton
                aria-label="Borrar producto"
                onClick={() => eliminarProducto(producto.idProducto)}
              >
                <Tooltip title="Borrar producto" placement="top">
                  <Delete sx={{ color: 'white', fontSize: 20 }} />
                </Tooltip>
              </IconButton>
            </Box>
          </Box>
          <CardMedia
            image={`/api/imagenes/${producto.pathImagen}`}
            className={styles.imagenProducto}
            title={producto.nombreProducto}
          />
        </CardContent>
        <CardContent>
          <Stack spacing={1} divider={<Divider />}>
            <Typography fontWeight="bold" alignSelf="flex-end">
              {colombianPeso.format(producto.precio)}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Código:</Typography>
              <Typography> {producto.codigo}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Categoria:</Typography>
              <Typography>
                {`${producto.categoria[0].toUpperCase()}${producto.categoria.slice(
                  1
                )}`}
              </Typography>
            </Box>
            <Box sx={{ alignSelf: 'center' }}>
              <Stock
                stock={producto.cantidad}
                idProducto={producto.idProducto}
                onChange={() => onEdit()}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
      <ModalEditarProducto
        producto={producto}
        open={modalEditarProductoAbierto}
        onClose={handleModalClose}
        onEdit={onEdit}
      />
    </>
  );
}

export { CardProducto };
