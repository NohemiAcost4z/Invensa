import { useReducer, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  FormHelperText,
  Input,
  Stack,
  TextField,
} from '@mui/material';
import styles from './ModalAnnadirProductos.module.scss';

const reducerProducto = (state, action) => {
  switch (action.type) {
    case 'cambiar_nombre':
      return { ...state, nombreProducto: action.payload };
    case 'cambiar_codigo':
      return { ...state, codigoProducto: action.payload };
    case 'cambiar_categoria':
      return { ...state, categoriaProducto: action.payload };
    case 'cambiar_precio':
      return { ...state, precioProducto: action.payload };
    case 'cambiar_cantidad':
      return { ...state, cantidadProducto: action.payload };
    case 'annadir_imagen':
      return { ...state, imagenProducto: action.payload };
  }
};

const ModalAnnadirProductos = ({ open, onClose, onCrearProducto }) => {
  const [estaCreandoProducto, setEstaCreandoProducto] = useState(false);
  const [productoAAnnadir, dispatch] = useReducer(reducerProducto, {
    nombreProducto: '',
    codigoProducto: '',
    categoriaProducto: '',
    precioProducto: '',
    cantidadProducto: '',
    imagenProducto: null,
  });

  const crearNuevoProducto = async () => {
    setEstaCreandoProducto(true);
    onCrearProducto(productoAAnnadir);
    setEstaCreandoProducto(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Añadir nuevo producto</DialogTitle>
      <Stack spacing={2} className={styles.container}>
        <TextField
          label="Nombre"
          value={productoAAnnadir.nombreProducto}
          onChange={(event) =>
            dispatch({
              type: 'cambiar_nombre',
              payload: event.target.value,
            })
          }
        />
        <TextField
          label="Código"
          value={productoAAnnadir.codigoProducto}
          onChange={(event) =>
            dispatch({
              type: 'cambiar_codigo',
              payload: event.target.value,
            })
          }
        />
        <TextField
          value={productoAAnnadir.categoriaProducto}
          label="Categoria"
          onChange={(event) =>
            dispatch({
              type: 'cambiar_categoria',
              payload: event.target.value,
            })
          }
        />
        <TextField
          label="Precio"
          type="number"
          value={productoAAnnadir.precioProducto}
          onChange={(event) =>
            dispatch({
              type: 'cambiar_precio',
              payload: event.target.value,
            })
          }
        />
        <TextField
          label="Cantidad"
          type="number"
          value={productoAAnnadir.cantidadProducto}
          onChange={(event) =>
            dispatch({
              type: 'cambiar_cantidad',
              payload: event.target.value,
            })
          }
        />
        <FormControl>
          <Input
            type="file"
            accept="image/*"
            aria-describedby="texto-seleccionador-imagen"
            onChange={(event) =>
              dispatch({
                type: 'annadir_imagen',
                payload: event.target.files[0],
              })
            }
          />
          <FormHelperText id="texto-seleccionador-imagen">
            Selecciona la imagen de tu producto
          </FormHelperText>
        </FormControl>
        <Button
          variant="contained"
          onClick={crearNuevoProducto}
          loading={estaCreandoProducto}
        >
          Añadir producto
        </Button>
      </Stack>
    </Dialog>
  );
};

export { ModalAnnadirProductos };
