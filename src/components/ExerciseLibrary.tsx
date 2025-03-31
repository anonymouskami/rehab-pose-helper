
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exerciseData } from "@/data/exercises";

const ExerciseLibrary = () => {
  // Group exercises by target area
  const exercisesByArea = exerciseData.reduce((acc, exercise) => {
    if (!acc[exercise.targetArea]) {
      acc[exercise.targetArea] = [];
    }
    acc[exercise.targetArea].push(exercise);
    return acc;
  }, {} as Record<string, typeof exerciseData>);

  const targetAreas = Object.keys(exercisesByArea);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Exercise Library</h2>
      
      <Tabs defaultValue={targetAreas[0]} className="w-full">
        <TabsList className="mb-4">
          {targetAreas.map((area) => (
            <TabsTrigger key={area} value={area}>
              {area}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {targetAreas.map((area) => (
          <TabsContent key={area} value={area}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exercisesByArea[area].map((exercise) => (
                <Card key={exercise.id}>
                  <CardHeader>
                    <CardTitle>{exercise.name}</CardTitle>
                    <CardDescription>{exercise.targetArea}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{exercise.description}</p>
                    <h4 className="font-semibold mb-2">Instructions:</h4>
                    <ol className="list-decimal list-inside space-y-1">
                      {exercise.instructions.map((instruction, idx) => (
                        <li key={idx} className="text-sm">{instruction}</li>
                      ))}
                    </ol>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Key Points:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {exercise.keyPoints.map((point, idx) => (
                          <li key={idx} className="text-sm">{point}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ExerciseLibrary;
