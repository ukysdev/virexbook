**Docker Setup — VirexBooks (Next.js + pnpm)**

- **Kurz:** Anleitung zum Builden und Hosten der Seite mit Docker / docker-compose.

Voraussetzungen
- Docker Engine installiert (und optional Docker Compose)
- Eine gültige `.env.local` Datei im Projektstamm mit den benötigten Umgebungsvariablen (z. B. Supabase-Keys). Die App liest die Variablen zur Laufzeit.

1) Schnellstart — Build & Run (Production)

- Image bauen:

```bash
docker build -t virexbooks .
```

- Container starten (Env aus `.env.local` laden):

```bash
# Hinweis: Das Image ist so konfiguriert, dass es die Dev-Server-Variante (`pnpm dev`) nutzt.
docker run --env-file .env.local -p 3000:3000 --name virexbooks -d virexbooks
```

Öffne: http://localhost:3000

2) Mit docker-compose (empfohlen)

- Builden & starten (führt `pnpm install`, `pnpm build` und inside-container `pnpm dev` aus):

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

Dieses Repository enthält eine `docker-compose.yml`, die bereits das Projekt mountet und `pnpm dev` ausführt.

- Starten (mit Hot-Reload):

```bash
docker compose up --build
```

Das mountet den lokalen Code in den Container und startet `pnpm dev`.

4) Hinweise zu Umgebungsvariablen
- Die Anwendung erwartet bestimmte ENV-Variablen (z. B. Supabase-URL/keys). Lege eine `.env.local` in deinem Projektstamm an und fülle die Werte:

```
# Beispiel
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
# weitere Variablen wie im Projekt benötigt
```

- Achte darauf, `.env.local` niemals in öffentliche Repositories zu pushen.

5) Troubleshooting
- Build schlägt fehl: Prüfe, ob native Build-Tools benötigt werden. Der Dockerfile installiert grundlegende Build-Tools (`make`, `g++`, `python3`).
- Laufzeitfehler wegen fehlender ENV: Stelle sicher, dass `.env.local` alle nötigen Variablen enthält.

6) Optional: Datenbank / Supabase lokal
- Dieses Repo stellt keinen lokalen Supabase-Server bereit. Für vollständige lokale Entwicklung kannst du die Supabase-CLI oder einen eigenen Postgres-Service hinzufügen.

7) Entfernen des Containers

```bash
docker rm -f virexbooks || true
docker rmi virexbooks || true
```

Wenn du möchtest, kann ich noch ein `docker-compose.dev.yml` mit einer fertigen Dev-Konfiguration erstellen oder eine kurze `.env.example` Datei anlegen. Sag mir, welche Option du bevorzugst.
