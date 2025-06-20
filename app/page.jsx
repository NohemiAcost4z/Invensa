import React from 'react';
import GeneralLayout from './layout';

export default async function HomePage() {
  const respuesta = await fetch('http://localhost:3000/api/productos');
  const productos = await respuesta.json();

  return (
    <GeneralLayout>
      <ul>
        {productos?.map(producto => (
          <li>
            <span>{producto.nombreProducto}</span>
          </li>
        ))}
      </ul>
    </GeneralLayout>
  );
}
