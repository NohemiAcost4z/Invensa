import path from 'path';
import fs from 'fs/promises';

export async function GET(request, { params }) {
  const { nombre } = await params;

  const filePath = path.join(process.cwd(), 'imagenes', nombre);

  try {
    const fileBuffer = await fs.readFile(filePath);
    const ext = path.extname(nombre).toLowerCase().slice(1);

    const contentTypeMap = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
      svg: 'image/svg+xml',
    };

    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch {
    return new Response('Imagen no encontrada', { status: 404 });
  }
}
