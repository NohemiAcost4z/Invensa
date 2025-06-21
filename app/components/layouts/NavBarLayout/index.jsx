import { rutasNavegables } from '../../../../src/constants';
import { AppBar, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';

function NavBarLayout({ children }) {
  const rutas = rutasNavegables;

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          {rutas.map(ruta => (
            <Typography key={ruta.href}>
              <Link href={ruta.href}>{ruta.label}</Link>
            </Typography>
              
          ))}
        </Toolbar>
      </AppBar>
      {children}
    </>

  )
}

export { NavBarLayout };