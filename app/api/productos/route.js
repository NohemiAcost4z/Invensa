import { connection } from '../../../src/lib/db';
import { writeFile } from 'fs/promises';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { rm } from 'fs';
import { cookies } from 'next/headers';

async function getUsuarioLogedo() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get('sesion')?.value;

  const [resultadoUsuario] = await connection.execute(
    'SELECT * FROM usuario WHERE Session_Token = ?',
    [token]
  );

  return resultadoUsuario[0];
}

export async function GET() {
  try {
    const usuario = await getUsuarioLogedo();
    const [resultado] = await connection.execute(
      'SELECT * FROM producto WHERE Id_Usuario = ?',
      [usuario.Id_Usuario]
    );

    const response = resultado.map((producto) => ({
      idProducto: producto.Id_Producto,
      nombreProducto: producto.Nombre_Producto,
      cantidad: producto.Cantidad,
      precio: producto.Precio,
      codigo: producto.Codigo,
      categoria: producto.Categoria,
      pathImagen: producto.Path_Imagen,
    }));

    return Response.json(response);
  } catch (err) {
    console.log(err);
    return Response.json(
      {
        Message: 'No se pudo crear el producto',
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.formData();
    const imagenProducto = data.get('imagenProducto');

    if (!imagenProducto) {
      return Response.json(
        { error: 'No se subió una imagen' },
        { status: 400 }
      );
    }

    const nombreProducto = data.get('nombreProducto');
    const cantidadProducto = data.get('cantidadProducto');
    const precioProducto = data.get('precioProducto');
    const codigoProducto = data.get('codigoProducto');
    const categoriaProducto = data.get('categoriaProducto');

    const idProducto = uuid();

    const buffer = Buffer.from(await imagenProducto?.arrayBuffer());
    const nombreImagen = `${idProducto}_${imagenProducto?.name?.replaceAll(
      ' ',
      '_'
    )}`;

    const idUsuario = (await getUsuarioLogedo()).Id_Usuario;

    await writeFile(path.join(process.cwd(), 'imagenes', nombreImagen), buffer);

    const [resultado] = await connection.execute(
      'INSERT INTO producto VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        idProducto,
        nombreProducto,
        cantidadProducto,
        precioProducto,
        codigoProducto,
        categoriaProducto,
        nombreImagen,
        idUsuario,
      ]
    );

    return Response.json({
      mensaje: 'el producto fue insertado exitosamente',
      idInsertado: resultado,
    });
  } catch (err) {
    console.log(err);
    return Response.json(
      {
        Message: 'No se pudo crear el producto',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const idUsuario = (await getUsuarioLogedo()).Id_Usuario;
    const data = await request.json();
    const [imagenAEliminar] = await connection.execute(
      'SELECT Path_Imagen from producto WHERE Id_Producto = ? AND  Id_Usuario = ?',
      [data.idProducto, idUsuario]
    );
    await rm(
      path.join(process.cwd(), 'imagenes', imagenAEliminar[0].Path_Imagen)
    );
    await connection.execute(
      'DELETE FROM producto WHERE Id_Producto = ? AND Id_Usuario = ?',
      [data.idProducto, idUsuario]
    );
    return new Response(null, { status: 204 });
  } catch (err) {
    console.log(err);
    return Response.json(
      {
        Message: 'No se pudo eliminar el producto',
      },
      { status: 500 }
    );
  }
}
