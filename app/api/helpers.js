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

async function obtenerCliente(correoCliente) {
  const [cliente] = await connection.execute(
    'SELECT * FROM cliente WHERE Correo = ?',
    [correoCliente]
  );

  const response = cliente[0]
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
    `UPDATE cliente SET Nombre_Cliente = ?, Telefono, ?, Correo = ? WHERE Id_Cliente = ?`,
    [cliente.nombreCliente, cliente.telefono, cliente.correo, cliente.idCliente]
  );
  const response = await obtenerCliente(cliente.idCliente);
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
    .then((err) => console.log(err));
  const response = await obtenerCliente(cliente.correo);
  return response;
}

export { getUsuarioLogedo, crearCliente, actualizarCliente, obtenerCliente };
