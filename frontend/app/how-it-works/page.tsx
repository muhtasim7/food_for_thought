import Layout from '@/components/Layout'

export default function HowItWorks() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h1>
          <p className="text-xl text-gray-600 mb-12">Simple steps to get your party food catered</p>

          {/* For Customers */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">For Customers</h2>

            <div className="space-y-8">
              {[
                {
                  num: 1,
                  title: 'Search & Browse',
                  desc: 'Use our search filters to find chefs by cuisine, location, dietary requirements, and budget.',
                },
                {
                  num: 2,
                  title: 'Check Profiles & Menus',
                  desc: 'View chef profiles, read reviews, check available menus and pricing. See what other customers say about their food.',
                },
                {
                  num: 3,
                  title: 'Send Booking Request',
                  desc: 'Fill in your event details: date, number of guests, preferred dishes. Add any special requirements or dietary restrictions.',
                },
                {
                  num: 4,
                  title: 'Chef Confirmation',
                  desc: 'The chef reviews your request and confirms availability. They may suggest menu modifications or discuss customization.',
                },
                {
                  num: 5,
                  title: 'Event Day',
                  desc: 'Chef delivers the food at your specified time. Enjoy authentic homemade party food with your guests!',
                },
                {
                  num: 6,
                  title: 'Leave a Review',
                  desc: 'Share your experience by rating and reviewing the chef. Help other customers find great food.',
                },
              ].map((step) => (
                <div key={step.num} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white font-bold text-lg">
                      {step.num}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Chefs */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">For Chefs</h2>

            <div className="space-y-8">
              {[
                {
                  num: 1,
                  title: 'Create Your Profile',
                  desc: 'Sign up, add your business name, bio, location, and experience. Upload a profile photo to build trust.',
                },
                {
                  num: 2,
                  title: 'Set Your Cuisines & Services',
                  desc: 'Select the cuisines you specialize in (Bengali, Pakistani, etc.) and dietary options you offer.',
                },
                {
                  num: 3,
                  title: 'Add Your Menus',
                  desc: 'Create menus with your signature dishes, prices per portion, and minimum order quantities.',
                },
                {
                  num: 4,
                  title: 'Receive Booking Requests',
                  desc: 'Customers send booking requests through the platform. Review their event details and contact them.',
                },
                {
                  num: 5,
                  title: 'Confirm & Deliver',
                  desc: 'Confirm bookings, discuss customization, and deliver amazing food. Build your reputation through great service.',
                },
                {
                  num: 6,
                  title: 'Grow Your Business',
                  desc: 'Collect reviews and ratings. More bookings = higher visibility on the platform. Grow your customer base.',
                },
              ].map((step) => (
                <div key={step.num} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white font-bold text-lg">
                      {step.num}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-lg shadow-md p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>

            <div className="space-y-6">
              {[
                {
                  q: 'How do payments work?',
                  a: 'Discuss pricing directly with the chef. We provide a secure platform for communication and confirmation. Payment arrangements are made between you and the chef.',
                },
                {
                  q: 'What if I need to cancel?',
                  a: 'Contact the chef directly as soon as possible. Cancellation terms depend on how far in advance you booked.',
                },
                {
                  q: 'Are chefs verified?',
                  a: 'Yes, all chefs on our platform are real people with complete profiles. Read reviews from previous customers to make informed decisions.',
                },
                {
                  q: 'Can I customize the menu?',
                  a: 'Absolutely! Most chefs welcome customization. Discuss your preferences and dietary requirements during the booking discussion.',
                },
                {
                  q: 'What areas do chefs serve?',
                  a: 'Each chef specifies their service area (Toronto, GTA, etc.). Filter by location when browsing to find chefs near you.',
                },
              ].map((item, idx) => (
                <div key={idx} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-bold text-gray-800 mb-2">{item.q}</h3>
                  <p className="text-gray-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
