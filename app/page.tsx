import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"

export default function HomePage() {
  return (
    <div className="page-container bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Personality Insights</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/assessment" className="text-gray-700 hover:text-blue-600 transition-colors">
                Assessment
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-4 text-center h-full">
        {/* Geometric Design Element */}
        <div className="relative w-32 h-32 mb-8 md:w-48 md:h-48">
          <div className="absolute inset-0 border-2 border-gray-300 transform rotate-45"></div>
          <div className="absolute inset-4 border-2 border-gray-400 transform -rotate-45"></div>
          <div className="absolute inset-8 border-2 border-blue-500 transform rotate-45"></div>
          <div className="absolute inset-12 border-2 border-blue-600 transform -rotate-45"></div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-blue-600">Personality Insights</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-lg mx-auto mb-8">
          Discover your personality traits through our scientifically validated assessment.
        </p>

        <Link href="/assessment">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Take the Assessment
          </Button>
        </Link>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center">
          <p className="text-gray-600 text-sm">© 2024 Personality Insights. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
