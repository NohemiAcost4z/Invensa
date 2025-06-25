import { v4 as uuid } from 'uuid';
import { connection } from '../../../src/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { correo, contrasenia } = await req.json();

    const [usuario] = await connection.execute(
      'SELECT * FROM usuario WHERE Correo = ?',
      [correo]
    );

    const autorizado = await bcrypt.compare(
      contrasenia,
      usuario[0].Contrasenia
    );

    if (autorizado) {
      const tokenDeSesion = uuid();
      await connection.execute(
        'UPDATE usuario SET Session_Token = ? WHERE Correo = ?',
        [tokenDeSesion, correo]
      );

      const usuarioLogeado = {
        idUsuario: usuario[0].Id_Usuario,
        nombreVisible: usuario[0].Nombre_Visible,
        correo: usuario[0].Correo,
        codigo: usuario[0].Codigo,
        fotoPerfil: usuario[0].Foto_Perfil,
      };

      const response = NextResponse.json({
        usuario: usuarioLogeado,
      });
      response.cookies.set('sesion', tokenDeSesion, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60,
        path: '/',
      });

      return response;
    } else {
      return Response.json(
        { message: 'No se pudo iniciar sesión' },
        { status: 401 }
      );
    }
  } catch (err) {
    console.error(err);
    Response.json(
      { message: 'hubo un error tratando de iniciar sesion' },
      { status: 500 }
    );
  }
}
