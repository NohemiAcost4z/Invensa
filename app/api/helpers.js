import { cookies } from 'next/headers';
import { connection } from '../../src/lib/db';

async function getUsuarioLogedo() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get('sesion')?.value;

  const [resultadoUsuario] = await connection.execute(
    'SELECT * FROM usuario WHERE Session_Token = ?',
    [token ?? null]
  );

  return resultadoUsuario[0];
}

export { getUsuarioLogedo };
