import { cookies } from 'next/headers';
import { connection } from './db';

const verificarTokenEnBaseDeDatos = async (token) => {
  const [usuario] = await connection.execute(
    'SELECT Id_Usuario, Nombre_Visible, Correo, Foto_Perfil FROM usuario WHERE Session_Token = ?',
    [token]
  );

  return usuario[0] ? usuario[0] : null;
};

export function withSession(handler) {
  return async function wrappedHandler(request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('sesion')?.value;

    if (!token) {
      return Response.json(
        {
          message:
            'No tienes acceso a este recurso por que no estas autenticado',
        },
        { status: 401 }
      );
    }

    const sesionValida = await verificarTokenEnBaseDeDatos(token);
    const usuario = {
      idUsuario: sesionValida.Id_Usuario,
      nombreVisible: sesionValida.Nombre_Visible,
      correo: sesionValida.Correo,
      fotoPerfil: sesionValida.Foto_Perfil,
    };

    if (!sesionValida) {
      return Response.json(
        {
          message:
            'No tienes acceso a este recurso por que no estas autenticado',
        },
        { status: 401 }
      );
    }

    const response = await handler(request, usuario);

    response.headers.append(
      'Set-Cookie',
      `sesion=${token}; Path=/; HttpOnly; Max-Age=${60 * 60}; SameSite=Lax`
    );

    return response;
  };
}
