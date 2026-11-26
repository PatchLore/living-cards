export const metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy Policy",
  description: "How CardRoots handles your data when you send an animated digital card: what we collect, why, and how to contact us.",
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
              Your card data (including messages and recipient names) is stored securely in our database so your card’s private link works. Each link stays open for 12 months from purchase; after that, the recipient’s name, your message and your email address are deleted automatically, and we keep only the order record (product, date and any tree planted). Payment information is handled exclusively by Stripe and is not stored on our servers.
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
            <h2 className="text-xl font-semibold mb-3 text-slate-900">8. CardRoots For Kids</h2>
            <p>
              Children’s Personalisation Data (CardRoots For Kids): When purchasing or personalising a CardRoots Kids creation, we ask only for a child’s first name, one short detail and a message. We never ask for children’s photographs, surnames, dates of birth, email addresses or home addresses, and we ask buyers not to include them. Purchased creations open from a private link that is excluded from search engines and never listed publicly; anyone the link is shared with can open it.
            </p>
            <p className="mt-3">
              Party invitation replies: Guests who open a CardRoots Kids birthday invitation can reply to it. We collect only the first name they type (up to 30 characters) and whether they can come. Each reply is emailed to the person who bought the invitation and to no one else. We never ask guests for an email address, phone number or any other detail. To prevent abuse, we keep a scrambled code made from the guest’s internet (IP) address; it cannot be turned back into the address and is erased after 24 hours. Replies are deleted automatically 90 days after they are sent.
            </p>
            <p className="mt-3">
              Analytics: We do not run analytics on private card links. On our other pages, including the Kids studio, we count visits with Vercel Web Analytics, which does not use cookies, and we remove anything after the page address (such as order references) before it is sent. While you personalise a Kids creation, your draft is kept only in your own browser tab and is cleared when you close it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-slate-900">9. Contact</h2>
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

