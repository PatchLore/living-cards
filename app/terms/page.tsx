export const metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms & Conditions",
  description: "How ordering, instant email delivery, refunds and tree planting work for CardRoots £5 animated digital greeting cards.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 sm:p-12 shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-slate-900">Terms & Conditions</h1>
        <p className="text-sm text-slate-600 mb-8">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-slate-900">1. About Us</h2>
            <p>
              CardRoots is a UK-based digital greeting card service. When you purchase a card, we create a personalised digital card and arrange for a real tree to be planted on your behalf.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-slate-900">2. Digital Delivery</h2>
            <p>
              Our cards are delivered digitally via email and shareable links. Once payment is confirmed, you will receive a link to your card which you can share with your recipient. Cards are delivered immediately after purchase completion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-slate-900">3. Tree Planting</h2>
            <p>
              For each card purchased, we fund the planting of one real tree through our partner organisations. Tree planting typically occurs within 30 days of purchase, though timing may vary based on seasonal planting schedules and project availability. You will receive confirmation once your tree has been planted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-slate-900">4. Payments</h2>
            <p>
              Payments are processed securely through Stripe. All prices are displayed in British Pounds (£) and include applicable taxes. By completing a purchase, you agree to the payment terms set by Stripe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-slate-900">5. Refunds</h2>
            <p>
              Due to the digital nature of our service and immediate tree planting commitments, we are unable to offer refunds once a card has been created and delivered. If you experience technical issues accessing your card, please contact us and we will resolve the matter promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-slate-900">6. Your Content</h2>
            <p>
              You are responsible for the content you include in your cards, including recipient names and personal messages. You must not include any content that is illegal, offensive, or violates the rights of others.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-slate-900">7. CardRoots For Kids</h2>
            <p>
              Children’s Personalisation Data (CardRoots For Kids): When purchasing or personalising a CardRoots Kids creation, we ask only for a child’s first name, one short detail and a message. We never ask for children’s photographs, surnames, dates of birth, email addresses or home addresses, and we ask buyers not to include them. Purchased creations open from a private link that is excluded from search engines and never listed publicly; anyone the link is shared with can open it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-slate-900">8. Contact</h2>
            <p>
              If you have any questions about these terms, please contact us at{" "}
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

