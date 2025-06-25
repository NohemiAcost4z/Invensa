import { useRouter } from 'next/navigation';
import { useEstadoApp } from '../../../context/EstadoAppContext';
import { useEffect } from 'react';

function LoggedInLayout({ children }) {
  const router = useRouter();
  const { usuario, setUsuario } = useEstadoApp();

  useEffect(() => {
    fetch('api/sesion').then(async (res) => {
      const usuario = await res.json();
      setUsuario(usuario);
    });
  }, [setUsuario]);

  useEffect(() => {
    if (usuario === undefined) return;

    if (!usuario?.idUsuario) {
      router.push('/');
    }
  }, [router, usuario, usuario?.idUsuario]);

  return usuario?.idUsuario ? <>{children}</> : null;
}

export { LoggedInLayout };
