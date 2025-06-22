import { connection } from '../../../src/lib/db';
import { writeFile } from 'fs/promises';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { rm } from 'fs';

export async function GET() {
  try {
    const [resultado] = await connection.execute('SELECT * FROM `producto`');

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

    await writeFile(path.join(process.cwd(), 'imagenes', nombreImagen), buffer);

    const [resultado] = await connection.execute(
      `INSERT INTO \`producto\` VALUES ("${idProducto}", "${nombreProducto}", ${cantidadProducto}, ${precioProducto}, "${codigoProducto}", "${categoriaProducto}", "${nombreImagen}", "268f4166-9e48-4471-a853-b34d19dbc0a0")`
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
    const data = await request.json();
    const [imagenAEliminar] = await connection.execute(
      `SELECT Path_Imagen from \`producto\` WHERE \`Id_Producto\` = "${data.idProducto}"`
    );
    await rm(
      path.join(process.cwd(), 'imagenes', imagenAEliminar[0].Path_Imagen)
    );
    await connection.execute(
      `DELETE FROM \`producto\` WHERE \`Id_Producto\` = "${data.idProducto}"`
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
