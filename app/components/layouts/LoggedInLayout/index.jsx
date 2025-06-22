import { redirect } from 'next/navigation';
import { useEstadoApp } from '../../../context/EstadoAppContext';

function LoggedInLayout({ children }) {
  const { usuario } = useEstadoApp();

  if (!usuario?.idUsuario) {
    redirect('/');
  }

  return <>{children}</>;
}

export { LoggedInLayout };
