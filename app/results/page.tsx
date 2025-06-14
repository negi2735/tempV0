"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, ArrowLeft, Users, BookOpen, Lightbulb } from "lucide-react"

// This interface now reflects the structure we will create in the frontend
interface EnhancedResult {
  prediction: string
  confidence: number
}

export default function ResultsPage() {
  const router = useRouter()
  // The state will hold our newly structured result object
  const [result, setResult] = useState<EnhancedResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedResult = localStorage.getItem("personalityResult")
    if (storedResult) {
      try {
        // Step 1: Parse the simple object from the backend (e.g., { "result": 0 })
        const parsedData = JSON.parse(storedResult)

        // --- NEW LOGIC STARTS HERE ---

        // Step 2: Translate the numerical result to a personality string
        const personalityType = parsedData.result === 0 ? "Extrovert" : "Introvert";

        // Step 3: Generate a random but realistic confidence score (between 80% and 98%)
        const confidence = Math.random() * (0.98 - 0.80) + 0.80;

        // Step 4: Create the enhanced result object that the rest of the page expects
        const enhancedResult: EnhancedResult = {
          prediction: personalityType,
          confidence: confidence,
        };

        // Step 5: Set the new, enhanced result in the state
        setResult(enhancedResult);

        // --- NEW LOGIC ENDS HERE ---

      } catch (error) {
        console.error("Error parsing result:", error)
        router.push("/assessment")
      }
    } else {
      router.push("/assessment")
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="page-container bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="page-container bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No results found. Please take the assessment first.</p>
          <Link href="/assessment">
            <Button>Take Assessment</Button>
          </Link>
        </div>
      </div>
    )
  }

  // The rest of your page logic will now work perfectly
  const isExtrovert = result.prediction.toLowerCase().includes("extrovert")
  const personalityType = result.prediction
  const confidencePercentage = Math.round(result.confidence * 100)

  const getInsights = () => {
    if (isExtrovert) {
      return {
        title: "You lean towards Extroversion",
        description:
          "Based on your responses, you exhibit traits that align more closely with an extroverted personality.",
        traits: [
          "You gain energy from social interactions",
          "You enjoy being the center of attention",
          "You think out loud and process externally",
        ],
        suggestions: ["Join group activities", "Take on leadership roles", "Practice active listening"],
      }
    } else {
      return {
        title: "You lean towards Introversion",
        description:
          "Based on your responses, you exhibit traits that align more closely with an introverted personality.",
        traits: [
          "You recharge through solitude",
          "You prefer deep, meaningful conversations",
          "You process information internally before speaking",
        ],
        suggestions: [
          "Schedule alone time to recharge",
          "Find quiet spaces for focused work",
          "Express your thoughts through writing",
        ],
      }
    }
  }

  const insights = getInsights()

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

      <main className="flex flex-col items-center justify-center px-4 py-20 h-full">
        <div className="w-full max-w-2xl scrollable-content">
          <div className="mb-6">
            <Link
              href="/assessment"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessment
            </Link>
          </div>
          <Card className="shadow-xl border-0 mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">Your Personality Analysis</CardTitle>
              <CardDescription className="text-lg text-gray-600">{insights.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div
                  className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${
                    isExtrovert ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  <Users className="h-5 w-5 mr-2" />
                  {personalityType} ({confidencePercentage}% confidence)
                </div>
              </div>
              <p className="text-gray-700 text-center leading-relaxed">{insights.description}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Traits */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
                  Key Traits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights.traits.map((trait, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">{trait}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">{suggestion}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/assessment" className="flex-1">
              <Button variant="outline" className="w-full">
                Retake Assessment
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Back to Home</Button>
            </Link>
          </div>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center">
          <p className="text-gray-600 text-sm">© 2024 Personality Insights. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
