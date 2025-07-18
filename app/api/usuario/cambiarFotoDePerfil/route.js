import { writeFile } from 'fs/promises';
import { connection } from '../../../../src/lib/db';
import path from 'path';
import { withSession } from '../../../../src/lib/utils';

export const PATCH = withSession(async (req, usuario) => {
  try {
    const data = await req.formData();
    const fotoPerfil = data.get('fotoPerfil');

    if (!fotoPerfil) {
      return Response.json(
        { error: 'No se subió una imagen' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await fotoPerfil?.arrayBuffer());
    const nombreImagen = `${usuario.idUsuario}_${fotoPerfil?.name?.replaceAll(
      ' ',
      '_'
    )}`;

    await writeFile(path.join(process.cwd(), 'imagenes', nombreImagen), buffer);

    await connection.execute(
      'UPDATE usuario SET Foto_Perfil = ? WHERE Id_Usuario = ?',
      [nombreImagen, usuario.idUsuario]
    );

    return Response.json({ fotoDePerfil: nombreImagen }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: 'la actualización de la foto de perfil falló' },
      { status: 500 }
    );
  }
});
