import { cookies } from 'next/headers';
import { connection } from '../../src/lib/db';
import { v4 as uuid } from 'uuid';

async function getUsuarioLogedo() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get('sesion')?.value;

  const [resultadoUsuario] = await connection.execute(
    'SELECT Id_Usuario, Nombre_Visible, Correo, Contrasenia, Foto_Perfil FROM usuario WHERE Session_Token = ?',
    [token ?? null]
  );
  if (!resultadoUsuario[0]) return;
  const response = {
    idUsuario: resultadoUsuario[0].Id_Usuario,
    nombreVisible: resultadoUsuario[0].Nombre_Visible,
    correo: resultadoUsuario[0].Correo,
    contrasenia: resultadoUsuario[0].Contrasenia,
    fotoPerfil: resultadoUsuario[0].Foto_Perfil,
  };

  return response;
}

async function obtenerClienteConCorreo(correoCliente) {
  const [cliente] = await connection.execute(
    'SELECT * FROM cliente WHERE Correo = ?',
    [correoCliente]
  );

  const response = !!cliente[0]
    ? {
        idCliente: cliente[0].Id_Cliente,
        nombreCliente: cliente[0].Nombre_Cliente,
        telefono: cliente[0].Telefono,
        correo: cliente[0].Correo,
      }
    : false;

  return response;
}

async function actualizarCliente(cliente) {
  await connection.execute(
    `UPDATE cliente SET Nombre_Cliente = ?, Telefono = ?, Correo = ? WHERE Id_Cliente = ?`,
    [cliente.nombreCliente, cliente.telefono, cliente.correo, cliente.idCliente]
  );
  const response = await obtenerClienteConCorreo(cliente.correo);
  return response;
}

async function crearCliente(cliente) {
  const uuidCliente = uuid();
  await connection
    .execute('INSERT INTO cliente VALUES (?, ?, ?, ?)', [
      uuidCliente,
      cliente.nombreCliente,
      cliente.telefono,
      cliente.correo,
    ])
    .then((err) => console.error(err));
  const response = await obtenerClienteConCorreo(cliente.correo);
  return response;
}

async function getAlertaStockPorIdProducto(idProducto) {
  const [alerta] = await connection.execute(
    'SELECT * FROM alertastock WHERE Id_Producto = ?',
    [idProducto]
  );

  return alerta[0]
    ? {
        idAlerta: alerta[0].Id_Alerta,
        idProducto: alerta[0].Id_Producto,
        idUsuario: alerta[0].Id_Usuario,
        cantidadMinima: alerta[0].Cantidad_Minima,
        fechaAlerta: alerta[0].Fecha_Alerta,
        estado: alerta[0].Estado,
      }
    : undefined;
}

async function crearActualizacion({
  idProducto,
  idAlerta,
  cantidad,
  tipo,
  idUsuario,
}) {
  try {
    const idActualizacion = uuid();
    await connection.execute(
      'INSERT INTO actualizacion VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        idActualizacion,
        idProducto,
        idUsuario,
        idAlerta,
        cantidad,
        tipo,
        new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' '),
      ]
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export {
  getUsuarioLogedo,
  crearCliente,
  actualizarCliente,
  obtenerClienteConCorreo,
  getAlertaStockPorIdProducto,
  crearActualizacion,
};
