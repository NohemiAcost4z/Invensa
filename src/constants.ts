interface Route {
  label: string;
  href: string;
}

const rutasNavegables = (logeado: boolean): Route[] => [
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
          label: 'Iniciar sesión',
          href: '/',
        },
        {
          label: 'Registrarse',
          href: '/registrarse',
        },
      ]),
];

export { rutasNavegables };
