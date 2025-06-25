import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect, useReducer, useState } from 'react';

const ventaAAnnadirReducer = (state, action) => {
  switch (action.type) {
    case 'cambiar_cliente':
      return {
        ...state,
        cliente: { ...state.cliente, nombreCliente: action.payload },
      };
    case 'cambiar_producto':
      return { ...state, idProducto: action.payload };
    case 'cambiar_cantidad':
      return { ...state, cantidad: action.payload };
    case 'cambiar_fecha':
      return { ...state, fechaVenta: action.payload };
    case 'cambiar_correo':
      return {
        ...state,
        cliente: { ...state.cliente, correo: action.payload },
      };
    case 'cambiar_telefono':
      return {
        ...state,
        cliente: { ...state.cliente, telefono: action.payload },
      };
  }
};

function ModalAnnadirVenta({ open, onClose, onCrear }) {
  const [ventaAAnnadir, dispatch] = useReducer(ventaAAnnadirReducer, {
    cliente: {
      nombreCliente: '',
      correo: '',
      telefono: '',
    },
    idProducto: '',
    cantidad: '',
    fechaVenta: '',
  });
  const [estaCreandoVenta, setEstaCreandoVenta] = useState(false);
  const [productos, setProductos] = useState([]);

  const obtenerProductos = async () => {
    const response = await fetch('/api/producto', {
      method: 'GET',
      credentials: 'include',
    });
    setProductos(await response.json());
  };

  const crearNuevaVenta = async () => {
    setEstaCreandoVenta(true);
    await fetch('api/venta', {
      method: 'POST',
      body: JSON.stringify({ ...ventaAAnnadir }),
    });
    onCrear();
    setEstaCreandoVenta(false);
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Añadir venta</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            label="Cliente"
            value={ventaAAnnadir.nombreCliente}
            onChange={(event) =>
              dispatch({ type: 'cambiar_cliente', payload: event.target.value })
            }
          />
          <TextField
            label="Correo"
            value={ventaAAnnadir.correo}
            onChange={(event) =>
              dispatch({ type: 'cambiar_correo', payload: event.target.value })
            }
          />
          <TextField
            label="Teléfono"
            value={ventaAAnnadir.telefono}
            onChange={(event) =>
              dispatch({
                type: 'cambiar_telefono',
                payload: event.target.value,
              })
            }
          />
          <FormControl fullWidth>
            <InputLabel id="seleccionar-producto-label">Producto</InputLabel>
            <Select
              id="seleccionar-producto"
              labelId="seleccionar-producto-label"
              label="Producto"
              value={ventaAAnnadir.idProducto}
              onChange={(event) => {
                dispatch({
                  type: 'cambiar_producto',
                  payload: event.target.value,
                });
              }}
            >
              {productos.map((producto) => (
                <MenuItem key={producto.idProducto} value={producto.idProducto}>
                  {producto.nombreProducto}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Cantidad"
            value={ventaAAnnadir.cantidad}
            onChange={(event) =>
              dispatch({
                type: 'cambiar_cantidad',
                payload: event.target.value,
              })
            }
          ></TextField>
        </Stack>
        <FormControl sx={{ marginTop: 4 }} fullWidth>
          <InputLabel id="seleccionar-fecha-label" shrink>
            Fecha de venta
          </InputLabel>
          <Input
            id="seleccionar-fecha"
            aria-labelledby="seleccionar-fecha-label"
            label="fecha"
            type="date"
            value={ventaAAnnadir.fechaVenta}
            onChange={(event) =>
              dispatch({
                type: 'cambiar_fecha',
                payload: event.target.value,
              })
            }
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={crearNuevaVenta}
          loading={estaCreandoVenta}
          variant="contained"
        >
          Añadir producto
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export { ModalAnnadirVenta };
