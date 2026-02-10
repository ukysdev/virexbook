import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Imprint | VirexBooks",
  description: "Imprint and contact information for VirexBooks",
  robots: "index, follow",
}

export default function ImprintPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Imprint</h1>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Provider identification</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>VirexBooks</strong>
            <br />
            [Your name or company name]
            <br />
            [Street and number]
            <br />
            [ZIP] [City]
            <br />
            Germany
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Phone:</strong> [Your phone number]
            <br />
            <strong>Email:</strong>{" "}
            <a href="mailto:contact@virexbooks.com" className="text-blue-500 hover:underline">
              contact@virexbooks.com
            </a>
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Representative</h2>
        <p className="text-sm">Representative in the sense of applicable law: [Your name]</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">VAT ID</h2>
        <p className="text-sm">
          VAT identification number, if applicable:
          <br />
          [Your VAT ID]
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Person responsible for editorial content</h2>
        <p className="text-sm">[Your name]</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Disclaimer</h2>
        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">Liability for content</h3>
          <p>
            The content on our pages has been created with the greatest care.
            However, we cannot guarantee the accuracy, completeness or
            timeliness of the content. As a service provider we are
            responsible for our own content on these pages according to
            general laws. However, we are not obliged to monitor transmitted
            or stored third-party information or to investigate circumstances
            that indicate unlawful activity.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">Liability for links</h3>
          <p>
            Our offer contains links to external third-party websites over
            which we have no control. Therefore, we cannot assume
            responsibility for the content of those sites. The respective
            provider or operator of the pages is always responsible for the
            content of linked pages.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">Copyright</h3>
          <p>
            The content and works created by the site operators on these pages
            are subject to copyright law. Reproduction, editing, distribution
            and any kind of exploitation outside the limits of copyright
            require the written consent of the respective author or creator.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Privacy</h2>
        <p className="text-sm">
          Using our website is generally possible without providing personal
          information. Where personal data (for example name, address or
          email address) is collected on our pages, this is done – where
          possible – on a voluntary basis. This data will not be passed on to
          third parties without your explicit consent.
        </p>
        <p className="text-sm mt-2">
          For more information on data protection, please see our
          <a href="/legal/privacy" className="text-blue-500 hover:underline">
            {' '}Privacy Policy
          </a>
          .
        </p>
      </section>

      <div className="pt-8 border-t text-xs text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString("en-US")}</p>
      </div>
    </div>
  )
}
