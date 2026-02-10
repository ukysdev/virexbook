import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AGB | VirexBooks",
  description: "Allgemeine Geschäftsbedingungen von VirexBooks",
  robots: "index, follow",
}

export default function TermsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Allgemeine Geschäftsbedingungen (AGB)</h1>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">1. Geltungsbereich</h2>
        <div className="space-y-2 text-sm">
          <p>
            Diese AGB gelten für alle Leistungen, die wir Ihnen auf der Website
            VirexBooks anbieten. Durch die Nutzung unserer Website erklären Sie
            sich mit diesen Bedingungen einverstanden.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">2. Registrierung und Benutzerkonto</h2>
        <div className="space-y-2 text-sm">
          <p>
            Für die Nutzung bestimmter Funktionen ist eine Registrierung erforderlich.
            Sie erklären sich verpflichtet, wahrheitsgemäße Angaben zu machen. Sie
            sind allein verantwortlich für die Geheimhaltung Ihres Passworts. Sie
            haften für alle Aktivitäten, die unter Ihrem Konto stattfinden.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">3. Nutzungsrechte und Beschränkungen</h2>
        <div className="space-y-2 text-sm">
          <p>
            Wir gewähren Ihnen eine begrenzte, nicht ausschließliche,
            nicht übertragbare Lizenz zur Nutzung von VirexBooks für
            Ihre persönlichen, nicht-kommerziellen Zwecke. Dies umfasst:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-3">
            <li>Das Lesen und Genießen von Inhalten anderer Autoren</li>
            <li>Das Veröffentlichen Ihrer eigenen Werke</li>
            <li>Die Teilnahme an der Community</li>
          </ul>
          <p>
            Sie dürfen darüber hinaus nicht:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Inhalte anderer Benutzer vervielfältigen, ändern oder ohne Genehmigung verbreiten</li>
            <li>Automatisierte Systeme zur Datenerfassung nutzen</li>
            <li>Andere Benutzer belästigen oder bedrohen</li>
            <li>Community-Richtlinien verletzen</li>
            <li>Die Platform hacken oder manipulieren</li>
            <li>Ihren Account verkaufen oder an andere Personen abtreten</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">4. Benutzer-Inhalte und Urheberrechte</h2>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Ihre Rechte an Ihren Inhalten:</p>
          <p>
            Sie behalten die vollständigen Urheberrechte an allen Inhalten, die Sie 
            auf VirexBooks erstellen und veröffentlichen (Texte, Geschichten, Kapitel, etc.). 
            VirexBooks beansprucht keine Eigentumsrechte an Ihren Werken.
          </p>

          <p className="font-semibold mt-3">Lizenz an VirexBooks:</p>
          <p>
            Mit dem Hochladen und Veröffentlichen von Inhalten gewähren Sie VirexBooks 
            eine weltweite, kostenlose, nicht ausschließliche Lizenz, um:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Ihre Inhalte auf der Platform zu speichern und zu hosten</li>
            <li>Ihre Inhalte den anderen Benutzern anzuzeigen</li>
            <li>Ihre Inhalte für technische Zwecke zu verarbeiten (z.B. Backups, Indizierung, Optimierung)</li>
            <li>Ihre Inhalte zu promoten (z.B. in Kategorien, Sammlungen, in sozialen Medien)</li>
          </ul>

          <p className="font-semibold mt-3">Verantwortung:</p>
          <p>
            Sie sind allein verantwortlich für die Inhalte, die Sie veröffentlichen. 
            Sie versichern, dass:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Sie die Urheberrechte an Ihren Inhalten haben oder über die erforderliche Lizenz verfügen</li>
            <li>Ihre Inhalte keine Rechte Dritter verletzen</li>
            <li>Ihre Inhalte keine illegalen Materialien enthalten</li>
            <li>Ihre Inhalte nicht beleidigend, rassistisch oder diskriminierend sind</li>
          </ul>

          <p className="font-semibold mt-3">Löschung Ihrer Inhalte:</p>
          <p>
            Sie können Ihre Inhalte jederzeit löschen. Nach der Löschung werden sie 
            nicht mehr auf der öffentlichen Platform angezeigt, aber Backups können noch 
            kurzzeitig vorhanden sein.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">5. Haftungsausschluss und Inhalte von Benutzern</h2>
        <div className="space-y-2 text-sm">
          <p>
            VirexBooks ist eine Community-Platform, auf der Benutzer Inhalte erstellen 
            und teilen. Wir sind nicht verantwortlich für die Richtigkeit, Vollständigkeit 
            oder Qualität der von Benutzern erstellten Inhalte.
          </p>
          <p>
            VirexBooks wird auf einer „wie besehen" Basis bereitgestellt. Wir
            lehnen alle ausdrücklichen und stillschweigenden Garantien ab,
            einschließlich der Garantien der Marktgängigkeit und Eignung für
            einen bestimmten Zweck. Wir haften nicht für:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Datenverlust oder Beschädigungen</li>
            <li>Unterbrechung oder Ausfälle des Service</li>
            <li>Von Benutzern erstellte Inhalte (Geschichten, Kommentare, etc.)</li>
            <li>Indirekte oder Folgeschäden</li>
            <li>Jegliche Verletzungen von Rechten Dritter durch Benutzer-Inhalte</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">6. Haftungsbeschränkung</h2>
        <div className="space-y-2 text-sm">
          <p>
            In keinem Fall haften wir für Schäden, die sich aus der Nutzung oder
            Unmöglichkeit der Nutzung von VirexBooks ergeben, auch wenn wir auf
            die Möglichkeit solcher Schäden hingewiesen wurden.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">7. Moderation und Inhaltsrichtlinien</h2>
        <div className="space-y-2 text-sm">
          <p>
            VirexBooks behält sich das Recht vor, Inhalte zu moderieren und zu entfernen, 
            die gegen unsere Community-Richtlinien verstoßen, einschließlich:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Illegale oder verschleierte Inhalte</li>
            <li>Rassistische, sexistische oder diskriminierende Inhalte</li>
            <li>Mobbing oder Belästigung von anderen Benutzern</li>
            <li>Spam oder automatisiert generierte Inhalte</li>
            <li>Inhalte, die Rechte Dritter verletzen</li>
            <li>Sexuelle Inhalte mit Mindern (absolutes Verbot)</li>
          </ul>
          <p className="mt-3">
            Wir werden Ihnen nach Möglichkeit vorher benachrichtigen, wenn wir Ihre 
            Inhalte entfernen. In schwerwiegenden Fällen können wir Ihren Account 
            sofort deaktivieren.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">8. Änderung und Beendigung</h2>
        <div className="space-y-2 text-sm">
          <p>
            Wir behalten uns das Recht vor, VirexBooks und diese AGB jederzeit
            zu ändern. Wesentliche Änderungen werden Ihnen mitgeteilt.
          </p>
          <p>
            Wir können Ihren Zugriff auf VirexBooks jederzeit beenden, wenn Sie 
            gegen diese AGB verstoßen. Sie können Ihren Account jederzeit selbst löschen.
          </p>
          <p className="mt-2 font-semibold">
            Wichtig: Wenn Ihr Account gelöscht wird, werden Ihre veröffentlichten Inhalte 
            nicht automatisch gelöscht. Sie müssen diese manuell löschen, wenn Sie möchten, 
            dass sie nicht mehr verfügbar sind. Sie können auch Ihre Inhalte exportieren, 
            bevor Sie Ihren Account löschen.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">9. Datenschutz und Privatsphäre</h2>
        <div className="space-y-2 text-sm">
          <p>
            Ihre Nutzung von VirexBooks unterliegt unserer Datenschutzerklärung. 
            Bitte lesen Sie unsere{" "}
            <a href="/legal/privacy" className="text-blue-500 hover:underline">
              Datenschutzerklärung
            </a>
            , um zu verstehen, wie wir Ihre persönlichen Daten verarbeiten.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">10. Salvatorische Klausel</h2>
        <div className="space-y-2 text-sm">
          <p>
            Sollte eine Bestimmung dieser AGB unwirksam sein, bleibt die Gültigkeit 
            der übrigen Bestimmungen unberührt. Wir werden die unwirksame Bestimmung 
            durch eine wirksame Bestimmung ersetzen, die dem Sinn und Zweck der 
            ursprünglichen Bestimmung entspricht.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">11. Anwendbares Recht</h2>
        <div className="space-y-2 text-sm">
          <p>
            Diese AGB werden nach deutschem Recht ausgelegt und die deutschen
            Gerichte haben die ausschließliche Gerichtsbarkeit über alle Streitigkeiten
            in Bezug auf diese AGB.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">12. Kontakt</h2>
        <div className="space-y-2 text-sm">
          <p>
            Falls Sie Fragen zu diesen AGB haben, kontaktieren Sie uns bitte unter:
            <br />
            <a href="mailto:contact@virexbooks.com" className="text-blue-500 hover:underline">
              contact@virexbooks.com
            </a>
          </p>
        </div>
      </section>

      <div className="pt-8 border-t text-xs text-muted-foreground">
        <p>Zuletzt aktualisiert: {new Date().toLocaleDateString("de-DE")}</p>
      </div>
    </div>
  )
}
