export async function onRequestGet(context) {
  const { env, params } = context;
  const filename = params.filename;

  if (!env.UPLOADS) {
    return new Response('R2 uploads bucket not configured', { status: 404 });
  }

  const object = await env.UPLOADS.get(filename);
  if (!object) {
    return new Response('File not found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  return new Response(object.body, { headers });
}