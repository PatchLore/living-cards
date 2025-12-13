export const metadata = {
  title: "Privacy Policy | CardRoots",
  description: "Privacy Policy for CardRoots digital greeting cards",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 sm:p-12 shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-slate-900">Privacy Policy</h1>
        <p className="text-sm text-slate-600 mb-8">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-slate-900">1. Introduction</h2>
            <p>
              We respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information when you use CardRoots.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-slate-900">2. Information We Collect</h2>
            <p className="mb-2">We collect the following information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your email address (for card delivery and receipts)</li>
              <li>Recipient names and messages (as provided by you)</li>
              <li>Payment information (processed securely by Stripe, not stored by us)</li>
              <li>Basic usage data (via analytics to improve our service)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-slate-900">3. How We Use Your Information</h2>
            <p className="mb-2">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Create and deliver your digital cards</li>
              <li>Process payments securely</li>
              <li>Arrange tree planting on your behalf</li>
              <li>Send you confirmation emails and receipts</li>
              <li>Improve our service and respond to your enquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-slate-900">4. Data Storage</h2>
            <p>
              Your card data (including messages and recipient names) is stored securely in our database. We retain this information to ensure your cards remain accessible via shareable links. Payment information is handled exclusively by Stripe and is not stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-slate-900">5. Sharing Your Information</h2>
            <p>
              We do not sell or share your personal information with third parties, except as necessary to provide our service (e.g., Stripe for payments, tree planting partners for fulfilment). We never share recipient information or card content with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-slate-900">6. Your Rights</h2>
            <p>
              Under UK data protection law, you have the right to access, correct, or delete your personal data. If you would like to exercise these rights, please contact us at{" "}
              <a href="mailto:info@cardroots.com" className="text-blue-600 hover:underline">
                info@cardroots.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-slate-900">7. Cookies</h2>
            <p>
              We use minimal cookies for essential functionality and analytics. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-slate-900">8. Contact</h2>
            <p>
              If you have questions about this privacy policy, please contact us at{" "}
              <a href="mailto:info@cardroots.com" className="text-blue-600 hover:underline">
                info@cardroots.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

