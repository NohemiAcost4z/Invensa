import { connection } from '../../../../src/lib/db';
import { withSession } from '../../../../src/lib/utils';
import {
  crearActualizacion,
  getAlertaStockPorIdProducto,
  getUsuarioLogedo,
} from '../../helpers';

export const PATCH = withSession(async (req) => {
  try {
    const usuario = await getUsuarioLogedo();
    if (!usuario) {
      return Response.json(
        { message: 'no tienes acceso a este recurso' },
        { status: 403 }
      );
    }
    const data = await req.json();

    const alertaProducto = await getAlertaStockPorIdProducto(data.idProducto);

    await connection.beginTransaction();

    await connection.execute(
      'UPDATE producto SET Cantidad = ? WHERE Id_Producto = ?',
      [data.stock, data.idProducto]
    );
    if (alertaProducto) {
      if (data.stock <= alertaProducto.cantidadMinima) {
        await connection.execute(
          'UPDATE alertastock SET Fecha_Alerta = ?, Estado = "Pendiente" WHERE Id_Alerta = ?',
          [
            new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' '),
            alertaProducto.idAlerta,
          ]
        );
      } else if (alertaProducto.estado === 'Pendiente') {
        await connection.execute(
          'UPDATE alertastock SET Fecha_Alerta = NULL, Estado = "Atendida" WHERE Id_Alerta = ?',
          [alertaProducto.idAlerta]
        );
      }
    }

    await crearActualizacion({
      idUsuario: usuario.idUsuario,
      idAlerta: alertaProducto?.idAlerta,
      idProducto: data.idProducto,
      cantidad: data.stock,
      tipo: 'Actualización de stock',
    });

    await connection.commit();
    return Response.json(
      { message: 'Stock actualizado', stock: data.stock },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    connection.rollback();
    return Response.json(
      { message: 'Error al actualizar el stock' },
      { status: 500 }
    );
  }
});
