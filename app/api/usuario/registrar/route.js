import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { connection } from '../../../../src/lib/db';

const SALT_STEPS = 10;

export async function POST(req) {
  try {
    const data = await req.json();

    const idUsuario = uuid();
    const hashContrasenia = await bcrypt.hash(data.contrasenia, SALT_STEPS);

    await connection.execute(
      'INSERT INTO usuario (Id_Usuario, Nombre_Visible, Correo, Contrasenia) VALUES (?, ?, ?, ?)',
      [idUsuario, data.nombreUsuario, data.correo, hashContrasenia]
    );
    return Response.json(
      { message: 'creación del usuario exitosa' },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: 'la creación del usuario falló' },
      { status: 500 }
    );
  }
}
