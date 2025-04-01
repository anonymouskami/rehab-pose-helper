import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { exerciseData } from "@/data/exercises";
import { toast } from "sonner";
import { ArrowRight, Info, AlertCircle } from "lucide-react";
import { getAiRecommendation, AiRequestData } from "@/services/aiService";

const formSchema = z.object({
  age: z.string().min(1, "Age is required").refine((val) => !isNaN(Number(val)), "Age must be a number"),
  bmi: z.string().min(1, "BMI is required").refine((val) => !isNaN(Number(val)), "BMI must be a number"),
  weight: z.string().min(1, "Weight is required").refine((val) => !isNaN(Number(val)), "Weight must be a number"),
  injuryType: z.string().min(1, "Injury type is required"),
  painLevel: z.string().min(1, "Pain level is required")
});

type FormValues = z.infer<typeof formSchema>;

const injurySolutions: {[key: string]: string[]} = {
  "ACL Tear": [
    "Rest and avoid putting weight on the knee.",
    "Apply ice to reduce swelling.",
    "Consult a physical therapist for rehabilitation exercises."
  ],
  "Ankle Sprain": [
    "Rest the ankle and avoid weight-bearing activities.",
    "Apply ice for 15-20 minutes every hour.",
    "Elevate the ankle above heart level."
  ],
  "Hamstring Pull": [
    "Rest and avoid activities that cause pain.",
    "Apply ice to the injured area.",
    "Gentle stretching once the pain subsides."
  ],
  "Musculoskeletal Injury": [
    "Consult a healthcare professional for specific advice."
  ],
  "Bone Fracture": [
    "Immobilize the area and seek medical attention.",
    "Apply ice to reduce swelling."
  ],
  "Ligament Sprain": [
    "Rest the affected joint.",
    "Apply ice and elevate the joint.",
    "Consult a doctor if pain persists."
  ],
  "Tendon Injury": [
    "Rest and avoid activities that cause pain.",
    "Use a warm compress to ease discomfort.",
    "Gentle stretching may help."
  ],
  "Muscle Strain": [
    "Rest the muscle and avoid strenuous activity.",
    "Apply ice to reduce swelling.",
    "Gently stretch the muscle once pain decreases."
  ],
  "Shin Splint": [
    "Rest and avoid high-impact activities.",
    "Ice the shins after activity.",
    "Consider using arch supports in shoes."
  ],
  "Tennis Elbow": [
    "Rest the elbow and avoid activities that exacerbate pain.",
    "Apply ice to reduce swelling.",
    "Gentle stretching and strengthening exercises."
  ],
  "Sprain": [
    "Rest the injured area.",
    "Apply ice for 15-20 minutes every hour.",
    "Elevate the injured limb."
  ],
  "Fracture": [
    "Immobilize the area and seek medical attention.",
    "Apply ice to reduce swelling."
  ],
  "Tendonitis": [
    "Rest and avoid activities that cause pain.",
    "Use a warm compress to ease discomfort.",
    "Gentle stretching may help."
  ],
  "Other": [
    "Consult a healthcare professional for specific advice."
  ]
};

const UserProfile = () => {
  const [showResults, setShowResults] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedExercises, setRecommendedExercises] = useState<typeof exerciseData>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: "",
      bmi: "",
      weight: "",
      injuryType: "",
      painLevel: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const aiRequestData: AiRequestData = {
        age: data.age,
        bmi: data.bmi,
        weight: data.weight,
        injuryType: data.injuryType,
        painLevel: data.painLevel
      };
      
      const aiResponse = await getAiRecommendation(aiRequestData);
      setAiRecommendation(aiResponse.recommendation);
      
      if (aiResponse.exerciseIds && aiResponse.exerciseIds.length > 0) {
        const exercises = exerciseData.filter(ex => 
          aiResponse.exerciseIds?.includes(ex.id)
        );
        setRecommendedExercises(exercises.length > 0 ? exercises : exerciseData.slice(0, 2));
        
        if (exercises.length > 0) {
          setSelectedExerciseId(exercises[0].id);
        }
      } else {
        const lowerInjuryType = data.injuryType.toLowerCase();
        
        if (lowerInjuryType.includes("knee") || lowerInjuryType.includes("acl")) {
          setRecommendedExercises(exerciseData.filter(ex => ex.id === "knee-extension"));
        } else if (lowerInjuryType.includes("shoulder")) {
          setRecommendedExercises(exerciseData.filter(ex => ex.id === "shoulder-flexion"));
        } else if (lowerInjuryType.includes("ankle") || lowerInjuryType.includes("foot")) {
          setRecommendedExercises(exerciseData.filter(ex => ex.id === "ankle-dorsiflexion"));
        } else if (lowerInjuryType.includes("hip") || lowerInjuryType.includes("back")) {
          setRecommendedExercises(exerciseData.filter(ex => ex.id === "hip-bridge"));
        } else {
          setRecommendedExercises(exerciseData.slice(0, 2));
        }
      }
      
      setShowResults(true);
    } catch (error) {
      toast.error("Failed to generate recommendations. Please try again.");
      console.error("Error generating recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartExercise = () => {
    navigate("/exercises", { state: { selectedExerciseId } });
  };
  
  const injuryTypes = [
    "ACL Tear", "Ankle Sprain", "Hamstring Pull", "Musculoskeletal Injury",
    "Bone Fracture", "Ligament Sprain", "Tendon Injury", "Muscle Strain",
    "Shin Splint", "Tennis Elbow", "Sprain", "Fracture", "Tendonitis", "Other"
  ];
  
  const painLevels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Rehab Pose Assistant</h1>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {!showResults ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-center">User Profile & Injury Information</h2>
            <p className="mb-6 text-gray-600 text-center">
              Please provide your information to get personalized rehabilitation recommendations
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your age" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your weight" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="bmi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BMI</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your BMI" {...field} />
                      </FormControl>
                      <FormDescription>
                        You can calculate your BMI by dividing your weight (kg) by your height squared (m²)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="injuryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Injury Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your injury type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {injuryTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="painLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pain Level (1-10)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your pain level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {painLevels.map(level => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Generating Recommendations..." : "Get Personalized Recommendations"}
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Personalized Recommendations</h2>
            
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">AI Recommendation</h3>
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <div className="flex items-start">
                  <Info className="text-blue-500 mt-1 mr-3 shrink-0" />
                  <p>{aiRecommendation || "Loading recommendation..."}</p>
                </div>
              </div>
            </div>
            
            {form.getValues("injuryType") && injurySolutions[form.getValues("injuryType")] && (
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-2">Home Solutions</h3>
                <Alert>
                  <AlertTitle>For {form.getValues("injuryType")}</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {injurySolutions[form.getValues("injuryType")].map((solution, i) => (
                        <li key={i}>{solution}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            {parseInt(form.getValues("painLevel")) > 5 && (
              <div className="mb-6">
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-800" />
                  <AlertTitle className="text-yellow-800">Medical Attention Recommended</AlertTitle>
                  <AlertDescription className="text-yellow-800">
                    Based on your pain level, it's advisable to see a healthcare professional before starting any exercise program.
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-3">Recommended Exercises</h3>
              {recommendedExercises.length > 0 ? (
                <div className="grid gap-4">
                  {recommendedExercises.map(exercise => (
                    <div 
                      key={exercise.id} 
                      className={`border rounded-md p-4 hover:bg-gray-50 ${exercise.id === selectedExerciseId ? 'border-primary bg-primary/5' : ''}`}
                      onClick={() => setSelectedExerciseId(exercise.id)}
                      role="button"
                    >
                      <h4 className="font-medium">{exercise.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{exercise.shortDescription}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No specific exercises recommended for your condition.</p>
              )}
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setShowResults(false)}>
                Go Back
              </Button>
              <Button onClick={handleStartExercise} className="gap-2">
                Start Exercises <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Note: This tool provides general recommendations and is not a substitute for professional medical advice.</p>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
