import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | VirexBooks",
  description: "Terms of Service of VirexBooks",
  robots: "index, follow",
}

export default function TermsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Terms of Service</h1>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">1. Scope</h2>
        <div className="space-y-2 text-sm">
          <p>
            These Terms of Service apply to all services we provide to you on the VirexBooks website. By using our
            website, you agree to these terms and conditions.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">2. Registration and User Account</h2>
        <div className="space-y-2 text-sm">
          <p>
            Registration is required to use certain features. You agree to provide accurate and truthful information.
            You are solely responsible for keeping your password confidential. You are liable for all activities that
            occur under your account.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">3. License and Restrictions</h2>
        <div className="space-y-2 text-sm">
          <p>
            We grant you a limited, non-exclusive, non-transferable license to use VirexBooks for your personal,
            non-commercial purposes. This includes:
          </p>

          <ul className="list-disc list-inside space-y-1">
            <li>Reading and enjoying content from other authors</li>
            <li>Publishing your own works</li>
            <li>Participating in the community</li>
          </ul>

          <p className="mt-3 font-semibold">You must not:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Reproduce, modify, or distribute other users&apos; content without permission</li>
            <li>Use automated systems to collect data</li>
            <li>Harass or threaten other users</li>
            <li>Violate community guidelines</li>
            <li>Hack or manipulate the platform</li>
            <li>Sell your account or transfer it to others</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">4. User Content and Copyright</h2>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Your rights to your content</p>
          <p>
            You retain full copyright to all content you create and publish on VirexBooks (texts, stories, chapters,
            etc.). VirexBooks claims no ownership rights to your works.
          </p>

          <p className="mt-3 font-semibold">License to VirexBooks</p>
          <p>
            By uploading and publishing content, you grant VirexBooks a worldwide, royalty-free, non-exclusive license
            to:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Store and host your content on the platform</li>
            <li>Display your content to other users</li>
            <li>Process your content for technical purposes (e.g., backups, indexing, optimization)</li>
            <li>Promote your content (e.g., in categories, collections, on social media)</li>
          </ul>

          <p className="mt-3 font-semibold">Responsibility</p>
          <p>You are solely responsible for the content you publish. You warrant that:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>You own the copyright to your content or have the necessary license</li>
            <li>Your content does not infringe third-party rights</li>
            <li>Your content does not contain illegal material</li>
            <li>Your content is not offensive, racist, or discriminatory</li>
          </ul>

          <p className="mt-3 font-semibold">Deleting your content</p>
          <p>
            You can delete your content at any time. After deletion, it will no longer be displayed on the public
            platform, but backups may still exist temporarily.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">5. Disclaimer and User-Generated Content</h2>
        <div className="space-y-2 text-sm">
          <p>
            VirexBooks is a community platform where users create and share content. We are not responsible for the
            accuracy, completeness, or quality of user-generated content.
          </p>
          <p>
            VirexBooks is provided on an &quot;as is&quot; basis. We disclaim all express and implied warranties,
            including warranties of merchantability and fitness for a particular purpose. We are not liable for:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Data loss or corruption</li>
            <li>Service interruptions or outages</li>
            <li>User-generated content (stories, comments, etc.)</li>
            <li>Indirect or consequential damages</li>
            <li>Any violation of third-party rights by user content</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">6. Limitation of Liability</h2>
        <div className="space-y-2 text-sm">
          <p>
            In no event shall we be liable for any damages arising out of or in connection with your use of or inability
            to use VirexBooks, even if we have been advised of the possibility of such damages.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">7. Content Moderation and Guidelines</h2>
        <div className="space-y-2 text-sm">
          <p>VirexBooks reserves the right to moderate and remove content that violates our community guidelines, including:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Illegal content</li>
            <li>Racist, sexist, or discriminatory content</li>
            <li>Harassment or bullying of other users</li>
            <li>Spam or automatically generated content</li>
            <li>Content that violates third-party rights</li>
            <li>Sexual content involving minors (absolute prohibition)</li>
          </ul>
          <p className="mt-3">
            We will notify you in advance when possible if we remove your content. In serious cases, we may suspend your
            account immediately.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">8. Modifications and Termination</h2>
        <div className="space-y-2 text-sm">
          <p>
            We reserve the right to modify VirexBooks and these Terms of Service at any time. Material changes will be
            communicated to you.
          </p>
          <p>
            We may terminate your access to VirexBooks at any time if you violate these Terms of Service. You may delete
            your account at any time.
          </p>
          <p className="mt-2 font-semibold">
            Important: When your account is deleted, your published content will not be automatically deleted. You must
            manually delete it if you want it to no longer be available. You can also export your content before
            deleting your account.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">9. Privacy and Data Protection</h2>
        <div className="space-y-2 text-sm">
          <p>
            Your use of VirexBooks is governed by our Privacy Policy. Please read our{" "}
            <a href="/legal/privacy" className="text-blue-500 hover:underline">
              Privacy Policy
            </a>{" "}
            to understand how we process your personal data.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">10. Severability</h2>
        <div className="space-y-2 text-sm">
          <p>
            If any provision of these Terms of Service is found to be invalid, the validity of the remaining provisions
            shall not be affected. We will replace any invalid provision with a valid one that achieves the intent and
            purpose of the original provision.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">11. Governing Law</h2>
        <div className="space-y-2 text-sm">
          <p>
            These Terms of Service shall be governed by and construed in accordance with the laws of Germany, and the
            German courts shall have exclusive jurisdiction over any disputes arising out of or relating to these Terms
            of Service.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">12. Contact</h2>
        <div className="space-y-2 text-sm">
          <p>
            If you have any questions about these Terms of Service, please contact us at:
            <br />
            <a href="mailto:contact@virexbooks.com" className="text-blue-500 hover:underline">
              contact@virexbooks.com
            </a>
          </p>
        </div>
      </section>

      <div className="pt-8 border-t text-xs text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString("en-US")}</p>
      </div>
    </div>
  )
}
