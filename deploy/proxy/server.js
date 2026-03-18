/**
 * Förderpilot – Multi-Provider API Proxy
 * Port 3003. Injiziert API-Keys serverseitig.
 * Provider wird via x-fp-provider Header bestimmt (default: claude).
 */
const http = require('http')
const https = require('https')

const PORT = 3003

const KEYS = {
  claude:     process.env.ANTHROPIC_API_KEY  || '',
  openrouter: process.env.OPENROUTER_API_KEY || '',
  openai:     process.env.OPENAI_API_KEY     || '',
}

const ROUTES = {
  claude: {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    buildHeaders: (key, bodyLen) => ({
      'Content-Type': 'application/json',
      'Content-Length': bodyLen,
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    }),
  },
  openrouter: {
    hostname: 'openrouter.ai',
    path: '/api/v1/chat/completions',
    buildHeaders: (key, bodyLen) => ({
      'Content-Type': 'application/json',
      'Content-Length': bodyLen,
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': 'https://foerderpilot.mmind.space',
      'X-Title': 'Förderpilot',
    }),
  },
  openai: {
    hostname: 'api.openai.com',
    path: '/v1/chat/completions',
    buildHeaders: (key, bodyLen) => ({
      'Content-Type': 'application/json',
      'Content-Length': bodyLen,
      'Authorization': `Bearer ${key}`,
    }),
  },
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-fp-provider')

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }
  if (req.method !== 'POST')    { res.writeHead(405); res.end('Method Not Allowed'); return }

  const providerName = req.headers['x-fp-provider'] || 'claude'
  const route = ROUTES[providerName] || ROUTES.claude
  const key   = KEYS[providerName]   || ''

  if (!key) {
    console.error(`[proxy] Kein Key für Provider: ${providerName}`)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: { message: `Kein API-Key für ${providerName} konfiguriert.` } }))
    return
  }

  let body = ''
  req.on('data', chunk => { body += chunk.toString() })
  req.on('end', () => {
    const bodyLen = Buffer.byteLength(body)
    const options = {
      hostname: route.hostname,
      port: 443,
      path: route.path,
      method: 'POST',
      headers: route.buildHeaders(key, bodyLen),
    }

    const upstream = https.request(options, (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      })
      upstreamRes.pipe(res)
    })

    upstream.on('error', (err) => {
      console.error('[proxy] Upstream error:', err.message)
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: { message: 'Proxy error: ' + err.message } }))
    })

    upstream.write(body)
    upstream.end()
  })
})

server.listen(PORT, () => {
  console.log(`[proxy] Förderpilot API-Proxy läuft auf Port ${PORT}`)
  for (const [p, k] of Object.entries(KEYS)) {
    console.log(`[proxy]   ${p}: ${k ? '✓ Key gesetzt' : '✗ kein Key'}`)
  }
})
