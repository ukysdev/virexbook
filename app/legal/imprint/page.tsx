import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Impressum | VirexBooks",
  description: "Impressum und Kontaktinformationen von VirexBooks",
  robots: "index, follow",
}

export default function ImprintPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Impressum</h1>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Angaben gemäß § 5 TMG</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>VirexBooks</strong>
            <br />
            [Ihr Name oder Unternehmensname]
            <br />
            [Straße Hausnummer]
            <br />
            [PLZ] [Stadt]
            <br />
            Deutschland
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Kontakt</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Telefon:</strong> [Ihre Telefonnummer]
            <br />
            <strong>E-Mail:</strong>{" "}
            <a href="mailto:contact@virexbooks.com" className="text-blue-500 hover:underline">
              contact@virexbooks.com
            </a>
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Vertreter</h2>
        <p className="text-sm">
          Vertreter im Sinne des § 7 Abs. 1 TMG: [Ihr Name]
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Umsatzsteuer-ID</h2>
        <p className="text-sm">
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
          <br />
          [Ihre USt-ID]
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Verantwortlich für redaktionelle Inhalte</h2>
        <p className="text-sm">[Ihr Name]</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Haftungsausschluss</h2>
        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">Haftung für Inhalte</h3>
          <p>
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt.
            Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
            können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind
            wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach
            den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind
            wir als Diensteanbieter jedoch nicht verpflichtet, die von Nutzern
            übermittelten oder gespeicherten Informationen zu überwachen oder
            nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
            hinweisen.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">Haftung für Links</h3>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
            fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
            der Seiten verantwortlich.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">Urheberrecht</h3>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Die
            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
            schriftlichen Zustimmung des jeweiligen Autors oder Erstellers.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Datenschutz</h2>
        <p className="text-sm">
          Die Nutzung unserer Website ist in der Regel ohne Angabe
          personenbezogener Daten möglich. Soweit auf unseren Seiten
          personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail
          Adresse) erhoben werden, erfolgt dies, soweit möglich, stets auf
          freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche
          Zustimmung nicht an Dritte weitergegeben.
        </p>
        <p className="text-sm mt-2">
          Weitere Informationen zu unserem Datenschutz finden Sie in unserer{" "}
          <a href="/legal/privacy" className="text-blue-500 hover:underline">
            Datenschutzerklärung
          </a>
          .
        </p>
      </section>

      <div className="pt-8 border-t text-xs text-muted-foreground">
        <p>Zuletzt aktualisiert: {new Date().toLocaleDateString("de-DE")}</p>
      </div>
    </div>
  )
}
