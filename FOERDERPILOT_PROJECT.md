# Förderpilot – Vollständige Projektdokumentation

> **Status: LIVE** → https://foerderpilot.mmind.space
> Lead-Magnet für mmind.ai | Stand: März 2026

---

## Inhaltsverzeichnis

1. [Projektüberblick](#1-projektüberblick)
2. [Server & Infrastruktur](#2-server--infrastruktur)
3. [SSH-Zugang](#3-ssh-zugang)
4. [Architektur](#4-architektur)
5. [Deployment-Workflow](#5-deployment-workflow)
6. [Proxy-Setup (Docker)](#6-proxy-setup-docker)
7. [Nginx-Konfiguration](#7-nginx-konfiguration)
8. [SSL / Let's Encrypt](#8-ssl--lets-encrypt)
9. [Web App – Tech Stack](#9-web-app--tech-stack)
10. [Web App – Features](#10-web-app--features)
11. [Lokale Entwicklung](#11-lokale-entwicklung)
12. [API-Key setzen](#12-api-key-setzen)
13. [Troubleshooting](#13-troubleshooting)
14. [Andere Apps auf demselben Server](#14-andere-apps-auf-demselben-server)

---

## 1. Projektüberblick

**Förderpilot** ist eine React-Single-Page-App, die Unternehmen, Privatpersonen und Organisationen in Liechtenstein per KI-Chat passende Förderungen findet.

| | |
|---|---|
| **URL** | https://foerderpilot.mmind.space |
| **Datenbasis** | 104 Förderungen (web-verifiziert März 2026) |
| **KI-Modell** | claude-sonnet-4-20250514 via Anthropic API |
| **Zweck** | Lead-Magnet für mmind.ai |
| **GitHub** | https://github.com/mmind-zeno/foerderpilot |

---

## 2. Server & Infrastruktur

| | |
|---|---|
| **Provider** | Hetzner |
| **IP** | `195.201.145.97` |
| **OS** | Linux (Ubuntu) |
| **Static Files** | `/opt/foerderpilot/static/index.html` (Single-File HTML, ~299 KB) |
| **API-Proxy** | `/opt/foerderpilot/proxy/` (Docker, Port 3003) |
| **Nginx Config** | `/etc/nginx/sites-available/foerderpilot-http` |
| **SSL** | Let's Encrypt, gültig bis 2026-06-12 |
| **Domain** | foerderpilot.mmind.space (A-Record → 195.201.145.97) |

---

## 3. SSH-Zugang

```bash
# Direkter Zugriff
ssh root@195.201.145.97

# Mit Alias (empfohlen)
ssh hetzner
```

**SSH-Config** (`~/.ssh/config` / `C:\Users\<User>\.ssh\config`):
```
Host hetzner
  HostName 195.201.145.97
  User root
```

Voraussetzung: SSH-Key (`id_ed25519` oder `id_rsa`) muss auf dem Server hinterlegt sein.

**Typische Remote-Befehle:**
```bash
# Einzelbefehl
ssh hetzner "echo ok"

# Mehrere Befehle
ssh hetzner "cd /opt/foerderpilot && docker compose ps"

# Datei hochladen
scp dist/index.html hetzner:/opt/foerderpilot/static/index.html

# Ordner hochladen
scp -r deploy/proxy/ hetzner:/opt/foerderpilot/proxy/
```

---

## 4. Architektur

```
Browser
  │
  ▼
Nginx (Port 443, SSL)
  │
  ├── /          → /opt/foerderpilot/static/index.html  (statische React-App)
  │
  └── /api/chat  → 127.0.0.1:3003  (Docker: foerderpilot-proxy)
                        │
                        ▼
                  Anthropic API (api.anthropic.com/v1/messages)
```

- **Statische Dateien:** Vite baut alles in eine einzige `index.html` (~299 KB, alle Assets inline via `vite-plugin-singlefile`). Kein Webserver nötig, Nginx reicht.
- **Proxy:** Node.js-Container injiziert `ANTHROPIC_API_KEY` serverseitig. Der API-Key steht nie im Frontend-Code.

---

## 5. Deployment-Workflow

### Normaler Update (nur Frontend)

```bash
# 1. Lokal bauen
cd C:/_DATA/600_github/foerderpilot/app
npm run build

# 2. Hochladen (kein Nginx-Neustart nötig)
scp dist/index.html hetzner:/opt/foerderpilot/static/index.html
```

### Proxy-Update

```bash
# Proxy-Files hochladen
scp -r C:/_DATA/600_github/foerderpilot/deploy/proxy/ hetzner:/opt/foerderpilot/proxy/

# Auf Server neu bauen & starten
ssh hetzner "cd /opt/foerderpilot/proxy && docker compose down && docker compose up -d --build"
```

### Nginx-Config updaten

```bash
# Config hochladen
scp C:/_DATA/600_github/foerderpilot/deploy/nginx-foerderpilot.conf \
    hetzner:/etc/nginx/sites-available/foerderpilot-http

# Symlink setzen (falls neu)
ssh hetzner "ln -sf /etc/nginx/sites-available/foerderpilot-http \
    /etc/nginx/sites-enabled/foerderpilot-http"

# Nginx prüfen & neuladen
ssh hetzner "nginx -t && nginx -s reload"
```

### Erstes Setup (Neuinstallation)

```bash
# 1. Verzeichnisse anlegen
ssh hetzner "mkdir -p /opt/foerderpilot/static /opt/foerderpilot/proxy"

# 2. Static build hochladen
scp dist/index.html hetzner:/opt/foerderpilot/static/index.html

# 3. Proxy hochladen
scp -r deploy/proxy/ hetzner:/opt/foerderpilot/proxy/

# 4. Nginx-Site einrichten
scp deploy/nginx-foerderpilot.conf hetzner:/etc/nginx/sites-available/foerderpilot-http
ssh hetzner "ln -sf /etc/nginx/sites-available/foerderpilot-http \
    /etc/nginx/sites-enabled/foerderpilot-http && nginx -t && nginx -s reload"

# 5. SSL
ssh hetzner "certbot --nginx -d foerderpilot.mmind.space \
    --non-interactive --agree-tos --email kontakt@mmind.ai"

# 6. Docker-Proxy starten
ssh hetzner "cd /opt/foerderpilot/proxy && docker compose up -d --build"

# 7. API-Key setzen (siehe Abschnitt 12)
```

---

## 6. Proxy-Setup (Docker)

**Lokale Dateien:** `deploy/proxy/`

```
deploy/proxy/
├── server.js          # Node.js HTTP-Proxy, Port 3003
├── Dockerfile         # node:18-alpine
└── docker-compose.yml # Port 127.0.0.1:3003:3003, env_file .env
```

**docker-compose.yml:**
```yaml
services:
  proxy:
    build: .
    container_name: foerderpilot-proxy
    restart: unless-stopped
    ports:
      - "127.0.0.1:3003:3003"
    env_file:
      - .env
```

**Proxy-Funktionsweise:**
- Empfängt `POST /api/chat` vom Frontend
- Fügt `x-api-key` Header mit `ANTHROPIC_API_KEY` aus `.env` hinzu
- Leitet Request an `api.anthropic.com/v1/messages` weiter
- Piped Response zurück ans Frontend

**Docker-Befehle:**
```bash
# Status
ssh hetzner "docker ps | grep foerderpilot"

# Logs
ssh hetzner "docker logs foerderpilot-proxy"

# Neustart
ssh hetzner "docker restart foerderpilot-proxy"

# Rebuild
ssh hetzner "cd /opt/foerderpilot/proxy && docker compose up -d --build"
```

---

## 7. Nginx-Konfiguration

**Remote:** `/etc/nginx/sites-available/foerderpilot-http`
**Lokal:** `deploy/nginx-foerderpilot.conf`

```nginx
server {
    listen 80;
    server_name foerderpilot.mmind.space;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name foerderpilot.mmind.space;

    root /opt/foerderpilot/static;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/foerderpilot.mmind.space/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/foerderpilot.mmind.space/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # API-Proxy → Docker Port 3003
    location /api/chat {
        proxy_pass http://127.0.0.1:3003;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
    }

    # SPA-Routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 8. SSL / Let's Encrypt

| | |
|---|---|
| **Domain** | foerderpilot.mmind.space |
| **Gültig bis** | 2026-06-12 |
| **Auto-Renewal** | via certbot-Cronjob auf Server |

```bash
# SSL-Status prüfen
ssh hetzner "certbot certificates"

# Manuell erneuern
ssh hetzner "certbot renew"

# Neu ausstellen
ssh hetzner "certbot --nginx -d foerderpilot.mmind.space \
    --non-interactive --agree-tos --email kontakt@mmind.ai"
```

---

## 9. Web App – Tech Stack

| | |
|---|---|
| **Framework** | React 18 + TypeScript |
| **Build-Tool** | Vite |
| **CSS** | Tailwind CSS v3 |
| **Bundling** | `vite-plugin-singlefile` → alles in eine `index.html` |
| **Fonts** | Fraunces (Headlines) + Plus Jakarta Sans (Body) via Google Fonts |
| **KI** | Anthropic Claude `claude-sonnet-4-20250514` |
| **Proxy** | Node.js (node:18-alpine Docker) |

**Lokale Pfade:**
- Projekt-Root: `C:\_DATA\600_github\foerderpilot\`
- App-Quellcode: `C:\_DATA\600_github\foerderpilot\app\`
- Deploy-Files: `C:\_DATA\600_github\foerderpilot\deploy\`

**Build-Befehl:**
```bash
cd C:/_DATA/600_github/foerderpilot/app
npm run build
# Output: dist/index.html (~299 KB, alle Assets inline)
```

---

## 10. Web App – Features

### KI-Chat (Kernfunktion)
- Nutzer beschreibt Situation in Freitext
- Claude analysiert gegen alle 104 Förderungen
- Gibt 3–6 passende Förderungen als JSON zurück
- Frontend rendert Ergebniskarten mit: Name, Anbieter, "Warum passend", Förderumfang, Frist, Link

### Förderungskatalog
- Alle Förderungen browsebar als Grid
- Filter nach Kategorie, Zielgruppe, Fristtyp
- Live-Suchfeld (Name/Anbieter/Tags)

### CTA
- Am Ende: "Kostenlose Erstberatung bei mmind.ai" → https://mmind.ai

### API-Endpoint
- Frontend: `POST /api/chat` (geht an Nginx)
- Nginx leitet an `127.0.0.1:3003` weiter (Docker-Proxy)
- Proxy fügt API-Key hinzu und leitet an Anthropic weiter

---

## 11. Lokale Entwicklung

```bash
cd C:/_DATA/600_github/foerderpilot/app

# Abhängigkeiten installieren
npm install

# Dev-Server starten (http://localhost:5173)
npm run dev

# Produktions-Build
npm run build
# → dist/index.html (Single File)
```

> Für lokale KI-Funktion: API-Key temporär in `app/.env.local` setzen:
> ```
> VITE_ANTHROPIC_API_KEY=sk-ant-...
> ```
> (Nur lokal! Nie committen.)

---

## 12. API-Key setzen

```bash
# API-Key auf Server setzen und Proxy neustarten
ssh hetzner "echo 'ANTHROPIC_API_KEY=sk-ant-XXXXX' > /opt/foerderpilot/proxy/.env \
    && docker restart foerderpilot-proxy"

# Prüfen ob Key gesetzt
ssh hetzner "grep -c 'ANTHROPIC_API_KEY' /opt/foerderpilot/proxy/.env"

# Proxy-Logs prüfen (sollte kein WARNUNG-Eintrag zeigen)
ssh hetzner "docker logs foerderpilot-proxy --tail 20"
```

---

## 13. Troubleshooting

### KI-Chat funktioniert nicht
```bash
# 1. Proxy läuft?
ssh hetzner "docker ps | grep foerderpilot-proxy"

# 2. Logs prüfen
ssh hetzner "docker logs foerderpilot-proxy --tail 50"

# 3. API-Key gesetzt?
ssh hetzner "cat /opt/foerderpilot/proxy/.env"

# 4. Nginx-Proxy-Route ok?
ssh hetzner "nginx -t"
```

### Seite lädt nicht
```bash
# Nginx-Status
ssh hetzner "systemctl status nginx"

# Static-File vorhanden?
ssh hetzner "ls -lh /opt/foerderpilot/static/index.html"

# Nginx-Logs
ssh hetzner "tail -50 /var/log/nginx/error.log"
```

### SSL-Fehler
```bash
ssh hetzner "certbot certificates"
ssh hetzner "certbot renew --dry-run"
```

### Docker-Probleme
```bash
# Alle Container
ssh hetzner "docker ps -a"

# Proxy neu bauen
ssh hetzner "cd /opt/foerderpilot/proxy && docker compose down && docker compose up -d --build"
```

---

## 14. Andere Apps auf demselben Server

| Projekt | Pfad | Port | Domain |
|---------|------|------|--------|
| EU AI Act Hub | /opt/aiact/ | 3000 | aiact.mmind.space |
| Forklore (recipes) | /opt/recipes/ | 3001 | forklore.mmind.space |
| Vegaluna | /opt/vegaluna/ | 3002 | — |
| **Förderpilot** | **/opt/foerderpilot/** | **3003** | **foerderpilot.mmind.space** |

Alle Projekte laufen auf `195.201.145.97`. Gleicher SSH-Alias `hetzner`. Neue Projekte → nächster freier Port (3004+).
