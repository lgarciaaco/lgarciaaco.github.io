/**
 * HTTP Basic Auth (Cloudflare Pages). Secrets: BASIC_USER, BASIC_PASS
 */
export async function onRequest(context) {
  const { request, env } = context;
  const user = env.BASIC_USER;
  const pass = env.BASIC_PASS;

  if (!user || !pass) {
    return new Response("Auth not configured (set BASIC_USER and BASIC_PASS)", {
      status: 503,
    });
  }

  const auth = request.headers.get("Authorization");
  if (!auth || !(await credentialsMatch(auth, user, pass))) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="immo screening"' },
    });
  }

  return context.next();
}

async function credentialsMatch(authHeader, expectedUser, expectedPass) {
  const [scheme, encoded] = authHeader.split(" ");
  if (scheme !== "Basic" || !encoded) return false;

  let decoded;
  try {
    decoded = atob(encoded);
  } catch {
    return false;
  }

  const colon = decoded.indexOf(":");
  if (colon < 0) return false;

  const user = decoded.slice(0, colon);
  const pass = decoded.slice(colon + 1);

  const userOk = await timingSafeEqual(user, expectedUser);
  const passOk = await timingSafeEqual(pass, expectedPass);
  return userOk && passOk;
}

async function timingSafeEqual(a, b) {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  if (ab.byteLength !== bb.byteLength) return false;
  return crypto.subtle.timingSafeEqual(ab, bb);
}
