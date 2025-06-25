import { connection } from '../../../../src/lib/db';
import { getUsuarioLogedo } from '../../helpers';

export async function GET() {
  try {
    const usuario = await getUsuarioLogedo();

    if (!usuario) {
      return Response.json([], { status: 403 });
    }

    const [resultado] = await connection.execute(
      'SELECT * FROM alertastock WHERE Id_Usuario = ?',
      [usuario.idUsuario]
    );

    const response = await Promise.all(
      resultado.map(async (alerta) => {
        const [productoResultado] = await connection.execute(
          'SELECT Id_Producto, Nombre_Producto FROM producto WHERE Id_Usuario = ? AND Id_Producto = ?',
          [usuario.idUsuario, alerta.Id_Producto]
        );
        return {
          idAlerta: alerta.Id_Alerta,
          cantidadMinima: alerta.Cantidad_Minima,
          fechaAlerta: alerta.Fecha_Alerta,
          estado: alerta.Estado,
          producto: {
            idProducto: productoResultado[0].Id_Producto,
            nombreProducto: productoResultado[0].Nombre_Producto,
          },
        };
      })
    );
    return Response.json(response);
  } catch (err) {
    console.log(err);
    Response.json(
      { message: 'Hubo un error obteniendo las alertas' },
      { status: 500 }
    );
  }
}
