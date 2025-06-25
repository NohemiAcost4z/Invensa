'use client';
import { useRef, useState } from 'react';
import { Container, IconButton, TextField, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import styles from './Stock.module.scss';

function Stock({ stock, idProducto, onChange }) {
  const [stockInterno, setStockInterno] = useState(stock);

  const stockRef = useRef(null);

  const updateStock = async (stock, idProducto) => {
    const response = await fetch('api/productos/actualizarStock', {
      method: 'PATCH',
      body: JSON.stringify({ stock: +stock, idProducto }),
      credentials: 'include',
    });
    const newStock = (await response.json()) ?? stock;
    setStockInterno(newStock.stock);
    onChange();
  };

  return (
    <Container className={styles.stockContainer}>
      <Typography fontSize={18}>Stock:</Typography>
      <IconButton
        aria-label="quitar stock"
        onClick={() => updateStock(stockInterno - 1, idProducto)}
        size="small"
      >
        <Remove />
      </IconButton>
      <TextField
        slotProps={{ htmlInput: { className: styles.stockInput } }}
        variant="standard"
        value={stockInterno}
        inputMode="numeric"
        type="number"
        inputRef={stockRef}
        onChange={(event) => setStockInterno(event.target.value)}
        onBlur={(event) => updateStock(event.target.value, idProducto)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            stockRef.current?.blur();
          }
        }}
      />
      <IconButton
        aria-label="añadir stock"
        size="small"
        onClick={() => updateStock(stockInterno + 1, idProducto)}
      >
        <Add />
      </IconButton>
    </Container>
  );
}

export { Stock };
