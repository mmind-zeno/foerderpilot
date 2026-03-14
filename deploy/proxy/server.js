/**
 * Förderpilot – Anthropic API Proxy
 * Läuft als Docker-Container auf Port 3003.
 * Injiziert den ANTHROPIC_API_KEY serverseitig.
 */
const http = require('http')
const https = require('https')

const PORT = 3003
const ANTHROPIC_HOST = 'api.anthropic.com'
const API_KEY = process.env.ANTHROPIC_API_KEY

if (!API_KEY) {
  console.error('[proxy] WARNUNG: ANTHROPIC_API_KEY nicht gesetzt!')
}

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method !== 'POST') {
    res.writeHead(405)
    res.end('Method Not Allowed')
    return
  }

  // Body lesen
  let body = ''
  req.on('data', chunk => { body += chunk.toString() })
  req.on('end', () => {
    const options = {
      hostname: ANTHROPIC_HOST,
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'x-api-key': API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
    }

    const proxy = https.request(options, (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      })
      upstreamRes.pipe(res)
    })

    proxy.on('error', (err) => {
      console.error('[proxy] Upstream error:', err.message)
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: { message: 'Proxy error: ' + err.message } }))
    })

    proxy.write(body)
    proxy.end()
  })
})

server.listen(PORT, () => {
  console.log(`[proxy] Förderpilot API-Proxy läuft auf Port ${PORT}`)
})
