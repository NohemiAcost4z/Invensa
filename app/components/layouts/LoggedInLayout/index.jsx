import { useRouter } from 'next/navigation';
import { useEstadoApp } from '../../../context/EstadoAppContext';
import { useEffect } from 'react';

function LoggedInLayout({ children }) {
  const router = useRouter();
  const { usuario } = useEstadoApp();

  useEffect(() => {
    if (usuario === undefined) return;

    if (!usuario?.idUsuario) {
      router.push('/');
    }
  }, [router, usuario, usuario?.idUsuario]);

  return usuario?.idUsuario ? <>{children}</> : null;
}

export { LoggedInLayout };
