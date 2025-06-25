import { v4 as uuid } from 'uuid';
import { connection } from '../../../src/lib/db';
import { crearActualizacion } from '../helpers';
import { withSession } from '../../../src/lib/utils';

export const POST = withSession(async (req, usuario) => {
  try {
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

    const [producto] = await connection.execute(
      'SELECT Cantidad FROM producto WHERE Id_Producto = ?',
      [body.idProducto]
    );

    await connection.beginTransaction();

    await connection.execute(
      'INSERT INTO alertastock VALUES (?, ?, ?, ?, NULL, "Atendida", TRUE)',
      [idAlerta, body.idProducto, usuario.idUsuario, body.cantidadMinima]
    );

    await crearActualizacion({
      idAlerta,
      idUsuario: usuario.idUsuario,
      idProducto: body.idProducto,
      cantidad: producto[0].Cantidad,
      tipo: 'Creación de una alerta',
    });
    await connection.commit();
    return Response.json({ message: 'Alerta creada' }, { status: 200 });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    return Response.json(
      { message: 'No se pudo crear la alerta' },
      { status: 500 }
    );
  }
});
