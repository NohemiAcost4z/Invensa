import { NavBarLayout } from './components/layouts/NavBarLayout';
import { Typography } from '@mui/material';

export default async function HomePage() {
  return (
    <NavBarLayout>
      <Typography variant="h1">Invensa gestión</Typography>
    </NavBarLayout>
  );
}
