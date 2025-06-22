interface Route {
  label: string;
  href: string;
}

const rutasNavegables = (logeado: boolean): Route[] => [
  {
    label: 'Menú',
    href: '/',
  },
  ...(logeado
    ? [
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
      ]
    : [
        {
          label: 'Registrarse',
          href: '/registrarse',
        },
        {
          label: 'Iniciar sesión',
          href: '/inicio-sesion',
        },
      ]),
];

export { rutasNavegables };
