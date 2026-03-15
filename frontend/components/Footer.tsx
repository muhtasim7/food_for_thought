export default function Footer() {
  return (
    <footer className="bg-black text-amber-100 border-t border-amber-300/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-display font-bold mb-4 text-amber-300">Food For Thought</h3>
            <p className="text-amber-100/70 text-sm">Connecting customers with local home chefs for authentic party food and catering.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-amber-300">For Customers</h4>
            <ul className="space-y-2 text-sm text-amber-100/70">
              <li><a href="/browse" className="hover:text-amber-300">Browse Chefs</a></li>
              <li><a href="#" className="hover:text-amber-300">How It Works</a></li>
              <li><a href="#" className="hover:text-amber-300">FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-amber-300">For Chefs</h4>
            <ul className="space-y-2 text-sm text-amber-100/70">
              <li><a href="/signup" className="hover:text-amber-300">Become a Chef</a></li>
              <li><a href="#" className="hover:text-amber-300">Dashboard</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-amber-300">Contact</h4>
            <ul className="space-y-2 text-sm text-amber-100/70">
              <li>Email: hello@foodforthought.com</li>
              <li>Phone: (416) 555-0100</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-300/20 pt-8 text-center text-amber-100/60 text-sm">
          <p>&copy; 2026 Food For Thought. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
