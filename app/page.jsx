'use client';

import { useRouter } from 'next/navigation';
import { HomePageComponent } from './components/HomePage';
import { useEstadoApp } from './context/EstadoAppContext';

export default function HomePage() {
  const { usuario } = useEstadoApp();
  const router = useRouter();

  if (usuario && usuario.idUsuario) {
    return router.push('/productos');
  }

  return <HomePageComponent />;
}
