import { cookies } from 'next/headers';
import { connection } from '../../../src/lib/db';

export async function GET() {
  const token = (await cookies()).get('sesion')?.value;

  if (!token) {
    return Response.json({ logeado: false });
  }

  const [resultado] = await connection.execute(
    'SELECT * FROM usuario WHERE Session_Token = ?',
    [token]
  );

  if (!resultado[0]) {
    return Response.json({ logeado: false });
  }

  const usuario = resultado[0];

  const response = {
    idUsuario: usuario.Id_Usuario,
    nombreVisible: usuario.Nombre_Visible,
    correo: usuario.Correo,
    codigo: usuario.Codigo,
    fotoPerfil: usuario.Foto_Perfil,
  };

  return Response.json(response);
}
