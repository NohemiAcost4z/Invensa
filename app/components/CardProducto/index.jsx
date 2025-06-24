import { Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  IconButton,
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

  const colombianPeso = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'COP',
  });

  const eliminarProducto = async (idProductoAEliminar) => {
    await fetch('http://localhost:3000/api/producto', {
      method: 'DELETE',
      body: JSON.stringify({ idProducto: idProductoAEliminar }),
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
            <IconButton
              aria-label="Borrar producto"
              onClick={() => eliminarProducto(producto.idProducto)}
            >
              <Tooltip title="Borrar producto" placement="top">
                <Delete sx={{ color: 'grey' }} />
              </Tooltip>
            </IconButton>
            <IconButton
              aria-label="Editar producto"
              onClick={() => setModalEditarProductoAbierto(true)}
            >
              <Tooltip title="Editar producto" placement="top">
                <Edit sx={{ color: 'grey' }} />
              </Tooltip>
            </IconButton>
          </Box>
          <CardMedia
            image={`/api/imagenes/${producto.pathImagen}`}
            className={styles.imagenProducto}
            title={producto.nombreProducto}
          />
        </CardContent>
        <CardContent>
          <Container className={styles.contentContainer}>
            <Typography variant="h3" fontSize={34}>
              {`${producto.nombreProducto[0].toUpperCase()}${producto.nombreProducto.slice(
                1
              )}`}
            </Typography>
            <Typography fontWeight="bold" alignSelf="flex-end">
              {colombianPeso.format(producto.precio)}
            </Typography>
          </Container>
          <Container>
            <Typography fontSize={18}>Código: {producto.codigo}</Typography>
            <Typography fontSize={18}>
              Categoria:{' '}
              {`${producto.categoria[0].toUpperCase()}${producto.categoria.slice(
                1
              )}`}
            </Typography>
            <Stock stock={producto.cantidad} idProducto={producto.idProducto} />
          </Container>
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
