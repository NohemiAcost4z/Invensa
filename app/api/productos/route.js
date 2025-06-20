import { connection } from '../../lib/db';

export async function GET(request) {
  try {
    const [resultado] = await connection.execute('SELECT * FROM `producto`');
  
    const response = resultado.map(producto => ({
      idProducto: producto.Id_Producto,
      nombreProducto: producto.Nombre_Producto,
      cantidad: producto.Cantidad,
      precio: producto.Precio,
      codigo: producto.codigo,
      categoria: producto.Categoria
    }));

    return Response.json( response );
  } catch (err) {
    console.log(err);
  }
}
