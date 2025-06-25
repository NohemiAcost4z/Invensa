import { v4 as uuid } from 'uuid';
import { connection } from '../../../src/lib/db';
import { getUsuarioLogedo } from '../helpers';

export async function POST(req) {
  try {
    const usuario = await getUsuarioLogedo();

    if (!usuario) {
      return Response.json(
        { message: 'no puedes modificar este recurso' },
        { status: 403 }
      );
    }

    const body = await req.json();

    const idAlerta = uuid();

    const [alertaPrevia] = await connection.execute(
      'SELECT Id_Alerta FROM alertastock WHERE Id_Producto = ?',
      [body.idProducto]
    );

    if (!!alertaPrevia[0]) {
      return (
        Response,
        Response.json(
          { message: 'ya existe una alerta para este producto' },
          { status: 409 }
        )
      );
    }

    await connection.execute(
      'INSERT INTO alertastock VALUES (?, ?, ?, ?, NULL, "Atendida")',
      [idAlerta, body.idProducto, usuario.idUsuario, body.cantidadMinima]
    );
    return Response.json({ message: 'Alerta creada' }, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: 'No se pudo crear la alerta' },
      { status: 500 }
    );
  }
}
