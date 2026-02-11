import { Navbar } from "@/components/navbar"
import Link from "next/link"

export default function PrivacyPage() {
  const lastUpdated = new Date(2024, 0, 1).toLocaleDateString("en-US")

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl py-12">
          <article className="prose prose-sm dark:prose-invert max-w-4xl mx-auto">
            <h1>Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: {lastUpdated}
            </p>

            <h2>1. Responsible Party</h2>
            <p>
              VirexBooks<br />
              [Address]<br />
              Email: support@virexbooks.de
            </p>

            <h2>2. Data Processing</h2>
            <p>
              We process the following types of data:
            </p>
            <ul>
              <li><strong>Authentication Data:</strong> Email, password hash (via Supabase)</li>
              <li><strong>Profile Data:</strong> Username, display name, bio, avatar</li>
              <li><strong>Content Data:</strong> Books, chapters, comments</li>
              <li><strong>Interaction Data:</strong> Likes, follower relationships, views</li>
              <li><strong>Technical Data:</strong> IP address, user agent (only for GDPR requests)</li>
            </ul>

            <h2>3. Legal Basis</h2>
            <p>
              Processing is based on:
            </p>
            <ul>
              <li>Art. 6(1)(a) GDPR - Your consent</li>
              <li>Art. 6(1)(b) GDPR - Contract performance</li>
              <li>Art. 6(1)(f) GDPR - Legitimate interests</li>
            </ul>

            <h2>4. Your Rights Under GDPR</h2>
            <p>
              You have the following rights regarding your personal data:
            </p>

            <h3>a) Right of Access (Art. 15)</h3>
            <p>
              You can request a copy of your personal data at any time.
              Use our{" "}
              <Link href="/settings/privacy" className="text-primary hover:underline">
                Privacy Settings
              </Link>
              {" "}for this purpose.
            </p>

            <h3>b) Right to Rectification (Art. 16)</h3>
            <p>
              You can correct inaccurate or incomplete data for free.
              Your{" "}
              <Link href="/settings/account" className="text-primary hover:underline">
                Account
              </Link>
              {" "}can be edited directly.
            </p>

            <h3>c) Right to Erasure (Art. 17 - "Right to be Forgotten")</h3>
            <p>
              You can delete your account and all associated data.
              Submit a request in{" "}
              <Link href="/settings/danger" className="text-primary hover:underline">
                Danger Zone
              </Link>
              .
            </p>
            <p>
              <strong>Important:</strong> There is a 30-day grace period. During this time, the deletion process can still be canceled.
            </p>

            <h3>d) Right to Data Portability (Art. 20)</h3>
            <p>
              You can export your data in a machine-readable format (JSON).
              This allows you to migrate your data to another service.
            </p>

            <h3>e) Right to Object (Art. 21)</h3>
            <p>
              You can object to the processing of your data for direct marketing.
            </p>

            <h2>5. Data Storage</h2>
            <ul>
              <li><strong>Active Accounts:</strong> Data is stored as long as the account is active</li>
              <li><strong>Deleted Accounts:</strong> Data is removed from backups within 30 days after deletion request</li>
              <li><strong>Processing Logs:</strong> 90 days retention</li>
            </ul>

            <h2>6. Cookies</h2>
            <p>
              We use cookies for the following purposes:
            </p>
            <ul>
              <li><strong>Essential Cookies:</strong> Authentication, session management (always active)</li>
              <li><strong>Analytics Cookies:</strong> Service improvement (optional)</li>
              <li><strong>Marketing Cookies:</strong> Personalized content (optional)</li>
            </ul>

            <p>
              You can change your cookie settings at any time in{" "}
              <Link href="/settings/privacy" className="text-primary hover:underline">
                Privacy Settings
              </Link>
              .
            </p>

            <h2>7. Third-Party Services</h2>
            <ul>
              <li><strong>Supabase:</strong> Data storage and authentication</li>
              <li><strong>Vercel:</strong> Hosting provider</li>
            </ul>

            <p>
              These services process your data according to their privacy policies.
            </p>

            <h2>8. Security</h2>
            <p>
              We implement the following security measures:
            </p>
            <ul>
              <li>HTTPS encryption for all connections</li>
              <li>Encrypted password storage</li>
              <li>Row-Level Security (RLS) at database level</li>
              <li>Regular security audits</li>
              <li>GDPR-compliant audit trails</li>
            </ul>

            <h2>9. Data Protection Officer</h2>
            <p>
              For questions about data processing, contact us at:
            </p>
            <p>
              Email: <a href="mailto:support@virexbooks.de">support@virexbooks.de</a><br />
              Response time: 24 hours
            </p>

            <h2>10. Complaint</h2>
            <p>
              You have the right to file a complaint with the competent data protection authority.
              For Germany:
            </p>
            <p>
              The Federal Data Protection Commissioner<br />
              www.bfdi.bund.de
            </p>

            <h2>11. Changes to this Privacy Policy</h2>
            <p>
              We may update this privacy policy at any time. Changes will be published on this page.
              Material changes will be notified to you by email.
            </p>

            <hr className="my-8" />

            <p className="text-sm text-muted-foreground">
              This privacy policy was created to comply with the GDPR (EU General Data Protection Regulation).
            </p>
          </article>
        </div>
      </div>
    </>
  )
}
