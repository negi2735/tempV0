"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, Loader2 } from "lucide-react"
import { z } from "zod"

// --- CORRECTED: The validation schema now matches your actual data ranges ---
const PersonalitySchema = z.object({
  Time_spent_Alone: z.number().int().min(0).max(10, "Value must be 10 or less"),
  Stage_fear: z.number().int().min(0).max(1, "Value must be 0 or 1"),
  Social_event_frequency: z.number().int().min(0).max(10, "Value must be 10 or less"), // Using a reasonable assumption
  Going_out: z.number().int().min(0).max(10, "Value must be 10 or less"),
  Drained_after_socializing: z.number().int().min(0).max(1, "Value must be 0 or 1"),
  Friends_circle_size: z.number().int().min(0).max(15, "Value must be 15 or less"),
  Post_frequency: z.number().int().min(0).max(10, "Value must be 10 or less"),
})

interface FormData {
  Time_spent_Alone: number
  Stage_fear: number
  Social_event_frequency: number
  Going_out: number
  Drained_after_socializing: number
  Friends_circle_size: number
  Post_frequency: number
}

export default function AssessmentPage() {
  const router = useRouter()
  // The initial state provides default values within the correct ranges
  const [formData, setFormData] = useState<FormData>({
    Time_spent_Alone: 5,
    Stage_fear: 0,
    Social_event_frequency: 5,
    Going_out: 5,
    Drained_after_socializing: 0,
    Friends_circle_size: 7,
    Post_frequency: 5,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // This handler updates the state for any input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value), // Convert input string to number
    });
  };

  const validateForm = () => {
    const result = PersonalitySchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setValidationErrors(errors);
      return false;
    }
    setValidationErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
        alert("Please correct the errors before submitting.");
        return;
    }
    setIsSubmitting(true);
    
    try {
      // Step 1: Get the prediction from the /predict endpoint
      const predictResponse = await fetch("https://ml-backend-rk7t.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (predictResponse.ok) {
        const result = await predictResponse.json();
        
        // Step 2: Prepare the data to be saved to the database
        const dataToSave = {
            ...formData,
            prediction: result.result
        };
        
        // Step 3: Send the combined data to the new /save-assessment endpoint
        fetch("https://ml-backend-rk7t.onrender.com/save-assessment", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave)
        });
        
        // Step 4: Continue the user flow immediately
        localStorage.setItem("personalityResult", JSON.stringify(result));
        router.push("/results");

      } else {
        const errorData = await predictResponse.json();
        alert(`Error: ${errorData.detail || "Failed to submit assessment"}`);
      }
    } catch (error) {
      console.error("Error connecting to server:", error);
      alert("Error connecting to server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2"><Brain className="h-8 w-8 text-blue-600" /><span className="text-xl font-bold text-gray-900">Personality Insights</span></div>
          </div>
        </div>
      </nav>
      <main className="flex flex-col items-center justify-center px-4 py-20 h-full">
        <div className="w-full max-w-2xl scrollable-content">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">Direct Data Input for Testing</CardTitle>
              <CardDescription className="text-gray-600">Enter the numerical values for each feature directly.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* --- CORRECTED: The form now uses the proper ranges from your data --- */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="Time_spent_Alone">Time Spent Alone (0-10)</Label>
                    <Input id="Time_spent_Alone" name="Time_spent_Alone" type="number" min="0" max="10" value={formData.Time_spent_Alone} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Stage_fear">Stage Fear (0=No, 1=Yes)</Label>
                    <Input id="Stage_fear" name="Stage_fear" type="number" min="0" max="1" value={formData.Stage_fear} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Social_event_frequency">Social Event Frequency (0-10)</Label>
                    <Input id="Social_event_frequency" name="Social_event_frequency" type="number" min="0" max="10" value={formData.Social_event_frequency} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Going_out">Enjoy Going Out (0-10)</Label>
                    <Input id="Going_out" name="Going_out" type="number" min="0" max="10" value={formData.Going_out} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Drained_after_socializing">Drained After Socializing (0=No, 1=Yes)</Label>
                    <Input id="Drained_after_socializing" name="Drained_after_socializing" type="number" min="0" max="1" value={formData.Drained_after_socializing} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Friends_circle_size">Friends Circle Size (0-15)</Label>
                    <Input id="Friends_circle_size" name="Friends_circle_size" type="number" min="0" max="15" value={formData.Friends_circle_size} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Post_frequency">Post Frequency (0-10)</Label>
                    <Input id="Post_frequency" name="Post_frequency" type="number" min="0" max="10" value={formData.Post_frequency} onChange={handleInputChange} />
                  </div>
                </div>
                {Object.values(validationErrors).map((error, i) => <p key={i} className="text-red-500 text-sm">{error}</p>)}
                <div className="pt-4">
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : "Submit Assessment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
