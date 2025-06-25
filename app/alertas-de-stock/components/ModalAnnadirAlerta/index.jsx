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
} from '@mui/material';
import { SelectProducto } from '../../../components/SelectProducto';
import { useReducer, useState } from 'react';
import styles from './ModalAnnadirAlerta.module.scss';

function alertaAAnnadirReducer(state, action) {
  switch (action.type) {
    case 'seleccionar-producto':
      return { ...state, idProducto: action.payload };
    case 'cambiar-cantidad-minima':
      return { ...state, cantidadMinima: action.payload };
  }
}

function ModalAnnadirAlerta({ open, onClose, onCrear }) {
  const [error, setError] = useState('');
  const [notificando, setNotificando] = useState('');
  const [estaCreandoAlerta, setEstaCreandoAlerta] = useState(false);
  const [alertaAAnnadir, dispatch] = useReducer(alertaAAnnadirReducer, {
    idProducto: '',
    cantidadMinima: 0,
  });

  const crearAlerta = async (alertaAAnnadir) => {
    setEstaCreandoAlerta(true);
    const response = await fetch('api/alertas', {
      method: 'POST',
      body: JSON.stringify(alertaAAnnadir),
      credentials: 'include',
    });
    if (!response.ok) {
      setEstaCreandoAlerta(false);
      const error = await response.json();
      setNotificando(true);
      setError(error.message);
      return;
    }
    setEstaCreandoAlerta(false);
    onCrear();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Agregar alerta</DialogTitle>
      <DialogContent>
        <Stack spacing={2} paddingTop={1}>
          <SelectProducto
            value={alertaAAnnadir.idProducto}
            onChange={(event) =>
              dispatch({
                type: 'seleccionar-producto',
                payload: event.target.value,
              })
            }
          />
          <TextField
            inputMode="numeric"
            type="number"
            slotProps={{ htmlInput: { className: styles.stockInput } }}
            value={alertaAAnnadir.cantidadMinima}
            onChange={(event) =>
              dispatch({
                type: 'cambiar-cantidad-minima',
                payload: event.target.value,
              })
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={() => crearAlerta(alertaAAnnadir)}
          loading={estaCreandoAlerta}
          variant="contained"
        >
          Añadir producto
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

export { ModalAnnadirAlerta };
