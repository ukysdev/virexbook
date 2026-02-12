**Docker Setup â€” VirexBooks (Next.js + pnpm)**

- **Kurz:** Anleitung zum Builden und Hosten der Seite mit Docker / docker-compose.

Voraussetzungen
- Docker Engine installiert (und optional Docker Compose)
- Eine gÃ¼ltige `.env.local` Datei im Projektstamm mit den benÃ¶tigten Umgebungsvariablen (z. B. Supabase-Keys). Die App liest die Variablen zur Laufzeit.

1) Schnellstart â€” Build & Run (Production)

- Image bauen:

```bash
docker build -t virexbooks .
```

- Container starten (Env aus `.env.local` laden):

```bash
# Hinweis: Das Image ist so konfiguriert, dass es die Dev-Server-Variante (`pnpm dev`) nutzt.
docker run --env-file .env.local -p 3000:3000 --name virexbooks -d virexbooks
```

Ã–ffne: http://localhost:3000

2) Mit docker-compose (empfohlen)

- Builden & starten (fÃ¼hrt `pnpm install`, `pnpm build` und inside-container `pnpm dev` aus):

```bash
docker compose up --build -d
```

- Logs ansehen:

```bash
docker compose logs -f
```

- Stoppen & entfernen:

```bash
docker compose down
```

3) Development (lokal, mit Hot-Reload)

Dieses Repository enthÃ¤lt eine `docker-compose.yml`, die bereits das Projekt mountet und `pnpm dev` ausfÃ¼hrt.

- Starten (mit Hot-Reload):

```bash
docker compose up --build
```

Das mountet den lokalen Code in den Container und startet `pnpm dev`.

4) Hinweise zu Umgebungsvariablen
- Die Anwendung erwartet bestimmte ENV-Variablen (z. B. Supabase-URL/keys). Lege eine `.env.local` in deinem Projektstamm an und fÃ¼lle die Werte:

```
# Beispiel
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=...
S3_REGION=us-east-1
S3_ENDPOINT=...
S3_PUBLIC_BASE_URL=...
S3_FORCE_PATH_STYLE=true
# weitere Variablen wie im Projekt benÃ¶tigt
```

- Achte darauf, `.env.local` niemals in Ã¶ffentliche Repositories zu pushen.

5) Troubleshooting
- Build schlÃ¤gt fehl: PrÃ¼fe, ob native Build-Tools benÃ¶tigt werden. Der Dockerfile installiert grundlegende Build-Tools (`make`, `g++`, `python3`).
- Laufzeitfehler wegen fehlender ENV: Stelle sicher, dass `.env.local` alle nÃ¶tigen Variablen enthÃ¤lt.

6) Optional: Datenbank / Supabase lokal
- Dieses Repo stellt keinen lokalen Supabase-Server bereit. FÃ¼r vollstÃ¤ndige lokale Entwicklung kannst du die Supabase-CLI oder einen eigenen Postgres-Service hinzufÃ¼gen.

7) Entfernen des Containers

```bash
docker rm -f virexbooks || true
docker rmi virexbooks || true
```

Wenn du mÃ¶chtest, kann ich noch ein `docker-compose.dev.yml` mit einer fertigen Dev-Konfiguration erstellen oder eine kurze `.env.example` Datei anlegen. Sag mir, welche Option du bevorzugst.
