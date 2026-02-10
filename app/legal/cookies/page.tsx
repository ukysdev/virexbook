import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookies | VirexBooks",
  description: "Cookie Policy of VirexBooks",
  robots: "index, follow",
}

export default function CookiesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cookie Policy</h1>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">What are Cookies?</h2>
        <div className="space-y-2 text-sm">
          <p>
            Cookies are small text files that are stored on your device (computer, tablet,
            or mobile phone) when you visit a website. They allow the website to remember
            information about your visit, such as your preferred language and other settings.
          </p>
          <p>
            Cookies do not cause any harm to your device and do not contain viruses. These
            are legitimate technologies used by most websites.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Which Cookies Do We Use?</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-2">Essential Cookies</h3>
            <p className="text-sm">
              These cookies are required for the website to work properly. They cannot be
              disabled, as the website will not function correctly otherwise. They are used,
              for example, for authentication and fraud protection.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Functional Cookies</h3>
            <p className="text-sm">
              These cookies enable advanced functionality and are used to remember your
              preferences (e.g., language, page size, filter settings). They make your next
              visit to the website easier.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Analytics Cookies</h3>
            <p className="text-sm">
              These cookies help us understand how users interact with our website. We collect
              information such as the number of visitors, pages visited, and how long you use
              the website. This information helps us improve our website. The collected data
              is anonymized and cannot be traced back to you.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Marketing Cookies</h3>
            <p className="text-sm">
              These cookies are used to show you relevant advertising. They can track you
              across multiple websites. We only use these with your explicit consent.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Session Cookies vs. Persistent Cookies</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Session Cookies:</strong> These are automatically deleted when you close
            your browser. They are used to manage your user account during a session.
          </p>
          <p>
            <strong>Persistent Cookies:</strong> These remain on your device until you delete
            them manually or they expire. They are used to remember your settings.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">How Do You Control Cookies?</h2>
        <div className="space-y-2 text-sm">
          <p>
            You can control cookies through your browser settings. Most browsers allow you to:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Completely block cookies</li>
            <li>Accept cookies only from trusted websites</li>
            <li>Automatically delete cookies when you close your browser</li>
            <li>View and delete stored cookies</li>
          </ul>
          <p className="mt-3">
            Please note that disabling essential cookies will prevent the website from
            functioning properly.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Third-Party Cookies</h2>
        <div className="space-y-2 text-sm">
          <p>
            Our website may reference or embed content from third parties, such as videos or
            maps. These may set their own cookies. We have no control over third-party
            cookies. Please review the privacy policies of these third-party providers for
            more information.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Your GDPR Rights</h2>
        <div className="space-y-2 text-sm">
          <p>
            Under GDPR, you have the right to revoke your consent to cookies at any time.
            Please note that this does not affect the lawfulness of data processing before
            revocation.
          </p>
          <p className="mt-2">
            If you have questions about our cookie usage or GDPR, please contact us at:{" "}
            <a href="mailto:contact@virexbooks.com" className="text-blue-500 hover:underline">
              contact@virexbooks.com
            </a>
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Cookie Policy Updates</h2>
        <div className="space-y-2 text-sm">
          <p>
            This cookie policy is updated regularly. The last update was on:{" "}
            <strong>{new Date().toLocaleDateString("en-US")}</strong>
          </p>
        </div>
      </section>

      <div className="pt-8 border-t text-xs text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString("en-US")}</p>
      </div>
    </div>
  )
}

