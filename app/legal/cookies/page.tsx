import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookies | VirexBooks",
  description: "Cookie-Richtlinie von VirexBooks",
  robots: "index, follow",
}

export default function CookiesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cookie-Richtlinie</h1>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Was sind Cookies?</h2>
        <div className="space-y-2 text-sm">
          <p>
            Cookies sind kleine Textdateien, die auf Ihrem Gerät (Computer, Tablet
            oder Mobiltelefon) gespeichert werden, wenn Sie eine Website besuchen.
            Sie ermöglichen es der Website, sich Informationen über Ihren Besuch
            zu merken, wie zum Beispiel Ihre bevorzugte Sprache und andere
            Einstellungen.
          </p>
          <p>
            Cookies richten auf Ihrem Gerät keinen Schaden an und enthalten keine
            Viren. Dies sind legitime Technologien, die von den meisten Websites
            verwendet werden.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Welche Cookies verwenden wir?</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-2">Notwendige Cookies</h3>
            <p className="text-sm">
              Diese Cookies sind erforderlich, damit die Website funktioniert.
              Sie können nicht deaktiviert werden, da die Website sonst nicht richtig
              funktioniert. Sie werden beispielsweise für die Authentifizierung und
              den Schutz vor Betrug verwendet.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Funktionale Cookies</h3>
            <p className="text-sm">
              Diese Cookies ermöglichen erweiterte Funktionalität und werden
              verwendet, um sich an Ihre Präferenzen zu erinnern (z.B. Sprache,
              Seitengröße, Filtereinstellungen). Sie erleichtern Ihren nächsten
              Besuch auf der Website.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Analytische Cookies</h3>
            <p className="text-sm">
              Diese Cookies helfen uns zu verstehen, wie Nutzer unsere Website nutzen.
              Wir erfassen Informationen wie die Anzahl der Besucher, die besuchten
              Seiten und wie lange Sie die Website nutzen. Diese Informationen
              helfen uns, unsere Website zu verbessern. Die gesammelten Daten werden
              anonymisiert und können nicht zu Ihnen zurückverfolgt werden.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Marketing Cookies</h3>
            <p className="text-sm">
              Diese Cookies werden verwendet, um Ihnen relevante Werbung anzuzeigen.
              Sie können Sie über mehrere Websites hinweg verfolgen. Wir nutzen diese
              nur mit Ihrer ausdrücklichen Zustimmung.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Session Cookies vs. Persistent Cookies</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Session Cookies:</strong> Diese werden automatisch gelöscht,
            wenn Sie Ihren Browser schließen. Sie werden verwendet, um Ihr
            Benutzerkonto während einer Sitzung zu verwalten.
          </p>
          <p>
            <strong>Persistent Cookies:</strong> Diese bleiben auf Ihrem Gerät
            gespeichert, bis Sie sie manuell löschen oder sie ablaufen. Sie werden
            verwendet, um sich an Ihre Einstellungen zu erinnern.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Wie kontrollieren Sie Cookies?</h2>
        <div className="space-y-2 text-sm">
          <p>
            Sie können die Cookies über die Einstellungen Ihres Browsers steuern.
            Die meisten Browser ermöglichen es Ihnen:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Cookies vollständig zu blockieren</li>
            <li>Nur Cookies von vertrauenswürdigen Websites zu akzeptieren</li>
            <li>Cookies automatisch zu löschen, wenn Sie den Browser schließen</li>
            <li>Gespeicherte Cookies anzuzeigen und zu löschen</li>
          </ul>
          <p className="mt-3">
            Bitte beachten Sie, dass das Deaktivieren von notwendigen Cookies
            dazu führt, dass die Website nicht richtig funktioniert.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Cookies von Dritten</h2>
        <div className="space-y-2 text-sm">
          <p>
            Unsere Website kann auf Inhalte von Dritten verweisen oder einbetten,
            wie Videos oder Karten. Diese können ihre eigenen Cookies setzen. Wir
            haben keine Kontrolle über die Cookies von Dritten. Bitte überprüfen
            Sie die Datenschutzerklärungen dieser Drittanbieter für weitere
            Informationen.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Ihre DSGVO-Rechte</h2>
        <div className="space-y-2 text-sm">
          <p>
            Gemäß DSGVO haben Sie das Recht, Ihre Zustimmung zu Cookies
            jederzeit zu widerrufen. Bitte beachten Sie, dass dies die
            Rechtmäßigkeit der vor dem Widerruf verarbeiteten Daten nicht
            berührt.
          </p>
          <p className="mt-2">
            Wenn Sie Fragen zu unserer Cookie-Nutzung oder zur DSGVO haben,
            kontaktieren Sie uns bitte unter:{" "}
            <a href="mailto:contact@virexbooks.com" className="text-blue-500 hover:underline">
              contact@virexbooks.com
            </a>
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Cookies aktualisieren</h2>
        <div className="space-y-2 text-sm">
          <p>
            Diese Cookie-Richtlinie wird regelmäßig aktualisiert. Die letzte
            Aktualisierung erfolgte am:{" "}
            <strong>{new Date().toLocaleDateString("de-DE")}</strong>
          </p>
        </div>
      </section>

      <div className="pt-8 border-t text-xs text-muted-foreground">
        <p>Zuletzt aktualisiert: {new Date().toLocaleDateString("de-DE")}</p>
      </div>
    </div>
  )
}
