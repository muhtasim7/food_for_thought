import Layout from '@/components/Layout'

export default function About() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About Food For Thought</h1>

          {/* Mission */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              We believe that party food doesn't have to come from big catering companies. Some of the best, most authentic food comes from home chefs and small caterers who put love and tradition into their cooking.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Food For Thought connects customers with these talented local chefs, making it easy to discover, book, and enjoy authentic homemade party food for birthdays, weddings, family gatherings, and special events.
            </p>
          </div>

          {/* Problem & Solution */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">The Problem</h2>
              <ul className="text-gray-600 space-y-3">
                <li>✗ No centralized platform for home chefs</li>
                <li>✗ Hard to find authentic local caterers</li>
                <li>✗ Relying on Facebook groups and WhatsApp</li>
                <li>✗ Difficult to compare menus and prices</li>
                <li>✗ No transparent review system</li>
                <li>✗ Time-consuming communication process</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Solution</h2>
              <ul className="text-gray-600 space-y-3">
                <li>✓ All chefs in one searchable place</li>
                <li>✓ Easy discovery by cuisine and location</li>
                <li>✓ Centralized platform for all communication</li>
                <li>✓ Transparent menu and pricing</li>
                <li>✓ Community reviews and ratings</li>
                <li>✓ Streamlined booking process</li>
              </ul>
            </div>
          </div>

          {/* Values */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Authenticity',
                  desc: 'We celebrate real home chefs and their authentic recipes, not corporate food chains.',
                },
                {
                  title: 'Community',
                  desc: 'We build a trusted community where customers and chefs connect and support each other.',
                },
                {
                  title: 'Quality',
                  desc: 'Every chef on our platform is committed to delivering great food and excellent service.',
                },
              ].map((value) => (
                <div key={value.title} className="text-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-orange-50 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-4">Have questions or feedback? We'd love to hear from you!</p>
            <div className="space-y-2 text-gray-600">
              <p>📧 Email: hello@foodforthought.com</p>
              <p>📱 Phone: (416) 555-0100</p>
              <p>📍 Based in Toronto, serving Greater Toronto Area</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
