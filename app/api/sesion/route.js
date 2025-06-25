import { withSession } from '../../../src/lib/utils';

export const GET = withSession(async (_, usuario) => {
  return Response.json(usuario);
});
