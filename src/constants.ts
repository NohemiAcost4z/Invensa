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
          label: 'Ventas',
          href: '/ventas',
        },
        {
          label: 'Alertas',
          href: '/alertas-de-stock',
        },
        {
          label: 'Movimientos',
          href: '/movimientos',
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
