import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ButtonUploadImagen } from '../ButtonUploadImagen';
import { useEffect, useReducer, useState } from 'react';

const editarProductoReducer = (state, action) => {
  switch (action.type) {
    case 'cambiar_nombre':
      return {
        ...state,
        nombre: action.payload,
      };
    case 'cambiar_precio':
      return {
        ...state,
        precio: action.payload,
      };
    case 'cambiar_codigo':
      return {
        ...state,
        codigo: action.payload,
      };
    case 'cambiar_categoria':
      return {
        ...state,
        categoria: action.payload,
      };
    case 'cambiar_imagen':
      return {
        ...state,
        imagen: action.payload,
      };
  }
};

function ModalEditarProducto({ open, producto, onEdit, onClose }) {
  const [error, setError] = useState('');
  const [notificando, setNotificando] = useState('');
  const [productoEditando, dispatch] = useReducer(editarProductoReducer, {
    nombre: '',
    precio: '',
    codigo: '',
    categoria: '',
    imagen: null,
  });

  const editarProducto = async ({ idProducto, productoEditando }) => {
    const formData = new FormData();
    formData.append('idProducto', idProducto);
    Object.keys(productoEditando).map((key) =>
      formData.append(key, productoEditando[key])
    );
    const response = await fetch('api/productos', {
      method: 'PATCH',
      body: formData,
      credentials: 'include',
    });
    if (!response.ok) {
      setEstaCreandoAlerta(false);
      const error = await response.json();
      setNotificando(true);
      setError(error.message);
      return;
    }
    onEdit();
    onClose();
  };

  useEffect(() => {
    if (producto) {
      dispatch({ type: 'cambiar_nombre', payload: producto?.nombreProducto });
      dispatch({ type: 'cambiar_precio', payload: producto?.precio });
      dispatch({ type: 'cambiar_codigo', payload: producto?.codigo });
      dispatch({ type: 'cambiar_categoria', payload: producto?.categoria });
    }
  }, [producto]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar producto</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ paddingY: 1 }}>
          <TextField
            label="Nombre"
            value={productoEditando.nombre}
            onChange={(event) =>
              dispatch({ type: 'cambiar_nombre', payload: event.target.value })
            }
          />
          <TextField
            label="Precio"
            value={productoEditando.precio}
            onChange={(event) =>
              dispatch({ type: 'cambiar_precio', payload: event.target.value })
            }
          />
          <TextField
            label="Código"
            value={productoEditando.codigo}
            onChange={(event) =>
              dispatch({ type: 'cambiar_codigo', payload: event.target.value })
            }
          />
          <TextField
            label="Categoría"
            value={productoEditando.categoria}
            onChange={(event) =>
              dispatch({
                type: 'cambiar_categoria',
                payload: event.target.value,
              })
            }
          />
          <Typography variant="h6" fontSize={16}>
            Imagen del producto
          </Typography>
          <ButtonUploadImagen
            imagen={productoEditando.imagen}
            setImagen={(image) =>
              dispatch({ type: 'cambiar_imagen', payload: image })
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={() =>
            editarProducto({
              idProducto: producto.idProducto,
              productoEditando,
            })
          }
          variant="outlined"
        >
          Completar
        </Button>
      </DialogActions>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={notificando}
        autoHideDuration={5000}
        onClose={() => setNotificando(false)}
      >
        <Alert
          onClose={() => setNotificando(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export { ModalEditarProducto };
