# Settings & GDPR Compliance

Diese Dokumentation beschreibt die neuen Settings-Funktionen und GDPR-Compliance-Features für VirexBooks.

## Überblick

Das Settings-System bietet Benutzern die folgenden Funktionalitäten:

1. **Account-Verwaltung** - E-Mail und Passwort ändern
2. **Datenschutz-Einstellungen** - GDPR-Datenrechte ausüben
3. **Konto-Löschung** - Sichere Löschung mit 30-Tage-Frist

## URL-Struktur

- `/settings` - Settings Übersicht
- `/settings/account` - Account-Einstellungen (Email, Passwort, Sitzungen)
- `/settings/privacy` - Datenschutzerklärung und DSGVO-Rechte
- `/settings/danger` - Kritische Aktionen (Account-Löschung)

## Features

### 1. Account-Einstellungen (`/settings/account`)

#### E-Mail ändern
- Benutzer können ihre E-Mail-Adresse ändern
- Ein Bestätigungslink wird an die neue E-Mail gesendet
- Die Änderung ist erst nach Bestätigung aktiv

#### Passwort ändern
- Mindestens 8 Zeichen erforderlich
- Sicherer API-Endpoint mit Validierung
- Bestätigung erforderlich

#### Sitzungsverwaltung
- Alle anderen Sitzungen abmelden (geplant)
- Sichere Session-Verwaltung

### 2. Datenschutz & GDPR (`/settings/privacy`)

#### A. Datenexport (DSGVO Art. 20)
**Funktion:** Benutzer können alle ihre Daten im JSON-Format exportieren

**Exportierte Daten:**
- Profildaten (Name, Bio, Avatar)
- Alle Bücher (veröffentlicht und Entwürfe)
- Alle Kapitel und Inhalte
- Kommentare
- Follower/Following-Listen
- Auth-Metadaten

**Endpoint:** POST `/api/settings/export-data`
**Format:** JSON-Datei, zeitgestempelt

**Verwendung im Frontend:**
```typescript
const response = await fetch("/api/settings/export-data", {
  method: "POST",
});
const blob = await response.blob();
// Download wird automatisch ausgelöst
```

#### B. Offizielle Datenanforderung (DSGVO Art. 15)
**Funktion:** Formelle GDPR-Anforderung mit Audit-Trail

**Details:**
- Anfrage wird in der Datenbank gespeichert
- 30-Tage Frist zur Beantwortung
- Audit-Trail mit IP und User-Agent
- Bestätigungsemail an den Benutzer

**Endpoint:** POST `/api/settings/request-data`

**Datenbank-Erfassung:**
```sql
INSERT INTO data_requests (
  user_id, request_type, email, status, 
  requested_at, expires_at
) VALUES (...)
```

#### C. Datenschutz-Präferenzen
- Analytik-Einwilligung
- Marketing-Cookie-Einwilligung
- Bestimmte Arten von Verarbeitung

### 3. Konto-Löschung (`/settings/danger`)

#### Konto-Lösch-Prozess

**Sicherheitsmechanismen:**
1. Bestätigungsdialog mit Warnnachricht
2. Erforderliche Bestätigung durch Texteingabe
3. 30-Tage Grace-Period vor endgültigem Löschen

**Gelöschte Daten:**
- Profil und Authentifizierung
- Alle Bücher und Kapitel
- Kommentare
- Follower/Following-Beziehungen
- Alle verbundenen Daten

**Endpoint:** POST `/api/settings/delete-account`

**Prozess:**
1. Benutzer beantragt Löschung
2. Löschungsanfrage wird in `deletion_requests` Tabelle gespeichert
3. Status wird auf "pending" gesetzt
4. Grace-Period von 30 Tagen
5. Nach 30 Tagen können Administratoren die endgültige Löschung durchführen

**Audit-Trail:**
- User-ID
- Email
- Anfrage-Zeitstempel
- Geplantes Löschdatum
- IP-Adresse und User-Agent
- Status-Updates

## Datenbank-Schema

### Tabelle: `data_requests`
```sql
CREATE TABLE data_requests (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  request_type VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### Tabelle: `deletion_requests`
```sql
CREATE TABLE deletion_requests (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  email VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  scheduled_deletion_at TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
```

## API-Endpoints

### 1. Passwort ändern
**POST** `/api/settings/change-password`

**Request:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response:**
```json
{
  "message": "Passwort erfolgreich geändert"
}
```

### 2. Daten exportieren
**POST** `/api/settings/export-data`

**Response:**
- JSON-Datei mit den Benutzerdaten
- Header: `Content-Type: application/json`
- Dateiname: `virexbooks-data-YYYY-MM-DD.json`

### 3. Daten anfordern
**POST** `/api/settings/request-data`

**Response:**
```json
{
  "message": "Datenanforderung eingereicht",
  "details": "Du erhältst deine Daten innerhalb von 30 Tagen per E-Mail"
}
```

### 4. Account löschen
**POST** `/api/settings/delete-account`

**Response:**
```json
{
  "message": "Account wird gelöscht..."
}
```

## GDPR-Compliance

### Rechtliche Grundlagen

1. **Recht auf Zugang (Art. 15)**
   - Benutzer können ihre Daten anfordern
   - 30-Tage Frist zur Beantwortung

2. **Recht auf Berichtigung (Art. 16)**
   - Benutzer können ihre Profildaten direkt bearbeiten

3. **Recht auf Löschung (Art. 17)**
   - "Right to be forgotten"
   - 30-Tage Grace-Period implementiert

4. **Recht auf Datenportabilität (Art. 20)**
   - JSON-Export in maschinenlesbarem Format
   - Strukturierte und häufig verwendete Formate

### Implementierte Sicherheitsmaßnahmen

1. **Authentifizierung**
   - Alle Endpoints erfordern Authentifizierung
   - Benutzer können nur eigene Daten abrufen

2. **Audit-Trail**
   - Alle Anfragen werden protokolliert
   - IP-Adresse und User-Agent werden gespeichert
   - Zeitstempel aller Aktionen

3. **Bestätigungsmechanismen**
   - Textbestätigung für Löschung erforderlich
   - Bestätigungslinks für Email-Änderungen
   - Bestätigungsdialoge für kritische Aktionen

4. **Datensicherheit**
   - RLS-Policies für Datenzugriff
   - Verschlüsselte Passwörter (Supabase Auth)
   - HTTPS für alle Endpoints

## Setup & Deployment

### 1. Datenbank-Migration

Führe die SQL-Migrationsdatei mit den neuen Tabellen aus:

```bash
# In Supabase Console oder via CLI
psql -U postgres -d your_db -f scripts/003_gdpr_tables.sql
```

### 2. Umgebungsvariablen

Stelle sicher, dass folgende Variablen gesetzt sind:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 3. Die neuen Routen sind sofort verfügbar

Die neuen Settings-Seiten sind unter `/settings` zugänglich.

## Zukünftige Improvements

1. **Email-Benachrichtigungen**
   - Bestätigungsemail für Datenexporte
   - Warnung vor Konto-Löschung
   - Benachrichtigung bei Passwortänderung

2. **Admin-Dashboard**
   - Verwaltung von Datenanforderungen
   - Verfolgung von Löschanforderungen
   - Compliance-Berichte

3. **Sitzungsverwaltung**
   - Liste aller aktiven Sitzungen
   - Möglichkeit, einzelne Sitzungen zu beenden
   - Geräte-Management

4. **Zwei-Faktor-Authentifizierung**
   - TOTP-Support
   - SMS-Backup-Codes

## Support & Kontakt

Bei Fragen zu Datenschutz und GDPR-Anfragen:
- Email: support@virexbooks.de
- Response-Zeit: 24 Stunden
- Frist: 30 Tage (GDPR-konform)

## Compliance-Checkliste

- [x] Recht auf Zugang implementiert (Datenexport)
- [x] Recht auf Berichtigung implementiert (Profil-Bearbeitung)
- [x] Recht auf Löschung implementiert (Account-Löschung)
- [x] Recht auf Datenportabilität implementiert (JSON-Export)
- [x] Audit-Trail implementiert
- [x] RLS-Policies für Sicherheit
- [ ] Email-Benachrichtigungen
- [ ] Admin-Verwaltungsinterface
- [ ] Datenschutzerklärung aktualisieren
- [ ] Cookie-Banner (falls nicht vorhanden)
