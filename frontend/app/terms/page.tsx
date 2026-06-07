'use client'

import Layout from '@/components/Layout'

const termsSections = [
  {
    title: '1. Overview',
    body:
      'Food for Thought ("we", "our", "us") is an online platform that connects users with independent chefs and catering providers. We act solely as a technology platform to facilitate introductions and communication between users and chefs. Food for Thought does not provide food services, catering, meal preparation, or delivery.',
  },
  {
    title: '2. No Food Services / Platform Only',
    body:
      'Food for Thought does not prepare, cook, handle, or deliver food; employ or manage chefs; or supervise or control services provided by chefs. All services are provided independently by chefs, and any agreement is solely between the user and the chef.',
  },
  {
    title: '3. Independent Third Parties',
    body:
      'All chefs listed on the platform are independent third parties and are not employees, agents, or representatives of Food for Thought. We do not control, endorse, or guarantee chef qualifications or credentials, food safety practices, licensing or regulatory compliance, service quality, or outcomes.',
  },
  {
    title: '4. No Verification of Listings',
    body:
      'Chef profiles, menus, pricing, images, certifications, and descriptions are provided by chefs. Food for Thought does not verify and makes no representations regarding the accuracy, completeness, or reliability of this information.',
  },
  {
    title: '5. Allergies and Dietary Restrictions',
    body:
      'Users are solely responsible for communicating all allergies, intolerances, and dietary restrictions directly with chefs and confirming ingredients and preparation methods before consuming any food. Food for Thought does not guarantee allergen-free meals or protection from cross-contact.',
  },
  {
    title: '6. No Responsibility for Services',
    body:
      'Food for Thought is not responsible for food quality, taste, or presentation; allergic reactions or food-related illness; chef conduct or professionalism; delays, cancellations, or no-shows; or property damage or personal injury. All risks arising from interactions with chefs are assumed by users.',
  },
  {
    title: '7. User Responsibilities',
    body:
      'Users agree to use the platform lawfully, communicate clearly with chefs regarding expectations, and independently verify chef qualifications if desired.',
  },
  {
    title: '8. Disputes Between Users and Chefs',
    body:
      'Any disputes regarding services, payments, quality, or outcomes are strictly between the user and the chef. Food for Thought is not a party to any agreements formed between users and chefs.',
  },
  {
    title: '9. Limitation of Liability',
    body:
      'To the fullest extent permitted by law, Food for Thought is not liable for any direct, indirect, incidental, or consequential damages, loss, injury, illness, or damages arising from services provided by chefs or issues resulting from user-chef interactions.',
  },
  {
    title: '10. Indemnification',
    body:
      'You agree to indemnify and hold harmless Food for Thought from any claims, damages, or liabilities arising from your use of the platform, your interactions with chefs or users, or any violation of these Terms.',
  },
  {
    title: '11. Platform Use',
    body:
      'We reserve the right to remove users or chefs, remove content, or suspend or terminate access at our discretion.',
  },
  {
    title: '12. Changes to Terms',
    body:
      'We may update these Terms at any time. Continued use of the platform constitutes acceptance of the updated Terms.',
  },
  {
    title: '13. Contact',
    body: 'For questions, contact hello@foodforthought.com.',
  },
]

export default function TermsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-amber-200/70 p-8 md:p-12">
            <div className="mb-10">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500 mb-3">
                Food for Thought
              </p>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                Terms of Service
              </h1>
              <p className="text-gray-600 text-lg">Last Updated: June 6, 2026</p>
            </div>

            <div className="space-y-6">
              {termsSections.map((section) => (
                <section key={section.title} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
                  <p className="text-gray-700 leading-7">{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}