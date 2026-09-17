export async function onRequest(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('No code received.', { status: 400 });
  }

  const CLIENT_ID = 'YOUR_CLIENT_ID';
  const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';

  const basic = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

  const tokenRes = await fetch('https://authz.constantcontact.com/oauth2/default/v1/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'https://mfsn-bkw.pages.dev/api/oauth/callback',
    }),
  });

  const data = await tokenRes.json();

  return new Response(
    `<pre>${JSON.stringify(data, null, 2)}</pre>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}
