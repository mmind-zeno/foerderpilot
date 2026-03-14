# Server-Deploy-Brief: Förderpilot auf Hetzner (195.201.145.97)

Dieses Dokument ergänzt die Projekt-Vorlage (CLAUDE_CODE_BRIEF.md, system_prompt.txt, foerderungen_data.json) um alles, was ein Agent braucht, um **autonom** die Förderpilot-Webapp auf dem bestehenden Hetzner-Server aufzusetzen. Gleicher Server wie EU AI Act Hub (aiact), Forklore (recipes) und Vegaluna; weitere Webapp = neuer Port, neuer Pfad, eigene Nginx-Site.

---

## 1. Server-Zugang (autonomer SSH-Zugriff)

| | |
|---|---|
| **Server-IP** | 195.201.145.97 |
| **SSH-Alias** | `hetzner` (aus ~/.ssh/config) |
| **SSH-Befehl** | `ssh hetzner` |

**SSH-Config (prüfen/vorhanden sein):**  
In `~/.ssh/config` (Windows: `C:\Users\<User>\.ssh\config`):

```
Host hetzner
  HostName 195.201.145.97
  User root
```

**Wichtig für autonome Befehle:** Alle Server-Aktionen laufen als:
- `ssh hetzner " <bash-befehl> "` (ein Befehl)
- Mehrere Befehle: `ssh hetzner "cd /opt/xy && docker compose up -d"`
- Dateien hochladen: `scp -r <lokal> hetzner:<remote-pfad>`

Der Agent muss **kein** Passwort eingeben können; Zugriff setzt funktionierende SSH-Keys (z. B. `id_ed25519` / `id_rsa`) voraus.

---

## 2. Bestehende Webapps auf diesem Server (Referenz)

Vier Webapps laufen bereits; Ports und Pfade sind belegt. Förderpilot nutzt den **nächsten freien Port** und einen **eigenen Pfad**.

| Projekt | Pfad | Host-Port | Domain | Nginx-Site |
|---------|------|-----------|--------|------------|
| EU AI Act Hub (aiact) | /opt/aiact/ | 3000 | aiact.mmind.space | nginx-aiact.conf |
| Forklore (recipes) | /opt/recipes/ | 3001 | forklore.mmind.space | nginx-recipes.conf |
| Vegaluna | (auf diesem Server) | 3002 | (ggf. vegaluna…) | — |
| **Förderpilot (neu)** | **/opt/foerderpilot/** | **3003** | **foerderpilot.mmind.space** | **nginx-foerderpilot.conf** |

### Wie aiact aufgebaut ist (Next.js + Docker)

- **Struktur:** `/opt/aiact/` mit `webapp/`, `docker-compose.yml`, ggf. `credentials/`.
- **Deploy (Windows):**
  - Lokal: `robocopy webapp webapp-deploy /E /XD node_modules .next .git credentials`
  - Hochladen: `scp -r webapp-deploy hetzner:/opt/aiact/webapp-new`
  - Auf Server: `ssh hetzner "cd /opt/aiact && rm -rf webapp && mv webapp-new webapp"`
- **Start:**
  `ssh hetzner "cd /opt/aiact && docker compose down 2>/dev/null || true && docker compose build --no-cache && docker compose up -d"`
- **Stack:** Next.js 14, Prisma + SQLite, Docker-Volume für DB, docker-entrypoint.sh für Migrations/Seed.
- **Logs:** `ssh hetzner "docker logs aiact-webapp-1"`

### Wie Forklore (recipes) aufgebaut ist

- **Pfad:** /opt/recipes/
- **Port:** 3001
- **Deploy:** Ähnlich aiact – robocopy ohne node_modules/.next, dann scp nach hetzner, dann auf Server Ordner tauschen und `docker compose build --no-cache && docker compose up -d`.
- **Besonderheiten:** Migration z. B. `migrate-recipe-columns.js` nach Start; .env mit NEXTAUTH_URL, ADMIN_PASSWORD, OPENAI_API_KEY/HUGGINGFACE_API_KEY.
- **Nginx:** nginx-recipes.conf, Domain forklore.mmind.space.

### Vegaluna

- **Port:** 3002 (Container-Name: vegaluna-webapp-1)
- Läuft auf demselben Host 195.201.145.97; gleicher Docker-Host wie aiact und recipes.

### Gemeinsame Muster (für Förderpilot übernehmen)

1. **Eigener Ordner unter /opt/** → `/opt/foerderpilot/`
2. **Eigener Host-Port** → 3003 (Container intern kann 80 oder 3000 sein, je nach Server-Typ)
3. **Docker:** docker-compose.yml im Projektpfad; Build auf dem Server, keine node_modules/.next mitkopieren bei Node-Apps.
4. **Nginx:** Neue Site-Datei (z. B. nginx-foerderpilot.conf), Server-Name foerderpilot.mmind.space, proxy_pass auf http://127.0.0.1:3003 (oder statisches Root, siehe unten).
5. **SSL:** Certbot nach A-Record: `sudo certbot --nginx -d foerderpilot.mmind.space --non-interactive --agree-tos --email <email>`

---

## 3. Förderpilot-spezifisch: Art der App & Deploy-Optionen

Förderpilot ist **kein** Next.js-Projekt, sondern **React + Vite** (laut CLAUDE_CODE_BRIEF: Parcel, bundle.html). Für den Server gibt es zwei sinnvolle Varianten:

**Option A – Nur statische Dateien (empfohlen wenn nur HTML/JS/CSS):**
- Build lokal oder in CI: Output z. B. `dist/` oder ein einzelnes `bundle.html` + Assets.
- Auf Server: Dateien nach `/opt/foerderpilot/static/` kopieren (z. B. per scp).
- Nginx-Site für foerderpilot.mmind.space mit `root /opt/foerderpilot/static;` und `index bundle.html` (oder index.html).
- **Kein** Docker nötig; nur Nginx + Certbot.

**Option B – Container für einheitlichen Ablauf:**
- Dockerfile: z. B. nginx-alpine, COPY der gebauten Dateien nach /usr/share/nginx/html.
- docker-compose.yml: Port 3003:80, Volume optional.
- Dann gleicher Ablauf wie aiact: Dateien/Projekt hochladen, auf Server `docker compose build --no-cache && docker compose up -d`, Nginx proxy_pass auf 127.0.0.1:3003.

**Umgebungsvariablen / API-Key:** Die App nutzt die Claude API; der API-Key darf nicht im Frontend-Code stehen (laut CLAUDE_CODE_BRIEF: „API Key wird vom Proxy injiziert“). Entweder ein kleines Backend/Proxy auf dem Server, das den Key setzt, oder Nginx sub_filter / Umgebungsvariable in einer serverseitigen Rendering-Schicht. Konkretes Proxy-Setup ggf. im Projekt ergänzen.

---

## 4. Checkliste für autonomes Aufsetzen (Förderpilot)

1. **Parameter festlegen:**  
   Pfad `/opt/foerderpilot/`, Port 3003, Domain foerderpilot.mmind.space, Nginx-Name foerderpilot.
2. **SSH prüfen:** `ssh hetzner "echo ok"` → "ok".
3. **Verzeichnis anlegen:** `ssh hetzner "mkdir -p /opt/foerderpilot/static"`
4. **Build-Artefakte hochladen:**
   - Bei statischem Build: `scp -r dist/* hetzner:/opt/foerderpilot/static/` (oder entsprechende Ordner).
   - Bei Docker: Projekt inkl. Dockerfile/docker-compose hochladen (ohne node_modules), dann Build auf Server.
5. **Nginx-Site anlegen:**
   - Config-Datei nginx-foerderpilot.conf (server_name foerderpilot.mmind.space; root oder proxy_pass je nach Option A/B).
   - Auf Server: `scp nginx-foerderpilot.conf hetzner:/etc/nginx/sites-available/foerderpilot`, dann `ssh hetzner "ln -sf /etc/nginx/sites-available/foerderpilot /etc/nginx/sites-enabled/foerderpilot && nginx -t && nginx -s reload"`.
6. **DNS:** A-Record für foerderpilot.mmind.space → 195.201.145.97.
7. **SSL:** `ssh hetzner "certbot --nginx -d foerderpilot.mmind.space --non-interactive --agree-tos --email <email>"`
8. **API-Key/Proxy:** Falls nötig, Konfiguration für Claude-API-Proxy dokumentieren und auf dem Server setzen.

---

## 5. Nginx-Template (Förderpilot, Option A – statisch)

```nginx
# foerderpilot.mmind.space – statische App
server {
    listen 443 ssl;
    server_name foerderpilot.mmind.space;
    root /opt/foerderpilot/static;
    index index.html bundle.html;
    client_max_body_size 10m;
    ssl_certificate /etc/letsencrypt/live/foerderpilot.mmind.space/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/foerderpilot.mmind.space/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    location / {
        try_files $uri $uri/ /index.html =404;
    }
}
server {
    listen 80;
    server_name foerderpilot.mmind.space;
    return 301 https://$host$request_uri;
}
```

(Nach Certbot sind die ssl_*-Pfade vorhanden; vorher ggf. nur listen 80 und root für Tests.)

---

## 6. Referenz-Skills (für den Agent)

- **EU AI Act Hub (eu-ai-act-hub):** Server-Details, SSH, aiact-Struktur, Docker-Befehle, Troubleshooting (Logs, Seed).
- **hetzner-nextjs-deploy:** Multi-Projekt-Setup, Parameter (Port, Pfad, Domain), Nginx, Certbot, Checkliste neues Projekt.

Förderpilot nutzt denselben Server und dieselben Muster (Port, Pfad, Nginx, SSL); nur die App ist statisch (React/Vite/Parcel) statt Next.js, daher optional ohne Docker.
