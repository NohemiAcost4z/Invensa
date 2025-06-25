import { connection } from '../../../src/lib/db';
import { v4 as uuid } from 'uuid';
import {
  actualizarCliente,
  crearCliente,
  getUsuarioLogedo,
  obtenerCliente,
} from '../helpers';

export async function POST(req) {
  try {
    const usuario = await getUsuarioLogedo();

    if (!usuario)
      return Response.json(
        { message: 'No tienes acceso a este recurso' },
        { status: 403 }
      );

    const body = await req.json();
    const idNuevaVenta = uuid();
    let clienteVenta = undefined;

    await connection.beginTransaction();
    const cliente = await obtenerCliente(body.cliente?.correo ?? null);
    if (cliente) {
      clienteVenta = await actualizarCliente(cliente.idCliente);
    } else {
      clienteVenta = await crearCliente(body.cliente);
    }
    await connection.execute('INSERT INTO venta VALUES (?, ?, ?, ?, ?, ?, ?)', [
      idNuevaVenta,
      clienteVenta.idCliente,
      body.idProducto,
      body.fechaVenta,
      body.cantidad,
      usuario.idUsuario,
    ]);
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
}
