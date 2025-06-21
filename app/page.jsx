import React from 'react';
import { NavBarLayout } from './components/layouts/NavBarLayout';

export default async function HomePage() {
  const respuesta = await fetch('http://localhost:3000/api/productos');
  const productos = await respuesta.json();

  return (
    <NavBarLayout>
      <ul>
        {productos?.map(producto => (
          <li key={producto.idProducto}>
            <span>{producto.nombreProducto}</span>
          </li>
        ))}
      </ul>
    </NavBarLayout>
  );
};
