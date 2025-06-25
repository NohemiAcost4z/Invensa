import { connection } from '../../../../src/lib/db';
import { withSession } from '../../../../src/lib/utils';

export const GET = withSession(async (_, usuario) => {
  try {
    const [resultadoVenta] = await connection.execute(
      'SELECT * FROM venta WHERE Id_Usuario = ?',
      [usuario.idUsuario]
    );

    const response = await Promise.all(
      resultadoVenta.map(async (venta) => {
        const [resultadoCliente] = await connection.execute(
          'SELECT Nombre_Cliente FROM cliente WHERE Id_Cliente = ?',
          [venta.Id_Cliente]
        );
        const [resultadoProducto] = await connection.execute(
          'SELECT Nombre_Producto, Precio FROM producto WHERE Id_Producto = ?',
          [venta.Id_Producto]
        );

        return {
          idVenta: venta.Id_Venta,
          nombreCliente: resultadoCliente[0].Nombre_Cliente,
          producto: {
            nombre: resultadoProducto[0].Nombre_Producto,
            precio: resultadoProducto[0].Precio,
          },
          fechaVenta: venta.Fecha_Venta,
          cantidad: venta.Cantidad,
        };
      })
    );

    return Response.json(response);
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: 'hubo un error al obtener las ventas' },
      { status: 500 }
    );
  }
});
