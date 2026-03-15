import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-black/90 backdrop-blur-md border-b border-amber-300/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="text-xl font-display font-bold text-amber-200 hidden sm:inline tracking-wide">Food For Thought</span>
          </Link>

          <nav className="hidden md:flex gap-8">
            <Link href="/" className="text-amber-100/90 hover:text-amber-300 transition">Home</Link>
            <Link href="/browse" className="text-amber-100/90 hover:text-amber-300 transition">Browse Chefs</Link>
            <Link href="/how-it-works" className="text-amber-100/90 hover:text-amber-300 transition">How It Works</Link>
            <Link href="/about" className="text-amber-100/90 hover:text-amber-300 transition">About</Link>
          </nav>

          <div className="flex gap-3">
            <Link href="/signup" className="bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-700 text-black px-4 py-2 rounded-lg font-semibold hover:brightness-105 transition">
              Chef Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
