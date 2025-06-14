import { type NextRequest, NextResponse } from "next/server"
import getMongoClient from "@/lib/mongodb"
import { z } from "zod"

// Define validation schema using Zod
const PersonalitySchema = z.object({
  Going_outside: z.number().int().min(1).max(5),
  Time_spent_Alone: z.number().int().min(1).max(5),
  Stage_fear: z.number().int().min(0).max(1),
  Drained_after_socializing: z.number().int().min(0).max(1),
  Reading_books: z.number().int().min(1).max(5),
  Talkativeness: z.number().int().min(1).max(5),
  Energy_level: z.number().int().min(1).max(5),
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()

    // Validate with Zod schema
    const validatedData = PersonalitySchema.parse(body)

    // Connect to MongoDB
    const client = await getMongoClient()
    const db = client.db("personality_predictor")

    // Add timestamp to the data
    const dataToInsert = {
      ...validatedData,
      createdAt: new Date(),
    }

    // Insert data into MongoDB
    const result = await db.collection("responses").insertOne(dataToInsert)

    // Return success response with the inserted ID
    return NextResponse.json(
      {
        success: true,
        insertedId: result.insertedId,
        // Mock prediction response for now (in a real app, this would come from ML model)
        prediction: Math.random() > 0.5 ? "Extrovert" : "Introvert",
        confidence: Math.random() * 0.5 + 0.5, // Random confidence between 0.5 and 1.0
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("API Error:", error)

    // Check if it's a validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: "Failed to store assessment data",
      },
      { status: 500 },
    )
  }
}
