import { useRef } from 'react';
import { TextField, Button, Box } from '@mui/material';

function ButtonUploadImagen({ imagen, setImagen }) {
  const inputRef = useRef();

  const handleFileChange = (event) => {
    const imagen = event.target?.files[0];
    setImagen(imagen);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <Box display="flex" gap={1} alignItems="center">
      <Button variant="contained" onClick={handleClick} fullWidth>
        Seleccionar imagen
      </Button>
      <input ref={inputRef} type="file" hidden onChange={handleFileChange} />
      <TextField
        value={imagen?.name ?? ''}
        placeholder="Selecciona una imagen"
        variant="standard"
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        fullWidth
      />
    </Box>
  );
}

export { ButtonUploadImagen };
