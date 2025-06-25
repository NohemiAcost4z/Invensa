import { connection } from '../../../src/lib/db';
import { writeFile } from 'fs/promises';
import { v4 as uuid } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { crearActualizacion, getAlertaStockPorIdProducto } from '../helpers';
import { withSession } from '../../../src/lib/utils';

export const GET = withSession(async (_, usuario) => {
  try {
    const [resultado] = await connection.execute(
      'SELECT * FROM producto WHERE Id_Usuario = ? AND Visible = TRUE',
      [usuario?.idUsuario ?? null]
    );
    const response = await Promise.all(
      resultado.map(async (producto) => {
        const alerta = await getAlertaStockPorIdProducto(producto.Id_Producto);

        return {
          idProducto: producto.Id_Producto,
          nombreProducto: producto.Nombre_Producto,
          cantidad: producto.Cantidad,
          precio: producto.Precio,
          codigo: producto.Codigo,
          categoria: producto.Categoria,
          pathImagen: producto.Path_Imagen,
          cantidadMinima:
            alerta && alerta.estado === 'Pendiente'
              ? alerta.cantidadMinima
              : undefined,
        };
      })
    );

    return Response.json(response);
  } catch (err) {
    console.error(err);
    return Response.json(
      {
        Message: 'No se obtener el usuario',
      },
      { status: 500 }
    );
  }
});

export const POST = withSession(async (request, usuario) => {
  try {
    if (!usuario) {
      return Response.json(
        { message: 'No tienes acceso a este recurso' },
        { status: 403 }
      );
    }

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

    await connection.beginTransaction();

    const [resultado] = await connection.execute(
      'INSERT INTO producto VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        idProducto,
        nombreProducto,
        cantidadProducto,
        precioProducto,
        codigoProducto,
        categoriaProducto,
        nombreImagen,
        usuario.idUsuario,
        true,
      ]
    );

    await crearActualizacion({
      idAlerta: null,
      idUsuario: usuario.idUsuario,
      idProducto: idProducto,
      cantidad: cantidadProducto,
      tipo: 'Creación de un producto',
    });

    await connection.commit();

    return Response.json({
      mensaje: 'el producto fue insertado exitosamente',
      idInsertado: resultado,
    });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    return Response.json(
      {
        Message: 'No se pudo crear el producto',
      },
      { status: 500 }
    );
  }
});

export const DELETE = withSession(async (request, usuario) => {
  try {
    const idUsuario = usuario.idUsuario;

    const data = await request.json();
    const [imagenAEliminar] = await connection.execute(
      'SELECT Path_Imagen from producto WHERE Id_Producto = ?',
      [data.idProducto]
    );
    const alertaProducto = await getAlertaStockPorIdProducto(data.idProducto);

    await connection.beginTransaction();
    if (alertaProducto) {
      await connection.execute(
        'UPDATE alertastock SET Visible=FALSE WHERE Id_Producto = ?',
        [data.idProducto]
      );
      await crearActualizacion({
        idUsuario,
        idAlerta: alertaProducto.idAlerta,
        idProducto: data.idProducto,
        cantidad: 0,
        tipo: 'Borrado de una alerta',
      });
    }

    await connection.execute(
      'UPDATE producto SET Visible = FALSE WHERE Id_Producto = ?',
      [data.idProducto]
    );
    await crearActualizacion({
      idUsuario,
      idAlerta: alertaProducto?.idAlerta ?? null,
      idProducto: data.idProducto,
      cantidad: 0,
      tipo: 'Borrado de un producto',
    });

    await fs.rm(
      path.join(process.cwd(), 'imagenes', imagenAEliminar[0].Path_Imagen)
    );

    await connection.commit();
    return new Response(null, { status: 204 });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    return Response.json(
      {
        Message: 'No se pudo eliminar el producto',
      },
      { status: 500 }
    );
  }
});

export const PATCH = withSession(async (request, usuario) => {
  try {
    const data = await request.formData();
    const imagenProducto = data.get('imagen');
    const idProducto = data.get('idProducto');
    const nombreProducto = data.get('nombre');
    const precioProducto = data.get('precio');
    const codigoProducto = data.get('codigo');
    const categoriaProducto = data.get('categoria');

    const [productoGuardado] = await connection.execute(
      'SELECT Path_Imagen, Cantidad from producto WHERE Id_Producto = ?',
      [idProducto]
    );
    const alerta = await getAlertaStockPorIdProducto(idProducto);

    const nombreImagen = `${idProducto}_${imagenProducto?.name?.replaceAll(
      ' ',
      '_'
    )}`;

    const cambioImagen =
      imagenProducto?.name != null &&
      nombreImagen !== productoGuardado[0].Path_Imagen;

    if (cambioImagen) {
      const buffer = Buffer.from(await imagenProducto?.arrayBuffer());
      await writeFile(
        path.join(process.cwd(), 'imagenes', nombreImagen),
        buffer
      );
    }

    await connection.beginTransaction();

    await connection.execute(
      `UPDATE producto SET Nombre_Producto = ?, Precio = ?, Codigo = ?, Categoria = ?${
        cambioImagen ? `, Path_Imagen = "${nombreImagen}"` : ''
      } WHERE Id_Producto = ?`,
      [
        nombreProducto,
        precioProducto,
        codigoProducto,
        categoriaProducto,
        idProducto,
      ]
    );
    await crearActualizacion({
      idUsuario: usuario.idUsuario,
      idAlerta: alerta ? alerta.idAlerta : null,
      idProducto: idProducto,
      cantidad: productoGuardado[0].Cantidad,
      tipo: 'Actualización de la definición de un producto',
    });

    connection.commit();

    if (cambioImagen) {
      await fs.rm(
        path.join(process.cwd(), 'imagenes', imageResults[0].Path_Imagen)
      );
    }
    return Response.json({ message: 'producto actualizado' });
  } catch (err) {
    console.error(err);
    connection.rollback();
    return Response.json({
      message: 'Hubo un error al tratar de actualizar el producto',
    });
  }
});
