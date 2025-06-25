import { connection } from '../../../src/lib/db';
import { v4 as uuid } from 'uuid';
import {
  actualizarCliente,
  crearActualizacion,
  crearCliente,
  getAlertaStockPorIdProducto,
  obtenerClienteConCorreo,
} from '../helpers';
import { withSession } from '../../../src/lib/utils';

export const POST = withSession(async (req, usuario) => {
  try {
    const body = await req.json();
    const idNuevaVenta = uuid();
    let clienteVenta = undefined;

    const [producto] = await connection.execute(
      'SELECT Cantidad FROM producto WHERE Id_Producto = ?',
      [body.idProducto]
    );

    if (body.cantidad > producto.Cantidad) {
      return Response.json(
        { message: 'el stock es insuficiente para realizar la venta' },
        { status: 409 }
      );
    }

    await connection.beginTransaction();
    const cliente = await obtenerClienteConCorreo(body.cliente?.correo ?? null);
    if (cliente) {
      clienteVenta = await actualizarCliente(cliente);
    } else {
      clienteVenta = await crearCliente(body.cliente);
    }
    await connection.execute('INSERT INTO venta VALUES (?, ?, ?, ?, ?, ?)', [
      idNuevaVenta,
      clienteVenta.idCliente,
      body.idProducto,
      body.fechaVenta,
      body.cantidad,
      usuario.idUsuario,
    ]);

    const alerta = await getAlertaStockPorIdProducto(body.idProducto);

    const [productoActualizado] = await connection.execute(
      'SELECT Cantidad FROM producto WHERE Id_Producto = ?',
      [body.idProducto]
    );

    if (alerta && alerta.cantidadMinima >= productoActualizado[0].Cantidad) {
      await connection.execute(
        'UPDATE alertastock SET Estado = "Pendiente" WHERE Id_Producto = ?',
        [body.idProducto]
      );
      await crearActualizacion({
        idUsuario: usuario.idUsuario,
        idAlerta: alerta.idAlerta,
        idProducto: body.idProducto,
        cantidad: productoActualizado[0].Cantidad,
        tipo: 'El stock se está aguantando',
      });
    }

    await crearActualizacion({
      idUsuario: usuario.idUsuario,
      idAlerta: alerta ? alerta.idAlerta : null,
      idProducto: body.idProducto,
      cantidad: body.cantidad,
      tipo: 'Se ha concretado una venta',
    });

    await connection.commit();
    return Response.json({ mesage: 'venta creada' });
  } catch (err) {
    console.error(err);
    connection.rollback();
    return Response.json(
      { message: 'la creación de la venta falló' },
      { status: 500 }
    );
  }
});
