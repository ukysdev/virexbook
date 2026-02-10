import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Datenschutz | VirexBooks",
  description: "Datenschutzerklärung von VirexBooks",
  robots: "index, follow",
}

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Datenschutzerklärung</h1>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">1. Datenschutz auf einen Blick</h2>
        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">Allgemeine Hinweise</h3>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit
            Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
            Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert
            werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen
            sie unserer unter diesem Text aufgelisteten Datenschutzerklärung.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">2. Datenerfassung auf dieser Website</h2>

        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">Wer ist verantwortlich für die Datenerfassung?</h3>
          <p>
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
            Dessen Kontaktdaten können Sie dem Abschnitt „Angaben zum Verantwortlichen"
            in dieser Datenschutzerklärung entnehmen.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">Wie erfassen wir Ihre Daten?</h3>
          <p>
            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen.
            Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular
            eingeben. Andere Daten werden von uns oder unseren IT-Systemen
            automatisch erfasst, wenn Sie die Website besuchen. Dies sind vor allem
            technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des
            Seitenabrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie
            diese Website betreten.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">Wofür nutzen wir Ihre Daten?</h3>
          <p>
            Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der
            Website zu gewährleisten. Andere Daten können zur Analyse Ihres
            Nutzerverhaltens verwendet werden.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">3. Analyse-Tools und Tools von Drittanbietern</h2>
        <p className="text-sm">
          Beim Besuch dieser Website können Ihre Surf-Verhaltensweisen statistisch
          ausgewertet werden. Dies geschieht vor allem mit Cookies und mit sogenannten
          Analyseprogrammen. Die Analyse Ihres Surf-Verhaltens erfolgt in der Regel
          anonym; das Surf-Verhalten kann nicht zu Ihnen zurückverfolgt werden.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">4. Ihre Rechte</h2>
        <div className="space-y-2 text-sm">
          <p>
            Sie haben das Recht:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Auskunft:</strong> Sie können jederzeit Auskunft über Ihre
              bei uns gespeicherten personenbezogenen Daten erhalten
            </li>
            <li>
              <strong>Berichtigung:</strong> Sie haben das Recht, unrichtige
              Daten berichtigen zu lassen
            </li>
            <li>
              <strong>Löschung:</strong> Sie können die Löschung Ihrer Daten
              verlangen (Recht auf „Vergessenwerden")
            </li>
            <li>
              <strong>Einschränkung:</strong> Sie können die Einschränkung der
              Verarbeitung verlangen
            </li>
            <li>
              <strong>Datenportabilität:</strong> Sie haben das Recht, Ihre Daten
              in einem strukturierten, gängigen Format zu erhalten
            </li>
            <li>
              <strong>Widerspruch:</strong> Sie können der Verarbeitung Ihrer
              Daten widersprechen
            </li>
          </ul>
        </div>

        <p className="text-sm">
          Wenn Sie eines dieser Rechte ausüben möchten, kontaktieren Sie uns bitte
          per E-Mail unter: contact@virexbooks.com
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">5. Cookies</h2>
        <div className="space-y-2 text-sm">
          <p>
            Die Internetseiten verwenden teilweise so genannte Cookies. Cookies
            richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren.
            Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und
            sicherer zu machen. Cookies sind kleine Textdateien, die auf Ihrem
            Rechner abgelegt werden und die Ihr Browser speichert.
          </p>
          <p>
            Die meisten der von uns verwendeten Cookies sind so genannte
            „Session-Cookies". Sie werden nach Ende Ihres Besuchs automatisch
            gelöscht. Andere Cookies bleiben auf Ihrem Endgerät gespeichert bis
            Sie diese löschen.
          </p>
        </div>
        <p className="text-sm">
          Weitere Informationen zu Cookies finden Sie in unserem{" "}
          <a href="/legal/cookies" className="text-blue-500 hover:underline">
            Cookie-Banner
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">6. Kontaktformular</h2>
        <div className="space-y-2 text-sm">
          <p>
            Falls Sie uns per Kontaktformular Anfragen zukommen lassen, werden
            Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort
            angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den
            Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir
            nicht ohne Ihre Einwilligung weiter.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">7. Benutzerkonten</h2>
        <div className="space-y-2 text-sm">
          <p>
            Wenn Sie ein Benutzerkonto bei uns erstellen, werden die von Ihnen
            angegebenen Daten (wie Name, E-Mail, Benutzername) für die Verwaltung
            Ihres Kontos und zur Bereitstellung unserer Services gespeichert.
            Diese Daten werden vertraulich behandelt und nicht an Dritte
            weitergegeben, sofern nicht eine rechtliche Verpflichtung besteht.
          </p>
        </div>
      </section>

      <div className="pt-8 border-t text-xs text-muted-foreground">
        <p>Zuletzt aktualisiert: {new Date().toLocaleDateString("de-DE")}</p>
      </div>
    </div>
  )
}
