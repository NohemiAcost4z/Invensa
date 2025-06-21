interface Route {
  label: string;
  href: string;
}

const rutasNavegables: Route[]  = [
  {
    label: 'Menú',
    href: '/',
  },
  {
    label: 'Registrarse',
    href: '/registrarse',
  },
  {
    label: 'Iniciar sesión',
    href: '/inicio-sesion',
  },
  {
    label: 'Productos',
    href: '/productos',
  },
  {
    label: 'Compras',
    href: '/compras',
  },
  {
    label: 'Ventas',
    href: '/ventas',
  },
  {
    label: 'Movimientos',
    href: '/movimientos',
  },
  {
    label: 'Facturas',
    href: '/facturas',
  },
];

export {
  rutasNavegables,
};
