import crypto from 'crypto';

const VERCEL_API_BASE = 'https://api.vercel.com';

function sanitizeProjectName(input = 'vercel-relay') {
  return `${input || 'vercel-relay'}`
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || `vercel-relay-${Date.now()}`;
}

function sha1(content) {
  return crypto.createHash('sha1').update(content).digest('hex');
}

function buildRelayFiles(sharedSecret = '') {
  const secretLine = sharedSecret ? `const RELAY_SECRET = '${sharedSecret.replaceAll("'", "\\'")}';` : 'const RELAY_SECRET = process.env.RELAY_SECRET || "";';
  const proxyJs = `${secretLine}
const ALLOW_HOSTS = [
  'chatgpt.com',
  'auth.openai.com',
  'api.openai.com',
  'localhost',
  '127.0.0.1'
];

export default async function handler(req, res) {
  try {
    if (RELAY_SECRET) {
      const token = req.headers['x-relay-secret'] || req.query.secret || '';
      if (token !== RELAY_SECRET) return res.status(401).json({ error: 'Unauthorized' });
    }

    const target = req.query.url || req.headers['x-relay-target'];
    if (!target) return res.status(400).json({ error: 'Missing target url' });

    const targetUrl = new URL(target);
    const allowed = ALLOW_HOSTS.some((host) => targetUrl.hostname === host || targetUrl.hostname.endsWith('.' + host));
    if (!allowed) return res.status(403).json({ error: 'Host not allowed' });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const headers = { ...req.headers };
    delete headers.host;
    delete headers['x-relay-secret'];
    delete headers['x-relay-target'];

    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    res.status(response.status);
    response.headers.forEach((value, key) => {
      if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) res.setHeader(key, value);
    });
    const body = Buffer.from(await response.arrayBuffer());
    return res.send(body);
  } catch (error) {
    return res.status(502).json({ error: error.message || 'Relay error' });
  }
}
`;

  return [
    { file: 'package.json', data: JSON.stringify({ type: 'module', dependencies: {} }, null, 2) },
    { file: 'vercel.json', data: JSON.stringify({ version: 2, functions: { 'api/proxy.js': { maxDuration: 30 } } }, null, 2) },
    { file: 'api/proxy.js', data: proxyJs },
  ];
}

async function vercelFetch(path, token, options = {}) {
  const response = await fetch(`${VERCEL_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!response.ok) throw new Error(data?.error?.message || data?.message || `Vercel HTTP ${response.status}`);
  return data;
}

export async function deployVercelRelay({ token, projectName, teamId = '', sharedSecret = '' }) {
  const safeToken = `${token || ''}`.trim();
  if (!safeToken) throw new Error('Thiếu Vercel API Token.');

  const name = sanitizeProjectName(projectName);
  const files = buildRelayFiles(sharedSecret).map((item) => ({
    ...item,
    sha: sha1(item.data),
    size: Buffer.byteLength(item.data),
  }));
  const query = teamId ? `?teamId=${encodeURIComponent(teamId)}` : '';

  for (const file of files) {
    await fetch(`${VERCEL_API_BASE}/v2/files${query}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${safeToken}`,
        'x-vercel-digest': file.sha,
        'Content-Type': 'application/octet-stream',
      },
      body: file.data,
    }).then(async (response) => {
      if (response.ok || response.status === 409) return;
      let data = null;
      try { data = await response.json(); } catch { data = null; }
      throw new Error(data?.error?.message || `Upload file thất bại: ${file.file}`);
    });
  }

  const deployment = await vercelFetch(`/v13/deployments${query}`, safeToken, {
    method: 'POST',
    body: JSON.stringify({
      name,
      project: name,
      target: 'production',
      files: files.map((file) => ({ file: file.file, sha: file.sha, size: file.size })),
      projectSettings: { framework: null, buildCommand: null, devCommand: null, outputDirectory: null },
    }),
  });

  const url = deployment?.url ? `https://${deployment.url}` : '';
  return {
    projectName: name,
    deploymentId: deployment?.id || '',
    url,
    proxyUrl: url ? `${url}/api/proxy` : '',
  };
}
