import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';

function SelectProducto({ value, onChange }) {
  const [productos, setProductos] = useState([]);

  const obtenerProductos = async () => {
    const response = await fetch('/api/productos', {
      method: 'GET',
      credentials: 'include',
    });
    setProductos(await response.json());
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel id="seleccionar-producto-label">Producto</InputLabel>
      <Select
        id="seleccionar-producto"
        labelId="seleccionar-producto-label"
        label="Producto"
        value={value}
        onChange={onChange}
      >
        {productos.map((producto) => (
          <MenuItem key={producto.idProducto} value={producto.idProducto}>
            {producto.nombreProducto}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export { SelectProducto };
