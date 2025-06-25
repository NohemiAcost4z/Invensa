import { FormControl, Input, InputLabel } from '@mui/material';

function DateSelector({ fecha, onChange, marginTop }) {
  return (
    <FormControl sx={{ marginTop }} fullWidth>
      <InputLabel id="seleccionar-fecha-label" shrink>
        Fecha de venta
      </InputLabel>
      <Input
        id="seleccionar-fecha"
        aria-labelledby="seleccionar-fecha-label"
        label="fecha"
        type="date"
        value={fecha}
        onChange={onChange}
      />
    </FormControl>
  );
}

export { DateSelector };
