import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | VirexBooks",
  description: "Privacy policy and data processing information for VirexBooks",
  robots: "index, follow",
}

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">1. Summary</h2>
        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">General information</h3>
          <p>
            The following notes provide a simple overview of what happens to your
            personal data when you visit this website. Personal data are all
            data with which you can be personally identified. For detailed
            information on data protection, please refer to the full privacy
            policy below.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">2. Data collection on this website</h2>

        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">Who is responsible for data collection?</h3>
          <p>
            The data processing on this website is carried out by the website
            operator. You can find the operator's contact details in the
            "Imprint" section of this site.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">How do we collect your data?</h3>
          <p>
            Some data is provided directly by you (for example via contact forms).
            Other data is collected automatically by our IT systems when you
            visit the site (technical data such as browser type, operating
            system or time of access). This data collection occurs as soon as
            you access the website.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">Why do we use your data?</h3>
          <p>
            Some data is required to provide the website correctly. Other data
            may be used to analyze user behavior to improve the service.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">3. Analytics & third-party tools</h2>
        <p className="text-sm">
          When visiting this website your browsing behavior may be analyzed for
          statistical purposes using cookies and analytics tools. These analyses
          are normally performed anonymously and cannot be directly traced back
          to you.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">4. Your rights</h2>
        <div className="space-y-2 text-sm">
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Access:</strong> Request information about the personal data
              we hold about you.
            </li>
            <li>
              <strong>Rectification:</strong> Request correction of inaccurate data.
            </li>
            <li>
              <strong>Erasure:</strong> Request deletion of your data (right to be
              forgotten) where applicable.
            </li>
            <li>
              <strong>Restriction:</strong> Request restriction of processing.
            </li>
            <li>
              <strong>Data portability:</strong> Receive your data in a structured,
              commonly used and machine-readable format.
            </li>
            <li>
              <strong>Objection:</strong> Object to processing where applicable.
            </li>
          </ul>
        </div>

        <p className="text-sm">To exercise any of these rights, contact us at contact@virexbooks.com.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">5. Cookies</h2>
        <div className="space-y-2 text-sm">
          <p>
            This site uses cookies in places. Cookies are small text files
            stored on your device to make the website more user-friendly,
            effective and secure. They do not harm your device.
          </p>
          <p>
            Most cookies used are session cookies and are deleted when you
            close your browser. Other cookies may persist until you delete
            them.
          </p>
        </div>
        <p className="text-sm">
          For more information about cookies, see our <a href="/legal/cookies" className="text-blue-500 hover:underline">Cookie Policy</a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">6. Contact form</h2>
        <div className="space-y-2 text-sm">
          <p>
            If you contact us via a contact form, the details you provide will
            be stored to process your request and for possible follow-up
            questions. We will not share this data without your consent.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">7. User accounts</h2>
        <div className="space-y-2 text-sm">
          <p>
            If you create an account, the information you provide (name, email,
            username) will be stored to manage your account and provide our
            services. This data is treated confidentially and is not shared
            with third parties unless required by law.
          </p>
        </div>
      </section>

      <div className="pt-8 border-t text-xs text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString("en-US")}</p>
      </div>
    </div>
  )
}
