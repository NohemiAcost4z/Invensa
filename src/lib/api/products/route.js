import { NextResponse } from 'next/server';
import { connection } from '../../db';

export async function GET(req) {
  const [resultado] = await connection.execute('SELECT * FROM product');

  return NextResponse.json(resultado);
}