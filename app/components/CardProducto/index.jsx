import { Delete } from '@mui/icons-material';
import {
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

function CardProducto({ producto, onDelete }) {
  const colombianPeso = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'COP',
  });

  const eliminarProducto = async (idProductoAEliminar) => {
    await fetch('http://localhost:3000/api/productos', {
      method: 'DELETE',
      body: JSON.stringify({ idProducto: idProductoAEliminar }),
    });
    onDelete();
  };

  return (
    <Card className={styles.cardContainer} key={producto.codigo}>
      <CardContent className={styles.imageContainer}>
        <IconButton
          className={styles.deleteButtonContainer}
          aria-label="borrar producto"
          onClick={() => eliminarProducto(producto.idProducto)}
        >
          <Tooltip title="borrar producto" placement="top">
            <Delete />
          </Tooltip>
        </IconButton>
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
          <Stock stock={producto.cantidad} idProducto={producto.idProducto} />
        </Container>
      </CardContent>
    </Card>
  );
}

export { CardProducto };
