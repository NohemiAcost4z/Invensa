import { connection } from '../../../src/lib/db';
import { withSession } from '../../../src/lib/utils';

export const GET = withSession(async (_, usuario) => {
  try {
    const [result] = await connection.execute(
      'SELECT Id_Actualizacion, Id_Producto, Cantidad, Tipo, Fecha FROM actualizacion WHERE Id_Usuario = ? ORDER BY Fecha DESC',
      [usuario.idUsuario]
    );

    const response = await Promise.all(
      result.map(async (actualizacion) => {
        const [producto] = await connection.execute(
          'SELECT Nombre_Producto FROM producto WHERE Id_Producto = ?',
          [actualizacion.Id_Producto]
        );

        const [alerta] = await connection.execute(
          'SELECT Cantidad_Minima FROM alertastock WHERE Id_Producto = ?',
          [actualizacion.Id_Producto]
        );

        return {
          idActualizacion: actualizacion.Id_Actualizacion,
          nombreProducto: producto[0].Nombre_Producto,
          cantidad: actualizacion.Cantidad,
          cantidadMinima: alerta[0] ? alerta[0].Cantidad_Minima : undefined,
          tipo: actualizacion.Tipo,
          fecha: actualizacion.Fecha,
        };
      })
    );

    return Response.json(response);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: 'No pudimos obtener los movimientos de tu cuenta' },
      { status: 500 }
    );
  }
});
