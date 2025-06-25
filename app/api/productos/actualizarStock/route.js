import { connection } from '../../../../src/lib/db';

export async function PATCH(req) {
  try {
    const data = await req.json();

    connection.execute(
      `UPDATE \`producto\` SET \`Cantidad\` = ${data.stock} WHERE \`Id_Producto\` = "${data.idProducto}"`
    );

    return Response.json(
      { message: 'Stock actualizado', stock: data.stock },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { message: 'Error al actualizar el stock' },
      { status: 500 }
    );
  }
}
